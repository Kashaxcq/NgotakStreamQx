/**
 * Offline replacement for the `react-native-bootsplash` Expo config plugin.
 *
 * The stock plugin requires `sharp` (native binary) at prebuild time to
 * generate splash assets. When the egress proxy blocks that install, this
 * plugin applies the *already generated* assets from `assets/bootsplash/`
 * and performs the same Android manifest / styles / colors / MainActivity
 * edits the stock plugin would make (react-native-bootsplash 6.3.12).
 *
 * To go back to the stock plugin, remove this entry from app.config.js and
 * uncomment the `react-native-bootsplash` plugin block.
 */
const fs = require('fs');
const path = require('path');
const {
  withAndroidManifest,
  withAndroidStyles,
  withAndroidColors,
  withMainActivity,
  withDangerousMod,
  AndroidConfig,
} = require('expo/config-plugins');
const {addImports} = require('@expo/config-plugins/build/android/codeMod');
const {mergeContents} = require('@expo/config-plugins/build/utils/generateCode');

const ASSETS_DIR = 'assets/bootsplash';
const BACKGROUND = '#000000';

function withBootDrawables(config) {
  return withDangerousMod(config, [
    'android',
    async cfg => {
      const {projectRoot, platformProjectRoot} = cfg.modRequest;
      const srcDir = path.resolve(projectRoot, ASSETS_DIR, 'android');
      if (!fs.existsSync(srcDir)) {
        throw new Error(
          `"${path.relative(projectRoot, srcDir)}" doesn't exist. ` +
            'Bootsplash assets were not generated.',
        );
      }
      const destDir = path.resolve(
        platformProjectRoot,
        'app',
        'src',
        'main',
        'res',
      );
      for (const entry of fs.readdirSync(srcDir)) {
        const srcEntry = path.join(srcDir, entry);
        if (!fs.statSync(srcEntry).isDirectory()) {
          continue;
        }
        const destEntry = path.join(destDir, entry);
        fs.mkdirSync(destEntry, {recursive: true});
        for (const file of fs.readdirSync(srcEntry)) {
          fs.copyFileSync(path.join(srcEntry, file), path.join(destEntry, file));
        }
      }
      return cfg;
    },
  ]);
}

function withBootManifest(config) {
  return withAndroidManifest(config, cfg => {
    const applications = cfg.modResults.manifest.application || [];
    for (const application of applications) {
      if (application.$['android:name'] === '.MainApplication') {
        for (const activity of application.activity || []) {
          if (activity.$['android:name'] === '.MainActivity') {
            activity.$['android:theme'] = '@style/BootTheme';
          }
        }
      }
    }
    return cfg;
  });
}

function withBootMainActivity(config) {
  return withMainActivity(config, cfg => {
    const {modResults} = cfg;
    const {language} = modResults;
    const isJava = language === 'java';
    const withImports = addImports(
      modResults.contents.replace(
        /(\/\/ )?setTheme\(R\.style\.AppTheme\)/,
        '// setTheme(R.style.AppTheme)',
      ),
      ['android.os.Bundle', 'com.zoontek.rnbootsplash.RNBootSplash'],
      isJava,
    );
    const withInit = mergeContents({
      src: withImports,
      comment: '    //',
      tag: 'bootsplash-init',
      offset: 0,
      anchor: /super\.onCreate\((null|savedInstanceState)\)/,
      newSrc:
        '    RNBootSplash.init(this, R.style.BootTheme)' + (isJava ? ';' : ''),
    });
    return {
      ...cfg,
      modResults: {...modResults, contents: withInit.contents},
    };
  });
}

function withBootStyles(config) {
  return withAndroidStyles(config, async cfg => {
    const {modResults} = cfg;
    const {resources} = modResults;
    const {style = []} = resources;
    const item = [
      {$: {name: 'postBootSplashTheme'}, _: '@style/AppTheme'},
      {$: {name: 'bootSplashBackground'}, _: '@color/bootsplash_background'},
      {$: {name: 'bootSplashLogo'}, _: '@drawable/bootsplash_logo'},
    ];
    const withBootTheme = [
      ...style.filter(({ $ }) => $?.name !== 'BootTheme'),
      {
        $: {name: 'BootTheme', parent: 'Theme.BootSplash.EdgeToEdge'},
        item,
      },
    ];
    return {
      ...cfg,
      modResults: {
        ...modResults,
        resources: {...resources, style: withBootTheme},
      },
    };
  });
}

function withBootColors(config) {
  return withAndroidColors(config, cfg => {
    cfg.modResults = AndroidConfig.Colors.assignColorValue(cfg.modResults, {
      name: 'bootsplash_background',
      value: BACKGROUND,
    });
    return cfg;
  });
}

module.exports = function withBootSplashOffline(config) {
  config = withBootDrawables(config);
  config = withBootManifest(config);
  config = withBootMainActivity(config);
  config = withBootStyles(config);
  config = withBootColors(config);
  return config;
};

import React from 'react';
import {View, ViewProps} from 'react-native';
import {useM3Colors} from '../../theme/M3PaletteContext';
import useThemeStore from '../../lib/zustand/themeStore';

interface AmbientBackgroundProps extends ViewProps {
  children?: React.ReactNode;
}

const AmbientBackground = ({children, style, ...rest}: AmbientBackgroundProps) => {
  const colors = useM3Colors();
  const isPureBlack = useThemeStore(state => state.isPureBlack);

  return (
    <View
      style={[{flex: 1, backgroundColor: isPureBlack ? '#000000' : colors.background}, style]}
      {...rest}>
      {children}
    </View>
  );
};

export default AmbientBackground;

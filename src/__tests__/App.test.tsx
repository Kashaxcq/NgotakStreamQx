/**
 * @format
 */

import 'react-native';
import App from '../src/App';
import {expect, it} from '@jest/globals';

// Keep this smoke test focused on module loading. Mounting the full native app
// in Jest schedules font/native work that outlives the test environment.
it('exports the root application component', () => {
  expect(App).toBeDefined();
});

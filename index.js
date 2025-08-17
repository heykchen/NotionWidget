import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './services/widget-task-handler';
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

import 'expo-router/entry';
registerWidgetTaskHandler(widgetTaskHandler);
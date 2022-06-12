import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';

import Navigation from './src/navigation/Navigation';
import config from './config';

const App = () => {
  return (
    <Navigation />
  );
}

AppRegistry.registerComponent(config.appName, () => App);

export default App;

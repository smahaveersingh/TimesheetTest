import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Test from '../screens/Tester';
import Header from '../components/Header';


const screens = {
  Test:
  {
      screen: Test,
      navigationOptions:({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title='Timesheet Review' />,
        headerLeft: () => null
            }
      }
  }
}

const DrawerStack = createStackNavigator(screens);



export default DrawerStack;
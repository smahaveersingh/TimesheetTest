import React from 'react';
import {  createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from './screens/login';
import Home from './screens/Home';
import Hour from './screens/Hour';
import Header from './components/Header';
import Onboarding from './screens/Onboarding';
import ListView from './screens/ListView';

const screens = {

  Onboarding: {
    screen: Onboarding,
    navigationOptions: {
      title: null,
    }
  },

  Login: {
    screen: Login,
      navigationOptions:
      {
        title: null,
      }
},

  Home:
  {
      screen: Home,
      navigationOptions:({ navigation }) => {
      return {
        headerTitle: () => <Header navigation={navigation} title='Timesheet' />,
        headerLeft: () => null
            }
      }
  },

Hour:
  {
    screen: Hour,
    navigationOptions:({ navigation }) => {
    return {
      headerTitle: () => <Header navigation={navigation} title='Enter hours' />,
      headerLeft: () => null
          }
        }
    },

    ListView: {
      screen: ListView,
      navigationOptions:({ navigation }) => {
        return {
          headerTitle: () => <Header navigation={navigation} title='Enter hours' />,
          headerLeft: () => null
              }
            }
    }

    


}


  


const stackNavigator = createStackNavigator(screens);



const App = createAppContainer(stackNavigator)
export default App;

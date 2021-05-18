import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Login from '../screens/login';
import Home from '../screens/Home';
import Hour from '../screens/Hour';
import EditSheet from '../screens/EditSheet';
import ViewEntry from '../screens/ViewEntry';
import ListView from '../screens/ListView';
import Header from '../components/Header';
import Onboarding from '../screens/Onboarding';


const screens = {
  Onboarding: {
    screen: Onboarding,
      navigationOptions:
      {
        title: null,
      }
},
  Login: {
    screen: Login,
    navigationOptions:
    {
      title: null,
      header: () => null
    }
},

ListView:
    {
      screen: Login,
      navigationOptions:
      {
        title: null,
        header: () => null,
        headerLeft: () => null
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
EditSheet:
  {
    screen: EditSheet,
    navigationOptions:({ navigation }) => {
    return {
      headerTitle: () => <Header navigation={navigation} title='Edit' />,
      headerLeft: () => null,
      
          }
    }
},

ViewEntry:
  {
    screen: ViewEntry,
    navigationOptions:({ navigation }) => {
    return {
      headerTitle: () => <Header navigation={navigation} title='Delete Entry' />,
      headerLeft: () => null
          }
    }
}




}


  


const HomeStack = createStackNavigator(screens);




export default HomeStack;
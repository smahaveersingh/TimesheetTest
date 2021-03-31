import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Login from '../screens/login';
import Home from '../screens/Home';
import Hour from '../screens/Hour';
import ViewEntry from '../screens/ViewEntry';
import ListView from '../screens/ListView';
import Header from '../components/Header';


const screens = {
  Login: {
    screen: Login,
      navigationOptions:
      {
        title: null,
      }
},

ListView:
    {
      screen: ListView,
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
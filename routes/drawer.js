import{ createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import HomeStack from './homestack';
import DrawerStack from './drawerStack';
import Expenses from './expenses';


const RootDrawerNavigator = createDrawerNavigator({
    Home: { 
        screen: HomeStack,
       
    },

    TSReview: {
        screen: DrawerStack,
    },
    
    Expenses: {
        screen: Expenses,
    }

});

export default createAppContainer(RootDrawerNavigator);
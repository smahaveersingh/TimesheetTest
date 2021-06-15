import{ createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import HomeStack_two from './homestack_two';
import DrawerStack from './drawerStack';
import Expenses from './expenses';


const RootDrawerNavigator = createDrawerNavigator({
    Home: { 
        screen: HomeStack_two,
       
    },

    TSReview: {
        screen: DrawerStack,
    },
    
    Expenses: {
        screen: Expenses,
    }

});

export default createAppContainer(RootDrawerNavigator);
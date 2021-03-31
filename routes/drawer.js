import{ createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import HomeStack from './homestack';
import DrawerStack from './drawerStack';


const RootDrawerNavigator = createDrawerNavigator({
    Home: { 
        screen: HomeStack,
       
    },

    TSReview: {
        screen: DrawerStack,
    }

});

export default createAppContainer(RootDrawerNavigator);
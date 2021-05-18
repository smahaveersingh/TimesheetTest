import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import HourScreen from '../screens/Hour';
import ViewEntryScreen from '../screens/ViewEntry';
import TestScreen from '../screens/Tester';


const Tab = createBottomTabNavigator();

function Tabs(){
    return(
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Hour" component={HourScreen} />
            <Tab.Screen name="View" component={ViewEntryScreen} />
            <Tab.Screen name="Test" component={TestScreen} />
            <Tab.Screen name="Expenses" component={TestScreen} />
        </Tab.Navigator>
    );
}

export default Tabs;
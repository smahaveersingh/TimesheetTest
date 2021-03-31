import * as React from 'react';
import { StatusBar, FlatList, Image, Animated, Text, View, Dimensions, StyleSheet, } from 'react-native';
const { width, height } = Dimensions.get('screen');
import WeekSelector from 'react-native-week-selector';
import { DatabaseConnection } from '../components/database-connection';
import moment from 'moment';
import { IconButton } from 'react-native-paper';

const db = DatabaseConnection.getConnection();

const BG_IMG = 'https://www.solidbackgrounds.com/images/1280x720/1280x720-dark-midnight-blue-solid-color-background.jpg';

const SPACING = 20;
const AVATAR_SIZE = 50;
const ITEM_SIZE = AVATAR_SIZE + SPACING *3;

export default function Test ({ navigation }) {
    const [flatListItems, setFlatListItems] = React.useState([]);
    const [selectedWeek, setselectedWeek] = React.useState();

    const pressHandler = () => 
    {
    navigation.navigate('Home')
    }
    const saveStartingWeek = (value) => {
    moment.locale('en');
    console.log("saveStartingWeek - value:", moment(value).format('L'));
    setselectedWeek(moment(value).format('L'));
    }

    const scrollY = React.useRef(new Animated.Value(0)).current;         

      let SearchEntry = () => {
        db.transaction((tx) => {
       tx.executeSql(
        'SELECT * FROM Timesheet WHERE eow = ?',
        [selectedWeek],
         (tx, results) => {
           //var temp = [];
           //for (let i = 0; i < results.rows.length; ++i)
             //temp.push(results.rows.item(i));
           //setFlatListItems(temp);
           var temp = [];
           var len = results.rows.length;
  
           console.log('len', len);
           if(len >= 0 ) {
            
             for (let i = 0; i < results.rows.length; ++i) 
            
             temp.push(results.rows.item(i));
             setFlatListItems(temp);
   console.log(temp)
           } else {
             alert('Cannot Search Entry!');
           }
                         }
       );
                       });
                    }


    return ( 
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 30}}>
        <Image 
        source={{uri: BG_IMG}}
        style={StyleSheet.absoluteFillObject}
        blurRadius={100}
        />
        <IconButton icon="magnify" size={45} style={{marginLeft: 320, marginTop: 50, position: 'absolute', backgroundColor: '#e6c877',  backgroundColor: '#e6c877', borderWidth: 3, borderColor: 'white'}} onPress={SearchEntry} />
        <View style={{
            marginTop: 10,
            height: 100,
            width:300,
            marginLeft: 10,
            borderWidth: 3,
            borderColor: 'white',
            backgroundColor: '#FFF0E0',
            borderRadius: 20,
            elevation: 10,
            shadowColor: '#fff',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            shadowRadius: 5, 
        }}>
            <Text style={{fontWeight: '700', fontSize: 20, marginBottom: 12, color: 'black'}}>  Week Ending: {moment(selectedWeek).format('MMM Do')}</Text>
        <WeekSelector
            whitelistRange={[new Date(2021, 1, 9), new Date()]}
            weekStartsOn={6}
            onWeekChanged={saveStartingWeek}
          />
          </View>
        <Animated.FlatList 
        data={flatListItems}
        onScroll={
            Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollY}}}],
                [{ useNativeDriver: true}]
            )
        }
        keyExtractor={item => item.key}
        contentContainerStyle={{
            padding: SPACING,
            paddingTop: StatusBar.currentHeight
        }}
        renderItem={({item, index}) => {
            const inputRange = [
                -1,
                0,
                ITEM_SIZE * index,
                ITEM_SIZE * (index + 2)
            ]
            const opacityInputRange = [
                -1,
                0,
                ITEM_SIZE * index,
                ITEM_SIZE * (index + 1)
            ]

            const scale = scrollY.interpolate({
                inputRange,
                outputRange: [1, 1, 1, 0]
            })

            const opacity = scrollY.interpolate({
                inputRange: opacityInputRange,
                outputRange: [1, 1, 1, 0]
            })


            return <Animated.View style={{flexDirection: 'row', padding: SPACING, marginBottom: SPACING, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 10
                },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                opacity,
                transform: [{scale}]
            }}>
                <Image 
                    source={{uri: 'https://cdn5.f-cdn.com/contestentries/1503819/34508403/5ce0587fe3d17_thumb900.jpg'}}
                    style={{width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE}}
                />
                <View>
                    <Text style={{fontWeight: '700', fontSize: 22, color: 'black'}}>  {item.arrival} - {item.depart}     [{item.totalHrs}]</Text>
                    <Text style={{fontWeight: 'bold', opacity: .7, fontSize: 15}}>   {item.projNum}  {item.siteID}</Text>
                    <Text style={{fontWeight: 'bold', opacity: .8, fontSize: 14, color: '#000000'}}>   {moment(item.date).format('dddd, MMMM Do')}</Text> 
                </View>
            </Animated.View>   
        }}
        />
        </View>
    );
} 
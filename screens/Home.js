import * as React from 'react';
import { StyleSheet, View, Text, Image, StatusBar, Animated, TouchableOpacity, Alert, Pressable, Modal, TouchableHighlight} from 'react-native';
import { Button, IconButton, Card, Colors } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import WeekSelector from 'react-native-week-selector';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';
import _ from "lodash";
import Swipeout from 'react-native-swipeout';
import { DatabaseConnection } from '../components/database-connection';
import { colors } from 'react-native-elements';
import AsyncStorage from "@react-native-community/async-storage";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

const db = DatabaseConnection.getConnection();



export default function Home ({ navigation }) {

  const selectDate = new Date();
  const [flatListItems, setFlatListItems] = React.useState([]);            //variable for storing entries into the FlatList
  const [modalVisible, setModalVisible] = React.useState(false);           //Flag Variable for Modal Pop-Up   
  const [Hours, setHours] = React.useState('');                            //Variable for Hours from TimePicker
  const [Minutes, setMinutes] = React.useState('');                        //Variable for Minutes from TimePicker
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false)        //Flag Variable for Lunch for week CheckBox  
  const [dayoftheWeek, setDayoftheWeek] = React.useState('');              //variable for DOW
  const [Week, setWeek] = React.useState(moment().day(5).format("L"));     //variable for EOW
  const [finishvisible, setfinishVisible] = React.useState(false);         //Flag variable for Finish Time TimePicker
  const [finishHours, setfinishHours] = React.useState(selectDate.getHours());              //Variable for Finish Hours from TimePicker
  const [finishMinutes, setfinishMinutes] = React.useState(selectDate.getMinutes());        //Variable for Finish Minutes from TimePicker
  const [currentDate, setCurrentDate] = React.useState(moment().format("L"));               //variable for current Date
  const [visible, setVisible] = React.useState(false);                                      //Flag variable for Start Time TimePicker
  const [showAlert, setshowAlert] = React.useState(false);                                  //Flag variable for Alert 
  const [IDtimesheet, setIDtimesheet] = React.useState('');                                 //variable for id_timesheet
  const [frTimes, setfrTimes] = React.useState('');                                         //variabe to store formatted Start Times
  const [frFinTimes, setfrFinTimes] = React.useState('');                                   //variabe to store formatted Finish Times
  const [totalHrsforday, settotalHrsforday] = React.useState([]);                           //variable to store total Hours for a given day
  const [selectedWeek, setselectedWeek] = React.useState(moment().day(5).format("L"));
  const [Thrs, setThrs] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState('');

  

      const onDismiss = React.useCallback(() => {    // function for closing Start TimePicker
        setVisible(false)
      }, [setVisible])
    
      const onFinishDismiss = React.useCallback(() => {   // function for closing Finish TimePicker
        setfinishVisible(false)
      }, [setfinishVisible])
    
    
      const onConfirm = React.useCallback(      // function to display Start TimePicker
        ({ hours, minutes }) => {
          setVisible(false);
          console.log({ hours, minutes });
          var FrHours = moment(hours, 'HH');
          var FrMinutes = moment(minutes, 'mm');
          hours = setHours(FrHours.format('HH'));
          minutes = setMinutes(FrMinutes.format('mm'));
          var times = FrHours.format('HH') + ':' + FrMinutes.format('mm');
          console.log('time: ' + times);
          setfrTimes(times);
        },
        [setVisible]
      );
    
      const onFinishConfirm = React.useCallback(   // function to display Finish TimePicker
        ({ hours, minutes }) => {
          setfinishVisible(false);
          console.log({ hours, minutes });
          var FinHrs = moment(hours, 'HH');
          var FinMnts = moment(minutes, 'mm');
          hours = setfinishHours(FinHrs.format('HH'));
          minutes = setfinishMinutes(FinMnts.format('mm'));
          var Fintimes = FinHrs.format('HH') + ':' + FinMnts.format('mm');
          console.log('Finish Times: ' + Fintimes);
          setfrFinTimes(Fintimes);
          
        },
        [setfinishVisible]
      );

      const saveStartingWeek = (value) => {   // function to save Week Selected by User
            moment.locale('en')
            console.log("saveStartingWeek - value:", moment(value).add(5, "days").format("L"));
            setselectedWeek(moment(value).add(5, "days").format("L"));
            }
      
    
      const getTimefromMins = (mins) => {  // Function to help convert Minutes in 100 to Minutes in 60 
        if (mins >= 24 * 60 || mins < 0) {
          Alert.alert("Valid input should be greater than or equal to 0 and less than 1440.");
        }
        var h = mins / 60 | 0;
        var m = mins % 60 | 0;
    
        return moment.utc().hours(h).minutes(m).format("HH:mm");
      }
       
       const calcTotalHrs = () => {   // function to calculate total Hours
        //setfinishVisible(true)
         var StrtTime = moment(frTimes, "HH:mm");
         var endTime = moment(frFinTimes, "HH:mm");
    
         var duration = moment.duration(StrtTime.diff(endTime));
         var DHrs = parseInt(duration.asHours());
        var Dmins = parseInt(duration.asMinutes())-DHrs* 60;
         var Tot  = endTime.diff(StrtTime, 'minutes');
         var timetomins = getTimefromMins(Tot);

         
         setThrs(timetomins);
         console.log("CalcTot: " + timetomins);
        //  db.transaction((tx) => {
        //   tx.executeSql(
        //     'UPDATE Timesheet set totalHrs = ?  where id_timesheet = ?',
        //     [timetomins,  IDtimesheet],
        //     (tx, results) => {
        //       console.log('Results', results.rowsAffected);
        //       if (results.rowsAffected > 0) 
        //       {
        //        console.log("Sucess: " + timetomins)
        //       } 
        //       else 
        //       alert('Error in calculating total hours');
        //     }
        //   );
        // });
     }
    
     const finishTime = () => {
      setfinishVisible(true)
     }
    
     const both  = () => 
     {
       calcTotalHrs();
       add_lunch();
     }
     
     
      
    
      const BG_IMG = 'https://www.solidbackgrounds.com/images/950x350/950x350-snow-solid-color-background.jpg';

      const SPACING = 20;
      const AVATAR_SIZE = 30;
      const ITEM_SIZE = AVATAR_SIZE + SPACING *3;
      const scrollY = React.useRef(new Animated.Value(0)).current;         


      const colors = {
        themeColor: "#4263ec",
        white: "#fff",
        background: "#f4f6fc",
        greyish: "#a4a4a4",
        tint: "#2b49c3",
      }

      const popAlert = (IDtimesheet) => 
      {
          setshowAlert (true);
          console.log('ID: ' + IDtimesheet)
          //navigation.navigate('EditSheet', IDtimesheet)
      }
      const pAlert = (IDtimesheet) => 
      {
          setIDtimesheet(IDtimesheet)
          console.log('ID: ' + IDtimesheet)
          //navigation.navigate('EditSheet', IDtimesheet)
      }
     
      const hideAlert = (item) => 
      {
          setshowAlert (false);
          navigation.navigate('EditSheet', item)
      };

     
    const pressHandler = () => 
    {
      save();
      navigation.navigate('Hour')
    };

    const lunchHandler = () => 
    {
      save();
      navigation.navigate('Lunch')
    };

    const deleteHandler = () => 
    {
      if (moment(Week).day("Friday").format('MMM Do') == moment().format('MMM Do') || moment(Week).day("Monday").format('MMM Do') == moment().format('MMM Do')) {
        navigation.navigate('ViewEntry');
      } else {
        alert('Its not Friday or Monday Yet!');
      }
    }

    const saveDayofWeek = (itemValue, itemIndex) => {
      setDayoftheWeek(itemValue);
  
      var next = getNextDay(itemValue);
      //console.log(next.getTime());
      console.log(moment(next.getTime()).format('L'));
      setCurrentDate(moment(next.getTime()).format('L'));
      calcTotalHrs();
    }
  
    const getNextDay = (dayName) => {
      var todayDate = new Date(Week);
      var now = todayDate.getDay();
  
      // Days of the week
    var daysoftheweek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
    // The index for the day you want
    var Indexofday = daysoftheweek.indexOf(dayName.toLowerCase());
  
    // Find the difference between the current day and the one you want
    // If it's the same day as today (or a negative number), jump to the next week
    var diff = Indexofday - now;
    diff = diff < 1 ? diff : diff;
  
    // Get the timestamp for the desired day
    var nextDayTimestamp = todayDate.getTime() + (1000 * 60 * 60 * 24 * diff);
  
    // Get the next day
    return new Date(nextDayTimestamp);
  
    }

    const saveWEEK = (value) => {
      moment.locale('en');
      console.log("saveStartingWeek - value:", moment(value).add(5, "days").format('L'));
        setWeek(moment(value).add(5, "days").format('L'));
    }

    /*React.useEffect(() => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Timesheet',
          [],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setFlatListItems(temp);
          }
        );
      });
    }, []);*/

    const filterTimeFormat = (time) => {
      var decimal_places = 2;

      // Maximum number of hours before we should assume minutes were intended. Set to 0 to remove the maximum.
      var maximum_hours = 15;
    
      // 3
      var int_format = time.match(/^\d+$/);
      
      // 1:15
      var time_format = time.match(/([\d]*):([\d]+)/);
      console.log('time_format: ' + time_format);
      // 10m
      var minute_string_format = time.toLowerCase().match(/([\d]+)m/);
    
      // 2h
      var hour_string_format = time.toLowerCase().match(/([\d]+)h/);
    
      // if (minutes >= 60) {
      //     minutes = minutes - 60;
      //     hours = hours + 1;
      //     console.log('min: ' + minutes)
      //   }
        
      if (time_format != null) {
        var hours = parseInt(time_format[1]);
        var minutes = parseFloat(time_format[2]/60);
         if (minutes >= 0) {
           console.log('greater!!!!');
         }
          var time = hours + minutes;
        
        
      } else if (minute_string_format != null || hour_string_format != null) {
        if (hour_string_format != null) {
          hours = parseInt(hour_string_format[1]);
        } else {
          hours = 0;
        }
        if (minute_string_format != null) {
          minutes = parseFloat(minute_string_format[1]/60);
          
        } else {
          minutes = 0;
        }
        time = hours + minutes;
      } else if (int_format != null) {
        // Entries over 15 hours are likely intended to be minutes.
        time = parseInt(time);
        if (maximum_hours > 0 && time > maximum_hours) {
          time = (time/60).toFixed(decimal_places);
        }
      }
    
      // make sure what ever we return is a 2 digit float
      time = parseFloat(time).toFixed(decimal_places);
      console.log('time' + time);
      return time;  
    }
   

    let Update = () => {
      save();
      db.transaction((tx) => {
     tx.executeSql(
      'SELECT * FROM Timesheet WHERE date = ?',
      [currentDate],
       (tx, results) => {
         //var temp = [];
         //for (let i = 0; i < results.rows.length; ++i)
           //temp.push(results.rows.item(i));
         //setFlatListItems(temp);
         var temp = [];
         var len = results.rows.length;

         console.log('len', len);
         if(len >= 0 ) {
          
           for (let i = 0; i < results.rows.length; ++i) {
             temp.push(results.rows.item(i));
           }
           setFlatListItems(temp);
 console.log(temp)
         } else {
           alert('Cannot Search Entry!');
         }
                       }
                       );
                      });
            };
    
    let SearchEntry = () => {
      save();
      db.transaction((tx) => {
     tx.executeSql(
      'SELECT * FROM Timesheet WHERE date = ? ORDER BY arrival',
      [currentDate],
       (tx, results) => {
         //var temp = [];
         //for (let i = 0; i < results.rows.length; ++i)
           //temp.push(results.rows.item(i));
         //setFlatListItems(temp);
         var temp = [];
         var len = results.rows.length;

         console.log('len', len);
         if(len >= 0 ) {
          
           for (let i = 0; i < results.rows.length; ++i) {
             temp.push(results.rows.item(i));
           }
           setFlatListItems(temp);
 console.log(temp)
         } else {
           alert('Cannot Search Entry!');
         }
                       }
     );
                     });

          db.transaction((tx) => {
          tx.executeSql(
          'SELECT totalHrs FROM Timesheet WHERE date = ?',
          [currentDate],
          (tx, results) => {
          //for (let i = 0; i < results.rows.length; ++i)
          //temp.push(results.rows.item(i));
          //setFlatListItems(temp);
          var temp = [];
          let sum = 0 ;
          var tot = [];

          var len = results.rows.length;

          console.log('len', len);
          if(len >= 0 ) {

          for (let i = 0; i < results.rows.length; ++i) 
      
          temp.push(results.rows.item(i));
          // console.log("temp" + temp)
          // const any = ['07:20', '07:52', '05:03', '01:01', '09:02', '06:00'];
          // const summmm = any.reduce((acc, time) => acc.add(moment.duration(time), moment.duration()));
          // console.log('summ:  ' + [Math.floor(summmm.asHours()), summmm.minutes()].join(':'));

           temp.forEach((item) => {
            
             tot.push(filterTimeFormat(item.totalHrs));
             
             
          //   //moment(item.totalHrs, "HH:mm")
           })
           tot.forEach(function (i){
             sum = sum + parseFloat(i);
           }) 
          
          var n = new Date(0,0);
          n.setSeconds(+sum * 60 * 60);
          settotalHrsforday(n.toTimeString().slice(0,5));
          console.log('sum: ' + sum + ' TOT: ' + tot + 'time: ' + n.toTimeString().slice(0,5));
          } 
          else {
          alert('Cannot Search Entry!');
          }
        }
            
          );
          });
};

const addTimes = (startTime, endTime) => {
  var times = [ 0, 0 ]
  var max = times.length

  var a = (startTime || '').split(':')
  var b = (endTime || '').split(':')

  // normalize time values
  for (var i = 0; i < max; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
  }

  // store time values
  for (var i = 0; i < max; i++) {
    times[i] = b[i] - a[i]
  }

  var hours = times[0]
  var minutes = times[1]


  if (minutes >= 60) {
    var h = (minutes / 60) << 0
    hours += h
    minutes -= 60 * h
  }

  var addd = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);
  console.log(addd);

  return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2)
}


let deleteEntry = (IDtimesheet) => {
  db.transaction((tx) => {
    console.log("Sample " + IDtimesheet); 
    tx.executeSql(
      'DELETE FROM Timesheet WHERE id_timesheet = ?',
      [IDtimesheet],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          Alert.alert(
            'Sucess',
            'Entry removed from Dataase',
            [
              {
                text: 'Ok',
                onPress: SearchEntry()
              }
            ],
            { cancelable: false }
          );
        } else {
          alert('Entry could not be deleted');
        }
      }
    );
  });
};

const setCheckBox = (newValue) => {
  setToggleCheckBox(newValue);
  calcTotalHrs();
}

const sow_lunch = () => {
  if (moment(Week).day("Monday").format('MMM Do') == moment().format('MMM Do') || moment(Week).day("Tuesday").format('MMM Do') == moment().format('MMM Do') || moment(Week).day("Wednesday").format('MMM Do') == moment().format('MMM Do') || moment(Week).day("Thursday").format('MMM Do') == moment().format('MMM Do') || moment(Week).day("Friday").format('MMM Do') == moment().format('MMM Do')) {
    setModalVisible(true);
  } else {
    setModalVisible(false);
  }
}

const find_lunch = () => {
  db.transaction(function (tx) {
    tx.executeSql(
      'SELECT * FROM Timesheet WHERE projNum = "Lunch"',
      [],
      (tx, results) => {
        var temp = [];
       var len = results.rows.length;
       console.log('len', len);
       if(len > 0 ) {
         for (let i = 0; i < results.rows.length; ++i) 
         temp.push(results.rows.item(i));
         if(len <= 0)
         {
            console.log('Lunch check!')
         }
         else{
            console.log("There is a Lunch already");
         }
       } 
       else {
        sow_lunch();
       }
      }
    );
  });
}

const time_clash = () => {
  db.transaction(function (tx) {
    tx.executeSql(
      'SELECT * FROM Timesheet WHERE ? < depart AND ? > arrival AND date=?',
      [frTimes, frFinTimes ,currentDate],
      (tx, results) => {
        var temp = [];
       var len = results.rows.length;
       console.log('len', len);
       if(len >= 0 ) {
         for (let i = 0; i < results.rows.length; ++i) 
         temp.push(results.rows.item(i));
         if(len <= 0)
         {
            console.log("Time Slot Available " + temp);
            add_lunch();
         }
         else{
            console.log("Error")
            alert('There is a timesheet conflict, select a different time');
         }
       } 
       else {
         alert('Cannot Search Entry!');
       }
      }
    );
  });
}

const hide_LModal = () => {
  SearchEntry();
  setModalVisible(false);
}



const add_lunch = () => {
  console.log( 1, selectedWeek, currentDate, 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek);

  if(toggleCheckBox == false)
{

  db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO Timesheet(user_id, eow, date, projNum, comment , arrival, depart, siteID, totalHrs, dayoftheweek) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [1, selectedWeek, currentDate, 'Lunch', 'Lunch', frTimes, frFinTimes, 'Lunch', Thrs, dayoftheWeek],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          Alert.alert(
            'Sucess',
            'Entry added succesfully to DB !!!',
            [
              {
                text: 'Ok',
                onPress: hide_LModal,
              },
            ],
            { cancelable: false }
          );
        } else alert('Error Entry unsuccesfull !!!');
      }
    );
    //save()
  });
}

else if (toggleCheckBox == true)
{
db.transaction(function (tx) {
  tx.executeSql(
    'INSERT INTO Timesheet(user_id, eow, date, projNum, comment , arrival, depart, totalHrs, siteID, dayoftheweek) VALUES (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?)',
    [1, selectedWeek, moment(selectedWeek).day("Monday").format('L'), "Lunch", 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek , 
    1, selectedWeek, moment(selectedWeek).day("Tuesday").format('L'), 'Lunch', 'Lunch', frTimes, frFinTimes,  Thrs, 'Lunch', dayoftheWeek , 
    1, selectedWeek, moment(selectedWeek).day("Wednesday").format('L'), 'Lunch', 'Lunch', frTimes, frFinTimes,  Thrs, 'Lunch', dayoftheWeek ,
    1, selectedWeek, moment(selectedWeek).day("Thursday").format('L'), 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek ,
    1, selectedWeek, moment(selectedWeek).day("Friday").format('L'), 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek ],
    (tx, results) => {
      console.log('Results', results.rowsAffected);
      if (results.rowsAffected > 0) {
        Alert.alert(
          'Sucess',
          'Entry added succesfully to DB !!!',
          [
            {
              text: 'Ok',
              onPress: hide_LModal,
            },
          ],
          { cancelable: false }
        );
      } else alert('Error Entry unsuccesfull !!!');
    }
  ); 
  //save()
});

}
};


 const save = async () => {
    try{
      await AsyncStorage.setItem("MyWeekEnding", Week)
      await AsyncStorage.setItem("MyWeek", currentDate)
      await AsyncStorage.setItem("MyDays", dayoftheWeek)
    }
    catch (err)
    {
      alert(err)
    }
  };

  const load = async () => {
    try{
     let Week = await AsyncStorage.getItem("MyWeekEnding")
     let currentDate = await AsyncStorage.getItem("MyWeek")
    
     if(Week !== null)
     {
      setWeek(Week)
     }
     
     if(currentDate !== null)
     {
      setCurrentDate(currentDate)
     }

    }
    catch (err){
      alert(err)
    }
  };

  React.useEffect(() => {
    load();
  },[])

  const onDelte = (IDtimesheet) => {
    deleteEntry(IDtimesheet);
  }

  const onEdit = (item) => {
    navigation.navigate('EditSheet', item)
  }

  let swipeBtns = (item) => [
    {
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => {  onDelte(item.id_timesheet) }
   },
    {
      text: 'Edit',
      backgroundColor: '#eed202',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => { onEdit(item) }
   }
  ];

  
  
   
    return (
      <View style={{backgroundColor: colors.white,flex: 1}}>
         <Image 
    source={require('../assets/Untitled.png')}
    style={StyleSheet.absoluteFillObject}
    blurRadius={30}
    onLoad={find_lunch}
    />
<Text style={{marginLeft: 18, marginTop: 20, fontSize: 20, color: '#091629', fontWeight: 'bold'}}>Week Ending            Day of the Week</Text>


      <View style={{
        marginTop: 10,
        height: 100,
        width:380,
        marginLeft: 8,
        borderWidth: 4,
        borderColor: 'black',
        backgroundColor: '#34c0eb',
        borderRadius: 20,        
      }}>
      
        <WeekSelector
        whitelistRange={[new Date(2018, 7, 13), new Date()]}
        weekStartsOn={6}
        onWeekChanged={saveWEEK}
      />
      <IconButton icon="magnify" size={25} style={{marginLeft: 330, marginTop: 25, position: 'absolute', backgroundColor: '#ffffff', borderWidth: 3, borderColor: 'white'}} onPress={SearchEntry} />

      </View>

        
        <Picker style={{width: 145, height: 44, backgroundColor: '#e1ecf2', marginTop: -73, marginLeft: 190, borderWidth: 2, borderColor: 'black', borderStyle: 'dashed' }}
                selectedValue={dayoftheWeek}
                itemStyle={{fontWeight: 'bold'}}
                onValueChange=
                {
                    saveDayofWeek
                }>

                        <Picker.Item label={'Monday' + ' ' +  moment(Week).day("Monday").format('MMM Do')} value="monday" />
                        <Picker.Item label={'Tuesday' + ' ' +  moment(Week).day("Tuesday").format('MMM Do')} value="tuesday" />
                        <Picker.Item label={'Wednesday' + ' ' +  moment(Week).day("Wednesday").format('MMM Do')} value="wednesday" />
                        <Picker.Item label={'Thursday' + ' ' +  moment(Week).day("Thursday").format('MMM Do')} value="thursday" />
                        <Picker.Item label={'Friday' + ' ' +  moment(Week).day("Friday").format('MMM Do')} value="friday" />
                        <Picker.Item label={'Saturday' + ' ' +  moment(Week).day("Saturday").format('MMM Do')} value="saturday" />
                        <Picker.Item label={'Sunday' + ' ' +  moment(Week).day("Sunday").format('MMM Do')} value="sunday" />
                       
                        </Picker>
       
        {/* <View>
        <Text style={{marginLeft: 148, marginTop: 100, fontSize: 16, color: '#a1a1a1', fontWeight: 'bold'}}>Add an Entry</Text>
        <IconButton icon="plus" size={45} style={{marginLeft: 160,  backgroundColor: '#ffffff', color:'#091629', borderWidth: 3, borderColor: 'white',}} onPress={pressHandler} />
        </View>  */}
        
        <Text style={{fontWeight: '700', fontSize: 20, color: '#091629', marginLeft: 20, marginTop: 30}}>{moment(currentDate).format('dddd, MMMM Do')}  </Text> 
        <Text style={{backgroundColor: "#091629", borderColor: 'black', paddingHorizontal: 25, paddingTop: 5, borderRadius: 10, height: 40, fontSize: 20, fontWeight: 'bold', color: '#f2fbff' ,width: 300, marginTop: 5, marginLeft: 60, borderWidth: 3}}>Day Total Hours: {totalHrsforday}</Text>
          <Animated.FlatList 
    data={flatListItems}
    onScroll={
        Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            { useNativeDriver: true}
        )
    }
    keyExtractor={(item) => item.id_timesheet}
    contentContainerStyle={{
        padding: SPACING,
        paddingTop: StatusBar.currentHeight
    }}
     
    renderItem={({item, index}) => {
      
      const isSelected = (selectedItem === item.id_timesheet);
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

        return  <Swipeout right={swipeBtns(item)}
            autoClose='true'
            backgroundColor= 'transparent'>
            <Animated.View style={{flexDirection: 'row', padding: SPACING, marginBottom: SPACING, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 10
            },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            opacity,
            transform: [{scale}]
            
        }}
        >
           
            <View>
            <Text style={{fontWeight: '700', fontSize: 24, color: '#091629'}}>{item.projNum}  </Text> 
            <Text style={{opacity: .7, fontSize: 15}}>  {item.projNum} - {item.siteID}</Text>
            <Text style={{fontWeight: '700', fontSize: 14, color: '#091629'}}>  {item.arrival} - {item.depart}     Duration : {item.totalHrs}</Text>  
        </View>        
        </Animated.View>   
        </Swipeout>
    }}
    
    />
 
    <View style={styles.centeredView}>
      
<Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => {
    setModalVisible(!modalVisible);
  }}
>
<View style={styles.centeredView}>
<View style={styles.modalView}>
    <View style={styles.Weekarrow}>
    <IconButton icon="close"  color={Colors.white} size={29} style={{marginLeft: 322, marginTop: 0, position: 'absolute', backgroundColor: '#e00000', borderWidth: 3, borderColor: 'white'}} onPress={() => setModalVisible(!modalVisible)}/>
      <Text style={{fontWeight: 'bold',  color: '#091629'}}>Week Ending: {selectedWeek}{navigation.getParam('eow')}</Text>
  <WeekSelector
      dateContainerStyle={styles.date}
      whitelistRange={[new Date(2021, 1, 9), new Date()]}
      weekStartsOn={6}
      onWeekChanged={saveStartingWeek}
    />
    </View>
<Text>Lunch Entry</Text>

<TimePickerModal
  visible={visible}
  onDismiss={onDismiss}
  onConfirm={onConfirm}
  hours={12} // default: current hours
  minutes={0} // default: current minutes
  label="Select time" // optional, default 'Select time'
  cancelLabel="Cancel" // optional, default: 'Cancel'
  confirmLabel="Ok" // optional, default: 'Ok'
  animationType="fade" // optional, default is 'none'
  locale={'en'} // optional, default is automically detected by your system
/>
<Button color="#09253a" style={styles.startTime} icon="clock" onPress={()=> setVisible(true)}>
  Start: {frTimes}
</Button>

<TimePickerModal
  visible={finishvisible}
  onDismiss={onFinishDismiss}
  onConfirm={onFinishConfirm}
  hours={12} // default: current hours
  minutes={0} // default: current minutes
  label="Select time" // optional, default 'Select time'
  cancelLabel="Cancel" // optional, default: 'Cancel'
  confirmLabel="Ok" // optional, default: 'Ok'
  animationType="fade" // optional, default is 'none'
  locale={'en'} // optional, default is automically detected by your system
/>
<Button color="#09253a" style={styles.endTime} icon="clock" onPress={()=> setfinishVisible(true)}>
  Finish: {frFinTimes}
</Button>

      
<CheckBox style={styles.check}
disabled={false}
value={toggleCheckBox}
onValueChange={setCheckBox}
/>

  

    <Text style={styles.sameWeek}>Same for the week</Text>

    <View>
              <Text style={{fontWeight: 'bold', color: '#091629', width: 250}}>
                  Day of the Week 
              </Text>
             <Picker style={styles.datefive}
              selectedValue={dayoftheWeek}
              onValueChange=
              {
                  saveDayofWeek
              }>
                      <Picker.Item key="uniqueID9" label="Please Select a Day" value="" />
                      <Picker.Item label="Monday" value="monday" />
                      <Picker.Item label="Tuesday" value="tuesday" />
                      <Picker.Item label="Wednesday" value="wednesday" />
                      <Picker.Item label="Thursday" value="thursday" />
                      <Picker.Item label="Friday" value="friday" />
                      <Picker.Item label="Saturday" value="saturday" />
                      <Picker.Item label="Sunday" value="sunday" />
                     
            </Picker>
    </View>
    

    <Button color="#09253a" onPress={time_clash} style={styles.addButton}>
                Add Lunch
        </Button>

              
            </View>
          </View>
        </Modal>
      </View>
     <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="Lunch" onPress={() => setModalVisible(true)}>
            <Icon name="fast-food" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Submit" onPress={deleteHandler}>
            <Icon name="checkmark-sharp" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="Add Entry" onPress={pressHandler}>
            <Icon name="add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
    <View>
    
   
  </View>   
  </View>
        
);
            
   }
    /*
    <View style={{marginLeft: -200, marginTop: -550}}>
              
          
            </View>
           
    */
   
   const styles = StyleSheet.create({
       container:{
         backgroundColor: colors.themeColor,
         alignItems: 'center',
           justifyContent: 'center',
           flex: 1,
           paddingBottom: 150
           },
           actionButtonIcon: {
            fontSize: 20,
            height: 22,
            color: 'white',
          },
           
         text:{
           alignItems: 'center',
           marginTop:20,
           justifyContent: 'center'
           },
           listItem: {
            flexDirection: 'row',
            marginTop: 5,
        },
    
        SelectedlistItem: {
            flexDirection: 'row',
            marginTop: 5,
            backgroundColor:"grey",
        },
   
       icons:{
           alignItems: 'center',
           color:'white',
           marginBottom:200,
           justifyContent: 'center'
           },
           date: {
            flex: 1,
            fontWeight: 'bold',
            justifyContent: 'center',
          },
          weekstyle: {
            marginTop: -400
          },
   
           text1:{
             alignItems: 'center',
             marginTop: -50,
             marginBottom: 75,
             justifyContent: 'center'
             },
             textheader: {
              color: '#111',
              fontSize: 12,
              fontWeight: '700',
          
            },
            textbottom: {
              color: '#111',
              fontSize: 18,
            },
            accordion:{
              width: '90%',
              backgroundColor: '#F2F2F7',
              borderRadius: 10,
              padding:20,
              justifyContent: 'center'
            },
            accordionHeader: {
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              marginVertical: 10,
              backgroundColor: 'white',
              borderRadius: 5,
              padding:10,    
          
            },
            accordionTitle: {
              fontSize: 20, 
              fontWeight:'bold',
              marginBottom: 20,
              color: '#62625A'
            },
            accordionItems: {
              borderRadius: 5,
              backgroundColor:'white',
          
            },
            accordionItemValue:{
              flexDirection: 'row',
              justifyContent:"space-between",
              padding: 10,
          
            },
            accordionItemValueBadge: {
              color: '#42C382',
              padding: 5,
              fontWeight: 'bold'
            },
            accordionItemValueName: {
              color: '#62625A'
            },
            onePickerItems: {
              height: 44,
              color: 'blue',
            },
            tableHeader: {
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              backgroundColor: "#09253a",
              borderTopEndRadius: 10,
              borderTopStartRadius: 10,
              height: 50,
              width: 350
            },
            tableRow: {
              flexDirection: "row",
              height: 50,
              alignItems:"center",
            },
            columnHeader: {
              width: "20%",
              justifyContent: "center",
              alignItems:"center"
            },
            columnHeaderTxt: {
              color: "white",
              fontWeight: "bold",
            },
            columnRowTxt: {
              width:"20%",
              textAlign:"center",
            },
            startTime:{
              marginLeft: -200,
              width: 140
             },
  
             endTime:{
              marginLeft: 200,
              marginTop: -38,
              width: 140
             },

            modalView: {
              margin: 20,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5
            },
            button: {
              backgroundColor: '#091629',
              borderRadius: 20,
              padding: 10,
              elevation: 2
              
            },
            buttonOpen: {
              backgroundColor: "#091629",
            },
            buttonClose: {
              backgroundColor: "#2196F3",
            },
            sameWeek: {
              marginTop: -25,
              marginLeft: 20,
              marginBottom: 20,
              color: 'black'
            },
      
            check: {
              marginLeft: -150,
               marginTop: 15,
              color: 'black'
            },
      
            textStyle: {
              backgroundColor: '#091629',
              color: "white",
              fontWeight: "bold",
              textAlign: "center"
            },
            modalText: {
              marginBottom: 15,
              textAlign: "center"
            },

            Weekarrow:{
              height: 100,
              width:350,
              marginTop:-37,
              marginBottom: 10,
              backgroundColor: '#7affbd',
              borderRadius: 20,
              fontWeight: 'bold',
              borderWidth: 3,
          borderColor: 'white',
             },
             delstyle:{
               backgroundColor: '#037272',
               padding: 10,
               borderRadius: 8,
               fontWeight: 'bold',
               color: '#fff'
             },
             edtbtn:{
               flexDirection: 'column',
               
              backgroundColor: '#eb864b',
              padding: 10,
              borderRadius: 8,
              fontWeight: 'bold'
             }
     });
     
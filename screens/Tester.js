import * as React from 'react';
import { StyleSheet, View, Text, Image, StatusBar, Animated, TouchableOpacity, Alert, Pressable, Modal} from 'react-native';
import { Button, IconButton, Card, Colors } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import WeekSelector from 'react-native-week-selector';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';
import _ from "lodash";
import Dialog from "react-native-dialog";
import { DatabaseConnection } from '../components/database-connection';
import { colors } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from "@react-native-community/async-storage";

const db = DatabaseConnection.getConnection();



export default function Home ({ navigation }) {

  const selectDate = new Date();
  const [flatListItems, setFlatListItems] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [Hours, setHours] = React.useState('');
  const [Minutes, setMinutes] = React.useState('');
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false)
  const [FINHours, setFINHours] = React.useState('');
  const [FINMinutes, setFINMinutes] = React.useState('');
  const [dayoftheWeek, setDayoftheWeek] = React.useState('');
  const [Week, setWeek] = React.useState(moment().day(5).format("L"));
  const [finishvisible, setfinishVisible] = React.useState(false);
  const [finishHours, setfinishHours] = React.useState(selectDate.getHours());
  const [finishMinutes, setfinishMinutes] = React.useState(selectDate.getMinutes());
  const [currentDate, setCurrentDate] = React.useState(moment().format("L"));
  const [formatDay, setformatDay] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [showAlert, setshowAlert] = React.useState(false);
  const [IDtimesheet, setIDtimesheet] = React.useState('');
  const [frTimes, setfrTimes] = React.useState('');
  const [frFinTimes, setfrFinTimes] = React.useState('');
  const [ columns, setColumns ] = React.useState([
    "Project",
    "Site",
    "Start/End",
    "Total"
  ])
  const [ direction, setDirection ] = React.useState(null);
  const [ selectedColumn, setSelectedColumn ] = React.useState(null);
  const [totalHrsforday, settotalHrsforday] = React.useState([]);
  const [selectedWeek, setselectedWeek] = React.useState(moment().day(5).format("L"));
  const [Thrs, setThrs] = React.useState('');

  var timeList = [];
  /*_onPressButton  = () => {
    alert(
      <Text>pop</Text>
        )
      }*/
      const onDismiss = React.useCallback(() => {
        setVisible(false)
      }, [setVisible])
    
      const onFinishDismiss = React.useCallback(() => {
        setfinishVisible(false)
      }, [setfinishVisible])
    
    
      const onConfirm = React.useCallback(
        ({ hours, minutes }) => {
          setVisible(false);
          console.log({ hours, minutes });
          var FrHours = moment(hours, 'HH');
          var FrMinutes = moment(minutes, 'mm');
          //setTime('{$hours}:${minutes}')
          hours = setHours(FrHours.format('HH'));
          minutes = setMinutes(FrMinutes.format('mm'));
          //setHours(hours.toString());
          //setMinutes(minutes.toString());
          var times = FrHours.format('HH') + ':' + FrMinutes.format('mm');
          console.log('time: ' + times);
          setfrTimes(times);
        },
        [setVisible]
      );
    
      const onFinishConfirm = React.useCallback(
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

      const saveStartingWeek = (value) => {
    
        moment.locale('en')
            console.log("saveStartingWeek - value:", moment(value).add(5, "days").format("L"));
            setselectedWeek(moment(value).add(5, "days").format("L"));
            //setselectedWeek(navigation.getParam('eow'));
            //setselectedWeek(new Date(value).toString());
            }
      
    
      const getTimefromMins = (mins) => {
        if (mins >= 24 * 60 || mins < 0) {
          Alert.alert("Valid input should be greater than or equal to 0 and less than 1440.");
        }
        var h = mins / 60 | 0;
        var m = mins % 60 | 0;
    
        return moment.utc().hours(h).minutes(m).format("HH:mm");
      }
    
      let updateUser = () => {
        console.log( selectedWeek, currentDate, frTimes, frFinTimes, Thrs, dayoftheWeek);
    
        if (!frTimes) {
          alert('Add Hours for the entry');
          return;
        }
        
        if (!frFinTimes) {
          alert('Add End Hours for the entry');
          return;
        }  
        
        if (!dayoftheWeek) {
          alert('Please select a day of the week');
          return;
        }
        
    
    
        db.transaction((tx) => {
          tx.executeSql(
            'UPDATE Timesheet set arrival = ?, depart = ? , dayoftheweek = ?, projNum = ?, siteID = ?, comment = ?, date = ?  where id_timesheet=?',
            [frTimes, frFinTimes, dayoftheWeek, 'Lunch', 'Lunch', 'Lunch', currentDate,  IDtimesheet],
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {
                Alert.alert(
                  'Sucesso',
                  'Usuário atualizado com sucesso !!',
                  [
                    {
                      text: 'Ok',
                      onPress: () =>
                      navigation.replace('Home', {
                        someParam: 'Param',
                      }),
                    },
                  ],
                  { cancelable: false }
                );
              } else alert('Erro ao atualizar o usuário');
            }
          );
        });
      };
      
    
       const calcTotalHrs = () => {
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
     
      
    
      const BG_IMG = '#fff';

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

      const popAlert = () => 
      {
          setshowAlert (true);
      }
     
      const hideAlert = () => 
      {
          setshowAlert (false);
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
      navigation.navigate('ViewEntry')
    }

    const saveDayofWeek = (itemValue, itemIndex) => {
      setDayoftheWeek(itemValue);
  
      var next = getNextDay(itemValue);
      //console.log(next.getTime());
      console.log(moment(next.getTime()).format('L'));
      setCurrentDate(moment(next.getTime()).format('L'));
      setformatDay(moment(next.getTime()).format('MMM Do'));
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
          'SELECT totalHrs FROM Timesheet WHERE eow = ?',
          [selectedWeek],
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


let deleteEntry = () => {
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
                onPress: Update()
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
                onPress: () =>
                navigation.replace('Home', {
                  someParam: 'Param',
                }),
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
              onPress: () =>
              navigation.replace('Home', {
                someParam: 'Param',
              }),
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
     let dayoftheWeek = await AsyncStorage.getItem("MyDays")

     if(Week !== null)
     {
      setWeek(Week)
     }
     
     if(currentDate !== null)
     {
      setCurrentDate(currentDate)
     }

     if(dayoftheWeek !== null)
     {
      setDayoftheWeek(dayoftheWeek)
     }

    }
    catch (err){
      alert(err)
    }
  };

  React.useEffect(() => {
    load();
  },[])


    
   
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
          borderColor: 'black',
          backgroundColor: '#7affbd',
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

<Text style={{backgroundColor: "#091629", borderColor: 'black', paddingHorizontal: 25, paddingTop: 5, borderRadius: 10, height: 40, fontSize: 20, fontWeight: 'bold', color: '#f2fbff' ,width: 300, marginTop: 5, marginLeft: 60, borderWidth: 3}}>Day Total Hours: {totalHrsforday}</Text>
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
      setIDtimesheet(item.id_timesheet)
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
            <TouchableOpacity onPress={popAlert}>
            <View>
            <Text style={{fontWeight: '700', fontSize: 24, color: '#091629'}}>{item.projNum}  </Text> 
                  <Text style={{opacity: .7, fontSize: 15}}>  {item.projNum} - {item.siteID}</Text>
                <Text style={{fontWeight: '700', fontSize: 14, color: '#091629'}}>  {item.arrival} - {item.depart}     Duration : {item.totalHrs}</Text>
          
           <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title= {item.comment}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          confirmText="Delete"
          cancelText="Edit"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            hideAlert()
            navigation.navigate('EditSheet', item)
          }}
          onConfirmPressed={() => {
            console.log("Timesheet ID: " + IDtimesheet)  
            deleteEntry(IDtimesheet);  
            hideAlert(); 
          }}
        />
          
           </View>
            </TouchableOpacity>  
           
        </Animated.View>   
        
    }}
    />
 
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
           
         text:{
           alignItems: 'center',
           marginTop:20,
           justifyContent: 'center'
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
              backgroundColor: '#e1ecf2',
              borderRadius: 20,
              fontWeight: 'bold'
             },
     });
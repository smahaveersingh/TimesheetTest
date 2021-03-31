import * as React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Alert, Pressable, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { Picker } from '@react-native-picker/picker';
import WeekSelector from 'react-native-week-selector';
import CheckBox from '@react-native-community/checkbox';
import "intl";
import "intl/locale-data/jsonp/en";
import { DatabaseConnection } from '../components/database-connection';
import moment from 'moment';

const db = DatabaseConnection.getConnection();

 function Hour ({ navigation }) {

  const selectDate = new Date();
  const [currentDate, setCurrentDate] = React.useState('');
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false)

  const [modalVisible, setModalVisible] = React.useState(false);
  const [dayoftheWeek, setDayoftheWeek] = React.useState('');
  const [projNum, setprojNum] = React.useState('');
  const [siteID, setsiteID] = React.useState('')
  const [Thrs, setThrs] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [finishvisible, setfinishVisible] = React.useState(false);
  const [Lvisible, setLVisible] = React.useState(false);
  const [Lfinishvisible, setLfinishVisible] = React.useState(false);

  const [Hours, setHours] = React.useState('');
  const [Minutes, setMinutes] = React.useState('');
  const [finishHours, setfinishHours] = React.useState(selectDate.getHours());
  const [finishMinutes, setfinishMinutes] = React.useState(selectDate.getMinutes());
  const [LunchHours, setLunchHours] = React.useState(selectDate.getHours());
  const [LunchMinutes, setLunchMinutes] = React.useState(selectDate.getMinutes());
  const [finishLunchHours, setfinishLunchHours] = React.useState(selectDate.getHours());
  const [finishLunchMinutes, setfinishLunchMinutes] = React.useState(selectDate.getMinutes());
  const [frTimes, setfrTimes] = React.useState('');
  const [frFinTimes, setfrFinTimes] = React.useState();
  const [description, setDescription] = React.useState('');
  const [selectedWeek, setselectedWeek] = React.useState();

  var timeList = []; // variable to store time values to check for overlaps

  const onDismiss = React.useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const onFinishDismiss = React.useCallback(() => {
    setfinishVisible(false)
  }, [setfinishVisible])

  const pressHandler = () => 
    {
      navigation.navigate('ListView')
    }



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
      console.log('Finish Times: ' + moment(Fintimes, 'HH:mm').format('HH:mm'));
      setfrFinTimes(Fintimes);
      
    },
    [setfinishVisible]
  );



  

  const renderUserNames = () => {
    if(projNum=='VOD103015'){
      return [<Picker.Item key="uniqueID8" label="CE005 ~ Woodcock Hill" value="VOD103015 1" />,
             <Picker.Item key="uniqueID7" label="CE006 ~ Crusheen knocknamucky" value="VOD103015 2" />,
            <Picker.Item key="uniqueID6" label="CE007 ~ Lack West" value="VOD103015 3" />,
            <Picker.Item key="uniqueID5" label="CE008 ~ Dangan Ballyvaughan" value="VOD103015 4" />,
            <Picker.Item key="uniqueID4" label="CE009 ~ Glenagall" value="VOD103015 5" />]
     }
   
     else if(projNum=='ABO101597'){
       return [<Picker.Item key="uniqueID3" label="CLS001 ~ Cluster 1 OHL" value="ABO101597 1" />
             ]
      }
   
     else{
          return [<Picker.Item key="uniqueID1" label="Client 1" value="Client 1" />,
           <Picker.Item key="uniqueID2" label="Client 2" value="Client 2" />]
       }

  }

  React.useEffect(() => {
    var tdate = new Date(); //Current Date
    var Tday = tdate.getDay(); //Current Day
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    /*setCurrentDate(
    
      //date + '/' + month + '/' + year 
      //+ ' ' + hours + ':' + min + ':' + sec
      moment(tdate).format("YYYY-MM-DD")
  );*/
  }, []);

  const testClash = (d1, d2) => {     //calculating the weight of the conflict.
    	// d1 and d2 in array format
  // [moment from, moment to]
  var count = 0;
  for (var i = 0, t; t = d1[i]; i++) {
    // use isBetween exclusion
    if (t.isBetween(d2[0], d2[1], null, '()')) {
      count++;
    }
  }

  for (var i = 0, t; t = d2[i]; i++) {
    // use isBetween exclusion
    if (t.isBetween(d1[0], d1[1], null, '()')) {
      count++;
    }
  }

  if (count > 1) {
    return console.log('completely conflict');
  }

  if (count > 0) {
    return console.log('partial conflict');
  }

  return console.log('something else');
  }

  var t1 = [moment(frTimes).format('HH:mm'), moment(frTimes).format('HH:mm')]

  const time_clash = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'SELECT arrival, depart FROM Timesheet WHERE date=?',
        [currentDate],
        (tx, results) => {
          var temp = [];
         var len = results.rows.length;

         console.log('len', len);
         if(len >= 0 ) {
          
           for (let i = 0; i < results.rows.length; ++i) 
          
           temp.push(results.rows.item(i));
           console.log(temp);
 console.log(temp)
         } else {
           alert('Cannot Search Entry!');
         }
        }
      );
    });
  }
  

  const add_entry = () => {
    //calcTotalHrs();
    
    console.log( selectedWeek, currentDate, projNum, description, frTimes, frFinTimes, Thrs, siteID, dayoftheWeek);

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO Timesheet(user_id, eow, date, projNum, comment , arrival, depart, totalHrs, siteID, dayoftheweek) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [1, selectedWeek, currentDate, projNum, description, frTimes, frFinTimes, Thrs, siteID, dayoftheWeek ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Sucess',
              'Entry added succesfully to DB !!!',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Home'),
                },
              ],
              { cancelable: false }
            );
          } else alert('Error Entry unsuccesfull !!!');
        }
      );
    });
  };

  const add_lunch = () => {
    
    console.log( selectedWeek, currentDate, projNum, description, Hours, Minutes, finishHours, finishMinutes, LunchHours, LunchMinutes,  finishLunchHours, finishLunchMinutes,  Thrs, siteID, dayoftheWeek);

    if(toggleCheckBox == false)
{
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO Timesheet(user_id, eow, date, projNum, comment , arrival ,  depart,  totalHrs, siteID, dayoftheweek) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [1, selectedWeek, currentDate, 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek ],
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
      
    });
  }

  else
{
  db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO Timesheet(user_id, eow, date, projNum, comment , arrival ,  depart,  totalHrs, siteID, dayoftheweek) VALUES (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?)',
      [1, selectedWeek, moment(selectedWeek).day("Monday").format('dddd, MMMM Do YYYY'), 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek , 
      1, selectedWeek, moment(selectedWeek).day("Tuesday").format('dddd, MMMM Do YYYY'), 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek ,  
      1, selectedWeek, moment(selectedWeek).day("Wednesday").format('dddd, MMMM Do YYYY'), 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek , 
      1, selectedWeek, moment(selectedWeek).day("Thursday").format('dddd, MMMM Do YYYY'), 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek , 
      1, selectedWeek, moment(selectedWeek).day("Friday").format('dddd, MMMM Do YYYY'), 'Lunch', 'Lunch',frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek ,  ],
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
    
  });
 
}
};


  let options  = renderUserNames();

  const saveDayofWeek = (itemValue, itemIndex) => {
    setDayoftheWeek(itemValue);
    var next = getNextDay(itemValue);
    //console.log(next.getTime());
    console.log(moment(next.getTime()).format('L'));
    setCurrentDate(moment(next.getTime()).format('L'));
    calcTotalHrs();
  }

  const getNextDay = (dayName) => {
    var todayDate = new Date(selectedWeek);
    var now = todayDate.getDay();

    // Days of the week
	var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

	// The index for the day you want
	var day = days.indexOf(dayName.toLowerCase());

  // Find the difference between the current day and the one you want
	// If it's the same day as today (or a negative number), jump to the next week
	var diff = day - now;
	diff = diff < 1 ? diff : diff;

	// Get the timestamp for the desired day
	var nextDayTimestamp = todayDate.getTime() + (1000 * 60 * 60 * 24 * diff);

	// Get the next day
	return new Date(nextDayTimestamp);

  }

  const saveStartingWeek = (value) => {
        moment.locale('en');
        console.log("saveStartingWeek - value:", moment(value).format('L'));
        setselectedWeek(moment(value).format('L'));
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

  // const splitTime = (time) => {  //function to split time in hours and minutes seperatly
  //   var today = new Date();
  //   var _t = time.split(";");
  //   today.setHours(_t[0], _t[1], 0, 0);
  //   return today;
  // }

  // const validate = (sTime, eTime) => {
  //   if(+splitTime(sTime) < +splitTime(eTime)) {
  //     var len = timeList.length;
  //     return len>0?(+splitTime(timeList[len - 1].e))
  //   }
  // }

   const calcTotalHrs = () => {
    //setfinishVisible(true)
     var StrtTime = moment(frTimes, "HH:mm");
     var endTime = moment(frFinTimes, "HH:mm");

     var duration = moment.duration(StrtTime.diff(endTime));
     var DHrs = parseInt(duration.asHours());
    var Dmins = parseInt(duration.asMinutes())-DHrs* 60;
     var Tot  = endTime.diff(StrtTime, 'minutes');
     var timetomins = getTimefromMins(Tot);
     //setThrs(Tot);
     
  //   //Alert.alert(DHrs + 'Hrs');
     setThrs(timetomins);
     console.log(timetomins);
 }

 const finishTime = () => {
  setfinishVisible(true)
 }

    
  

  return (
        <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.Weekarrow}>
            <Text style={{fontWeight: 'bold'}}>Week Ending: {selectedWeek}</Text>
        <WeekSelector
            dateContainerStyle={styles.date}
            whitelistRange={[new Date(2021, 1, 9), new Date()]}
            weekStartsOn={6}
            onWeekChanged={saveStartingWeek}
          />
          </View>

          
          <View>
                    <Text style={{fontWeight: 'bold'}}>
                        Day of the Week 
                    </Text>
                   <Picker style={styles.datefive}
                    selectedValue={dayoftheWeek}
                    onValueChange=
                    {
                        saveDayofWeek
                    }>
                            <Picker.Item label="Monday" value="monday" />
                            <Picker.Item label="Tuesday" value="tuesday" />
                            <Picker.Item label="Wednesday" value="wednesday" />
                            <Picker.Item label="Thursday" value="thursday" />
                            <Picker.Item label="Friday" value="friday" />
                            <Picker.Item label="Saturday" value="saturday" />
                            <Picker.Item label="Sunday" value="sunday" />
                           
                            </Picker>
                            </View>
  
          <View style={styles.btn}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.titleStyle}>Project No </Text>
              <View style={styles.pickerStyle}>
                  {<Picker
                      mode='dropdown'
                      selectedValue={projNum}
                      onValueChange={(itemValue, itemIndex) =>
                          //this.setState({ projNum: itemValue })
                          setprojNum(itemValue)
                      }>
                      <Picker.Item key="uniqueID9" label="Please Select" value="" />
                      <Picker.Item key="uniqueID10" label="VOD103015 ~ Assure Provide engsupport Oct 1st to Oct 31st 2019" value="VOD103015" />
                      <Picker.Item key="uniqueID11" label="ABO101597 ~ Over head Line works Cluster 1 ~ CLS001 ~ Cluster1 OHL" value="ABO101597" />
                      <Picker.Item key="uniqueID12" label="Client" value="Client" />
                  </Picker>}
              </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
              <Text style={styles.titleStyle}>Site ID</Text>
              <View style={styles.pickerStyle2}>
                  {<Picker
                      mode='dropdown'
                      selectedValue={siteID}
                      onValueChange={(itemValue, itemIndex) =>
                          //this.setState({ siteID: itemValue })
                          setsiteID(itemValue)
                      }>
                      <Picker.Item label="Please Select" value="" />
                           {options}
  
                  </Picker>}
              </View>
          </View>
         </View>


          <View style={styles.section}>
            <TimePickerModal
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={12} // default: current hours
        minutes={14} // default: current minutes
        label="Select time" // optional, default 'Select time'
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale={'en'} // optional, default is automically detected by your system
      />
      <Button color="#09253a" style={styles.startTime} icon="walk" onPress={()=> setVisible(true)}>
        Start: {frTimes}
      </Button>

      <TimePickerModal
        visible={finishvisible}
        onDismiss={onFinishDismiss}
        onConfirm={onFinishConfirm}
        hours={12} // default: current hours
        minutes={14} // default: current minutes
        label="Select time" // optional, default 'Select time'
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale={'en'} // optional, default is automically detected by your system

      />
      <Button color="#09253a" style={styles.endTime} icon="run" onPress={() => setfinishVisible(true)}>
        Finish: {frFinTimes}
      </Button>
      
      
      

      <TextInput 
      placeholder="  Description"
      onChangeText={description => setDescription(description)} 
      defaultValue={description}
      style={styles.input}
      
      />

      <Button onPress={pressHandler}>
          Total hrs: {Thrs}
      </Button>


            <Button color="#09253a" onPress={add_entry}>
              Add : {Thrs}
      </Button>

            <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                  <Text>Lunch Entry</Text>
              
                  <TimePickerModal
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={12} // default: current hours
        minutes={14} // default: current minutes
        label="Select time" // optional, default 'Select time'
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale={'en'} // optional, default is automically detected by your system
      />
      <Button color="#09253a" style={styles.startTime} icon="walk" onPress={()=> setVisible(true)}>
        Start: {Hours}:{Minutes}
      </Button>

      <TimePickerModal
        visible={finishvisible}
        onDismiss={onFinishDismiss}
        onConfirm={onFinishConfirm}
        hours={12} // default: current hours
        minutes={14} // default: current minutes
        label="Select time" // optional, default 'Select time'
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale={'en'} // optional, default is automically detected by your system
      />
      <Button color="#09253a" style={styles.endTime} icon="run" onPress={()=> setfinishVisible(true)}>
        Finish: {finishHours}:{finishMinutes}
      </Button>
      
            
              <CheckBox style={styles.check}
            disabled={false}
            value={toggleCheckBox}
            onValueChange={(newValue) => setToggleCheckBox(newValue)}
          />

        

          <Text style={styles.sameWeek}>Same for the week</Text>

          

          <Button color="#09253a" onPress={add_lunch} style={styles.addButton}>
                      Add
              </Button>

                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}
                    ><Text style={styles.textStyle}>Hide Modal</Text>
                      
                    </Pressable>
                  </View>
                </View>
              </Modal>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.textStyle}>Add Lunch</Text>
              </Pressable>
            </View>
              
      
          </View>
      </View>
      </SafeAreaView>
   );
   }
   
   
   const styles = StyleSheet.create({
       container:{
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
           },
           date: {
             flex: 1,
             fontWeight: 'bold',
             justifyContent: 'center',
           },
           text: {
             paddingLeft: 15,
             fontSize: 50,
             fontWeight: 'bold',
           },
           Weekarrow:{
            height: 100,
            width:370,
            marginTop:-70,
            marginBottom: 30,
            backgroundColor: '#e8dddc',
            borderRadius: 20,
            fontWeight: 'bold'
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

           startLunch:{
            marginLeft: -200,
            width: 140
           },

           endLunch:{
            marginLeft: 200,
            marginTop: -38,
           },
           
         text:{
           alignItems: 'center',
           marginTop:20,
           justifyContent: 'center'
           },
           title: {
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            padding: 20,
          },
   
       icons:{
           alignItems: 'center',
           color:'white',
           marginBottom:200,
           justifyContent: 'center'
           },
   
           text1:{
             alignItems: 'center',
             marginTop: -50,
             marginBottom: 75,
             justifyContent: 'center'
             },
             section: {
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30
             },
             
   input: {
      margin: 15,
      height: 40,
      width: 340,
      borderColor: "#09253a",
      borderWidth: 2,
      borderRadius: 10
   },
   titleStyle: {
    marginLeft:20,
    marginTop:10,
    padding:-10,
    fontWeight:'bold'
    },

  pickerStyle: {
    width:325,
    marginLeft:-50,
    padding: -15,
    marginTop:35,
    marginRight: -40,
    },

    pickerStyle2: {
      width:325,
      marginLeft:-20,
      padding: -15,
      marginTop:35,
      marginRight: -40,
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
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
        marginRight: 175
      },
      addButton:{
        backgroundColor: "#34ed66",
        marginLeft: 175,
        
      },
      check: {
        marginLeft: -150,
         marginTop: 15,
        color: 'black'
      },

      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      sameWeek: {
        marginTop: -25,
        marginLeft: 20,
        marginBottom: 20,
        color: 'black'
      },
     });
     
     export default Hour;
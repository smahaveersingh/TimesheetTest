import * as React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { Picker } from '@react-native-picker/picker';
import WeekSelector from 'react-native-week-selector';
import "intl";
import "intl/locale-data/jsonp/en";
import { DatabaseConnection } from '../components/database-connection';
import moment from 'moment';

const db = DatabaseConnection.getConnection();

 function Hour ({ navigation }) {

  const selectDate = new Date();
  const [currentDate, setCurrentDate] = React.useState('');
  

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
  
  const [description, setDescription] = React.useState('');
  const [selectedWeek, setselectedWeek] = React.useState();

  const onDismiss = React.useCallback(() => {
    setVisible(false)
  }, [setVisible])

  const onFinishDismiss = React.useCallback(() => {
    setfinishVisible(false)
  }, [setfinishVisible])

  const onLDismiss = React.useCallback(() => {
    setLVisible(false)
  }, [setLVisible])

  const onLFinishDismiss = React.useCallback(() => {
    setLfinishVisible(false)
  }, [setLfinishVisible])


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
    },
    [setfinishVisible]
  );

  const onLConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setLVisible(false);
      console.log({ hours, minutes });
      //setTime('{$hours}:${minutes}')
      hours = setLunchHours(hours);
      minutes = setLunchMinutes(minutes);
    },
    [setLVisible]
  );

  const onLFinishConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setLfinishVisible(false);
      console.log({ hours, minutes });
      //setTime('{$hours}:${minutes}')
      hours = setfinishLunchHours(hours);
      minutes = setfinishLunchMinutes(minutes);
    },
    [setLfinishVisible]
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

  /*var momentObj = moment(currentDate + Hours + Minutes, 'YYYY-MM-DDLT');
  var dateTime = momentObj.format('YYYY-MM-DDTHH:mm:s');
  console.log(dateTime);*/

  

  const add_entry = () => {
    console.log( selectedWeek, currentDate, projNum, description, Hours, Minutes, finishHours, finishMinutes, LunchHours, LunchMinutes,  finishLunchHours, finishLunchMinutes,  Thrs, siteID, dayoftheWeek);

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO Timesheet(user_id, eow, date, projNum, comment , arrivalHours , arrivalMinutes,  departHours, departMinutes, startLHours, startLMinutes, FinishLHours, FinishLMinutes,  totalHrs, siteID, dayoftheweek) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [1, selectedWeek, currentDate, projNum, description, Hours, Minutes, finishHours, finishMinutes, LunchHours, LunchMinutes, finishLunchHours, finishLunchMinutes,   Thrs, siteID, dayoftheWeek ],
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

  let options  = renderUserNames();

  const saveDayofWeek = (itemValue, itemIndex) => {
    setDayoftheWeek(itemValue);
    /*if (dayoftheWeek == 'monday') {
      setCurrentDate(moment(selectedWeek, "DD-MM-YYYY").add(1, 'days'));
    } else if (dayoftheWeek == 'tuesday') {
      setCurrentDate(moment(selectedWeek).add(2, 'days').format("DD-MM-YYYY"));
    } else if (dayoftheWeek == 'wednesday') {
      setCurrentDate(moment(selectedWeek, "DD-MM-YYYY").add(3, 'days'));
    } else if (dayoftheWeek == 'thursday') {
      setCurrentDate(moment(selectedWeek, "DD-MM-YYYY").add(4, 'days'));
    } else if (dayoftheWeek == 'friday') {
      setCurrentDate(moment(selectedWeek, "DD-MM-YYYY").add(5, 'days'));
    } else if (dayoftheWeek == 'saturday') {
      setCurrentDate(moment(selectedWeek, "DD-MM-YYYY").add(6, 'days'));
    } else if (dayoftheWeek == 'sunday') {
      setCurrentDate(moment(selectedWeek, "DD-MM-YYYY").add(7, 'days'));
    }*/

    var next = getNextDay(itemValue);
    //console.log(next.getTime());
    console.log(moment(next.getTime()).format('L'));
    setCurrentDate(moment(next.getTime()).format('L'));
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

  const CalcTotalHrs = () => {
    var StrtTime = moment(Hours, "HH");
    var endTime = moment(finishHours, "HH");

    var duration = moment.duration(StrtTime.diff(endTime));
    var DHrs = parseInt(duration.asHours());
    setThrs(DHrs);
    Alert.alert(DHrs + 'Hrs');

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
              <Text style={styles.titleStyle}>Project No</Text>
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
      
      <TimePickerModal
        visible={Lvisible}
        onDismiss={onLDismiss}
        onConfirm={onLConfirm}
        hours={12} // default: current hours
        minutes={14} // default: current minutes
        label="Select time" // optional, default 'Select time'
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale={'en'} // optional, default is automically detected by your system
      />
           <Button color="#09253a" style={styles.startLunch} icon="food" onPress={()=> setLVisible(true)}>
        Lunch : {LunchHours}:{LunchMinutes}
      </Button>

      <TimePickerModal
        visible={Lfinishvisible}
        onDismiss={onLFinishDismiss}
        onConfirm={onLFinishConfirm}
        hours={12} // default: current hours
        minutes={0} // default: current minutes
        label="Select time" // optional, default 'Select time'
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale={'en'} // optional, default is automically detected by your system
      />
      <Button color="#09253a" style={styles.endLunch} icon="food" onPress={()=> setLfinishVisible(true)}>
        Finishes : {finishLunchHours}:{finishLunchMinutes}
      </Button>

      <TextInput 
      placeholder="  Description"
      onChangeText={description => setDescription(description)} 
      defaultValue={description}
      style={styles.input}
      
      />


      <Button color="#09253a" onPress={add_entry}>
              Submit
            </Button>
      
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
     });
     
     export default Hour;
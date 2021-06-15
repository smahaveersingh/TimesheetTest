import React, {useEffect, useState,useRef} from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Image, StatusBar, Animated, TouchableOpacity, SafeAreaView, TouchableHighlight} from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import { Button } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { ActivityIndicator, FlatList} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import WeekSelector from 'react-native-week-selector';
import "intl";
import "intl/locale-data/jsonp/en";
import { DatabaseConnection } from '../components/database-connection';
import moment from 'moment';
import profile from '../assets/profile.png';
// Tab ICons...
import home from '../assets/home.png';
import search from '../assets/clock.png';
import notifications from '../assets/calendar.png';
import settings from '../assets/settings.png';
import logout from '../assets/logout.png'
// Menu
import menu from '../assets/menu.png';
import close from '../assets/close.png';


const db = DatabaseConnection.getConnection();

 function Hour ({ navigation }) {

  const selectDate = new Date();                                    //var to get date
  const [currentDate, setCurrentDate] = React.useState('');         //var to set selected date
  const [toggleCheckBox, setToggleCheckBox] = React.useState(false) // var for Lunch checkbox (i.e. same Lunch for week)
  const [dayoftheWeek, setDayoftheWeek] = React.useState(moment().format("L")); // var to set selected DOW
  const [projNum, setprojNum] = React.useState('');     //var to set selected ProjNum
  const [siteID, setsiteID] = React.useState('')        //var to set selected SiteID
  const [Thrs, setThrs] = React.useState('');           //var to set Total Hours
  const [visible, setVisible] = React.useState(false);  //Flag var to show  & hide Start Timepicker
  const [finishvisible, setfinishVisible] = React.useState(false);                  //Flag var to show  & hide Finish Timepicker
  const [Hours, setHours] = React.useState(selectDate.getHours());                  //var to set selected Hour from Start TimePicker
  const [Minutes, setMinutes] = React.useState(selectDate.getMinutes());            //var to set selected Minutes from Start TimePicker
  const [finishHours, setfinishHours] = React.useState(selectDate.getHours());      //var to set selected Hour from Finish TimePicker
  const [finishMinutes, setfinishMinutes] = React.useState(selectDate.getMinutes());//var to set selected Minutes from Start TimePicker
  const [frTimes, setfrTimes] = React.useState('');                                 //var to format the selected Start Time from TimePicker
  const [frFinTimes, setfrFinTimes] = React.useState('');                           //var to format the selected Finish Time from TimePicker
  const [description, setDescription] = React.useState('');                         //var to set Description value
  const [selectedWeek, setselectedWeek] = React.useState(moment().day(5).format("L")); //var to set selected EOW
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [currentTab, setCurrentTab] = useState("Hour");   //var to set current Tab status in side Drawer
  const [showMenu, setShowMenu] = useState(false);        //var to get the curretn Status of menu ...

  // Animated Properties...
  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
  
  //Usefull For creating multiple Buttons at once instead of declaring them one by one..........
  const TabButton = (currentTab, setCurrentTab, title, image) => {  //Function to create custom Styled Buttons for Side Drawer
  return (

    <TouchableOpacity onPress={() => {
      if (title == "LogOut") {        //If Logout Button is selected in the side Drawer, navigate the user to Login Screen
        navigation.navigate("Login")
      } if (title == "Hour") {        //If Hour Button is selected, navigate the user to Add Entry Screen
        navigation.navigate("Hour")
      } if (title == "Home") {        //If Home Button is selected, navigate the user to Home Screen
        navigation.navigate("Home")
      } if (title == "TS Review") {   //If TS Review Button is selected, navigate the user to TS Review Screen
        navigation.navigate("Test")
      } 
      else {
        setCurrentTab(title)
      }
    }}>
      <View style={{
        flexDirection: "row",
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: currentTab == title ? 'white' : 'transparent', //If the current Tab is the same as the title in the side drawer, set the BG color to white, else to Transparent 
        paddingLeft: 13,
        paddingRight: 35,
        borderRadius: 8,
        marginTop: 15
      }}>

        <Image source={image} style={{
          width: 25, height: 25,
          tintColor: currentTab == title ? "#5359D1" : "white"
        }}></Image>

        <Text style={{
          fontSize: 15,
          fontWeight: 'bold',
          paddingLeft: 15,
          color: currentTab == title ? "#5359D1" : "white"
        }}>{title}</Text>

      </View>
    </TouchableOpacity>
  );
}


  const onDismiss = React.useCallback(() => {       //Function to close Start TimePicker Modal when user clicks Cancel/Dismiss
    setVisible(false)
  }, [setVisible])

  const onFinishDismiss = React.useCallback(() => { //Function to close Finish TimePicker Modal when user clicks Cancel/Dismiss
    setfinishVisible(false)
  }, [setfinishVisible])


  const onConfirm = React.useCallback(              //Function to open Start TimePicker Modal and set the selected formatted times 
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

  const onFinishConfirm = React.useCallback(    //Function to open Finish TimePicker Modal and set the selected formatted times 
    ({ hours, minutes }) => {
      setfinishVisible(false);
      console.log({ hours, minutes });
      var FinHrs = moment(hours, 'HH');
      var FinMnts = moment(minutes, 'mm');
      hours = setfinishHours(FinHrs.format('HH'));
      minutes = setfinishMinutes(FinMnts.format('mm'));
      var Fintimes = FinHrs.format('HH') + ':' + FinMnts.format('mm'); //var to combine Hours and Minute into HH:mm format
      console.log('Finish Times: ' + Fintimes);
      setfrFinTimes(Fintimes);
      
    },
    [setfinishVisible]
  );
 

  const renderUserNames = () => { //Function for rendering SiteID based on the ProjNum selected (i.e. Logic for Hierarchial Picker Component)
    
    if(projNum=='VOD103015'){     //if projNum(VOD103015) is selected , down below are site ID's available for this specific ProjNum
      return [<Picker.Item key="uniqueID8" label="CE005 ~ Woodcock Hill" value="CE005 ~ Woodcock Hill" />,
             <Picker.Item key="uniqueID7" label="CE006 ~ Crusheen knocknamucky" value="CE006 ~ Crusheen knocknamucky" />,
            <Picker.Item key="uniqueID6" label="CE007 ~ Lack West" value="CE007 ~ Lack West" />,
            <Picker.Item key="uniqueID5" label="CE008 ~ Dangan Ballyvaughan" value="CE008 ~ Dangan Ballyvaughan" />,
            <Picker.Item key="uniqueID4" label="CE009 ~ Glenagall" value="CE009 ~ Glenagall" />]
     }
   
     else if(projNum=='ABO101597'){ //if projNum(ABO101597) is selected , down below are site ID's available for this specific ProjNum
       return [<Picker.Item key="uniqueID3" label="CLS001 ~ Cluster 1 OHL" value="CLS001 ~ Cluster 1 OHL" />
             ]
      }
   
      else if(projNum=='VOD75860'){ //if projNum(VOD75860) is selected , down below are site ID's available for this specific ProjNum
        return [<Picker.Item key="uniqueID4" label="DN823 Robinson Transport -  Bolts removed from fenc - DN823 Robinsons Transport" value="DN823 Robinson Transport -  Bolts removed from fenc - DN823 Robinsons Transport" />
              ]
       }

     else{
          return [<Picker.Item key="uniqueID1" label="Client 1" value="Client 1" />,
           <Picker.Item key="uniqueID2" label="Client 2" value="Client 2" />]
       }

  }
  React.useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => response.json())
      .then((json) => setData(json.movies))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);


const time_clash = () => {     //Function for checking if TimeClashes(2 Entries happenning at the same time) occur.
  db.transaction(function (tx) {
    tx.executeSql(

      //SQL Statement to select all Entries for a given Date where, 
      //Start Time < Departure Time && Finish Time > Arrival time

      'SELECT * FROM Timesheet WHERE ? < depart AND ? > arrival AND date=?',   
      [frTimes, frFinTimes ,currentDate], 
      (tx, results) => {              //getting results back from querying the SQL Statement
        var temp = [];                //declaring an empty array
       var len = results.rows.length; //var to get length of result from the SQL Statement
       console.log('len', len);
       if(len >= 0 ) {                //if length of result >= 0
         for (let i = 0; i < results.rows.length; ++i) 
         temp.push(results.rows.item(i)); //populate Temp array with values we get from results varaible(i.e  result from the SQL Statement)
         if(len <= 0)           //if length of result <= 0, then there is no TimeClashes
         {
            console.log("Time Slot Available " + temp);
            add_entry();        //Call Add Entry Function
         }
         else{                  //if length of result > 0, then TimeClash exists for the selected Time
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


  const add_entry = () => { //Function for adding an entry into the local database on the Device
    console.log( selectedWeek, currentDate, projNum, description, frTimes, frFinTimes, Thrs, siteID, dayoftheWeek);

    //Validation checking: i.e. Cannot add an entry without selecting a Week, Day, Project, Site, Start Time, Finish Time
    if (!selectedWeek) {
      alert('Please select a end of the week');
      return;
    }
    if (!dayoftheWeek) {
      alert('Please select a day of the week');
      return;
    }
    if (!projNum) {
      alert('Please select a Project ');
      return;
    }

    if (!siteID) {
      alert("Don't forget to add a site");
      return;
    }

    if (!frTimes) {
      alert('Add Hours for the entry');
      return;
    }
    
    if (!frFinTimes) {
      alert('Add End Hours for the entry');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        //SQL Insert Statement to insert an entry into Timesheet Table
        'INSERT INTO Timesheet(user_id, eow, date, projNum, comment , arrival, depart, totalHrs, siteID, dayoftheweek) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [1, selectedWeek, currentDate, projNum, description, frTimes, frFinTimes, Thrs, siteID, dayoftheWeek ],
        (tx, results) => {    // ----------------------------------------> getting results back from querying the SQL Statement
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {     //If length to results returned is greater than 0, then the entry is added succesfully
            Alert.alert(
              'Sucess',
              'Entry added succesfully to DB !!!',
              [
                {
                  text: 'Ok',
                  onPress: () =>
                  navigation.navigate('Home'), //When the entry added is successfull, navigate from ADD ENTRY Screen to HOME Screen
                }
              ],
              { cancelable: false }
            );
          } else alert('Error Entry unsuccesfull !!!'); //If length to results returned is lesser than or equal to 0, then the entry added is unsuccesfull!
        }
      );
    });
  };

  const add_lunch = () => { //Function for adding a Lunch Entry into the Local Database in the Device
    console.log( 1, selectedWeek, currentDate, 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek);
    
    //Validation check for Day of the Week, i.e. Cannot add a Lunch entry wihtout selecting a day of the week
    if (!dayoftheWeek) {
      alert('Please select a day of the week');
      return;
    }

    if(toggleCheckBox == false) //if "same lunch for the week" is not selected, then execute the SQL INSERT Statement only once
  {
  
    db.transaction(function (tx) {
      tx.executeSql(
        //SQL Insert Statement to insert a Lunch entry into Timesheet Table
        'INSERT INTO Timesheet(user_id, eow, date, projNum, comment , arrival, depart, siteID, totalHrs, dayoftheweek) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [1, selectedWeek, currentDate, 'Lunch', 'Lunch', frTimes, frFinTimes, 'Lunch', Thrs, dayoftheWeek],
        (tx, results) => {  // ----------------------------------------> getting results back from querying the SQL Statement
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {  //If length to results returned is greater than 0, then the entry is added succesfully
            Alert.alert(
              'Sucess',
              'Entry added succesfully to DB !!!',
              [
                {
                  text: 'Ok',
                  onPress: () =>
                  navigation.navigate('Home'), //When the entry added is successfull, navigate from ADD ENTRY Screen to HOME Screen
                },
              ],
              { cancelable: false }
            );
          } else alert('Error Entry unsuccesfull !!!'); //If length to results returned is lesser than or equal to 0, then the entry added is unsuccesfull!
        }
      );
    });
  }
  
  else if (toggleCheckBox == true)  //if "same lunch for the week" is  selected, then execute the same SQL INSERT Statement 5 times for M-T-W-TH-FR 
  {
  db.transaction(function (tx) {
    tx.executeSql(
      //SQL Insert Statement to insert a Lunch entry into Timesheet Table 5 times for 5 different days of the week
      'INSERT INTO Timesheet(user_id, eow, date, projNum, comment , arrival, depart, totalHrs, siteID, dayoftheweek) VALUES (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?), (?,?,?,?,?,?,?,?,?,?)',
      [1, selectedWeek, moment(selectedWeek).day("Monday").format('L'), "Lunch", 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek , 
      1, selectedWeek, moment(selectedWeek).day("Tuesday").format('L'), 'Lunch', 'Lunch', frTimes, frFinTimes,  Thrs, 'Lunch', dayoftheWeek , 
      1, selectedWeek, moment(selectedWeek).day("Wednesday").format('L'), 'Lunch', 'Lunch', frTimes, frFinTimes,  Thrs, 'Lunch', dayoftheWeek ,
      1, selectedWeek, moment(selectedWeek).day("Thursday").format('L'), 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek ,
      1, selectedWeek, moment(selectedWeek).day("Friday").format('L'), 'Lunch', 'Lunch', frTimes, frFinTimes, Thrs, 'Lunch', dayoftheWeek ],
      (tx, results) => {  // ----------------------------------------> getting results back from querying the SQL Statement
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {  //If length to results returned is greater than 0, then the entry is added succesfully
          Alert.alert(
            'Sucess',
            'Entry added succesfully to DB !!!',
            [
              {
                text: 'Ok',
                //When the entry added is succesfull, call SearchEntry() 
                //which Searches and gives updated list of all entries including the ones we recently added
                onPress: SearchEntry() 
              },
            ],
            { cancelable: false }
          );
        } else alert('Error Entry unsuccesfull !!!');  //If length to results returned is lesser than or equal to 0, then the entry added is unsuccesfull!
      }
    ); 
  });
  
  }
  };

  const Lunch_time_clash = () => { //Function to check if there's any time clash between Lunch Entries
    db.transaction(function (tx) {
      tx.executeSql(
        //SQL Statement to select all Entries for a given Date where, 
        //Start Time < Departure Time && Finish Time > Arrival time

        'SELECT * FROM Timesheet WHERE ? < depart AND ? > arrival AND date=?',
        [frTimes, frFinTimes ,currentDate],
        (tx, results) => {                    //getting results back from querying the SQL Statement
          var temp = [];                      //declaring an empty array
         var len = results.rows.length;       //var to get length of result from the SQL Statement
         console.log('len', len);
         if(len >= 0 ) {                      //if length of result >= 0
           for (let i = 0; i < results.rows.length; ++i) 
           temp.push(results.rows.item(i));   //populate Temp array with values we get from results varaible(i.e  result from the SQL Statement)
           if(len <= 0)                       //if length of result <= 0, then there is no TimeClashes, then add Lunch Entry
           {
              console.log("Time Slot Available " + temp);
              add_lunch();                    //Call add_lunch Function
           }
           else{                               //if length of result > 0, then TimeClash exists for the selected Time
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

  let options  = renderUserNames();

  const saveDayofWeek = (itemValue, itemIndex) => { //Function to save Day of the Week selected from the Picker
    setDayoftheWeek(itemValue);
    var next = getNextDay(itemValue); 
    //console.log(next.getTime());
    moment.locale('en');
    console.log(moment(next.getTime()).format("L"));
    setCurrentDate(moment(next.getTime()).format("L"));
    calcTotalHrs(); //Function call to calculate Total Hours for the selected day
  }

  const getNextDay = (dayName) => { //Function to find next day given current Day and return it DATE Format
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

	// Get the next day in Date Format ex: Friday 24th June 2021 --> 06/24/2021
	return new Date(nextDayTimestamp);

  }

  const saveStartingWeek = (value) => { //function for saving selected EOW
    moment.locale('en')
        console.log("saveStartingWeek - value:", moment(value).add(5, "days").format("L"));
        setselectedWeek(moment(value).add(5, "days").format("L"));
        console.log("this friday: " + moment().day(5).format("L") + "todays date: " + moment().format("L"));
        }
  

  const getTimefromMins = (mins) => { //function to return minutes in HH:mm format ex: 120 mins = 2:00 hrs, and to help convert Minutes in 0-100 to Minutes in 0-60 
    if (mins >= 24 * 60 || mins < 0) {
      Alert.alert("Valid input should be greater than or equal to 0 and less than 1440.");
    }
    var h = mins / 60 | 0;
    var m = mins % 60 | 0;

    return moment.utc().hours(h).minutes(m).format("HH:mm");
  }

   const calcTotalHrs = () => { //Function to calculate totalHrs given a start time and End Time
    //setfinishVisible(true)
     var StrtTime = moment(frTimes, "HH:mm");
     var endTime = moment(frFinTimes, "HH:mm");

     var duration = moment.duration(StrtTime.diff(endTime));
     var DHrs = parseInt(duration.asHours());
    var Dmins = parseInt(duration.asMinutes())-DHrs* 60;
     var Tot  = endTime.diff(StrtTime, 'minutes'); //calculating the difference between endTime and startTime
     var timetomins = getTimefromMins(Tot);
     setThrs(timetomins);
     console.log(timetomins);
 }


 return (
  <SafeAreaView style={styles.container}>
       <View style={{ justifyContent: 'flex-start', padding: 15 }}>
        <Image source={profile} style={{
          width: 60, 
          height: 60,
          borderRadius: 10,
          marginTop: 12
        }}></Image>

        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          marginTop: 20
        }}>John Doe</Text>

        <TouchableOpacity>
          <Text style={{
            marginTop: 6,
            color: 'white'
          }}>View Profile</Text>
        </TouchableOpacity>

        <View style={{ flexGrow: 1, marginTop: 50 }}>
          {
            // Tab Bar Buttons....
          }

          {TabButton(currentTab, setCurrentTab, "Home", home)}
          {TabButton(currentTab, setCurrentTab, "Hour", search)}
          {TabButton(currentTab, setCurrentTab, "TS Review", notifications)}
          {TabButton(currentTab, setCurrentTab, "Settings", settings)}

        </View>

        <View>
          {TabButton(currentTab, setCurrentTab, "LogOut", logout)}
        </View>

      </View>
      {
        // Over lay View...
      }

<Animated.View style={{
        flexGrow: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderRadius: showMenu ? 15 : 0,
        // Transforming View...
        transform: [
          { scale: scaleValue },
          { translateX: offsetValue }
        ]
      }}>

        {
          // Menu Button...
        }
        <Animated.View style={{
          transform: [{
            translateY: closeButtonOffset
          }]
        }}>
          <TouchableHighlight onPress={() => {
            // Do Actions Here....
            // Scaling the view...
            Animated.timing(scaleValue, {
              toValue: showMenu ? 1 : 0.88,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            Animated.timing(offsetValue, {
              // YOur Random Value...
              toValue: showMenu ? 0 : 230,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            Animated.timing(closeButtonOffset, {
              // YOur Random Value...
              toValue: !showMenu ? -30 : 0,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            setShowMenu(!showMenu);
          }}>
 
 
 <View >
             <View style={styles.head}>
           <Image source={showMenu ? close : menu} style={{
              width: 20,
              height: 20,
              tintColor: 'white',
              marginTop: 20,
              marginLeft: -135

            }}></Image>
        <View>
                <Text style={styles.headText}>                   Add Entry</Text>
        

        </View>

 </View>
        </View>

            

          </TouchableHighlight>

       
    
  <View>
  <Text style={{fontWeight: 'bold',  fontSize: 20, color: '#091629', marginLeft: 10, marginTop: 10}}>Week Ending                {moment(selectedWeek).format('dddd, MMMM Do')}{navigation.getParam('eow')}</Text>
    <View style={{
        marginTop:20,
        height: 70,
        width:380,
        marginLeft: -8,
        marginBottom:20,
        borderWidth: 3,
        borderColor: 'white',
        backgroundColor: '#87CEEB',
        borderRadius: 20,
      
      }}>
  <WeekSelector
      dateContainerStyle={styles.date}
      whitelistRange={[new Date(2021, 1, 9), new Date()]}
      weekStartsOn={6}
      onWeekChanged={saveStartingWeek}
    />
    </View>

    <View style={styles.section}>
      <TimePickerModal style={styles.section}
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
<Button color="#09253a" style={styles.endTime} icon="clock" onPress={() => setfinishVisible(true)}>
  Finish: {frFinTimes}
</Button>

</View>

    <View>
              <Text style={{fontWeight: 'bold', color: '#091629', marginBottom: -20, marginLeft: 20, marginTop: 0}}>
                  Day of the Week 
              </Text>
             <Picker 
              mode="dropdown"
              style={styles.datefive}
              selectedValue={dayoftheWeek}
              onValueChange=
              {
                  saveDayofWeek
              }>
                      <Picker.Item key="uniqueID9" label="Please Select a Day" value="" />
                      <Picker.Item label={'Monday' + ' ' +  moment(selectedWeek).day("Monday").format('MMM Do')} value="monday" />
                        <Picker.Item label={'Tuesday' + ' ' +  moment(selectedWeek).day("Tuesday").format('MMM Do')} value="tuesday" />
                        <Picker.Item label={'Wednesday' + ' ' +  moment(selectedWeek).day("Wednesday").format('MMM Do')} value="wednesday" />
                        <Picker.Item label={'Thursday' + ' ' +  moment(selectedWeek).day("Thursday").format('MMM Do')} value="thursday" />
                        <Picker.Item label={'Friday' + ' ' +  moment(selectedWeek).day("Friday").format('MMM Do')} value="friday" />
                        <Picker.Item label={'Saturday' + ' ' +  moment(selectedWeek).day("Saturday").format('MMM Do')} value="saturday" />
                        <Picker.Item label={'Sunday' + ' ' +  moment(selectedWeek).day("Sunday").format('MMM Do')} value="sunday" />
                       
                     
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
                <Picker.Item key="uniqueID9" label="Please Select Project" value="" />
                <Picker.Item key="uniqueID10" label="VOD103015 ~ Assure Provide engsupport Oct 1st to Oct 31st 2019" value="VOD103015" />
                <Picker.Item key="uniqueID11" label="ABO101597 ~ Over head Line works Cluster 1 ~ CLS001 ~ Cluster1 OHL" value="ABO101597" />
                <Picker.Item key="uniqueID12" label="VOD75860 ~ DN823 Robinsons Transport" value="VOD75860" />
                <Picker.Item key="uniqueID13" label="Client" value="Client" />
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
                <Picker.Item label="Please Select a Site" value="" />
                     {options}

            </Picker>}
        </View>
    </View>
   </View>


   


<TextInput 
placeholder="  Description"
onChangeText={description => setDescription(description)} 
defaultValue={description}
style={styles.input}
/>


<TouchableHighlight style={{ alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 3,
    backgroundColor: '#44db47',
    width: 150,
    marginLeft: 110,
    marginTop: 10,
    }}
    onPress={time_clash}
    
    >
  <Text style={{fontSize: 15,
    lineHeight: 15,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
    }}> Add </Text>
</TouchableHighlight>
    </View>
    </Animated.View>
    </Animated.View>
</SafeAreaView>
   );
   }
   
   
   const styles = StyleSheet.create({
       container:{
        flex: 1,
            backgroundColor: '#091629',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
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
            width:350,
            marginTop:-37,
            marginBottom: 10,
            backgroundColor: '#7affbd',
            borderRadius: 20,
            fontWeight: 'bold',
            borderWidth: 3,
          borderColor: 'white',
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
              marginTop: 5,
              marginBottom: 25
              
             },
             
             input: {
              margin: 25,
              height: 50,
              width: 340,
              borderColor: "#09253a",
              borderWidth: 2,
              borderRadius: 10,
              marginLeft: 8
           },
           titleStyle: {
            marginLeft:20,
            marginTop:10,
            marginBottom:60,
            padding:-10,
            fontWeight:'bold',
            color: '#091629'
            },
        
          pickerStyle: {
            width:325,
            marginLeft:-50,
            padding: -15,
            marginTop:35,
            marginRight: -40,
            color: '#091629'
            },
        
            pickerStyle2: {
              width:325,
              marginLeft:-20,
              padding: -15,
              marginTop:35,
              marginRight: -40,
              },
        datefive:{
          margin:20,
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
              head: {
                padding:0,
                marginLeft:-15.5,
                marginTop: -20,
                width: 400,
                height: 70,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#091629',
                borderTopLeftRadius: 10
                },
                
                headText: {
                fontWeight: 'bold',
                fontSize: 20,
                color: 'whitesmoke',
                letterSpacing: 1,
                marginBottom:-18
                
                },
            });
     
     export default Hour;
import * as React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, TouchableHighlight, StatusBar} from 'react-native';
import { Button, DataTable, Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import WeekSelector from 'react-native-week-selector';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import _ from "lodash";
import Dialog from "react-native-dialog";
import { DatabaseConnection } from '../components/database-connection';
import { TouchableOpacity } from 'react-native';
import { colors } from 'react-native-elements';

const db = DatabaseConnection.getConnection();



export default function Home ({ navigation }) {

  const [flatListItems, setFlatListItems] = React.useState([]);
  const [Hours, setHours] = React.useState('');
  const [Minutes, setMinutes] = React.useState('');
  const [FINHours, setFINHours] = React.useState('');
  const [FINMinutes, setFINMinutes] = React.useState('');
  const [dayoftheWeek, setDayoftheWeek] = React.useState('');
  const [Week, setWeek] = React.useState();
  const [currentDate, setCurrentDate] = React.useState('');
  const [formatDay, setformatDay] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [ columns, setColumns ] = React.useState([
    "Project",
    "Site",
    "Start/End",
    "Total"
  ])
  const [ direction, setDirection ] = React.useState(null);
  const [ selectedColumn, setSelectedColumn ] = React.useState(null);
  const [totalHrsforday, settotalHrsforday] = React.useState([]);

  /*_onPressButton  = () => {
    alert(
      <Text>pop</Text>
        )
      }*/

      const colors = {
        themeColor: "#4263ec",
        white: "#fff",
        background: "#f4f6fc",
        greyish: "#a4a4a4",
        tint: "#2b49c3",
      }

      const showDialog = () => {
        setVisible(true);
      };
    
      const handleCancel = () => {
        setVisible(false);
      };
  
      const handleDelete = () => {
        // The user has pressed the "Delete" button, so here you can do your own logic.
        // ...Your logic
        setVisible(false);
      };
  
    const pressHandler = () => 
    {
      navigation.navigate('Hour')
    }

    const saveDayofWeek = (itemValue, itemIndex) => {
      setDayoftheWeek(itemValue);
  
      var next = getNextDay(itemValue);
      //console.log(next.getTime());
      console.log(moment(next.getTime()).format('L'));
      setCurrentDate(moment(next.getTime()).format('L'));
      setformatDay(moment(next.getTime()).format('MMM Do'));
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
      console.log("saveStartingWeek - value:", moment(value).format('L'));
        setWeek(moment(value).format('L'));
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
    
      return time;  
    }

   
    
    let SearchEntry = () => {
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

          db.transaction((tx) => {
          tx.executeSql(
          'SELECT totalHrs FROM Timesheet WHERE date = ?',
          [currentDate],
          (tx, results) => {
          //var temp = [];
          //for (let i = 0; i < results.rows.length; ++i)
          //temp.push(results.rows.item(i));
          //setFlatListItems(temp);
          var temp = [];
          let sum = 0.0 ;
          var tot = [];
          var len = results.rows.length;

          console.log('len', len);
          if(len >= 0 ) {

          for (let i = 0; i < results.rows.length; ++i) 

          temp.push(results.rows.item(i));
          temp.forEach((item) => {
            
            tot.push(filterTimeFormat(item.totalHrs));
           
            //sum = sum + parseFloat(item.totalHrs);
            
            
            //moment(item.totalHrs, "HH:mm")
          })
          tot.forEach(function (i){
            sum = sum + parseFloat(i);
          })
          settotalHrsforday(sum);
          console.log('sum: ' + sum + ' TOT: ' + tot);
          totalHrsforday
          } else {
          alert('Cannot Search Entry!');
          }
        }
            
          );
          });
};



    const formatTime = (item) => {
      var SHours = moment(item.arrivalHours, 'HH');
      var SMinutes = moment(item.arrivalMinutes, 'mm');

      setHours(SHours.format('HH'));
      setMinutes(SMinutes.format('mm'));

      var FHours = moment(item.departHours, 'HH');
      var FMinutes = moment(item.departMinutes, 'mm');

      setFINHours(FHours.format('HH'));
      setFINMinutes(FMinutes.format('mm'));
    }

    const sortTable  = (column) => {
      const newDirection = direction === "desc" ? "asc" : "desc" 
      const sortedData = _.orderBy(flatListItems, [column],[newDirection]);
      setSelectedColumn(column);
      setDirection(newDirection);
      setFlatListItems(sortedData);
    }

    const tableHeader = () => (
      <View style={styles.tableHeader}>
        {
          columns.map((column, index) => {
            {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.columnHeader}
                  onPress={() => sortTable(column)}>
                  <Text style={styles.columnHeaderTxt}>
                    {column + " "}
                    { selectedColumn === column && <MaterialCommunityIcons 
                      name={direction === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"} 
                    />
                    }
                  </Text>

                </TouchableOpacity>
              )
            }
          })
        }
      </View>
    )
  
  
   
   
      return (
        <SafeAreaView style={{ flex: 1}}>
          <View style={{backgroundColor: colors.white,
         alignItems: 'center',
           justifyContent: 'center',
           flex: 1,
           paddingBottom: 150}}>
             <StatusBar barStyle="light-content" backgroundColor={colors.themeColor} />
          <View style={{marginLeft: -200, marginBottom: 615, backgroundColor: '#FFF0E0', height: 50, borderColor: 'black', borderWidth: 3, borderRadius: 4 }}>
          
          <WeekSelector
            whitelistRange={[new Date(2018, 7, 13), new Date()]}
            weekStartsOn={6}
            onWeekChanged={saveWEEK}
          />
            </View>

            
          <View style={{borderWidth: 3,  borderColor: 'black', borderRadius: 4, marginRight: -200, marginBottom: 170, marginTop: -665}}>
            <Picker style={{width: 150, height: 44, backgroundColor: '#FFF0E0', borderColor: 'black', borderWidth: 1, }}
                    selectedValue={dayoftheWeek}
                    itemStyle={styles.onePickerItems}
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
          </View>

          <View style={{flex: 0, marginTop: -100, alignContent: 'center', marginLeft: 100, width: 500, marginBottom: -100,}}>
            <Card style={{paddingRight: 150, borderRadius: 5, marginLeft: 30}}>
              <Text style={{backgroundColor: "#42f599", paddingRight: 60, paddingHorizontal: 20, borderRadius: 10, height: 35, fontSize: 20, fontWeight: 'bold', width: 265}}>Day Total Hours:  {totalHrsforday}</Text>
            </Card>
            <FlatList
            data={flatListItems}
            style={{width:"90%", marginLeft: 10, marginTop: 30}}
            ListHeaderComponent={tableHeader}
            stickyHeaderIndices={[0]}
            nestedScrollEnabled
            keyExtractor={(item, index) => index+""}
            renderItem={({ item, index }) => {
              return (
                <View style={{...styles.tableRow, backgroundColor: index % 2 == 1 ? "#F0FBFC" : "white"}}>
              <TouchableHighlight onPress={showDialog}>
                <Text style={{...styles.columnRowTxt, fontWeight:"bold", width: 80}}>{item.projNum}</Text>
              
              </TouchableHighlight>
              <Text style={styles.columnRowTxt}>{item.siteID}</Text>
              <Text style={styles.columnRowTxt}>{item.arrival}/{item.depart}</Text>
              <Text style={styles.columnRowTxt}>{item.totalHrs}</Text>
              <Dialog.Container visible={visible}>
              <Dialog.Title>
                <Text>{item.projNum } {" "} {item.siteID}</Text>
                </Dialog.Title>
              <Dialog.Description>
                Day : {item.dayoftheweek} 
              </Dialog.Description>
              <Dialog.Description>
                Project Number : {item.projNum}
                </Dialog.Description>
              <Dialog.Description>
                Site ID : {item.siteID}
                </Dialog.Description>
              <Dialog.Description>
                Start Hours : {item.arrival}
                {" "} End Hours : {item.depart}
                </Dialog.Description>
              <Dialog.Description>
                Total Hrs : {item.totalHrs} {" "} {totalHrsforday}
                </Dialog.Description>
              <Dialog.Description>
                Description: {item.comment}
              </Dialog.Description>
              <Dialog.Button label="Edit" onPress={handleCancel} />
              <Dialog.Button label="Delete" onPress={handleDelete} />
            </Dialog.Container>
            </View>
              )
            }} 
          />
         
          </View>
            <View style={{marginTop: 150}}>
             <Button icon="plus" onPress={pressHandler}>
                Add Entry
           </Button>
           <Button icon="magnify" onPress={SearchEntry}>
                Search
           </Button>
           </View>
            <StatusBar style="auto" />
           </View>
            
        </SafeAreaView>
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
              fontWeight: 'bold'
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
              
            }
     });
     
    /*<DataTable 
          style={{ marginTop: 20 }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        data={tableItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={( item ) => entryTable(item)}
        />
        
        <FlatList
            style={{ marginTop: 20 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}  
          />
        */
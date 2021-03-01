import * as React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import { DatabaseConnection } from '../components/database-connection';

const db = DatabaseConnection.getConnection();


export default function Home ({ navigation }) {

  const [flatListItems, setFlatListItems] = React.useState([]);
  
    const pressHandler = () => 
    {
      navigation.navigate('Hour')
    }

    React.useEffect(() => {
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
    }, []);

    const listItemView = (item) => {
      return (
        <View
          key={item.id_timesheet}
          style={{ backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 }}>
            <Text style={styles.textheader}>UserId</Text>
            <Text style={styles.textbottom}>{item.user_id}</Text>

            <Text style={styles.textheader}>Week Ending</Text>
            <Text style={styles.textbottom}>{item.eow}</Text>

            <Text style={styles.textheader}>Date</Text>
            <Text style={styles.textbottom}>{item.date}</Text>

            <Text style={styles.textheader}>Project Number</Text>
            <Text style={styles.textbottom}>{item.projNum}</Text>

            <Text style={styles.textheader}>Description</Text>
            <Text style={styles.textbottom}>{item.comment}</Text>

            <Text style={styles.textheader}>Start Work</Text>
            <Text style={styles.textbottom}>{item.arrivalHours}:{item.arrivalMinutes}</Text>

            <Text style={styles.textheader}>Finish Work</Text>
            <Text style={styles.textbottom}>{item.departHours}:{item.departMinutes}</Text>

            <Text style={styles.textheader}>Start Lunch</Text>
            <Text style={styles.textbottom}>{item.startLHours}:{item.startLMinutes}</Text>

            <Text style={styles.textheader}>Finish Lunch</Text>
            <Text style={styles.textbottom}>{item.FinishLHours}:{item.FinishLMinutes}</Text>

            <Text style={styles.textheader}>Total Hours</Text>
            <Text style={styles.textbottom}>{item.totalHrs}</Text>

            <Text style={styles.textheader}>Site ID</Text>
            <Text style={styles.textbottom}>{item.siteID}</Text>

        </View>
      );
    };
   
   
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
          <View style={{ flex: 1 }}>
          <FlatList
            style={{ marginTop: 30 }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
           <Button icon="plus" onPress={pressHandler}>
                Add Entry
           </Button>
           </View>
        </SafeAreaView>
   );
   }
   
   
   const styles = StyleSheet.create({
       container:{
           flex: 1,
         backgroundColor: '#fff',
         alignItems: 'center',
           justifyContent: 'center'
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
     });
     
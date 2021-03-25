import React, {useEffect} from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button } from 'react-native';
import { DatabaseConnection } from '../components/database-connection';

const db = DatabaseConnection.getConnection();

export default function login({ navigation }) {

 const pressHandler = () => 
 {
   navigation.navigate('Home')
 }

 useEffect(() => {
  db.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='Timesheet'",
      [],
      function (tx, res) {
        console.log('item:', res.rows.length);
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS Timesheet', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS Timesheet(id_timesheet INTEGER PRIMARY KEY AUTOINCREMENT, user_id BIGINT(20), eow DATE, date DATETIME, projNum VARCHAR(30), comment VARCHAR(250), arrivalHours TIME, arrivalMinutes TIME,  departHours TIME, departMinutes TIME, startLHours TIME, startLMinutes TIME, FinishLHours TIME, FinishLMinutes TIME, totalHrs TIME, siteID VARCHAR(45), dayoftheweek VARCHAR(45))',
            []
          );
        }
      }
    );
  });
}, []);


   return (
    <View style={styles.container}>
    
      <View style={styles.image}>
        <Image source={require('../assets/obelisks.png')}/>
      </View>

      <View style={styles.login}>
          <TextInput placeholder='Login'/>
      </View>

      <View style={styles.password}>
          <TextInput placeholder='Password'/>
      </View>
    
      <Button title="Login" color="#FF0000" onPress={pressHandler}/>

      <View style={styles.words}>
          <Text>Forgot password</Text>
      </View>

  </View>
);
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
     
    image: {
          marginTop:-150,
          alignItems: 'center'
      },
      
    login: {
        borderWidth: 1,
        width: 250,
        height: 40,
        marginTop:80,
        margin: 10
        
      },
  
      password: {
        borderWidth: 1,
        width: 250,
        height: 40,
        margin: 10
      },
      

      words: {
        margin: 50
      }
  
  });
  
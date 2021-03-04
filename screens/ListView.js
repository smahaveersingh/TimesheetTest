import React, { Component } from 'react';
import {  View,Text, FlatList } from 'react-native';
import { Collapse, CollapseHeader, CollapseBody } from "accordion-collapse-react-native";
import { Thumbnail, List, ListItem, Separator, Item } from 'native-base';
import { DatabaseConnection } from '../components/database-connection';
import { DataTable } from 'react-native-paper';

const db = DatabaseConnection.getConnection();

function ListView () {
    const [flatListItems, setFlatListItems] = React.useState([]);

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
          key={item.user_id}
          style={{backgroundColor: '#d5f5dd', marginTop: 20, padding: 30, borderRadius: 10, width: 500, marginLeft: -50 }}>
            <Collapse style={{marginBottom: -80}}>
      <CollapseHeader>
        <Separator>
          <Text style={{fontWeight: 'bold'}}>{item.dayoftheweek}  ({item.totalHrs}  Hours)</Text>
          
        </Separator>
      </CollapseHeader>
      <CollapseBody>
        <ListItem >
          <DataTable.Cell>{item.projNum} {item.siteID}</DataTable.Cell>
          <DataTable.Cell>{item.arrivalHours}:{item.arrivalMinutes}{'\n'}{item.departHours}:{item.departMinutes}</DataTable.Cell>
          <DataTable.Cell>{item.comment}</DataTable.Cell>
        </ListItem>
        
      </CollapseBody>
    </Collapse>
          </View>
        );
      };    



    return(
        <View>
            <FlatList
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}  
          />
        </View>
    );
}

export default ListView;
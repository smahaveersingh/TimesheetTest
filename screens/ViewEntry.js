import React, {useState,useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
//import axios from axios

export default function DeleteUser ({ navigation })  {
    const [values, setValues] = React.useState([]);
    const [selectedValue, setSelectedValue] = useState(null);

    useEffect(() => {
        fetch('https://aboutreact.herokuapp.com/demosearchables.php')
        .then(response => response.json())
        .then(responseJson => {
            setValues(responseJson.results)
        })
        .catch((error) => {
            console.error(error);
          });
      }, []);

    return (        
        <View style={{flex: 1,backgroundColor:'white'}}>
                <Picker
                    selectedValue={selectedValue ? selectedValue.id : null}
                    style={{ width: '100%' }}
                    onValueChange={(itemValue) => setSelectedValue({ id: itemValue })}>
                    { values.map((value, i) => {
                        return <Picker.Item key={i} value={value.id} label={value.name} />
                    })}
                </Picker>
               </View> 
        
    )
}
import React, {useEffect, useState} from 'react';
import * as Font from 'expo-font';
import { StatusBar, LogBox, Dimensions } from "react-native";
import AppLoading  from 'expo-app-loading';
import Navigator from './routes/drawer';
import Navigator_two from './routes/drawer_two';
import { isAndroid } from "@freakycoder/react-native-helpers";
import AnimatedSplash from "react-native-animated-splash-screen";
import checkIfFirstLaunch  from './routes/checkIfFirstLaunch';
import AsyncStorage from "@react-native-community/async-storage";


LogBox.ignoreAllLogs();

const getFonts = () => Font.loadAsync({
'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
'nunito-semi-bold': require('./assets/fonts/Nunito-SemiBold.ttf')
});


export default function App(){
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if(value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

    React.useEffect(() => {
      StatusBar.setBarStyle("dark-content");
      if (isAndroid) {
        StatusBar.setBackgroundColor("rgba(0,0,0,0)");
        StatusBar.setTranslucent(true);
      }
      setTimeout(() => {
        setIsLoaded(true);
      }, 2050);
    }, []);

  if(isFirstLaunch === null) {
    return null;
  } else if ( isFirstLaunch === true) {
    if(fontsLoaded)
    {
      return (
        <AnimatedSplash
        logoWidth={100}
        logoHeight={100}
        logoImage={require("./assets/O.png")}
        isLoaded={isLoaded}
        backgroundColor={null}
        imageBackgroundResizeMode="cover"
      >
        <Navigator/>
        </AnimatedSplash>
      );
    }

  else {
    return(
      
  <AppLoading
  startAsync={getFonts}
  onFinish={()=> setFontsLoaded(true)}
  onError={console.warn}
  />
    )}}
    else {
      if(fontsLoaded)
    {
      return (
        <AnimatedSplash
        logoWidth={100}
        logoHeight={100}
        logoImage={require("./assets/O.png")}
        isLoaded={isLoaded}
        backgroundColor={null}
        imageBackgroundResizeMode="cover"
      >
        <Navigator_two />
        </AnimatedSplash>
      );
    }

  else {
    return(
      
  <AppLoading
  startAsync={getFonts}
  onFinish={()=> setFontsLoaded(true)}
  onError={console.warn}
  />
    )}
    }
}

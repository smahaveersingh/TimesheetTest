import * as React from 'react';
import {
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Animated,
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);

const DURATION = 1000;
const TEXT_DURATION = DURATION * 0.8;

const quotes = [
  {
    quote:
      '',
    author: 'Professional Engineering Services',
  },
  {
    quote: 'The fastest way to build an app.',
    author: 'The Expo Team',
  },
];

const Circle = ({ onPress, index, quotes, animatedValue, animatedValue2 }) => {
  const { initialBgColor, nextBgColor, bgColor } = colors[index];
  const inputRange = [0, 0.001, 0.5, 0.501, 1];
  const backgroundColor = animatedValue2.interpolate({
    inputRange,
    outputRange: [
      initialBgColor,
      initialBgColor,
      initialBgColor,
      bgColor,
      bgColor,
    ],
  });
  const dotBgColor = animatedValue2.interpolate({
    inputRange: [0, 0.001, 0.5, 0.501, 0.9, 1],
    outputRange: [
      bgColor,
      bgColor,
      bgColor,          
      initialBgColor,
      initialBgColor,
      nextBgColor,
    ],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        styles.container,
        { backgroundColor },
      ]}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: dotBgColor,
            transform: [
              { perspective: 200 },
              {
                rotateY: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ['0deg', '-90deg', '-180deg'],
                }),
              },

              {
                scale: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 6, 1],
                }),
              },

              {
                translateX: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={onPress}>
          <Animated.View
            style={[
              styles.button,
              {
                transform: [
                  {
                    scale: animatedValue.interpolate({
                      inputRange: [0, 0.05, 0.5, 1],
                      outputRange: [1, 0, 0, 1],
                      // extrapolate: "clamp"
                    }),
                  },
                  {
                    rotateY: animatedValue.interpolate({
                      inputRange: [0, 0.5, 0.9, 1],
                      outputRange: ['0deg', '180deg', '180deg', '180deg'],
                    }),
                  },
                ],
                opacity: animatedValue.interpolate({
                  inputRange: [0, 0.05, 0.9, 1],
                  outputRange: [1, 0, 0, 1],
                }),
              },
            ]}
          >
            <AnimatedAntDesign name='arrowright' size={28} color={'white'} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

/* 
initialBgColor -> Big background of the element
bgColor -> initial circle bg color that will be the next slide initial BG Color
nextBgColor -> next circle bg color after we fully transition the circle and this will be small again
prev bgColor === next initialBgColor
prev nextBgColor === next bgColor
*/

const colors = [
  {
    initialBgColor: '#ffffff',
    bgColor: '#fcba03',
    nextBgColor: '#222',
  },     
  {
    initialBgColor: 'midnightblue',
    bgColor: 'turquoise',
    nextBgColor: 'goldenrod',
  },
  {
    initialBgColor: 'turquoise',
    bgColor: 'goldenrod',
    nextBgColor: '#222',
  },
];

export default function Onboarding({navigation}) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const animatedValue2 = React.useRef(new Animated.Value(0)).current;
  const sliderAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [...Array(quotes.length).keys()];
  const [index, setIndex] = React.useState(0);

  const animate = (i) =>
    Animated.parallel([
      Animated.timing(sliderAnimatedValue, {
        toValue: i,
        duration: TEXT_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue2, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: false,
      }),
    ]);

  const onPress = () => {
    animatedValue.setValue(0);
    animatedValue2.setValue(0);
    animate((index) % colors.length).start();
    setIndex((index) % colors.length);
    navigation.navigate('Login');
  };
  

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 100 }}>
      <StatusBar hidden />
      <Circle
        index={index}
        onPress={onPress}
        quotes={quotes}
        animatedValue={animatedValue}
        animatedValue2={animatedValue2}
      />
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [
            {
              translateX: sliderAnimatedValue.interpolate({
                inputRange,
                outputRange: quotes.map((_, i) => -i * width * 2),
              }),
            },
          ],
          opacity: sliderAnimatedValue.interpolate({
            inputRange: [...Array(quotes.length * 2 + 1).keys()].map(
              (i) => i / 2
            ),
            outputRange: [...Array(quotes.length * 2 + 1).keys()].map((i) =>
              i % 2 === 0 ? 1 : 0
            ),
          }),
        }}
      >
        {quotes.slice(0, colors.length).map(({ quote, author }, i) => {
          return (
            <View style={{ paddingRight: width, width: width * 2 }} key={i}>
              <Text
                style={[styles.paragraph, { color: colors[i].nextBgColor }]}
              >
                {quote}
              </Text>
              <Image source={require('../assets/obelisks.png')} style={{alignContent: 'center', alignItems: 'center', marginLeft:70, marginTop: 100, borderRadius: 20}}/>
              <Text
                style={[
                  styles.paragraph,
                  {
                    color: colors[i].nextBgColor,
                    fontSize: 23,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    opacity: 0.8,
                    marginTop: 30
                  },
                ]}
              >
              {author}
              </Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    paddingBottom: 50,
  },
  paragraph: {
    margin: 12,
    fontSize: 24,
    // fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  button: {
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: 'turquoise',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

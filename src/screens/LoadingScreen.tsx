import { useEffect, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
} from "react-native";

import LottieView from "lottie-react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useResponsive } from "../utils/responsive";

export default function LoadingScreen({
  navigation,
}: any) {

  const {
    isMobile,
  } = useResponsive();

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const dotsAnim = useRef(
    new Animated.Value(0.4)
  ).current;

  useEffect(() => {

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.timing(dotsAnim, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {

      navigation.replace("Login");

    }, 3500);

    return () => clearTimeout(timer);

  }, []);

  return (
    <ImageBackground
      source={require("../assets/network-bg.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >

      <LinearGradient
        colors={[
          "rgba(2,6,23,0.92)",
          "rgba(7,21,43,0.97)",
        ]}
        style={styles.overlay}
      >

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
            },
          ]}
        >

          {/* HANDSHAKE */}

          <View
            style={{
              width: isMobile ? 220 : 320,
              height: isMobile ? 220 : 320,

              justifyContent: "center",
              alignItems: "center",
            }}
          >

            <LottieView
              source={require("../assets/handshake.json")}
              autoPlay
              loop
              resizeMode="contain"
              style={{
                width: "100%",
                height: "100%",
              }}
            />

          </View>

          {/* TITLE */}

          <Text
            style={[
              styles.title,
              {
                fontSize: isMobile
                  ? 34
                  : 52,
              },
            ]}
          >
            Network Dev
          </Text>

          {/* SUBTITLE */}

          <Text
            style={[
              styles.subtitle,
              {
                fontSize: isMobile
                  ? 15
                  : 18,
              },
            ]}
          >
            Estabelecendo conexão...
          </Text>

          {/* DOTS */}

          <Animated.View
            style={[
              styles.dotsContainer,
              {
                opacity: dotsAnim,
              },
            ]}
          >

            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />

          </Animated.View>

        </Animated.View>

      </LinearGradient>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
  },

  backgroundImage: {
    resizeMode: "cover",
    opacity: 0.14,
  },

  overlay: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",
  },

  content: {
    alignItems: "center",

    justifyContent: "center",
  },

  title: {
    color: "#fff",

    fontWeight: "800",

    marginTop: -12,

    letterSpacing: 0.5,
  },

  subtitle: {
    color: "#94A3B8",

    marginTop: 8,
  },

  dotsContainer: {
    flexDirection: "row",

    marginTop: 24,
  },

  dot: {
    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor: "#2563EB",

    marginHorizontal: 6,
  },

});
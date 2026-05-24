import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";

import { login } from "../services/auth";
export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(40))[0];
  const { width } = useWindowDimensions();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start();
  }, []);

  async function handleLogin() {
    if (!email || !password) {
      return Alert.alert("Erro", "Preencha todos os campos");
    }
    try {
      await login(email, password);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);

      Alert.alert("Erro", "Email ou senha inválidos");
    }
  }

  return (
    <ImageBackground
      source={require("../assets/map.png")}
      style={styles.background}
      imageStyle={styles.image}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>
                Network <Text style={styles.devText}>Dev</Text>
              </Text>
              <Text style={styles.subtitle}>
                Conecte-se com devs próximos a você
              </Text>
            </View>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#bbb"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="Senha"
              placeholderTextColor="#bbb"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("CreateProfile")}
            >
              <Text style={styles.link}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  image: {
    resizeMode: "cover",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(5,10,25,0.9)",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 30,
  },

  /* HEADER */
  header: {
    marginBottom: 35,
    width: "100%",
  },

  titleRow: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  devText: {
    color: "#4DA6FF",
  },

  subtitle: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 3,
    textAlign: "center",
    maxWidth: 200,
    lineHeight: 16,
    opacity: 0.9,
  },

  /* CARD */
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400, // Mantém o card centralizado e legível no PC
    alignSelf: 'center',

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    color: "#fff",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  button: {
    backgroundColor: "#2979FF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",

    shadowColor: "#2979FF",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  or: {
    textAlign: "center",
    marginVertical: 10,
    color: "#aaa",
  },

  googleButton: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  googleText: {
    color: "#fff",
  },

  link: {
    textAlign: "center",
    marginTop: 12,
    color: "#4DA6FF",
  },
});

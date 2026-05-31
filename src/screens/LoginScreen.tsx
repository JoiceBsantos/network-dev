import React, { useState, useEffect } from "react";
import { useResponsive } from "../utils/responsive";
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
  Platform,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { login } from "../services/auth";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showAlert(title: string, message: string) {
  if (Platform.OS === "web") {
    (globalThis as any).alert(`${title}

${message}`);
  } else {
    Alert.alert(title, message);
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function LoginScreen({ navigation }: LoginScreenProps) {

  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [showPassword, setShowPassword]   = useState(false);
  const [emailError, setEmailError]       = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fadeAnim   = useState(new Animated.Value(0))[0];
  const translateY = useState(new Animated.Value(40))[0];

  const { width, isMobile, isSmallDesktop } = useResponsive();

  // ── Animação de entrada ────────────────────────────────────────────────────

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

  // ── Login — valida só ao apertar Entrar ───────────────────────────────────

  async function handleLogin() {
    let eEmail    = "";
    let ePassword = "";

    if (!email)
      eEmail = "Email é obrigatório";
    else if (!isValidEmail(email))
      eEmail = "Email inválido";

    if (!password)
      ePassword = "Senha é obrigatória";
    else if (password.length < 6)
      ePassword = "Mínimo de 6 caracteres";

    setEmailError(eEmail);
    setPasswordError(ePassword);

    // Alerta e para se tiver qualquer erro
    if (eEmail || ePassword) {
      showAlert(
        "Dados inválidos",
        "Verifique seu email e senha antes de continuar."
      );
      return;
    }

    try {
      await login(email, password);
      navigation.replace("Main");
    } catch (error) {
      console.log(error);
      showAlert(
        "Erro ao entrar",
        "Email ou senha incorretos. Verifique suas credenciais e tente novamente."
      );
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <ImageBackground
      source={require("../assets/network-bg.png")}
      style={styles.background}
      imageStyle={styles.image}
    >
      <LinearGradient
        colors={["rgba(0,8,25,0.82)", "rgba(0,12,35,0.78)", "rgba(0,16,45,0.74)"]}
        style={styles.overlay}
      >
        {/* GLOWS */}
        <View style={styles.blueGlow} />
        <View style={styles.blueGlowTwo} />
        <View style={styles.blueGlowThree} />

        <Animated.View
          style={[
            styles.mainContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY }],
            },
          ]}
        >

          {/* ── DESKTOP / TABLET ──────────────────────────────────────── */}

          {!isMobile ? (
            <View
              style={[
                styles.webContainer,
                { paddingHorizontal: isSmallDesktop ? 70 : 120 },
              ]}
            >

              {/* Branding */}
              <View style={styles.visualSection}>
                <View style={styles.brandRow}>
                  <Image
                    source={require("../assets/logo.png")}
                    style={styles.visualLogo}
                  />
                  <Text
                    style={[
                      styles.visualTitle,
                      { fontSize: isSmallDesktop ? 52 : 64 },
                    ]}
                  >
                    Network <Text style={styles.devText}>Dev</Text>
                  </Text>
                </View>

                <Text
                  style={[
                    styles.visualSubtitle,
                    {
                      fontSize: isSmallDesktop ? 18 : 20,
                      lineHeight: isSmallDesktop ? 32 : 38,
                    },
                  ]}
                >
                  Conecte-se com devs próximos.{"\n"}
                  Networking inteligente em tempo real.
                </Text>

                <View style={styles.visualBadge}>
                  <Text style={styles.visualBadgeText}>
                    BLE • React Native • Networking • Dev Community
                  </Text>
                </View>
              </View>

              {/* Formulário */}
              <View style={styles.loginWrapper}>
                <View style={styles.cardGlow} />

                <View style={[styles.card, { padding: isSmallDesktop ? 22 : 28 }]}>
                  <Text style={[styles.loginTitle, { fontSize: isSmallDesktop ? 34 : 44 }]}>
                    Bem-vindo de volta!
                  </Text>

                  <Text style={[styles.loginSubtitle, { fontSize: isSmallDesktop ? 16 : 18 }]}>
                    Acesse sua comunidade dev.
                  </Text>

                  <View style={styles.lineGlow} />

                  {/* EMAIL */}
                  <View
                    style={[
                      styles.inputContainer,
                      { paddingVertical: 18 },
                      emailError ? styles.inputError : null,
                    ]}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={22}
                      color="#C7D2FE"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#A5B4FC"
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {emailError !== "" && (
                    <Text style={styles.fieldError}>{emailError}</Text>
                  )}

                  {/* SENHA */}
                  <View
                    style={[
                      styles.inputContainer,
                      { paddingVertical: 18 },
                      passwordError ? styles.inputError : null,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={22}
                      color="#C7D2FE"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Senha"
                      placeholderTextColor="#A5B4FC"
                      secureTextEntry={!showPassword}
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#A5B4FC"
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError !== "" && (
                    <Text style={styles.fieldError}>{passwordError}</Text>
                  )}

                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    activeOpacity={0.92}
                  >
                    <LinearGradient
                      colors={["#2563EB", "#3B82F6", "#60A5FA"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.buttonGradient, { paddingVertical: 20 }]}
                    >
                      <Text style={styles.buttonText}>Entrar</Text>
                      <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.registerContainer}
                    onPress={() => navigation.navigate("CreateProfile")}
                  >
                    <View style={styles.registerLine} />
                    <View style={styles.registerContent}>
                      <Ionicons name="person-add-outline" size={22} color="#3B82F6" />
                      <Text style={styles.link}>Criar conta</Text>
                    </View>
                    <View style={styles.registerLine} />
                  </TouchableOpacity>
                </View>
              </View>

            </View>

          ) : (

            /* ── MOBILE ─────────────────────────────────────────────── */

            <View style={styles.mobileContainer}>
              <View style={styles.mobileHeader}>
                <View style={styles.mobileBrandRow}>
                  <Image
                    source={require("../assets/logo.png")}
                    style={styles.mobileLogo}
                  />
                  <Text style={[styles.mobileTitle, { fontSize: width < 380 ? 30 : 38 }]}>
                    Network <Text style={styles.devText}>Dev</Text>
                  </Text>
                </View>
                <Text style={styles.mobileSubtitle}>
                  Conecte-se com devs próximos a você
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    padding: width < 380 ? 20 : 26,
                    width: "100%",
                    maxWidth: 420,
                  },
                ]}
              >

                {/* EMAIL */}
                <View
                  style={[
                    styles.inputContainer,
                    { paddingVertical: 14 },
                    emailError ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={22}
                    color="#C7D2FE"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#A5B4FC"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {emailError !== "" && (
                  <Text style={styles.fieldError}>{emailError}</Text>
                )}

                {/* SENHA */}
                <View
                  style={[
                    styles.inputContainer,
                    { paddingVertical: 14 },
                    passwordError ? styles.inputError : null,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#C7D2FE"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Senha"
                    placeholderTextColor="#A5B4FC"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color="#A5B4FC"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError !== "" && (
                  <Text style={styles.fieldError}>{passwordError}</Text>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  activeOpacity={0.92}
                >
                  <LinearGradient
                    colors={["#2563EB", "#3B82F6", "#60A5FA"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.buttonGradient, { paddingVertical: 16 }]}
                  >
                    <Text style={styles.buttonText}>Entrar</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.registerContainer}
                  onPress={() => navigation.navigate("CreateProfile")}
                >
                  <View style={styles.registerContent}>
                    <Ionicons name="person-add-outline" size={22} color="#3B82F6" />
                    <Text style={styles.link}>Criar conta</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          )}

        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  image: {
    resizeMode: "cover",
    opacity: 1,
  },

  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  mainContainer: {
    flex: 1,
  },

  webContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 40,
  },

  visualSection: {
    flex: 1,
    justifyContent: "center",
    minWidth: 320,
    maxWidth: 720,
    paddingRight: 40,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  visualLogo: {
    width: 94,
    height: 94,
    resizeMode: "contain",
    marginRight: -2,
    marginTop: -12,
  },

  visualTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: -2,
    flexWrap: "nowrap",
  },

  devText: {
    color: "#3B82F6",
  },

  visualSubtitle: {
    color: "#D6E2FF",
    fontSize: 20,
    lineHeight: 38,
    marginTop: 22,
    maxWidth: 520,
  },

  visualBadge: {
    alignSelf: "flex-start",
    marginTop: 34,
    backgroundColor: "rgba(37,99,235,0.12)",
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.28)",
  },

  visualBadgeText: {
    color: "#60A5FA",
    fontSize: 14,
    fontWeight: "600",
  },

  loginWrapper: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 320,
    maxWidth: 520,
  },

  cardGlow: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: 999,
    backgroundColor: "#2563EB",
    opacity: 0.08,
  },

  card: {
    width: "100%",
    backgroundColor: "rgba(6,18,40,0.78)",
    borderRadius: 34,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#2563EB",
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
  },

  loginTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  loginSubtitle: {
    color: "#AAB8D4",
    marginTop: 8,
  },

  lineGlow: {
    width: 80,
    height: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 999,
    marginTop: 18,
    marginBottom: 28,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 24,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 6,
  },

  inputError: {
    borderColor: "#F87171",
    backgroundColor: "rgba(248,113,113,0.06)",
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
  },

  eyeButton: {
    padding: 4,
  },

  fieldError: {
    color: "#F87171",
    fontSize: 12,
    marginLeft: 8,
    marginBottom: 16,
    marginTop: 2,
  },

  button: {
    marginTop: 16,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#2563EB",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },

  buttonGradient: {
    paddingHorizontal: 26,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  registerContainer: {
    marginTop: 26,
    flexDirection: "row",
    alignItems: "center",
  },

  registerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  registerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
  },

  link: {
    color: "#60A5FA",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  mobileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
  },

  mobileHeader: {
    alignItems: "center",
    marginBottom: 46,
  },

  mobileBrandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  mobileLogo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginRight: -4,
    marginTop: -8,
  },

  mobileTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  mobileSubtitle: {
    color: "#CBD5E1",
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },

  blueGlow: {
    position: "absolute",
    width: 600,
    height: 600,
    borderRadius: 999,
    backgroundColor: "#2563EB",
    opacity: 0.04,
    top: -180,
    left: -120,
  },

  blueGlowTwo: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 999,
    backgroundColor: "#1D4ED8",
    opacity: 0.05,
    bottom: -140,
    right: -80,
  },

  blueGlowThree: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 999,
    backgroundColor: "#60A5FA",
    opacity: 0.05,
    top: "38%",
    left: "40%",
  },

});

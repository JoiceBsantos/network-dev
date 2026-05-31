import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  ScrollView,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../services/api";
import { getStoredUserId } from "../services/auth";
import { useResponsive } from "../utils/responsive";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ConnectionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Connection">;
  route:      RouteProp<RootStackParamList, "Connection">;
};

// ─── Componente ───────────────────────────────────────────────────────────────

const DEV_IMAGES: Record<string, any> = {
  "Joice Barbosa":  require("../assets/joice.png"),
  "Adriel Pereira": require("../assets/adriel.png"),
  "Luiz Henrique":  require("../assets/luiz.png"),
};

export default function ConnectionScreen({ navigation, route }: ConnectionScreenProps) {
  const name  = route.params?.name  ?? "Adriel Pereira";
  const stack = route.params?.stack ?? "Java + Spring Boot";
  const match = route.params?.match ?? "91%";
  const [showHandshake, setShowHandshake] = useState(false);
  const [showSuccess, setShowSuccess]     = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const { isMobile, isDesktop } = useResponsive();

  // ── Animação de pulso ──────────────────────────────────────────────────────

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // ── Conectar ───────────────────────────────────────────────────────────────

  async function handleConnection() {
    setShowHandshake(true);

    try {
      const myId = await getStoredUserId();
      await api.post("/proximity/detect", {
        originUserId:   Number(myId),
        detectedUserId: 3,
        rssi:           -45,
        timestamp:      new Date().toISOString(),
      });
    } catch (e) {
      console.log("Erro ao registrar log de proximidade", e);
    }

    setTimeout(() => {
      setShowHandshake(false);
      setShowSuccess(true);
    }, 2200);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <LinearGradient colors={["#020617", "#07152B"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <View style={styles.backgroundGlowTop} />

          <View
            style={[
              styles.content,
              {
                paddingHorizontal: isMobile ? 20 : 40,
                maxWidth:          isDesktop ? 1100 : 900,
                alignSelf:         "center",
                width:             "100%",
              },
            ]}
          >

            {/* ── BACK ────────────────────────────────────────────────── */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#4DA6FF" />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            {/* ── HEADER ──────────────────────────────────────────────── */}
            <Text style={[styles.title, { fontSize: isMobile ? 28 : 42 }]}>
              Conexão Detectada
            </Text>
            <Text style={[styles.subtitle, { fontSize: isMobile ? 15 : 18, maxWidth: 700 }]}>
              Desenvolvedor próximo encontrado via BLE
            </Text>

            {/* ── CONNECTION AREA ──────────────────────────────────────── */}
            <View style={[styles.connectionWrapper, { paddingVertical: isMobile ? 28 : 50, paddingHorizontal: isMobile ? 18 : 40 }]}>
              <View style={[styles.connectionContainer, { flexDirection: isMobile ? "column" : "row", gap: isMobile ? 30 : 20 }]}>

                {/* Você */}
                <View style={styles.userContainer}>
                  <Image
                    source={require("../assets/me.png")}
                    style={[styles.avatar, { width: isMobile ? 92 : 130, height: isMobile ? 92 : 130, borderRadius: isMobile ? 46 : 65 }]}
                  />
                  <Text style={[styles.userName, { fontSize: isMobile ? 18 : 24 }]}>Você</Text>
                  <Text style={[styles.stack, { fontSize: isMobile ? 13 : 15 }]}>React Native</Text>
                </View>

                {/* Linha de conexão */}
                <View style={[styles.lineContainer, { width: isMobile ? 3 : "auto", height: isMobile ? 120 : "auto" }]}>
                  <View style={[styles.line, { width: isMobile ? 3 : "100%", height: isMobile ? "100%" : 3 }]} />
                  <Animated.View style={[styles.connectionGlow, { transform: [{ scale: pulseAnim }] }]} />
                </View>

                {/* Dev detectado */}
                <View style={styles.userContainer}>
                  <Image
                    source={DEV_IMAGES[name]}
                    style={[styles.avatar, { width: isMobile ? 92 : 130, height: isMobile ? 92 : 130, borderRadius: isMobile ? 46 : 65 }]}
                  />
                  <Text style={[styles.userName, { fontSize: isMobile ? 18 : 24 }]}>{name}</Text>
                  <Text style={[styles.stack, { fontSize: isMobile ? 13 : 15 }]}>{stack}</Text>
                </View>

              </View>
            </View>

            {/* ── MATCH ───────────────────────────────────────────────── */}
            <View style={[styles.matchCard, { paddingVertical: isMobile ? 22 : 30 }]}>
              <Text style={styles.matchTitle}>Compatibilidade</Text>
              <Text style={[styles.matchValue, { fontSize: isMobile ? 56 : 82 }]}>{match}</Text>
              <Text style={[styles.matchDescription, { fontSize: isMobile ? 15 : 17 }]}>
                Vocês possuem interesses e stacks compatíveis.
              </Text>
            </View>

            {/* ── BLE INFO ────────────────────────────────────────────── */}
            <View style={[styles.infoContainer, { flexDirection: isMobile ? "column" : "row", gap: 14 }]}>
              <View style={styles.infoBadge}>
                <Text style={styles.infoText}>📍 Distância: 3 metros</Text>
              </View>
              <View style={styles.infoBadge}>
                <Text style={styles.infoText}>📶 Sinal BLE Forte</Text>
              </View>
              <View style={styles.infoBadge}>
                <Text style={styles.infoText}>🔵 Bluetooth ativo</Text>
              </View>
            </View>

            {/* ── OBJECTIVE ───────────────────────────────────────────── */}
            <View style={[styles.objectiveCard, { padding: isMobile ? 18 : 24 }]}>
              <Text style={[styles.objectiveTitle, { fontSize: isMobile ? 16 : 20 }]}>
                Objetivo Profissional
              </Text>
              <Text style={[styles.objectiveText, { fontSize: isMobile ? 15 : 17 }]}>
                Buscando networking em mobile e projetos IoT.
              </Text>
            </View>

            {/* ── BOTÃO CONECTAR ──────────────────────────────────────── */}
            <TouchableOpacity
              style={[styles.connectButton, { width: isMobile ? "100%" : 420, alignSelf: "center", marginTop: isMobile ? 18 : 30 }]}
              onPress={handleConnection}
            >
              <Text style={[styles.connectButtonText, { fontSize: isMobile ? 16 : 18 }]}>
                Enviar Conexão
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

        {/* ── MODAL HANDSHAKE ─────────────────────────────────────────────── */}
        <Modal visible={showHandshake} transparent animationType="fade" statusBarTranslucent>
          <View style={styles.handshakeOverlay}>
            <View style={styles.handshakeGlow} />

            {/* Container com tamanho igual ao LoadingScreen */}
            <View style={{ width: isMobile ? 220 : 280, height: isMobile ? 220 : 280 }}>
              <LottieView
                source={require("../assets/handshake.json")}
                autoPlay
                loop
                resizeMode="contain"
                style={{ width: "100%", height: "100%" }}
              />
            </View>

            <Text style={[styles.handshakeText, { fontSize: isMobile ? 20 : 24 }]}>
              Conectando desenvolvedores...
            </Text>
          </View>
        </Modal>

        {/* ── MODAL SUCESSO ───────────────────────────────────────────────── */}
        <Modal visible={showSuccess} transparent animationType="fade">
          <View style={styles.successOverlay}>
            <View style={styles.successCard}>
              <Ionicons name="checkmark-circle" size={70} color="#22C55E" />

              <Text style={styles.successTitle}>Conexão enviada 🚀</Text>

              <Text style={styles.successText}>
                Sua conexão foi enviada com sucesso!
              </Text>

              <TouchableOpacity
                style={styles.successButton}
                onPress={() => {
                  setShowSuccess(false);
                  // Volta para as tabs (Home)
                  navigation.navigate("Main");
                }}
              >
                <Text style={styles.successButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
  },
  backgroundGlowTop: {
    position: "absolute",
    top: -220,
    left: -140,
    width: 340,
    height: 340,
    borderRadius: 340,
    backgroundColor: "rgba(37,99,235,0.16)",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  backText: {
    color: "#4DA6FF",
    fontSize: 16,
    marginLeft: 8,
  },
  title: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 32,
    lineHeight: 26,
    alignSelf: "center",
  },
  connectionWrapper: {
    backgroundColor: "rgba(15,23,42,0.65)",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    marginBottom: 24,
    overflow: "hidden",
  },
  connectionContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  userContainer: {
    alignItems: "center",
  },
  avatar: {
    borderWidth: 3,
    borderColor: "#4DA6FF",
  },
  userName: {
    color: "#fff",
    fontWeight: "800",
    marginTop: 18,
    textAlign: "center",
  },
  stack: {
    color: "#4DA6FF",
    marginTop: 6,
    textAlign: "center",
  },
  lineContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    backgroundColor: "rgba(77,166,255,0.3)",
    borderRadius: 99,
  },
  connectionGlow: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4DA6FF",
    shadowColor: "#4DA6FF",
    shadowOpacity: 1,
    shadowRadius: 22,
    elevation: 12,
  },
  matchCard: {
    backgroundColor: "rgba(15,23,42,0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    borderRadius: 30,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  matchTitle: {
    color: "#CBD5E1",
    fontSize: 15,
    textAlign: "center",
  },
  matchValue: {
    color: "#4DA6FF",
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    width: "100%",
  },
  matchDescription: {
    color: "#ccc",
    textAlign: "center",
    lineHeight: 26,
  },
  infoContainer: {
    marginBottom: 22,
  },
  infoBadge: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.65)",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  infoText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
  objectiveCard: {
    backgroundColor: "rgba(77,166,255,0.05)",
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(77,166,255,0.04)",
  },
  objectiveTitle: {
    color: "#4DA6FF",
    fontWeight: "800",
    marginBottom: 12,
  },
  objectiveText: {
    color: "#ddd",
    lineHeight: 28,
  },
  connectButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  connectButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  handshakeOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(2,6,23,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  handshakeText: {
    color: "#fff",
    fontWeight: "700",
    marginTop: 14,
  },
  handshakeGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: "rgba(59,130,246,0.12)",
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#081228",
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  successTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 20,
  },
  successText: {
    color: "#CBD5E1",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24,
  },
  successButton: {
    backgroundColor: "#2563EB",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 26,
  },
  successButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  handshakeAnimation: {},
});

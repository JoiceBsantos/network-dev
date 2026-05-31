import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../navigation/AppNavigator";
import { useResponsive } from "../utils/responsive";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ConnectionsScreenProps = {
  navigation: BottomTabNavigationProp<MainTabParamList, "Connections">;
};

interface Connection {
  id:     string;
  name:   string;
  stack:  string;
  avatar: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function showAlert(title: string, message: string) {
  if (Platform.OS === "web") {
    (globalThis as any).alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

// ─── Dados mock ───────────────────────────────────────────────────────────────

const DEV_IMAGES: Record<string, any> = {
  "Joice Barbosa":  require("../assets/joice.png"),
  "Adriel Pereira": require("../assets/adriel.png"),
  "Luiz Henrique":  require("../assets/luiz.png"),
};

const MOCK_ACCEPTED: Connection[] = [
  { id: "1", name: "Joice Barbosa",  stack: "React Native",       avatar: "" },
];

const MOCK_SENT: Connection[] = [
  { id: "2", name: "Adriel Pereira", stack: "Java + Spring Boot", avatar: "" },
];

const MOCK_RECEIVED: Connection[] = [
  { id: "3", name: "Luiz Henrique",  stack: "Node.js + DevOps",   avatar: "" },
];

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ConnectionsScreen({ navigation }: ConnectionsScreenProps) {
  const { isMobile, isDesktop } = useResponsive();

  const [accepted, setAccepted]   = useState<Connection[]>(MOCK_ACCEPTED);
  const [sent, setSent]           = useState<Connection[]>(MOCK_SENT);
  const [received, setReceived]   = useState<Connection[]>(MOCK_RECEIVED);

  // ── Aceitar solicitação ────────────────────────────────────────────────────

  function handleAccept(item: Connection) {
    setAccepted((prev) => [...prev, item]);
    setReceived((prev) => prev.filter((r) => r.id !== item.id));
    showAlert("Conexão aceita! 🎉", `Você e ${item.name} agora estão conectados.`);
  }

  // ── Recusar solicitação ────────────────────────────────────────────────────

  function handleDecline(item: Connection) {
    setReceived((prev) => prev.filter((r) => r.id !== item.id));
    showAlert("Solicitação recusada", `A solicitação de ${item.name} foi removida.`);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <LinearGradient colors={["#020B1D", "#07152B", "#0F2A52"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: isMobile ? 20 : 40,
              maxWidth:          isDesktop ? 900 : "100%",
              alignSelf:         "center",
              width:             "100%",
            },
          ]}
          showsVerticalScrollIndicator={false}
        >

          {/* ── HEADER ──────────────────────────────────────────────────── */}
          <View style={styles.header}>
            <Text style={[styles.title, { fontSize: isMobile ? 26 : 34 }]}>
              Conexões
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {accepted.length + sent.length + received.length}
              </Text>
            </View>
          </View>

          {/* ── SOLICITAÇÕES RECEBIDAS ───────────────────────────────────── */}
          {received.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Ionicons name="notifications" size={18} color="#F59E0B" style={styles.sectionIcon} />
                <Text style={[styles.sectionTitle, { color: "#F59E0B" }]}>
                  Solicitações recebidas
                </Text>
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>{received.length}</Text>
                </View>
              </View>

              {received.map((item) => (
                <View key={item.id} style={[styles.card, styles.cardReceived]}>
                  <Image source={DEV_IMAGES[item.name]} style={styles.avatar} />

                  <View style={styles.cardInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.stack}>{item.stack}</Text>
                    <Text style={styles.requestLabel}>Quer se conectar com você 👋</Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAccept(item)}
                    >
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={() => handleDecline(item)}
                    >
                      <Ionicons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* ── CONEXÕES ACEITAS ─────────────────────────────────────────── */}
          <View style={[styles.sectionHeader, { marginTop: received.length > 0 ? 24 : 0 }]}>
            <Ionicons name="people" size={18} color="#3B82F6" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Conexões aceitas</Text>
          </View>

          {accepted.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Nenhuma conexão ainda</Text>
            </View>
          ) : (
            accepted.map((item) => (
              <View key={item.id} style={styles.card}>
                <Image source={DEV_IMAGES[item.name]} style={styles.avatar} />

                <View style={styles.cardInfo}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.stack}>{item.stack}</Text>
                </View>

                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={() => (navigation as any).navigate("Connection")}
                >
                  <Text style={styles.profileButtonText}>Perfil</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          {/* ── ENVIADAS / AGUARDANDO ────────────────────────────────────── */}
          {sent.length > 0 && (
            <>
              <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                <Ionicons name="time-outline" size={18} color="#94A3B8" style={styles.sectionIcon} />
                <Text style={[styles.sectionTitle, { color: "#94A3B8" }]}>
                  Aguardando resposta
                </Text>
              </View>

              {sent.map((item) => (
                <View key={item.id} style={[styles.card, styles.cardPending]}>
                  <Image source={DEV_IMAGES[item.name]} style={styles.avatar} />

                  <View style={styles.cardInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.stack}>{item.stack}</Text>
                  </View>

                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>Pendente</Text>
                  </View>
                </View>
              ))}
            </>
          )}

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  scrollContent: {
    paddingTop: 56,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    gap: 12,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  countBadge: {
    backgroundColor: "rgba(59,130,246,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  countText: {
    color: "#3B82F6",
    fontWeight: "700",
    fontSize: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionIcon: {
    marginRight: 8,
  },

  sectionTitle: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },

  sectionBadge: {
    backgroundColor: "rgba(245,158,11,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },

  sectionBadgeText: {
    color: "#F59E0B",
    fontWeight: "700",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#09162D",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.12)",
  },

  cardReceived: {
    borderColor: "rgba(245,158,11,0.25)",
    backgroundColor: "rgba(245,158,11,0.05)",
  },

  cardPending: {
    borderColor: "rgba(148,163,184,0.15)",
    opacity: 0.8,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
  },

  cardInfo: {
    flex: 1,
  },

  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  stack: {
    color: "#3B82F6",
    marginTop: 3,
    fontSize: 13,
  },

  requestLabel: {
    color: "#F59E0B",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },

  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },

  acceptButton: {
    backgroundColor: "#22C55E",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },

  declineButton: {
    backgroundColor: "rgba(239,68,68,0.8)",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },

  profileButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },

  profileButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },

  pendingBadge: {
    backgroundColor: "rgba(148,163,184,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.2)",
  },

  pendingText: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 13,
  },

  emptyCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
  },

  emptyText: {
    color: "#4A5568",
    fontSize: 14,
  },

});

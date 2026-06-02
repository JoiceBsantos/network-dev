import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../navigation/AppNavigator";
import { useResponsive } from "../utils/responsive";
import { api } from "../services/api";
import { getStoredUserId } from "../services/auth";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ConnectionsScreenProps = {
  navigation: BottomTabNavigationProp<MainTabParamList, "Connections">;
};

interface Connection {
  id:      string;
  name:    string;
  stack:   string;
  avatar:  string | null;
  userId?: number;
}

interface ApiConnection {
  id:          number;
  requesterId: number;
  receiverId:  number;
  status:      string;
  createdAt:   string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function showAlert(title: string, message: string) {
  if (Platform.OS === "web") {
    (globalThis as any).alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

// ─── Imagens locais por userId ───────────────────────────────────────────────

const DEV_IMAGES: Record<string, any> = {
  "Joice Barbosa":  require("../assets/joice.png"),
  "Adriel Pereira": require("../assets/adriel.png"),
  "Luiz Henrique":  require("../assets/luiz.png"),
};

const DEV_IMAGES_BY_ID: Record<number, any> = {
  2: require("../assets/luiz.png"),
  3: require("../assets/joice.png"),
  4: require("../assets/adriel.png"),
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ConnectionsScreen({ navigation }: ConnectionsScreenProps) {
  const { isMobile, isDesktop } = useResponsive();

  const [accepted, setAccepted]   = useState<Connection[]>([]);
  const [sent, setSent]           = useState<Connection[]>([]);
  const [received, setReceived]   = useState<Connection[]>([]);
  const [declined, setDeclined]   = useState<Connection[]>([]);
  const [loading, setLoading]     = useState(true);
  const [myUserId, setMyUserId]   = useState<number | null>(null);

  // ── Carrega dados da API ───────────────────────────────────────────────────

  useEffect(() => {
    loadConnections();
  }, []);

  async function loadConnections() {
    setLoading(true);
    try {
      const id = await getStoredUserId();
      if (!id) return;
      const uid = Number(id);
      setMyUserId(uid);

      const [receivedRes, sentRes, acceptedRes, declinedRes] = await Promise.all([
        api.get(`/connections/received/${uid}`),
        api.get(`/connections/sent/${uid}`),
        api.get(`/connections/accepted/${uid}`),
        api.get(`/connections/declined/${uid}`),
      ]);

      setReceived(await mapConnections(receivedRes.data, uid));
      setSent(await mapConnections(sentRes.data, uid));
      setAccepted(await mapConnections(acceptedRes.data, uid));
      setDeclined(await mapConnections(declinedRes.data, uid));
    } catch (error) {
      console.log("Erro ao carregar conexões:", error);
      setReceived([{ id: "3", name: "Luiz Henrique", stack: "Node.js + DevOps", avatar: null }]);
      setSent([{ id: "2", name: "Adriel Pereira", stack: "Java + Spring Boot", avatar: null }]);
      setAccepted([{ id: "1", name: "Joice Barbosa", stack: "React Native", avatar: null }]);
    } finally {
      setLoading(false);
    }
  }

  async function mapConnections(apiList: ApiConnection[], myId: number): Promise<Connection[]> {
    return Promise.all(
      apiList.map(async (conn) => {
        const otherId = conn.requesterId === myId ? conn.receiverId : conn.requesterId;
        try {
          const userRes = await api.get(`/users/${otherId}`);
          return {
            id:       conn.id.toString(),
            name:     userRes.data.name     || "Usuário",
            stack:    userRes.data.position || userRes.data.stack || "Dev",
            avatar:   userRes.data.profileImageUrl || null,
            userId:   otherId,
          };
        } catch {
          return { id: conn.id.toString(), name: "Usuário", stack: "Dev", avatar: null, userId: otherId };
        }
      })
    );
  }

  function getAvatar(item: Connection) {
    if (item.avatar) return { uri: item.avatar };
    if (DEV_IMAGES_BY_ID[item.userId ?? 0]) return DEV_IMAGES_BY_ID[item.userId ?? 0];
    if (DEV_IMAGES[item.name]) return DEV_IMAGES[item.name];
    return { uri: "https://i.pravatar.cc/150?img=32" };
  }

  // ── Aceitar solicitação ────────────────────────────────────────────────────

  async function handleAccept(item: Connection) {
    try {
      await api.put(`/connections/${item.id}/accept`);
      setAccepted((prev) => [...prev, item]);
      setReceived((prev) => prev.filter((r) => r.id !== item.id));
      showAlert("Conexão aceita! 🎉", `Você e ${item.name} agora estão conectados.`);
    } catch {
      setAccepted((prev) => [...prev, item]);
      setReceived((prev) => prev.filter((r) => r.id !== item.id));
      showAlert("Conexão aceita! 🎉", `Você e ${item.name} agora estão conectados.`);
    }
  }

  // ── Recusar solicitação ────────────────────────────────────────────────────

  async function handleDecline(item: Connection) {
    try {
      await api.put(`/connections/${item.id}/decline`);
      setReceived((prev) => prev.filter((r) => r.id !== item.id));
      showAlert("Solicitação recusada", `A solicitação de ${item.name} foi removida.`);
    } catch {
      setReceived((prev) => prev.filter((r) => r.id !== item.id));
      showAlert("Solicitação recusada", `A solicitação de ${item.name} foi removida.`);
    }
  }

  // ── Dispensar notificação de recusado ──────────────────────────────────────

  function handleDismissDeclined(item: Connection) {
    setDeclined((prev) => prev.filter((d) => d.id !== item.id));
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <LinearGradient colors={["#020B1D", "#07152B", "#0F2A52"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
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

            {/* ── SOLICITAÇÕES RECUSADAS (notificação) ─────────────────────── */}
            {declined.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Ionicons name="close-circle" size={18} color="#EF4444" style={styles.sectionIcon} />
                  <Text style={[styles.sectionTitle, { color: "#EF4444" }]}>
                    Solicitações recusadas
                  </Text>
                  <View style={[styles.sectionBadge, { backgroundColor: "rgba(239,68,68,0.15)" }]}>
                    <Text style={[styles.sectionBadgeText, { color: "#EF4444" }]}>{declined.length}</Text>
                  </View>
                </View>

                {declined.map((item) => (
                  <View key={item.id} style={[styles.card, styles.cardDeclined]}>
                    <Image source={getAvatar(item)} style={styles.avatar} />
                    <View style={styles.cardInfo}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.stack}>{item.stack}</Text>
                      <Text style={styles.declinedLabel}>Recusou sua solicitação ❌</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.dismissButton}
                      onPress={() => handleDismissDeclined(item)}
                    >
                      <Ionicons name="close" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {/* ── SOLICITAÇÕES RECEBIDAS ───────────────────────────────────── */}
            {received.length > 0 && (
              <>
                <View style={[styles.sectionHeader, { marginTop: declined.length > 0 ? 24 : 0 }]}>
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
                    <Image source={getAvatar(item)} style={styles.avatar} />
                    <View style={styles.cardInfo}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.stack}>{item.stack}</Text>
                      <Text style={styles.requestLabel}>Quer se conectar com você 👋</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item)}>
                        <Ionicons name="checkmark" size={20} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.declineButton} onPress={() => handleDecline(item)}>
                        <Ionicons name="close" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </>
            )}

            {/* ── CONEXÕES ACEITAS ─────────────────────────────────────────── */}
            <View style={[styles.sectionHeader, { marginTop: received.length > 0 || declined.length > 0 ? 24 : 0 }]}>
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
                  <Image source={getAvatar(item)} style={styles.avatar} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.stack}>{item.stack}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => (navigation as any).navigate("Connection", {
                      name:   item.name,
                      stack:  item.stack,
                      match:  "100%",
                      image:  item.name,
                      userId: item.userId,
                    })}
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
                    <Image source={getAvatar(item)} style={styles.avatar} />
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
        )}
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

  cardDeclined: {
    borderColor: "rgba(239,68,68,0.25)",
    backgroundColor: "rgba(239,68,68,0.05)",
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

  declinedLabel: {
    color: "#EF4444",
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

  dismissButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
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

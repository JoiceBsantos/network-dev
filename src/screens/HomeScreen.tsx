import { useResponsive } from "../utils/responsive";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
  Animated,
  ImageStyle,
} from "react-native";

import { useEffect, useRef, useState } from "react";

import { logout, getStoredUserId } from "../services/auth";

import { Ionicons } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";

const allDevelopers = [
  {
    id: "1",
    name: "Ana Costa",
    stack: "React Native",
    match: "92%",
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "2",
    name: "Carlos Lima",
    stack: "Java + Spring Boot",
    match: "85%",
    image: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "3",
    name: "Marina Souza",
    stack: "UI/UX Design",
    match: "97%",
    image: "https://i.pravatar.cc/150?img=45",
  },
  {
    id: "4",
    name: "Pedro Henrique",
    stack: "Node.js",
    match: "80%",
    image: "https://i.pravatar.cc/150?img=60",
  },
  {
    id: "5",
    name: "Juliana Alves",
    stack: "Flutter",
    match: "88%",
    image: "https://i.pravatar.cc/150?img=21",
  },
  {
    id: "6",
    name: "Lucas Mendes",
    stack: "AWS + DevOps",
    match: "94%",
    image: "https://i.pravatar.cc/150?img=53",
  },
];

export default function HomeScreen({ navigation }: any) {

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [isSearching, setIsSearching] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

  const [developers, setDevelopers] = useState<any[]>([]);

  const [foundCount, setFoundCount] = useState(0);

  const [userName] = useState("Desenvolvedor");

  const {
  width,
  isMobile,
  isTablet,
  isDesktop,
  isSmallDesktop,
} = useResponsive();

  async function handleLogout() {
    await logout();
    navigation.replace("Login");
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    const id = await getStoredUserId();

    if (id) {
    }
  }

  function handleSearchDevs() {
    rotateAnim.setValue(0);

    setIsSearching(true);

    setFoundCount(0);

    setTimeout(() => {
      setFoundCount(1);
    }, 1000);

    setTimeout(() => {
      setFoundCount(2);
    }, 2200);

    setTimeout(() => {
      setFoundCount(3);
    }, 3500);

    setTimeout(() => {
      setFoundCount(4);
    }, 4500);

    const randomDevelopers = [...allDevelopers]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map((dev) => ({
        ...dev,
        distance: `${Math.floor(Math.random() * 10) + 1} metros de distância`,
      }));

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4500,
        useNativeDriver: true,
      }),
    ).start();

    setTimeout(() => {
      setDevelopers(randomDevelopers);

      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      setIsSearching(false);

      setHasSearched(true);
    }, 5000);
  }

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 800,
          useNativeDriver: true,
        }),

        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4500,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#020B1D", "#07152B", "#0F2A52"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />

        <View
          style={{
            width: "100%",
            maxWidth: 1400,
            alignSelf: "center",
            paddingHorizontal: isMobile ? 0 : 22,
            flex: 1,
          }}
        >
          {/* TOPO */}

          {!isSearching && (
            <View style={styles.topContainer}>
              <View
                style={[
                  styles.topHeader,
                  {
                    flexDirection: width < 430 ? "column" : "row",
                    alignItems: width < 430 ? "flex-start" : "center",
                    gap: width < 430 ? 18 : 0,
                  },
                ]}
              >
                <View>
                  <Text style={styles.greeting}>Olá, {userName} 👋</Text>

                  <Text style={styles.welcome}>Que bom te ver por aqui!</Text>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate("MyProfile")}
                >
                  <Image
                    source={{
                      uri: "https://i.pravatar.cc/150?img=32",
                    }}
                    style={[
                      styles.profileImage,
                      {
                        width: isMobile ? 74 : 60,
                        height: isMobile ? 74 : 60,
                        borderRadius: isMobile ? 37 : 30,
                      },
                    ] as ImageStyle}
                  />

                  <View style={styles.onlineProfile} />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.topActions,
                  {
                    width: isMobile ? "100%" : "auto",
                    justifyContent: isMobile ? "space-between" : "flex-start",
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.logoutButton,
                    {
                      borderColor: "#3B82F6",
                    },
                  ]}
                  onPress={() => navigation.navigate("Feed")}
                >
                  <Ionicons name="images-outline" size={18} color="#3B82F6" />

                  <Text
                    style={[
                      styles.logoutText,
                      {
                        color: "#3B82F6",
                        marginLeft: 5,
                      },
                    ]}
                  >
                    Feed
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" style={styles.logoutIcon} />

                  <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* BRAND */}

          {!isSearching && (
            <View style={styles.brandContainer}>
              <View
                style={[
                  styles.brandLeft,
                  {
                    alignItems: isMobile ? "flex-start" : "center",
                  },
                ]}
              >
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logo as ImageStyle}
                />

                <View>
                  <Text
                    style={[
                      styles.title,
                      {
                        fontSize: isMobile ? 18 : 26,
                      },
                    ]}
                  >
                    Network <Text style={styles.devText}>Dev</Text>
                  </Text>

                  <Text
                    style={[
                      styles.subtitle,
                      {
                        maxWidth: isMobile ? width - 140 : 420,
                      },
                    ]}
                  >
                    Encontre devs com interesses em comum
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* BLUETOOTH */}

          {!isSearching && (
            <View style={styles.bluetoothStatus}>
              <View style={styles.bluetoothStatusLeft}>
                <View style={styles.bluetoothDot} />

                <Text style={styles.bluetoothMiniText}>
                  Bluetooth conectado
                </Text>
              </View>

              <Text style={styles.bluetoothMiniDevice}>ESP32 ativo</Text>
            </View>
          )}

          {/* BOTÃO INICIAL */}

          {!isSearching && !hasSearched && (
            <View style={styles.initialContainer}>
              <TouchableOpacity
                style={[
                  styles.searchButton,
                  {
                    width: isMobile ? "100%" : "auto",
                    maxWidth: 420,
                    paddingHorizontal: isMobile ? 18 : 30,
                  },
                ]}
                onPress={handleSearchDevs}
              >
                <Ionicons
                  name="search-outline"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 10 }}
                />

                <Text style={styles.searchButtonText}>Procurar Devs</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* RADAR */}

          {isSearching && (
            <View style={styles.searchingContainer}>
              <Text style={styles.searchingTitle}>
                Buscando devs próximos...
              </Text>

              <Text style={styles.searchingSubtitle}>
                Escaneando dispositivos BLE próximos
              </Text>

              <View style={styles.radarContainer}>
                <View style={styles.radarGlow} />

                <View style={styles.circleOne} />

                <View style={styles.circleTwo} />

                <View style={styles.circleThree} />

                <Animated.View
                  style={[
                    styles.beamContainer,
                    {
                      transform: [{ rotate }],
                    },
                  ]}
                >
                  <View style={styles.beam} />
                </Animated.View>

                <Animated.View
                  style={[
                    styles.centerDot,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />

                <View style={styles.dotOne} />

                <View style={styles.dotTwo} />

                <View style={styles.dotThree} />
              </View>

              {foundCount > 0 && (
                <Text style={styles.foundText}>
                  +{foundCount} desenvolvedor(es) encontrado(s)
                </Text>
              )}

              <Text style={styles.searchingInfo}>
                Escaneando conexões BLE...
              </Text>
            </View>
          )}

          {/* DEVS */}

          {hasSearched && !isSearching && (
            <Animated.View
              style={{
                flex: 1,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                ],
              }}
            >
              <View
                style={[
                  styles.sectionHeader,
                  {
                    flexDirection: width < 500 ? "column" : "row",
                    alignItems: width < 500 ? "flex-start" : "center",
                    gap: width < 500 ? 10 : 0,
                  },
                ]}
              >
                <View style={styles.sectionLeft}>
                  <Ionicons
                    name="people-outline"
                    size={22}
                    color="#3B82F6"
                    style={styles.peopleIcon}
                  />

                  <Text style={styles.sectionTitle}>
                    Desenvolvedores detectados
                  </Text>
                </View>

                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {developers.length} próximos
                  </Text>
                </View>
              </View>

              <FlatList
                data={developers}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                numColumns={
                  isMobile
                    ? 1
                    : width < 1400
                    ? 2
                    : 2
                }
                columnWrapperStyle={
                  !isMobile
                    ? {
                        gap: 18,
                        justifyContent: "flex-start",
                        marginBottom: 18,
                      }
                    : undefined
                }
                contentContainerStyle={{
                  paddingBottom: isMobile ? 180 : 120,
                }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.92}
                    style={[
                      styles.card,
                      isDesktop && styles.cardDesktop,
                      {
                        padding: width < 380 ? 12 : 16,
                        flexDirection: width < 430 ? "column" : "row",
                        alignItems: width < 430 ? "center" : "flex-start",
                      }
                    ]}
                    onPress={() => navigation.navigate("Connection")}
                  >
                    <View
                      style={[
                        styles.cardLeft,
                        {
                          marginRight: width < 430 ? 0 : 16,
                          marginBottom: width < 430 ? 12 : 0,
                        },
                      ]}
                    > 
                      <Image
                        source={{ uri: item.image }}
                        style={styles.avatar as ImageStyle}
                      />

                      <View style={styles.onlineIndicator} />
                    </View>

                    <View
                      style={[
                        styles.cardContent,
                        {
                          alignItems: width < 430 ? "center" : "flex-start",
                          marginTop: width < 430 ? 14 : 0,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.cardHeader,
                          {
                            width: "100%",
                            flexDirection: width < 430 ? "column" : "row",
                            alignItems: width < 430 ? "center" : "flex-start",
                            gap: width < 430 ? 10 : 0,
                          },
                        ]}
                     >
                        <View>
                          <Text
                            style={[
                              styles.name,
                              {
                                fontSize: width < 380 ? 16 : 18,
                              }
                            ]}
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>

                          <Text
                            style={[
                              styles.stack,
                              {
                                fontSize: width < 380 ? 13 : 15,
                              }
                            ]}
                            numberOfLines={1}
                          >
                            {item.stack}
                          </Text>
                        </View>

                        <View style={styles.matchBadge}>
                          <Text style={styles.matchText}>{item.match}</Text>
                        </View>
                      </View>

                      <Text style={styles.distance}>📍 {item.distance}</Text>

                      <TouchableOpacity
                        style={styles.connectButton}
                        onPress={() => navigation.navigate("Connection")}
                      >
                        <Text style={styles.connectText}>Conectar</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />

              <TouchableOpacity
                style={[
                  styles.searchAgainButton,
                  {
                    width: isMobile ? "100%" : "auto",
                    alignSelf: isMobile ? "center" : "flex-start",
                  },
                ]}
                onPress={handleSearchDevs}
              >
                <Ionicons
                  name="refresh-outline"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />

                <Text style={styles.searchAgainText}>Buscar Novamente</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
  },

  topContainer: {
    marginTop: 55,
    marginBottom: 26,
    gap: 18,
  },

  topHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },

  greeting: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 18,
  },

  welcome: {
    color: "#A7B1CB",
    fontSize: 16,
    marginTop: 4,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 10,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",

    backgroundColor: "rgba(255,255,255,0.03)",
  },

  logoutIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    marginRight: 8,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  brandLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  logo: {
    width: 82,
    height: 82,

    resizeMode: "contain",

    marginRight: -18,
    marginLeft: -18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  devText: {
    color: "#3B82F6",
  },

  subtitle: {
    color: "#AAB4CF",
    marginTop: 4,
    fontSize: 12,
    maxWidth: 220,
  },

  profileImage: {
    width: 60,
    height: 60,

    borderRadius: 31,

    borderWidth: 2,
    borderColor: "#3B82F6",
  },

  onlineProfile: {
    position: "absolute",
    bottom: 3,
    right: 0,

    width: 18,
    height: 18,
    borderRadius: 9,

    backgroundColor: "#00FF88",

    borderWidth: 2,
    borderColor: "#020B1D",
  },

  bluetoothStatus: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.05)",

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 16,

    marginTop: -10,
    marginBottom: 18,
  },

  bluetoothStatusLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  bluetoothDot: {
    width: 10,
    height: 10,

    borderRadius: 99,

    backgroundColor: "#00FF88",

    marginRight: 10,
  },

  bluetoothMiniText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  bluetoothMiniDevice: {
    color: "#7C8BA1",
    fontSize: 13,
  },

  initialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
  },

  searchButton: {
    backgroundColor: "#2563EB",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
    paddingVertical: 18,

    borderRadius: 18,

    shadowColor: "#2563EB",
    shadowOpacity: 0.45,
    shadowRadius: 18,

    elevation: 10,
  },

  searchButtonText: {
    color: "#fff",

    fontWeight: "bold",
    fontSize: 16,
  },

  searchingContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    paddingBottom: 80,
  },

  searchingTitle: {
    color: "#FFFFFF",

    fontSize: 20,
    fontWeight: "700",

    textAlign: "center",

    width: 240,

    lineHeight: 28,

    marginBottom: 12,
  },

  searchingSubtitle: {
    color: "#AAB4CF",

    fontSize: 15,

    textAlign: "center",

    marginBottom: 50,
  },

  searchingInfo: {
    color: "#6B7A99",

    fontSize: 14,

    textAlign: "center",

    lineHeight: 22,
  },

  radarContainer: {
    height: 300,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 22,

    width: "100%",
    overflow: "hidden",
  },

  radarGlow: {
    position: "absolute",

    width: 260,
    height: 260,

    borderRadius: 130,

    backgroundColor: "rgba(59,130,246,0.05)",

    shadowColor: "#2563EB",

    shadowOpacity: 0.45,

    shadowRadius: 40,

    elevation: 20,
  },

  beamContainer: {
    position: "absolute",
    width: 260,
    height: 260,
  },

  circleOne: {
    position: "absolute",

    width: 250,
    height: 250,

    borderRadius: 125,

    borderWidth: 1,

    borderColor: "rgba(59,130,246,0.20)",

    alignSelf: "center",
  },

  circleTwo: {
    position: "absolute",

    width: 180,
    height: 180,

    borderRadius: 90,

    borderWidth: 1,

    borderColor: "rgba(59,130,246,0.20)",
  },

  circleThree: {
    position: "absolute",

    width: 110,
    height: 110,

    borderRadius: 55,

    borderWidth: 1,

    borderColor: "rgba(59,130,246,0.20)",
  },

  beam: {
    width: 120,
    height: 120,

    backgroundColor: "rgba(59,130,246,0.06)",

    borderTopRightRadius: 120,
    position: "absolute",
    top: 0,
    left: 140,
  },

  centerDot: {
    width: 22,
    height: 22,

    borderRadius: 11,

    backgroundColor: "#3B82F6",
  },

  dotOne: {
    position: "absolute",

    top: 65,
    right: 72,

    width: 16,
    height: 16,

    borderRadius: 8,

    backgroundColor: "#00FF88",
  },

  dotTwo: {
    position: "absolute",

    left: 88,
    top: 135,

    width: 16,
    height: 16,

    borderRadius: 8,

    backgroundColor: "#3B82F6",
  },

  dotThree: {
    position: "absolute",

    left: 115,
    bottom: 72,

    width: 16,
    height: 16,

    borderRadius: 8,

    backgroundColor: "#00FF88",
  },

  foundText: {
    color: "#00FF88",

    fontSize: 16,

    fontWeight: "700",

    marginBottom: 18,

    textAlign: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 16,
    marginTop: 10,
  },

  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  peopleIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },

  badge: {
    backgroundColor: "rgba(59,130,246,0.12)",

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 16,

    marginLeft: 14,
  },

  badgeText: {
    color: "#3B82F6",
    fontWeight: "700",
    fontSize: 13,
  },

  card: {
    backgroundColor: "#09162D",
    borderRadius: 24,
    padding: 14,
    flexDirection: "row",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.12)",
  },

  cardDesktop: {
    flex: 1,
    minWidth: 320,
    maxWidth: 530,
  },

  cardLeft: {
    marginRight: 16,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  onlineIndicator: {
    position: "absolute",
    bottom: 60,
    right: 6,

    width: 14,
    height: 14,

    borderRadius: 7,

    backgroundColor: "#00FF88",

    borderWidth: 2,
    borderColor: "#09162D",
  },

  cardContent: {
    flex: 1,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  name: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  stack: {
    color: "#3B82F6",
    fontSize: 15,
    marginTop: 4,
  },

  matchBadge: {
    backgroundColor: "rgba(59,130,246,0.12)",

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    minWidth: 60,

    marginTop: 4,
  },

  matchText: {
    color: "#3B82F6",
    fontWeight: "700",
    fontSize: 14,
  },

  distance: {
    color: "#B5C0DA",
    fontSize: 14,
  },

  connectButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 14,
    alignItems: "center",
  },

  connectText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  searchAgainButton: {
    backgroundColor: "#1d4fd8fa",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 14,

    borderRadius: 16,

    marginTop: 6,
    marginBottom: 55,
  },

  searchAgainText: {
    color: "#FFFFFF",

    fontWeight: "bold",

    fontSize: 15,
  },
});

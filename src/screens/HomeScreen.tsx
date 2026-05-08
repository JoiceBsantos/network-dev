import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';

import { useEffect, useRef, useState } from 'react';
import { logout } from '../services/auth';
import { Ionicons } from '@expo/vector-icons';

const developers = [
  {
    id: '1',
    name: 'Ana Costa',
    stack: 'React Native',
    distance: '3 metros de distância',
    match: '92%',
    image: 'https://i.pravatar.cc/150?img=32',
  },

  {
    id: '2',
    name: 'Carlos Lima',
    stack: 'Java + Spring Boot',
    distance: '5 metros de distância',
    match: '85%',
    image: 'https://i.pravatar.cc/150?img=12',
  },

  {
    id: '3',
    name: 'Marina Souza',
    stack: 'UI/UX Design',
    distance: '2 metros de distância',
    match: '97%',
    image: 'https://i.pravatar.cc/150?img=45',
  },

  {
    id: '4',
    name: 'Pedro Henrique',
    stack: 'Node.js',
    distance: '7 metros de distância',
    match: '80%',
    image: 'https://i.pravatar.cc/150?img=60',
  },
];

export default function HomeScreen({ navigation }: any) {

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const [search, setSearch] = useState('');

  const filteredDevelopers = developers.filter((dev) =>
    dev.name.toLowerCase().includes(search.toLowerCase()) ||
    dev.stack.toLowerCase().includes(search.toLowerCase())
  );

  async function handleLogout() {
    await logout();
    navigation.replace('Login');
  }

  useEffect(() => {

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4500,
        useNativeDriver: true,
      })
    ).start();

  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

return (

  <SafeAreaView style={styles.container}>

    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="light-content"
    />

    {/* CONTEÚDO FIXO */}
    <View>

      {/* TOPO */}

      <View style={styles.topContainer}>

        <View>

          <Text style={styles.greeting}>
            Olá, Joice 👋
          </Text>

          <Text style={styles.welcome}>
            Que bom te ver por aqui!
          </Text>

        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >

          <Ionicons
            name="log-out-outline"
            style={styles.logoutIcon}
          />

          <Text style={styles.logoutText}>
            Sair
          </Text>

        </TouchableOpacity>

      </View>

      {/* BRAND */}

      <View style={styles.brandContainer}>

        <View style={styles.brandLeft}>

          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
          />

          <View>

            <Text style={styles.title}>
              Network <Text style={styles.devText}>Dev</Text>
            </Text>

            <Text
              style={styles.subtitle}
              numberOfLines={1}
            >
              Encontre devs com interesses em comum
            </Text>

          </View>

        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('MyProfile')}
        >

          <Image
            source={{
              uri: 'https://i.pravatar.cc/150?img=32',
            }}
            style={styles.profileImage}
          />

          <View style={styles.onlineProfile} />

        </TouchableOpacity>

      </View>

      {/* BLUETOOTH */}

      <View style={styles.bluetoothCard}>

        <View style={styles.bluetoothIconContainer}>

          <Ionicons
            name="bluetooth-outline"
            size={24}
            color="#00FF88"
          />

        </View>

        <View style={{ flex: 1 }}>

          <Text style={styles.bluetoothTitle}>
            Bluetooth conectado
          </Text>

          <Text style={styles.bluetoothText}>
            ESP32 ativo e procurando devs próximos
          </Text>

        </View>

        <Text style={styles.arrow}>
          ›
        </Text>

      </View>

      {/* RADAR */}

      <View style={styles.radarContainer}>

        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />
        <View style={styles.circleThree} />

        <Animated.View
          style={[
            styles.beam,
            {
              transform: [{ rotate }],
            },
          ]}
        />

        <View style={styles.centerDot} />

        <View style={styles.dotOne} />
        <View style={styles.dotTwo} />
        <View style={styles.dotThree} />

      </View>

      {/* TITULO */}

      <View style={styles.sectionHeader}>

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
            {filteredDevelopers.length} próximos
          </Text>

        </View>

      </View>

    </View>

    {/* LISTA ROLÁVEL */}
    <FlatList
      data={filteredDevelopers}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}

      contentContainerStyle={{
        paddingBottom: 120,
      }}

      renderItem={({ item }) => (

        <TouchableOpacity
          activeOpacity={0.92}
          style={styles.card}
        >

          <View style={styles.cardLeft}>

            <Image
              source={{ uri: item.image }}
              style={styles.avatar}
            />

            <View style={styles.onlineIndicator} />

          </View>

          <View style={styles.cardContent}>

            <View style={styles.cardHeader}>

              <View>

                <Text style={styles.name}>
                  {item.name}
                </Text>

                <Text style={styles.stack}>
                  {item.stack}
                </Text>

              </View>

              <View style={styles.matchBadge}>

                <Text style={styles.matchText}>
                  {item.match}
                </Text>

              </View>

            </View>

            <Text style={styles.distance}>
              📍 {item.distance}
            </Text>

            <TouchableOpacity style={styles.connectButton}
            onPress={() => navigation.navigate('Connection')}>

              <Text style={styles.connectText}>
                Conectar
              </Text>

            </TouchableOpacity>

          </View>

        </TouchableOpacity>
      )}
    />

  </SafeAreaView>
);
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#020B1D',
    paddingHorizontal: 22,
  },

  /* TOPO */

  topContainer: {
    marginTop: 52,
    marginBottom: 26,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },

  welcome: {
    color: '#A7B1CB',
    fontSize: 14,
    marginTop: 4,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 10,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',

    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  logoutIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 8,
  },

  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  /* BRAND */

  brandContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 18,
  },

  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  logo: {
    width: 135,
    height: 135,
    resizeMode: 'contain',

    marginRight: -40,
    marginLeft: -40,
    marginTop: -30,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  devText: {
    color: '#3B82F6',
  },

  subtitle: {
    color: '#AAB4CF',
    marginTop: 4,
    fontSize: 12,
    width: 260,
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 31,

    marginTop: -60,

    borderWidth: 2,
    borderColor: '#3B82F6',
  },

  onlineProfile: {
    position: 'absolute',
    bottom: 3,
    right: 0,

    width: 18,
    height: 18,
    borderRadius: 9,

    backgroundColor: '#00FF88',

    borderWidth: 2,
    borderColor: '#020B1D',
  },

  /* BLUETOOTH */

  bluetoothCard: {
    backgroundColor: '#09162D',

    borderRadius: 18,

    paddingVertical: 4,
    paddingHorizontal: 6,

    flexDirection: 'row',
    alignItems: 'center',

    marginTop: -20,

    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.15)',
  },

  bluetoothIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,

    backgroundColor: 'rgba(0,255,136,0.08)',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 14,
  },

  bluetoothIcon: {
    color: '#00FF88',
    fontSize: 24,
    fontWeight: 'bold',
  },

  bluetoothTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  bluetoothText: {
    color: '#AAB4CF',
    marginTop: 4,
    fontSize: 13,
  },

  arrow: {
    color: '#94A3B8',
    fontSize: 28,
  },

  /* RADAR */

  radarContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    width: '100%',
  },

  circleOne: {
    position: 'absolute',

    width: 250,
    height: 250,
    borderRadius: 125,

    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.20)',
    alignSelf: 'center',
  },

  circleTwo: {
    position: 'absolute',

    width: 180,
    height: 180,
    borderRadius: 90,

    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.20)',
  },

  circleThree: {
    position: 'absolute',

    width: 110,
    height: 110,
    borderRadius: 55,

    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.20)',
  },

  beam: {
    position: 'absolute',

    width: 140,
    height: 140,

    backgroundColor: 'rgba(59,130,246,0.15)',

    borderTopRightRadius: 140,
    left: '50%',
    top: '50%',
    marginLeft: 0,
    marginTop: -140,

    transformOrigin: 'bottom left',
  },

  centerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,

    backgroundColor: '#3B82F6',
  },

  dotOne: {
    position: 'absolute',

    top: 65,
    right: 72,

    width: 16,
    height: 16,
    borderRadius: 8,

    backgroundColor: '#00FF88',
  },

  dotTwo: {
    position: 'absolute',

    left: 88,
    top: 135,

    width: 16,
    height: 16,
    borderRadius: 8,

    backgroundColor: '#3B82F6',
  },

  dotThree: {
    position: 'absolute',

    left: 115,
    bottom: 72,

    width: 16,
    height: 16,
    borderRadius: 8,

    backgroundColor: '#00FF88',
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: 16,
    marginTop: -20,
  },

  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  peopleIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },

  badge: {
    backgroundColor: 'rgba(59,130,246,0.12)',

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 16,

    marginLeft: 14,
  },

  badgeText: {
    color: '#3B82F6',
    fontWeight: '700',
    fontSize: 13,
  },

  /* CARD */

  card: {
    backgroundColor: '#09162D',

    borderRadius: 24,

    padding: 18,

    flexDirection: 'row',

    marginBottom: 18,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },

  cardLeft: {
    marginRight: 16,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },

  onlineIndicator: {
    position: 'absolute',

    bottom: 60,
    right: 6,

    width: 18,
    height: 18,
    borderRadius: 8,

    backgroundColor: '#00FF88',

    borderWidth: 2,
    borderColor: '#09162D',
  },

  cardContent: {
    flex: 1,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  stack: {
    color: '#3B82F6',
    fontSize: 15,
    marginTop: 4,
  },

  matchBadge: {
    backgroundColor: 'rgba(59,130,246,0.12)',

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
    marginTop: 4,
  },

  matchText: {
    color: '#3B82F6',
    fontWeight: '700',
    fontSize: 14,
  },

  distance: {
    color: '#B5C0DA',
    fontSize: 14,
    marginTop: 10,
  },

  connectButton: {
    backgroundColor: '#2563EB',

    alignSelf: 'flex-end',

    paddingHorizontal: 24,
    paddingVertical: 12,

    borderRadius: 16,

    marginTop: 16,
  },

  connectText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

});
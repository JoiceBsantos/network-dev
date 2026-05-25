import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { api } from '../services/api';
import { getStoredUserId } from '../services/auth';


export default function ConnectionScreen({ navigation }: any) {
  const [showHandshake, setShowHandshake] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
  }, []);

  async function handleConnection() {
    setShowHandshake(true);
    
    try {
      const myId = await getStoredUserId();
      // Registra a proximidade no backend (MongoDB) conforme API 4.1
      await api.post('/proximity/detect', {
        originUserId: Number(myId),
        detectedUserId: 3, // ID do Carlos Lima (MOCK)
        rssi: -45,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.log("Erro ao registrar log de proximidade", e);
    }

    setTimeout(() => {
      setShowHandshake(false);

      Alert.alert(
        'Conexão enviada 🚀',
        'Sua conexão foi enviada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    }, 2200);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGlowTop} />

      <View style={{ flex : 1 }} />
      {/* BACK BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>

        {/* HEADER */}
        <Text style={styles.title}>Conexão Detectada</Text>
        <Text style={styles.subtitle}>Desenvolvedor próximo encontrado via BLE</Text>

        {/* CONNECTION AREA */}
        <View style={styles.connectionContainer}>
          {/* USER */}
          <View style={styles.userContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=32' }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Você</Text>
            <Text style={styles.stack}>React Native</Text>
          </View>

          {/* LINE */}
          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Animated.View
              style={[
                styles.connectionGlow,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
          </View>

          {/* DETECTED DEV */}
          <View style={styles.userContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Carlos Lima</Text>
            <Text style={styles.stack}>Java + Spring</Text>
          </View>
        </View>

        {/* MATCH */}
        <View style={styles.matchCard}>
          <Text style={styles.matchTitle}>Compatibilidade</Text>
          <Text style={styles.matchValue}>92%</Text>
          <Text style={styles.matchDescription}>
            Vocês possuem interesses e stacks compatíveis.
          </Text>
        </View>

        {/* BLE INFO */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>📍 Distância aproximada: 3 metros</Text>
          <Text style={styles.infoText}>📶 BLE detectado com sinal forte</Text>
        </View>

        {/* OBJECTIVE */}
        <View style={styles.objectiveCard}>
          <Text style={styles.objectiveTitle}>Objetivo Profissional</Text>
          <Text style={styles.objectiveText}>Buscando networking em mobile e projetos IoT.</Text>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.connectButton} onPress={handleConnection}>
          <Text style={styles.connectButtonText}>Enviar Conexão</Text>
        </TouchableOpacity>

        {/* SPACE BOTTOM */}
        <View style={{ height: 40 }} />

      <Modal visible={showHandshake} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.handshakeOverlay}>
          <View style={styles.handshakeGlow} />

          <LottieView
            source={require('../assets/handshake.json')}
            autoPlay
            loop
            style={styles.handshakeAnimation}
          />

          <Text style={styles.handshakeText}>Conectando desenvolvedores...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    overflow: 'hidden',
  },

  /* BACK */
  backButton: {
    marginBottom: 20,
  },

  backText: {
    color: '#4DA6FF',
    fontSize: 16,
  },

  /* HEADER */
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },

  subtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 22,
  },

  /* CONNECTION */
  connectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },

  userContainer: {
    alignItems: 'center',
    width: 110,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderColor: '#4DA6FF',
  },

  userName: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },

  stack: {
    color: '#4DA6FF',
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },

  /* LINE */
  lineContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  line: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(77,166,255,0.3)',
    borderRadius: 99,
  },

  connectionGlow: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4DA6FF',
    shadowColor: '#4DA6FF',
    shadowOpacity: 1,
    shadowRadius: 22,
    elevation: 12,
  },

  /* MATCH */
  matchCard: {
    backgroundColor: 'rgba(15,23,42,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 26,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },

  matchTitle: {
    color: '#CBD5E1',
    fontSize: 14,
  },

  matchValue: {
    color: '#4DA6FF',
    fontSize: 42,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
    width: '100%',
  },

  matchDescription: {
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
  },

  /* INFO */
  infoCard: {
    backgroundColor: 'rgba(15,23,42,0.65)',
    borderRadius: 18,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },

  infoText: {
    color: '#ddd',
    marginBottom: 8,
  },

  /* OBJECTIVE */
  objectiveCard: {
    backgroundColor: 'rgba(77,166,255,0.05)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(77,166,255,0.04)',
  },

  objectiveTitle: {
    color: '#4DA6FF',
    fontWeight: 'bold',
    marginBottom: 10,
  },

  objectiveText: {
    color: '#ddd',
    lineHeight: 22,
  },

  /* BUTTON */
  connectButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },

  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },


  handshakeOverlay: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2,6,23,0.92)',
    justifyContent: 'center',
    alignItems: 'center',

  },

  handshakeEmoji: {
    fontSize: 90,
  },

  handshakeText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 26,
  },
  handshakeGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 260,
    backgroundColor: 'rgba(59,130,246,0.12)',
  },

  handshakeAnimation: {
    width: 190,
    height: 190,
  },

  backgroundGlowTop: {
    position: 'absolute',
    top: -220,
    left: -140,
    width: 340,
    height: 340,
    borderRadius: 340,
    backgroundColor: 'rgba(37,99,235,0.16)',
  },

});
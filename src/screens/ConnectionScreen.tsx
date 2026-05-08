import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConnectionScreen({ navigation }: any) {

  function handleConnection() {

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

  }

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* BACK BUTTON */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >

          <Text style={styles.backText}>
            ← Voltar
          </Text>

        </TouchableOpacity>

        {/* HEADER */}
        <Text style={styles.title}>
          Conexão Detectada
        </Text>

        <Text style={styles.subtitle}>
          Desenvolvedor próximo encontrado via BLE
        </Text>

        {/* CONNECTION AREA */}
        <View style={styles.connectionContainer}>

          {/* USER */}
          <View style={styles.userContainer}>

            <Image
              source={{
                uri: 'https://i.pravatar.cc/150?img=32',
              }}
              style={styles.avatar}
            />

            <Text style={styles.userName}>
              Você
            </Text>

            <Text style={styles.stack}>
              React Native
            </Text>

          </View>

          {/* LINE */}
          <View style={styles.lineContainer}>

            <View style={styles.line} />

            <View style={styles.connectionGlow} />

          </View>

          {/* DETECTED DEV */}
          <View style={styles.userContainer}>

            <Image
              source={{
                uri: 'https://i.pravatar.cc/150?img=12',
              }}
              style={styles.avatar}
            />

            <Text style={styles.userName}>
              Carlos Lima
            </Text>

            <Text style={styles.stack}>
              Java + Spring
            </Text>

          </View>

        </View>

        {/* MATCH */}
        <View style={styles.matchCard}>

          <Text style={styles.matchTitle}>
            Compatibilidade
          </Text>

          <Text style={styles.matchValue}>
            92%
          </Text>

          <Text style={styles.matchDescription}>
            Vocês possuem interesses e stacks compatíveis.
          </Text>

        </View>

        {/* BLE INFO */}
        <View style={styles.infoCard}>

          <Text style={styles.infoText}>
            📍 Distância aproximada: 3 metros
          </Text>

          <Text style={styles.infoText}>
            📶 BLE detectado com sinal forte
          </Text>

        </View>

        {/* OBJECTIVE */}
        <View style={styles.objectiveCard}>

          <Text style={styles.objectiveTitle}>
            Objetivo Profissional
          </Text>

          <Text style={styles.objectiveText}>
            Buscando networking em mobile e projetos IoT.
          </Text>

        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.connectButton}
          onPress={handleConnection}
        >

          <Text style={styles.connectButtonText}>
            Enviar Conexão
          </Text>

        </TouchableOpacity>

        {/* SPACE BOTTOM */}
        <View style={{ height: 40 }} />

      </ScrollView>

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#071120',
    paddingTop: 20,
    paddingHorizontal: 20,
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },

  /* CONNECTION */

  connectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },

  userContainer: {
    alignItems: 'center',
    width: 110,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
    height: 2,
    backgroundColor: 'rgba(77,166,255,0.3)',
  },

  connectionGlow: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4DA6FF',

    shadowColor: '#4DA6FF',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },

  /* MATCH */

  matchCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  matchTitle: {
    color: '#aaa',
    fontSize: 14,
  },

  matchValue: {
    color: '#4DA6FF',
    fontSize: 52,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  matchDescription: {
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 22,
  },

  /* INFO */

  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  infoText: {
    color: '#ddd',
    marginBottom: 8,
  },

  /* OBJECTIVE */

  objectiveCard: {
    backgroundColor: 'rgba(77,166,255,0.08)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 30,

    borderWidth: 1,
    borderColor: 'rgba(77,166,255,0.15)',
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
    backgroundColor: '#2979FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',

    shadowColor: '#2979FF',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },

  connectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
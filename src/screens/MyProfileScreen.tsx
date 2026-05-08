import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyProfileScreen({ navigation }: any) {

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
          Meu Perfil
        </Text>

        <Text style={styles.subtitle}>
          Configure sua identidade profissional
        </Text>

        {/* AVATAR */}
        <View style={styles.avatarContainer}>

          <Image
            source={{
              uri: 'https://i.pravatar.cc/300?img=32',
            }}
            style={styles.avatar}
          />

          <TouchableOpacity style={styles.editPhotoButton}>
            <Text style={styles.editPhotoText}>
              Alterar foto
            </Text>
          </TouchableOpacity>

        </View>

        {/* NAME */}
        <View style={styles.card}>

          <Text style={styles.label}>
            Nome
          </Text>

          <TextInput
            placeholder="Seu nome"
            placeholderTextColor="#777"
            style={styles.input}
            value="Joice Barbosa"
          />

        </View>

        {/* POSITION */}
        <View style={styles.card}>

          <Text style={styles.label}>
            Cargo
          </Text>

          <TextInput
            placeholder="Seu cargo"
            placeholderTextColor="#777"
            style={styles.input}
            value="Desenvolvedora Mobile"
          />

        </View>

        {/* STACK */}
        <View style={styles.card}>

          <Text style={styles.label}>
            Stack
          </Text>

          <TextInput
            placeholder="Tecnologias"
            placeholderTextColor="#777"
            style={styles.input}
            value="React Native • TypeScript • Java"
          />

        </View>

        {/* OBJECTIVE */}
        <View style={styles.card}>

          <Text style={styles.label}>
            O que você procura?
          </Text>

          <TextInput
            placeholder="Networking, vagas, projetos..."
            placeholderTextColor="#777"
            style={styles.textArea}
            multiline
            value="Buscando networking e oportunidades em mobile e IoT."
          />

        </View>

        {/* BIO */}
        <View style={styles.card}>

          <Text style={styles.label}>
            Bio
          </Text>

          <TextInput
            placeholder="Fale sobre você"
            placeholderTextColor="#777"
            style={styles.textArea}
            multiline
            value="Apaixonada por tecnologia, desenvolvimento mobile e soluções IoT."
          />

        </View>

        {/* BLE STATUS */}
        <View style={styles.bleCard}>

          <Text style={styles.bleTitle}>
            Status BLE
          </Text>

          <View style={styles.bleRow}>

            <View style={styles.greenDot} />

            <Text style={styles.bleText}>
              ESP32 conectado
            </Text>

          </View>

        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.saveButton}>

          <Text style={styles.saveButtonText}>
            Salvar Perfil
          </Text>

        </TouchableOpacity>

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
    marginBottom: 30,
  },

  /* AVATAR */

  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4DA6FF',
  },

  editPhotoButton: {
    marginTop: 15,
  },

  editPhotoText: {
    color: '#4DA6FF',
    fontWeight: 'bold',
  },

  /* CARD */

  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  label: {
    color: '#4DA6FF',
    marginBottom: 10,
    fontWeight: 'bold',
  },

  input: {
    color: '#fff',
    fontSize: 15,
  },

  textArea: {
    color: '#fff',
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  /* BLE */

  bleCard: {
    backgroundColor: 'rgba(77,166,255,0.08)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 30,

    borderWidth: 1,
    borderColor: 'rgba(77,166,255,0.15)',
  },

  bleTitle: {
    color: '#4DA6FF',
    fontWeight: 'bold',
    marginBottom: 15,
  },

  bleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF88',
    marginRight: 10,
  },

  bleText: {
    color: '#fff',
  },

  /* BUTTON */

  saveButton: {
    backgroundColor: '#2979FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',

    shadowColor: '#2979FF',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
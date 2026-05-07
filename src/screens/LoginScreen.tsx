import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';

export default function LoginScreen({ navigation }: any) {
  return (
    <ImageBackground
      source={require('../assets/map.png')}
      style={styles.background}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>

            <View style={styles.titleRow}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
              />

              <View style={styles.textContainer}>
                <Text style={styles.title}>
                  Network <Text style={styles.devText}>Dev</Text>
                </Text>

                <Text style={styles.subtitle}>
                  Conecte-se com devs próximos a você
                </Text>
              </View>
            </View>

          </View>

          {/* CARD */}
          <View style={styles.card}>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#bbb"
              style={styles.input}
            />

            <TextInput
              placeholder="Senha"
              placeholderTextColor="#bbb"
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Text style={styles.or}>ou</Text>

            <TouchableOpacity style={styles.googleButton}>
              <Text style={styles.googleText}>Entrar com Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('CreateProfile')}>
              <Text style={styles.link}>Criar conta</Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  image: {
    resizeMode: 'cover',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5,10,25,0.9)',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30, 
  },

  /* HEADER */
  header: {
    marginBottom: 35, 
    width: '100%',
    alignItems: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  logo: {
    width: 110,          
    height: 110,
    resizeMode: 'contain',
    marginRight: -35,   
    marginTop: -30,     
  },

  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: -2,
  },

  devText: {
    color: '#4DA6FF',
  },

  subtitle: {
    color: '#aaa',
    fontSize: 12,       
    marginTop: 3,
    textAlign: 'center',
    maxWidth: 200,
    lineHeight: 16,
    opacity: 0.9,
  },

  /* CARD */
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',

    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    color: '#fff',

    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.15)',
  },

  button: {
    backgroundColor: '#2979FF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',

    shadowColor: '#2979FF', 
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#aaa',
  },

  googleButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  googleText: {
    color: '#fff',
  },

  link: {
    textAlign: 'center',
    marginTop: 12,
    color: '#4DA6FF',
  },
});
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Alert,
} from 'react-native';

import { useEffect, useRef, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';

import { register } from '../services/auth';

import { createUser } from '../services/userService';



export default function CreateProfileScreen({ navigation }: any) {

  const translateY = useRef(new Animated.Value(300)).current;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    stack: '',
    role: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  // VALIDAÇÃO
  function validate() {

    let newErrors: any = {};

    if (!form.name) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!form.email) {
      newErrors.email = 'Email é obrigatório';
    }

    if (!form.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (form.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // CADASTRO FIREBASE
  async function handleSubmit() {

    if (!validate()) return;

    try {

      const user = await register(
        form.email,
        form.password
      );

      await createUser({
        name: form.name,
        bio: form.bio,
        stack: form.stack,
        position: form.role,
      });

      console.log('Usuário criado:', user.email);

      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso!'
      );

      navigation.navigate('Home');

    } catch (error: any) {

      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível criar a conta'
      );
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

          <Animated.View
            style={[
              styles.card,
              { transform: [{ translateY }] }
            ]}
          >

            <View style={styles.handle} />

            <Text style={styles.title}>Crie seu perfil</Text>

            <Text style={styles.subtitle}>
              Complete seu perfil para começar
            </Text>

            {/* NOME */}
            <View style={styles.inputBox}>
              <Ionicons
                name="person-outline"
                size={18}
                color="#888"
              />

              <TextInput
                placeholder="Nome completo"
                style={styles.input}
                value={form.name}
                onChangeText={(text) =>
                  setForm({ ...form, name: text })
                }
              />
            </View>

            {errors.name && (
              <Text style={styles.error}>
                {errors.name}
              </Text>
            )}

            {/* EMAIL */}
            <View style={styles.inputBox}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#888"
              />

              <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) =>
                  setForm({ ...form, email: text })
                }
              />
            </View>

            {errors.email && (
              <Text style={styles.error}>
                {errors.email}
              </Text>
            )}

            {/* SENHA */}
            <View style={styles.inputBox}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#888"
              />

              <TextInput
                placeholder="Senha"
                secureTextEntry
                style={styles.input}
                value={form.password}
                onChangeText={(text) =>
                  setForm({ ...form, password: text })
                }
              />
            </View>

            {errors.password && (
              <Text style={styles.error}>
                {errors.password}
              </Text>
            )}

            {/* BIO */}
            <View style={styles.inputBox}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#888"
              />

              <TextInput
                placeholder="Bio"
                style={styles.input}
                value={form.bio}
                onChangeText={(text) =>
                  setForm({ ...form, bio: text })
                }
              />
            </View>

            {/* STACK */}
            <View style={styles.inputBox}>
              <Ionicons
                name="code-slash-outline"
                size={18}
                color="#888"
              />

              <TextInput
                placeholder="Stack (React, Node...)"
                style={styles.input}
                value={form.stack}
                onChangeText={(text) =>
                  setForm({ ...form, stack: text })
                }
              />
            </View>

            {/* CARGO */}
            <View style={styles.inputBox}>
              <Ionicons
                name="briefcase-outline"
                size={18}
                color="#888"
              />

              <TextInput
                placeholder="Cargo / Função"
                style={styles.input}
                value={form.role}
                onChangeText={(text) =>
                  setForm({ ...form, role: text })
                }
              />
            </View>

            {/* INFO */}
            <View style={styles.infoBox}>
              <Ionicons
                name="sparkles-outline"
                size={16}
                color="#4A6CF7"
              />

              <Text style={styles.infoText}>
                Usamos sua stack para sugerir devs próximos a você
              </Text>
            </View>

            {/* BOTÃO */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                Entrar na rede
              </Text>
            </TouchableOpacity>

            {/* BLUETOOTH */}
            <View style={styles.bluetooth}>
              <Ionicons
                name="bluetooth-outline"
                size={16}
                color="#666"
              />

              <Text style={styles.footer}>
                Ative o Bluetooth para encontrar devs ao seu redor
              </Text>
            </View>

            {/* CANCELAR */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.close}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </Animated.View>

        </KeyboardAvoidingView>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 68,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },

  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 15,
    maxHeight: '100%',
  },

  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#666',
    marginBottom: 15,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 3,
  },

  input: {
    flex: 1,
    padding: 10,
  },

  error: {
    color: 'red',
    fontSize: 11,
    marginBottom: 5,
    marginLeft: 5,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF3FF',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },

  infoText: {
    color: '#4A6CF7',
    fontSize: 12,
    marginLeft: 5,
    flex: 1,
  },

  button: {
    backgroundColor: '#3B5BDB',
    padding: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  bluetooth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  footer: {
    fontSize: 11,
    color: '#666',
    marginLeft: 5,
    textAlign: 'center',
  },

  close: {
    textAlign: 'center',
    marginTop: 12,
    color: '#3B5BDB',
  },
});
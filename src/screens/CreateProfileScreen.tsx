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
  ScrollView,
} from 'react-native';

import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { register } from '../services/auth';

export default function CreateProfileScreen({ navigation }: any) {
  const translateY = useRef(new Animated.Value(300)).current;
  const [showStacks, setShowStacks] = useState(false);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);

  const stackOptions = [
    {
      category: 'Front-End',
      items: ['React', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript'],
    },
    {
      category: 'Back-End',
      items: ['Java', 'Spring Boot', 'C#', '.NET', 'Node.js', 'Python', 'Django', 'FastAPI', 'PHP'],
    },
    {
      category: 'Mobile',
      items: ['Flutter', 'React Native', 'Kotlin', 'Swift'],
    },
    {
      category: 'Cloud & DevOps',
      items: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
    },
    {
      category: 'Banco de Dados',
      items: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL'],
    },
    {
      category: 'Dados & Inteligência Artificial',
      items: ['Python', 'Power BI', 'AI/ML', 'Data Science'],
    },
    {
      category: 'UX/UI Design',
      items: ['Figma', 'Photoshop', 'UX/UI'],
    },
    {
      category: 'Cyber Security',
      items: ['Cyber Security'],
    },
    {
      category: 'Full Stack',
      items: ['Full Stack'],
    },
  ];

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    stack: '',
    position: '', // Alinhado com a documentação (position em vez de role)
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  function validate() {
    let newErrors: any = {};
    if (!form.name) newErrors.name = 'Nome é obrigatório';
    if (!form.email) newErrors.email = 'Email é obrigatório';
    if (!form.password) newErrors.password = 'Senha é obrigatória';
    if (form.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      // Envia o objeto completo conforme exigido pelo /api/users/register
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        bio: form.bio,
        stack: form.stack,
        position: form.position,
        uuidBluetooth: `DEV_${Math.floor(Math.random() * 1000)}` // Exemplo de UUID
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      navigation.navigate('Home');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível criar a conta');
    }
  }

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setShowStacks(false);
        }}
      >
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.card,
            { transform: [{ translateY }] }
          ]}
        >
          {/* ADICIONADO AQUI O SCROLLVIEW QUE FALTAVA NO TOPO */}
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.handle} />

            <Text style={styles.title}>Crie seu perfil</Text>
            <Text style={styles.subtitle}>Complete seu perfil para começar</Text>

            {/* NOME */}
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={18} color="#888" />
              <TextInput
                placeholder="Nome completo"
                style={styles.input}
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />
            </View>
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            {/* EMAIL */}
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color="#888" />
              <TextInput
                placeholder="Email"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(text) => setForm({ ...form, email: text })}
              />
            </View>
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {/* SENHA */}
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color="#888" />
              <TextInput
                placeholder="Senha"
                secureTextEntry
                style={styles.input}
                value={form.password}
                onChangeText={(text) => setForm({ ...form, password: text })}
              />
            </View>
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            {/* BIO */}
            <View style={styles.inputBox}>
              <Ionicons name="document-text-outline" size={18} color="#888" />
              <TextInput
                placeholder="Bio"
                style={styles.input}
                value={form.bio}
                onChangeText={(text) => setForm({ ...form, bio: text })}
              />
            </View>

            {/* STACK SELECT */}
            <View>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setShowStacks(!showStacks)}
                activeOpacity={0.8}
              >
                <Ionicons name="code-slash-outline" size={18} color="#888" />
                <Text
                  style={{
                    flex: 1,
                    padding: 10,
                    color: selectedStacks.length > 0 ? '#111' : '#999',
                  }}
                  numberOfLines={1}
                >
                  {selectedStacks.length > 0 ? selectedStacks.join(', ') : 'Selecionar stacks'}
                </Text>
                <Ionicons
                  name={showStacks ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={18}
                  color="#666"
                />
              </TouchableOpacity>

              {showStacks && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                    {stackOptions.map((group) => (
                      <View key={group.category}>
                        <Text style={styles.categoryTitle}>{group.category}</Text>
                        {group.items.map((item) => {
                          const isSelected = selectedStacks.includes(item);
                          return (
                            <TouchableOpacity
                              key={item}
                              style={styles.option}
                              onPress={() => {
                                let updatedStacks = [];
                                if (isSelected) {
                                  updatedStacks = selectedStacks.filter(stack => stack !== item);
                                } else {
                                  updatedStacks = [...selectedStacks, item];
                                }
                                setSelectedStacks(updatedStacks);
                                setForm({ ...form, stack: updatedStacks.join(', ') });
                              }}
                            >
                              <Text
                                style={{
                                  color: isSelected ? '#3B5BDB' : '#111',
                                  fontWeight: isSelected ? 'bold' : 'normal',
                                }}
                              >
                                {item}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* CARGO */}
            <View style={styles.inputBox}>
              <Ionicons name="briefcase-outline" size={18} color="#888" />
              <TextInput
                placeholder="Cargo / Posição"
                style={styles.input}
                value={form.position}
                onChangeText={(text) => setForm({ ...form, position: text })}
              />
            </View>

            {/* INFO */}
            <View style={styles.infoBox}>
              <Ionicons name="sparkles-outline" size={16} color="#4A6CF7" />
              <Text style={styles.infoText}>
                Usamos sua stack para sugerir devs próximos a você
              </Text>
            </View>

            {/* BOTÃO */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Entrar na rede</Text>
            </TouchableOpacity>

            {/* BLUETOOTH */}
            <View style={styles.bluetooth}>
              <Ionicons name="bluetooth-outline" size={16} color="#666" />
              <Text style={styles.footer}>
                Ative o Bluetooth para encontrar devs ao seu redor
              </Text>
            </View>

            {/* CANCELAR */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.close}>Cancelar</Text>
            </TouchableOpacity>

          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 10, 25, 0.8)',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 5,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  scrollContent: {
    paddingBottom: 20,
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
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 5,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B5BDB',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: '#F8FAFF',
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
    marginBottom: 28,
    color: '#3B5BDB',
  },
});
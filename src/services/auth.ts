import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = '@network_dev_UserId';

export async function register(userData: any) {
  // O endpoint correto é /users/register
  const response = await api.post('/users/register', userData);
  if (response.data.userId) {
    await saveUserId(response.data.userId.toString());
  }
  return response.data;
}

export async function login(email: string, password: string) {
  // LÓGICA DE TESTE LOCAL (SEM API)
  if (email === 'teste@email.com' && password === '123456') {
    const mockUser = {
      userId: 999,
      name: "Usuário Teste",
      email: "teste@email.com",
      message: "Login de teste realizado"
    };
    await saveUserId(mockUser.userId.toString());
    return mockUser;
  }

  // O endpoint correto é /users/login
  const response = await api.post('/users/login', { email, password });
  if (response.data.userId) {
    await saveUserId(response.data.userId.toString());
  }
  return response.data;
}

async function saveUserId(id: string) {
  await AsyncStorage.setItem(USER_ID_KEY, id);
}

export async function logout() {
  await AsyncStorage.removeItem(USER_ID_KEY);
}

export async function getStoredUserId() {
  return await AsyncStorage.getItem(USER_ID_KEY);
}
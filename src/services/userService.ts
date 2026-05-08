import { api } from './api';

export async function createUser(data: {
  name: string;
  bio: string;
  stack: string;
  position: string;
}) {

  const response = await api.post('/users', data);

  return response.data;
}

export async function getMe() {

  const response = await api.get('/users/me');

  return response.data;
}

export async function updateUser(
  id: number,
  data: {
    name: string;
    bio: string;
    stack: string;
    position: string;
  }
) {

  const response = await api.put(`/users/${id}`, data);

  return response.data;
}
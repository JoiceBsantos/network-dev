import { api } from './api';

// Substituído por getUser com ID específico conforme README2.MD
export async function getUser(id: number) {
  const response = await api.get(`/users/${id}`);

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
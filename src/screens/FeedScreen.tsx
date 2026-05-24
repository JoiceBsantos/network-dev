import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  Modal,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../services/api';
import { getStoredUserId } from '../services/auth';

const MOCK_PHOTOS = [
  { id: '1', url: 'https://picsum.photos/id/1/400/400' },
  { id: '2', url: 'https://picsum.photos/id/2/400/400' },
  { id: '3', url: 'https://picsum.photos/id/3/400/400' },
  { id: '4', url: 'https://picsum.photos/id/4/400/400' },
  { id: '5', url: 'https://picsum.photos/id/5/400/400' },
  { id: '6', url: 'https://picsum.photos/id/6/400/400' },
];

export default function FeedScreen({ navigation }: any) {
  const { width } = useWindowDimensions();
  const [photos, setPhotos] = useState<any[]>(MOCK_PHOTOS);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts?page=0&size=50');
      // A API retorna um objeto Page do Spring (content[])
      if (response.data.content) {
        const formattedPosts = response.data.content.map((post: any) => ({
          id: post.id.toString(),
          url: post.imageUrl || 'https://via.placeholder.com/400',
          description: post.description
        }));
        setPhotos(formattedPosts);
      }
    } catch (error) {
      console.log("Erro ao buscar posts, mantendo mocks para teste local");
    }
  };

  // Define o tamanho da imagem para ser 1/3 da tela (grid)
  // No PC, limitamos a largura máxima para não distorcer
  const numColumns = width > 768 ? 4 : 3;
  const imageSize = (Math.min(width, 800)) / numColumns;

  const handleAddPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadPhoto(result.assets[0].uri);
    }
  };

  const uploadPhoto = async (uri: string) => {
    setLoading(true);
    try {
      const userId = await getStoredUserId();
      if (!userId) throw new Error("Usuário não identificado");

      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('description', 'Novo post via mobile');
      formData.append('image', {
        uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      } as any);

      await api.post('/posts/create-with-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert("Sucesso", "Foto postada!");
      fetchPosts();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível postar a foto.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Apagar Foto",
      "Deseja realmente remover esta foto?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Apagar", style: "destructive", onPress: () => {
          // Nota: O README2.MD não especifica endpoint de DELETE de post. 
          // Implementação local apenas para UI:
          setPhotos(prev => prev.filter(p => p.id !== selectedPostId));
          setSelectedImage(null);
        }}
      ]
    );
  };

  return (
    <LinearGradient colors={['#020B1D', '#07152B']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#4DA6FF" />
          </TouchableOpacity>
          
          <Image 
            source={require('../assets/logo.png')} 
            style={{ width: 40, height: 40, resizeMode: 'contain' }} 
          />

          <TouchableOpacity style={styles.postButton} onPress={handleAddPhoto} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#3B82F6" />
            ) : (
              <Ionicons name="add-circle" size={32} color="#3B82F6" />
            )}
          </TouchableOpacity>
        </View>

        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => {
                setSelectedImage(item.url);
                setSelectedPostId(item.id);
              }}
            >
              <Image
                source={{ uri: item.url }}
                style={{ width: imageSize, height: imageSize, margin: 1 }}
              />
            </TouchableOpacity>
          )}
        />

        {/* MODAL FULLSCREEN */}
        <Modal visible={!!selectedImage} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <TouchableOpacity 
              style={styles.closeModal} 
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close" size={35} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={28} color="#ff4d4d" />
            </TouchableOpacity>

            {selectedImage && (
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.fullImage} 
                resizeMode="contain" 
              />
            )}
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 800, // Centraliza e limita a largura no PC
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  listContent: {
    paddingBottom: 20,
  },
  postButton: {
    padding: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  closeModal: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 50,
    zIndex: 10,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
  },
});
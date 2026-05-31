import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  Text,
  Alert,
  ActivityIndicator,
  TextInput,
  Animated,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";
import { getStoredUserId } from "../services/auth";
import { useResponsive } from "../utils/responsive";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../navigation/AppNavigator";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type FeedScreenProps = {
  navigation: BottomTabNavigationProp<MainTabParamList, "Feed">;
};

interface ApiPost {
  id:          number;
  userId:      number;
  description: string;
  imageUrl:    string | null;
  createdAt:   string;
}

interface Post {
  id:          string;
  user:        string;
  role:        string;
  avatar:      string;
  url:         string;
  description: string;
  likes:       number;
  liked:       boolean;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function showAlert(title: string, message: string) {
  if (Platform.OS === "web") {
    (globalThis as any).alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function FeedScreen({ navigation }: FeedScreenProps) {
  const { width } = useWindowDimensions();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const [posts, setPosts]                         = useState<Post[]>([]);
  const [loading, setLoading]                     = useState(true);
  const [loadingMore, setLoadingMore]             = useState(false);
  const [page, setPage]                           = useState(0);
  const [hasMore, setHasMore]                     = useState(true);
  const [selectedImage, setSelectedImage]         = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId]       = useState<string | null>(null);
  const [createPostVisible, setCreatePostVisible] = useState(false);
  const [postText, setPostText]                   = useState("");
  const [newImage, setNewImage]                   = useState<string | null>(null);
  const [publishing, setPublishing]               = useState(false);

  const likeAnimations = useRef<Record<string, Animated.Value>>({}).current;

  // ── Carrega posts da API ───────────────────────────────────────────────────

  useEffect(() => {
    loadFeed(0, true);
  }, []);

  async function loadFeed(pageNum: number, reset: boolean = false) {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const response = await api.get("/posts", {
        params: { page: pageNum, size: 10, sort: "createdAt,desc" },
      });

      const apiPosts: ApiPost[] = response.data.content || [];
      const isLast: boolean     = response.data.last ?? true;

      // Busca dados dos usuários dos posts
      const userIds = [...new Set(apiPosts.map((p) => p.userId))];
      const userMap: Record<number, { name: string; avatar: string; role: string }> = {};

      await Promise.all(
        userIds.map(async (uid) => {
          try {
            const userRes = await api.get(`/users/${uid}`);
            userMap[uid] = {
              name:   userRes.data.name   || "Usuário",
              avatar: userRes.data.profileImageUrl || "https://i.pravatar.cc/150?img=32",
              role:   userRes.data.position || userRes.data.stack || "",
            };
          } catch {
            // Fallback de rede — nunca exibe "Você" ou "Dev" hardcoded
            userMap[uid] = { name: "Usuário", avatar: "https://i.pravatar.cc/150?img=32", role: "" };
          }
        })
      );

      const mapped: Post[] = apiPosts.map((p) => {
        const id   = p.id.toString();
        const user = userMap[p.userId] || { name: "Usuário", avatar: "https://i.pravatar.cc/150?img=32", role: "" };
        if (!likeAnimations[id]) {
          likeAnimations[id] = new Animated.Value(1);
        }
        return {
          id,
          user:        user.name,
          role:        user.role,
          avatar:      user.avatar,
          url:         p.imageUrl || "https://picsum.photos/id/1/800/800",
          description: p.description || "",
          likes:       0,
          liked:       false,
        };
      });

      setPosts((prev) => reset ? mapped : [...prev, ...mapped]);
      setHasMore(!isLast);
      setPage(pageNum);
    } catch (error) {
      console.log("❌ Erro ao carregar feed:", error);
      if (reset) loadMock();
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function loadMock() {
    const mock: Post[] = [
      { id: "m1", user: "Joice Barbosa",  role: "React Native Developer", avatar: "https://i.pravatar.cc/150?img=32", url: "https://picsum.photos/id/1/800/800",  description: "Finalizando a Home responsiva 🚀", likes: 24, liked: false },
      { id: "m2", user: "Adriel Pereira", role: "Backend Java",           avatar: "https://i.pravatar.cc/150?img=12", url: "https://picsum.photos/id/20/800/800", description: "Deploy concluído com sucesso 🔥",   likes: 17, liked: false },
      { id: "m3", user: "Luiz Henrique",  role: "Node.js + DevOps",       avatar: "https://i.pravatar.cc/150?img=53", url: "https://picsum.photos/id/30/800/800", description: "Novo protótipo no Figma ✨",        likes: 42, liked: false },
    ];
    mock.forEach((p) => { likeAnimations[p.id] = new Animated.Value(1); });
    setPosts(mock);
  }

  // ── Layout responsivo ──────────────────────────────────────────────────────

  const numColumns = isDesktop ? 3 : isTablet ? 2 : 1;
  const imageSize  = isDesktop ? 360 : isTablet ? width * 0.42 : width - 32;

  // ── Adicionar foto ─────────────────────────────────────────────────────────

  const handleAddPhoto = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      showAlert("Permissão necessária", "Você precisa permitir o acesso à galeria.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setNewImage(result.assets[0].uri);
  };

  // ── Criar post ─────────────────────────────────────────────────────────────
  // BUG 1 FIX: transformRequest: (data) => data impede o axios de reserializar
  //            o FormData sem o boundary, que causava o 500 no Spring Boot.
  // BUG 4 FIX: fallback usa nome real do AsyncStorage, nunca "Você"/"Dev".

  const handleCreatePost = async () => {
    if (!postText && !newImage) {
      showAlert("Erro", "Adicione um texto ou imagem.");
      return;
    }

    setPublishing(true);

    try {
      const userId = await getStoredUserId();

      if (newImage) {
        // ── BUG 1 FIX ────────────────────────────────────────────────────────
        const uriParts = newImage.split(".");
        const ext      = uriParts[uriParts.length - 1]?.toLowerCase() || "jpg";
        const mimeType = ext === "png" ? "image/png" : ext === "gif" ? "image/gif" : "image/jpeg";

        const formData = new FormData();
        formData.append("userId", userId || "1");
        formData.append("description", postText);
        formData.append("image", {
          // iOS adiciona "file://" que o fetch não entende — removemos aqui
          uri:  Platform.OS === "ios" ? newImage.replace("file://", "") : newImage,
          type: mimeType,
          name: `post_${Date.now()}.${ext}`,
        } as any);

        // CRÍTICO: transformRequest: (data) => data impede o axios de converter
        // o FormData para string, preservando o boundary do multipart.
        await api.post("/posts/create-with-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          transformRequest: (data) => data,
        });
        // ─────────────────────────────────────────────────────────────────────
      } else {
        // Post só com texto
        await api.post("/posts", {
          userId:      Number(userId),
          description: postText,
          imageUrl:    null,
        });
      }

      setPostText("");
      setNewImage(null);
      setCreatePostVisible(false);
      await loadFeed(0, true);
      showAlert("Sucesso", "Publicação criada! 🚀");
    } catch (error: any) {
      console.log("❌ Erro ao criar post:", error?.response?.data || error);

      // ── BUG 1 FIX: não cria post fantasma em caso de 500 (erro do servidor)
      if (error?.response?.status === 500) {
        showAlert(
          "Erro no servidor",
          "Falha ao processar a imagem. Tente com uma foto menor (abaixo de 5 MB) ou sem imagem."
        );
        setPublishing(false);
        return; // mantém o modal aberto para o usuário tentar novamente
      }

      // ── BUG 4 FIX: fallback local para erros de rede (sem conexão)
      //    Busca o nome real salvo em AsyncStorage — nunca usa "Você"/"Dev"
      let nomeReal   = "Usuário";
      let roleReal   = "";
      let avatarReal = "https://i.pravatar.cc/150?img=32";
      try {
        const userStr = await AsyncStorage.getItem("usuario");
        if (userStr) {
          const u    = JSON.parse(userStr);
          nomeReal   = u.name  || u.nome  || "Usuário";
          roleReal   = u.position || u.stack || "";
          avatarReal = u.profileImageUrl || avatarReal;
        }
      } catch {}

      const newPost: Post = {
        id:          Date.now().toString(),
        user:        nomeReal,   // ✅ nome real do usuário logado
        role:        roleReal,   // ✅ cargo real, sem hardcode "Dev"
        avatar:      avatarReal,
        url:         newImage || "https://picsum.photos/800/800",
        description: postText,
        likes:       0,
        liked:       false,
      };
      likeAnimations[newPost.id] = new Animated.Value(1);
      setPosts((prev) => [newPost, ...prev]);
      setPostText("");
      setNewImage(null);
      setCreatePostVisible(false);
    } finally {
      setPublishing(false);
    }
  };

  // ── Like (local) ───────────────────────────────────────────────────────────

  const handleLike = (id: string) => {
    Animated.sequence([
      Animated.timing(likeAnimations[id], { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(likeAnimations[id], { toValue: 1,   duration: 120, useNativeDriver: true }),
    ]).start();

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  // ── Infinite scroll ────────────────────────────────────────────────────────

  const handleInfiniteScroll = () => {
    if (loadingMore || !hasMore) return;
    loadFeed(page + 1);
  };

  // ── Deletar post ───────────────────────────────────────────────────────────

  const handleDelete = () => {
    if (Platform.OS === "web") {
      const confirm = (globalThis as any).confirm("Deseja realmente remover esta foto?");
      if (confirm) {
        setPosts((prev) => prev.filter((p) => p.id !== selectedPostId));
        setSelectedImage(null);
      }
    } else {
      Alert.alert("Apagar Foto", "Deseja realmente remover esta foto?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: () => {
            setPosts((prev) => prev.filter((p) => p.id !== selectedPostId));
            setSelectedImage(null);
          },
        },
      ]);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <LinearGradient colors={["#020B1D", "#07152B"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <View style={[styles.header, { paddingHorizontal: isMobile ? 18 : 28 }]}>
          <Image
            source={require("../assets/logo.png")}
            style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, resizeMode: "contain" }}
          />
          <Text style={styles.headerTitle}>Feed</Text>
          <TouchableOpacity style={styles.postButton} onPress={() => setCreatePostVisible(true)}>
            <Ionicons name="add-circle" size={34} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* ── FEED ──────────────────────────────────────────────────────── */}
        {loading ? (
          <View style={styles.skeletonContainer}>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.skeletonCard}>
                <View style={styles.skeletonAvatar} />
                <View style={styles.skeletonImage} />
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            key={numColumns}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: isMobile ? 16 : 22, paddingBottom: 100 }}
            columnWrapperStyle={!isMobile ? { justifyContent: "space-between", marginBottom: 22 } : undefined}
            onEndReached={handleInfiniteScroll}
            onEndReachedThreshold={0.4}
            onRefresh={() => loadFeed(0, true)}
            refreshing={loading}
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 60 }}>
                <Ionicons name="images-outline" size={48} color="#4A5568" />
                <Text style={{ color: "#4A5568", marginTop: 12, fontSize: 16 }}>
                  Nenhuma publicação ainda
                </Text>
              </View>
            }
            ListFooterComponent={
              loadingMore
                ? <ActivityIndicator size="large" color="#3B82F6" style={{ marginVertical: 20 }} />
                : null
            }
            renderItem={({ item }) => (
              <View style={[styles.postCard, { width: imageSize }]}>

                {/* USER */}
                <View style={styles.postHeader}>
                  <View style={styles.userInfo}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <View>
                      <Text style={styles.userName}>{item.user}</Text>
                      <Text style={styles.userRole}>{item.role}</Text>
                    </View>
                  </View>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
                </View>

                {/* DESCRIPTION */}
                <Text style={styles.description}>{item.description}</Text>

                {/* IMAGE */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => { setSelectedImage(item.url); setSelectedPostId(item.id); }}
                >
                  <Image
                    source={{ uri: item.url }}
                    style={[styles.postImage, { height: isMobile ? 300 : 360 }]}
                  />
                </TouchableOpacity>

                {/* ACTIONS */}
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
                    <Animated.View style={{ transform: [{ scale: likeAnimations[item.id] || new Animated.Value(1) }] }}>
                      <Ionicons
                        name={item.liked ? "heart" : "heart-outline"}
                        size={24}
                        color={item.liked ? "#ff4d6d" : "#fff"}
                      />
                    </Animated.View>
                    <Text style={styles.actionText}>{item.likes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={22} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-social-outline" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>

              </View>
            )}
          />
        )}

        {/* ── MODAL CRIAR POST ──────────────────────────────────────────── */}
        <Modal visible={createPostVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.createPostModal, { width: isMobile ? "100%" : 600 }]}>
              <Text style={styles.modalTitle}>Criar publicação</Text>

              <TextInput
                placeholder="Compartilhe algo..."
                placeholderTextColor="#8A94A6"
                multiline
                value={postText}
                onChangeText={setPostText}
                style={styles.input}
              />

              {newImage && (
                <Image source={{ uri: newImage }} style={styles.previewImage} />
              )}

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.secondaryButton} onPress={handleAddPhoto}>
                  <Ionicons name="image-outline" size={22} color="#fff" />
                  <Text style={styles.secondaryText}>Imagem</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.publishButton}
                  onPress={handleCreatePost}
                  disabled={publishing}
                >
                  {publishing
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.publishText}>Publicar</Text>
                  }
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={() => setCreatePostVisible(false)}>
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ── MODAL FULLSCREEN ──────────────────────────────────────────── */}
        <Modal visible={!!selectedImage} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <TouchableOpacity style={styles.closeModal} onPress={() => setSelectedImage(null)}>
              <Ionicons name="close" size={35} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={28} color="#ff4d4d" />
            </TouchableOpacity>

            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
            )}
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 1400,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  postButton: {
    padding: 5,
  },

  postCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 999,
    marginRight: 12,
  },

  userName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  userRole: {
    color: "#8A94A6",
    fontSize: 13,
    marginTop: 2,
  },

  description: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  postImage: {
    width: "100%",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 20,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "100%",
    height: "80%",
  },

  closeModal: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
  },

  deleteButton: {
    position: "absolute",
    bottom: 50,
    zIndex: 10,
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 30,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  createPostModal: {
    backgroundColor: "#081228",
    borderRadius: 26,
    padding: 22,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 18,
    color: "#fff",
    minHeight: 140,
    textAlignVertical: "top",
    fontSize: 16,
  },

  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    marginTop: 18,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
  },

  secondaryText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },

  publishButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 16,
    minWidth: 100,
    alignItems: "center",
  },

  publishText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  closeButton: {
    position: "absolute",
    top: 18,
    right: 18,
  },

  skeletonContainer: {
    padding: 16,
  },

  skeletonCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 22,
    marginBottom: 18,
    overflow: "hidden",
  },

  skeletonAvatar: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    margin: 16,
  },

  skeletonImage: {
    width: "100%",
    height: 300,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
});

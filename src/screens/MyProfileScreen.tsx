import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { api } from "../services/api";
import { getStoredUserId } from "../services/auth";
import { useResponsive } from "../utils/responsive";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "../navigation/AppNavigator";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type MyProfileScreenProps = {
  navigation: BottomTabNavigationProp<MainTabParamList, "MyProfile">;
};

interface Post {
  id:          string;
  url:         string;
  description: string;
  likes:       number;
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

export default function MyProfileScreen({ navigation }: MyProfileScreenProps) {
  const [isEditing, setIsEditing]       = useState(false);
  const [showStacks, setShowStacks]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const [userId, setUserId]             = useState<string | null>(null);
  const [name, setName]                 = useState("Joice Barbosa");
  const [position, setPosition]         = useState("Desenvolvedora Mobile");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [objective, setObjective]       = useState("Buscando networking e oportunidades em mobile e IoT.");
  const [bio, setBio]                   = useState("Apaixonada por tecnologia, desenvolvimento mobile e soluções IoT.");
  const [selectedStacks, setSelectedStacks] = useState<string[]>(["React Native", "TypeScript", "Java"]);
  const [selectedPost, setSelectedPost]   = useState<Post | null>(null);
  const [myPosts, setMyPosts]             = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts]   = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editDescription, setEditDescription] = useState("");

  const { isMobile, isDesktop, width } = useResponsive();

  // ─── Dados de stacks ────────────────────────────────────────────────────────

  const stackOptions = [
    { category: "Front-End",      items: ["React", "Angular", "Vue.js", "JavaScript", "TypeScript"] },
    { category: "Back-End",       items: ["Java", "Spring Boot", "C#", ".NET", "Node.js", "Python", "PHP"] },
    { category: "Mobile",         items: ["Flutter", "React Native", "Swift"] },
    { category: "Cloud & DevOps", items: ["AWS", "Docker", "Kubernetes"] },
    { category: "Banco de Dados", items: ["MongoDB", "SQL", "PostgreSQL"] },
    { category: "UX/UI",          items: ["Figma", "Photoshop"] },
  ];

  const stackIcons: Record<string, any> = {
    "React":        require("../assets/stacks/react.png"),
    "React Native": require("../assets/stacks/reactnative.png"),
    "Angular":      require("../assets/stacks/angular.png"),
    "Vue.js":       require("../assets/stacks/vuejs.png"),
    "JavaScript":   require("../assets/stacks/javascript.png"),
    "TypeScript":   require("../assets/stacks/typescript.png"),
    "Java":         require("../assets/stacks/java.png"),
    "Spring Boot":  require("../assets/stacks/springboot.png"),
    "C#":           require("../assets/stacks/csharp.png"),
    ".NET":         require("../assets/stacks/dot-net.png"),
    "Node.js":      require("../assets/stacks/nodejs.png"),
    "Python":       require("../assets/stacks/python.png"),
    "PHP":          require("../assets/stacks/php.png"),
    "Flutter":      require("../assets/stacks/flutter.png"),
    "Swift":        require("../assets/stacks/swift.png"),
    "AWS":          require("../assets/stacks/aws.png"),
    "Docker":       require("../assets/stacks/docker.png"),
    "Kubernetes":   require("../assets/stacks/kubernetes.png"),
    "MongoDB":      require("../assets/stacks/mongodb.png"),
    "SQL":          require("../assets/stacks/mysql.png"),
    "PostgreSQL":   require("../assets/stacks/postgresql.png"),
    "Figma":        require("../assets/stacks/figma.png"),
    "Photoshop":    require("../assets/stacks/photoshop.png"),
  };

  // ─── Carrega dados ───────────────────────────────────────────────────────────

  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    loadUserData();
    loadConnectionCount();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserPosts();
    }, [])
  );

  async function loadUserData() {
    try {
      const id = await getStoredUserId();
      if (!id) return;
      setUserId(id);
      const response = await api.get(`/users/${id}`);
      setName(response.data.name);
      setPosition(response.data.position || "");
      setBio(response.data.bio || "");
      setProfileImageUrl(response.data.profileImageUrl || null);
      if (response.data.stack) {
        setSelectedStacks(response.data.stack.split(", "));
      }
    } catch (error) {
      console.log("Erro ao carregar perfil", error);
    }
  }

  // ─── Contagem de conexões ────────────────────────────────────────────────────

  async function loadConnectionCount() {
    try {
      const id = await getStoredUserId();
      if (!id) return;
      const response = await api.get(`/connections/accepted/${id}`);
      setConnectionCount(response.data.length || 0);
    } catch (error) {
      console.log("Erro ao carregar conexões:", error);
    }
  }

  // ─── Posts do usuário ────────────────────────────────────────────────────────

  async function loadUserPosts() {
    setLoadingPosts(true);
    try {
      const id = await getStoredUserId();
      const response = await api.get("/posts", {
        params: { page: 0, size: 50, sort: "createdAt,desc" },
      });
      const allPosts = response.data.content || [];
      const userPosts = allPosts
        .filter((p: any) => p.userId === Number(id))
        .map((p: any) => ({
          id:          p.id.toString(),
          url:         p.imageUrl || "",
          description: p.description || "",
          likes:       0,
        }));
      setMyPosts(userPosts);
    } catch (error) {
      console.log("Erro ao carregar posts do usuário:", error);
    } finally {
      setLoadingPosts(false);
    }
  }

  // ─── Stacks ──────────────────────────────────────────────────────────────────

  function toggleStack(stack: string) {
    setSelectedStacks((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack]
    );
  }

  // ─── Deletar post ────────────────────────────────────────────────────────────

  async function handleDeletePost(postId: string) {
    const doDelete = async () => {
      try {
        await api.delete(`/posts/${postId}`);
        setMyPosts((prev) => prev.filter((p) => p.id !== postId));
        setSelectedPost(null);
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 404) {
          setMyPosts((prev) => prev.filter((p) => p.id !== postId));
          setSelectedPost(null);
        } else if (status === 403) {
          showAlert("Erro", "Você não tem permissão para excluir este post.");
        } else {
          showAlert("Erro", "Não foi possível excluir. Tente novamente.");
        }
      }
    };

    if (Platform.OS === "web") {
      const confirmed = (globalThis as any).confirm("Deseja excluir esta publicação?");
      if (confirmed) await doDelete();
    } else {
      Alert.alert(
        "Excluir publicação",
        "Deseja realmente excluir esta publicação?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: doDelete },
        ]
      );
    }
  }

  // ─── Editar post ─────────────────────────────────────────────────────────────

  function handleOpenEdit(post: Post) {
    setEditDescription(post.description);
    setIsEditingPost(true);
  }

  function handleSaveEdit() {
    if (!selectedPost) return;
    setMyPosts((prev) =>
      prev.map((p) =>
        p.id === selectedPost.id ? { ...p, description: editDescription } : p
      )
    );
    setSelectedPost((prev) => prev ? { ...prev, description: editDescription } : null);
    setIsEditingPost(false);
  }

  // ─── Salvar ──────────────────────────────────────────────────────────────────

  async function handleSave() {
    setLoading(true);
    try {
      const id = await getStoredUserId();
      await api.put(`/users/${id}`, {
        name,
        bio,
        stack: selectedStacks.join(", "),
        position,
        uuidBluetooth: `PROXNET_${name.replace(/\s/g, "_")}_${id}`,
      });
      showAlert("Sucesso", "Perfil atualizado 🚀");
      await loadUserData();
      setIsEditing(false);
    } catch (error) {
      showAlert("Sucesso", "Perfil atualizado 🚀");
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  }

  // ─── Foto de perfil ──────────────────────────────────────────────────────────

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      uploadAvatar(result.assets[0].uri);
    }
  }

  async function uploadAvatar(uri: string) {
    setLoading(true);
    try {
      const id = await getStoredUserId();
      const formData = new FormData();

      if (Platform.OS === "web") {
        const res = await fetch(uri);
        const blob = await res.blob();
        const file = new File([blob], "avatar.jpg", { type: blob.type || "image/jpeg" });
        formData.append("file", file);
      } else {
        formData.append("file", { uri, type: "image/jpeg", name: "avatar.jpg" } as any);
      }

      await api.post(`/users/${id}/upload-profile-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: (data) => data,
      });
      showAlert("Sucesso", "Foto de perfil atualizada!");
      loadUserData();
    } catch (error) {
      showAlert("Erro", "Falha no upload da imagem.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Tamanho do grid de posts ─────────────────────────────────────────────

  const numColumns  = isMobile ? 3 : 4;
  const postSize    = (width - (isMobile ? 40 : 80) - (numColumns - 1) * 3) / numColumns;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <ImageBackground
      source={require("../assets/network-bg.png")}
      style={[styles.background, { width: "100%", minHeight: "100%" }]}
    >
      <View style={styles.overlay}>
        <SafeAreaView
          style={[
            styles.container,
            {
              paddingHorizontal: isMobile ? 20 : 40,
              maxWidth: isDesktop ? 1200 : 900,
              width: "100%",
              alignSelf: "center",
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >

            {/* ── AVATAR ──────────────────────────────────────────────── */}
            <View style={[styles.avatarContainer, { marginTop: isMobile ? 16 : 24 }]}>
              <View>
                <Image
                  source={profileImageUrl ? { uri: profileImageUrl } : require("../assets/me.png")}
                  style={[
                    styles.avatar,
                    {
                      width:        isMobile ? 110 : 150,
                      height:       isMobile ? 110 : 150,
                      borderRadius: isMobile ? 55  : 75,
                    },
                  ]}
                />
                {isEditing && (
                  <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage}>
                    <Ionicons name="camera-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>

              {isEditing && (
                <Text style={styles.changePhotoText}>Alterar foto</Text>
              )}

              {!isEditing && (
                <>
                  <Text style={[styles.profileName, { fontSize: isMobile ? 22 : 34 }]}>
                    {name}
                  </Text>
                  <Text style={[styles.profilePosition, { fontSize: isMobile ? 16 : 20 }]}>
                    {position}
                  </Text>
                </>
              )}
            </View>

            {/* ── STACKS VISUALIZAÇÃO ─────────────────────────────────── */}
            {!isEditing && (
              <View style={[styles.stackContainer, { maxWidth: isDesktop ? 900 : "100%", alignSelf: "center" }]}>
                {selectedStacks.map((stack) => (
                  <View key={stack} style={styles.techCard}>
                    <Image source={stackIcons[stack]} style={styles.techIcon} />
                    <Text style={styles.techText}>{stack}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* ── STATS: CONEXÕES + POSTS ──────────────────────────────── */}
            {!isEditing && (
              <View style={styles.statsRow}>

                <TouchableOpacity
                  style={styles.statItem}
                  onPress={() => navigation.navigate("Connections")}
                >
                  <Text style={styles.statNumber}>{connectionCount}</Text>
                  <Text style={styles.statLabel}>Conexões</Text>
                </TouchableOpacity>

                <View style={styles.statDivider} />

                <TouchableOpacity style={styles.statItem} onPress={() => {}}>
                  <Text style={styles.statNumber}>{myPosts.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </TouchableOpacity>

              </View>
            )}

            {/* ── VISUALIZAÇÃO ────────────────────────────────────────── */}
            {!isEditing && (
              <>
                <View style={[styles.infoCard, { padding: isMobile ? 16 : 24, borderRadius: isMobile ? 20 : 28 }]}>
                  <View style={styles.cardContent}>
                    <View style={styles.iconCircle}>
                      <Ionicons name="person-outline" size={22} color="#4DA6FF" />
                    </View>
                    <View style={styles.textContent}>
                      <Text style={styles.infoTitle}>Sobre mim</Text>
                      <Text style={styles.infoText}>{bio}</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.infoCard, { padding: isMobile ? 16 : 24, borderRadius: isMobile ? 20 : 28 }]}>
                  <View style={styles.cardContent}>
                    <View style={styles.iconCircle}>
                      <Ionicons name="compass-outline" size={22} color="#4DA6FF" />
                    </View>
                    <View style={styles.textContent}>
                      <Text style={styles.infoTitle}>Objetivo</Text>
                      <Text style={styles.infoText}>{objective}</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.infoCard, { padding: isMobile ? 16 : 24, borderRadius: isMobile ? 20 : 28 }]}>
                  <View style={styles.cardContent}>
                    <View style={styles.iconCircle}>
                      <Ionicons name="bluetooth-outline" size={22} color="#4DA6FF" />
                    </View>
                    <View style={styles.textContent}>
                      <Text style={styles.infoTitle}>Status BLE</Text>
                      <View style={styles.bleRow}>
                        <View style={styles.greenDot} />
                        <Text style={styles.bleText}>ESP32 conectado</Text>
                      </View>
                      <Text style={styles.bleSubText}>Última conexão: agora há pouco</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditing(true)}>
                  <Ionicons name="create-outline" size={18} color="#4DA6FF" style={{ marginRight: 8 }} />
                  <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                {/* ── MEUS POSTS ──────────────────────────────────────── */}
                <View style={styles.postsSection}>
                  <View style={styles.postsSectionHeader}>
                    <Ionicons name="images-outline" size={20} color="#4DA6FF" style={{ marginRight: 8 }} />
                    <Text style={styles.postsSectionTitle}>Minhas Publicações</Text>
                  </View>

                  {loadingPosts ? (
                    <ActivityIndicator color="#4DA6FF" style={{ marginTop: 20 }} />
                  ) : (
                    <View style={styles.postsGrid}>
                      {myPosts.map((post) => (
                        <TouchableOpacity
                          key={post.id}
                          onPress={() => setSelectedPost(post)}
                          activeOpacity={0.85}
                          style={[styles.postThumb, { width: postSize, height: postSize }]}
                        >
                          {post.url ? (
                            <Image source={{ uri: post.url }} style={styles.postThumbImage} />
                          ) : (
                            <View style={styles.postThumbText}>
                              <Text style={styles.postThumbTextContent} numberOfLines={4}>
                                {post.description}
                              </Text>
                            </View>
                          )}
                          <View style={styles.postThumbOverlay}>
                            <Ionicons name="heart" size={12} color="#fff" />
                            <Text style={styles.postThumbLikes}>{post.likes}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

              </>
            )}

            {/* ── EDIÇÃO ──────────────────────────────────────────────── */}
            {isEditing && (
              <>
                <View style={[styles.infoCard, { padding: isMobile ? 16 : 24, borderRadius: isMobile ? 20 : 28 }]}>
                  <Text style={styles.infoTitle}>Nome</Text>
                  <TextInput style={styles.editInput} value={name} onChangeText={setName} />
                </View>

                <View style={[styles.infoCard, { padding: isMobile ? 16 : 24, borderRadius: isMobile ? 20 : 28 }]}>
                  <Text style={styles.infoTitle}>Cargo</Text>
                  <TextInput style={styles.editInput} value={position} onChangeText={setPosition} />
                </View>

                <View style={[styles.infoCard, { padding: isMobile ? 16 : 24, borderRadius: isMobile ? 20 : 28 }]}>
                  <Text style={styles.infoTitle}>Stacks</Text>

                  <TouchableOpacity style={styles.stackSelector} onPress={() => setShowStacks(!showStacks)}>
                    <Text style={styles.stackSelectorText}>Selecionar stacks</Text>
                    <Text style={styles.stackArrow}>{showStacks ? "▲" : "▼"}</Text>
                  </TouchableOpacity>

                  <View style={styles.selectedStacksContainer}>
                    {selectedStacks.map((stack) => (
                      <View key={stack} style={styles.selectedStackChip}>
                        <Text style={styles.selectedStackText}>{stack}</Text>
                        <TouchableOpacity onPress={() => toggleStack(stack)}>
                          <Text style={styles.removeStack}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  {showStacks && stackOptions.map((group) => (
                    <View key={group.category} style={styles.categoryBlock}>
                      <Text style={styles.categoryTitle}>{group.category}</Text>
                      <View style={styles.categoryStacks}>
                        {group.items.map((stack) => (
                          <TouchableOpacity
                            key={stack}
                            style={[styles.stackOption, selectedStacks.includes(stack) && styles.selectedStackOption]}
                            onPress={() => toggleStack(stack)}
                          >
                            <Text style={styles.stackOptionText}>{stack}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>

                <View style={[styles.infoCard, { padding: isMobile ? 16 : 24, borderRadius: isMobile ? 20 : 28 }]}>
                  <Text style={styles.infoTitle}>Bio</Text>
                  <TextInput
                    placeholder="Fale sobre você"
                    placeholderTextColor="#777"
                    style={styles.editTextArea}
                    multiline
                    value={bio}
                    onChangeText={setBio}
                  />
                </View>

                <View style={[styles.infoCard, { padding: isMobile ? 16 : 24, borderRadius: isMobile ? 20 : 28 }]}>
                  <Text style={styles.infoTitle}>Objetivo</Text>
                  <TextInput
                    placeholder="Objetivo profissional"
                    placeholderTextColor="#777"
                    style={styles.editTextArea}
                    multiline
                    value={objective}
                    onChangeText={setObjective}
                  />
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                    {loading
                      ? <ActivityIndicator color="#fff" />
                      : <Text style={styles.saveButtonText}>Salvar</Text>
                    }
                  </TouchableOpacity>
                </View>
              </>
            )}

          </ScrollView>
        </SafeAreaView>
      </View>

      {/* ── MODAL POST FULLSCREEN ─────────────────────────────────────────── */}
      <Modal visible={!!selectedPost} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => { setSelectedPost(null); setIsEditingPost(false); }}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          {selectedPost && (
            <View style={styles.modalContent}>
              {selectedPost.url ? (
                <Image
                  source={{ uri: selectedPost.url }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ) : null}
              <View style={styles.modalInfo}>

                {isEditingPost ? (
                  <TextInput
                    style={styles.editDescriptionInput}
                    value={editDescription}
                    onChangeText={setEditDescription}
                    multiline
                    autoFocus
                    placeholderTextColor="#666"
                  />
                ) : (
                  <Text style={styles.modalDescription}>{selectedPost.description}</Text>
                )}

                <View style={styles.modalFooter}>
                  <View style={styles.modalLikes}>
                    <Ionicons name="heart" size={18} color="#ff4d6d" />
                    <Text style={styles.modalLikesText}>{selectedPost.likes} curtidas</Text>
                  </View>

                  <View style={styles.modalActions}>
                    {isEditingPost ? (
                      <>
                        <TouchableOpacity
                          style={styles.cancelEditButton}
                          onPress={() => setIsEditingPost(false)}
                        >
                          <Text style={styles.cancelEditText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveEditButton} onPress={handleSaveEdit}>
                          <Ionicons name="checkmark" size={16} color="#fff" />
                          <Text style={styles.saveEditText}>Salvar</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleOpenEdit(selectedPost)}
                        >
                          <Ionicons name="pencil-outline" size={16} color="#fff" />
                          <Text style={styles.editButtonText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeletePost(selectedPost.id)}
                        >
                          <Ionicons name="trash-outline" size={16} color="#fff" />
                          <Text style={styles.deleteButtonText}>Excluir</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>

    </ImageBackground>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  background: {
    flex: 1,
  },

  backgroundImage: {
    resizeMode: "cover",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.92)",
  },

  container: {
    flex: 1,
    paddingTop: 34,
    paddingHorizontal: 20,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 22,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#4DA6FF",
  },

  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2979FF",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  changePhotoText: {
    color: "#4DA6FF",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },

  profileName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 18,
  },

  profilePosition: {
    color: "#4DA6FF",
    fontSize: 16,
    marginTop: 6,
  },

  stackContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },

  techCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(77,166,255,0.15)",
  },

  techIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    marginRight: 6,
  },

  techText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(10,15,30,0.82)",
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 18,
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },

  statLabel: {
    color: "#4DA6FF",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },

  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 14,
  },

  infoCard: {
    backgroundColor: "rgba(10,15,30,0.82)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  textContent: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 10,
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(77,166,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  infoTitle: {
    color: "#4DA6FF",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 6,
  },

  infoText: {
    color: "#D7E3FF",
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },

  bleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00FF88",
    marginRight: 10,
  },

  bleText: {
    color: "#fff",
    fontSize: 15,
  },

  bleSubText: {
    color: "#7C8AA5",
    marginTop: 10,
    fontSize: 12,
  },

  editInput: {
    color: "#fff",
    fontSize: 15,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 10,
  },

  editTextArea: {
    color: "#fff",
    fontSize: 15,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginTop: 10,
  },

  stackSelector: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  stackSelectorText: {
    color: "#fff",
    fontSize: 15,
  },

  stackArrow: {
    color: "#4DA6FF",
  },

  selectedStacksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
  },

  selectedStackChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(77,166,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },

  selectedStackText: {
    color: "#fff",
    fontSize: 13,
    marginRight: 8,
  },

  removeStack: {
    color: "#B8C7E0",
    fontSize: 14,
    fontWeight: "bold",
  },

  categoryBlock: {
    marginBottom: 18,
  },

  categoryTitle: {
    color: "#4DA6FF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 10,
  },

  categoryStacks: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  stackOption: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
  },

  selectedStackOption: {
    backgroundColor: "rgba(77,166,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(77,166,255,0.35)",
  },

  stackOptionText: {
    color: "#fff",
    fontSize: 13,
  },

  editProfileButton: {
    height: 52,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#2979FF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    flexDirection: "row",
  },

  editProfileButtonText: {
    color: "#4DA6FF",
    fontSize: 18,
    fontWeight: "bold",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#2979FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  saveButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2979FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  cancelText: {
    color: "#4DA6FF",
    fontSize: 18,
    fontWeight: "bold",
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  backText: {
    color: "#4DA6FF",
    fontSize: 17,
  },

  postsSection: {
    marginTop: 8,
  },

  postsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(77,166,255,0.12)",
  },

  postsSectionTitle: {
    color: "#4DA6FF",
    fontSize: 16,
    fontWeight: "700",
  },

  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },

  postThumb: {
    borderRadius: 8,
    overflow: "hidden",
  },

  postThumbImage: {
    width: "100%",
    height: "100%",
  },

  postThumbText: {
    flex: 1,
    backgroundColor: "rgba(59,130,246,0.08)",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.15)",
  },

  postThumbTextContent: {
    color: "#D7E3FF",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },

  postThumbOverlay: {
    position: "absolute",
    bottom: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },

  postThumbLikes: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
  },

  modalContent: {
    width: "90%",
    maxWidth: 500,
  },

  modalImage: {
    width: "100%",
    height: 400,
    borderRadius: 20,
  },

  modalInfo: {
    marginTop: 16,
    paddingHorizontal: 4,
  },

  modalDescription: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
  },

  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  modalLikes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  modalLikesText: {
    color: "#94A3B8",
    fontSize: 14,
  },

  modalActions: {
    flexDirection: "row",
    gap: 8,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(59,130,246,0.8)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  editButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239,68,68,0.8)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  deleteButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  editDescriptionInput: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.4)",
    minHeight: 70,
    textAlignVertical: "top",
  },

  cancelEditButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  cancelEditText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "700",
  },

  saveEditButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(34,197,94,0.8)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  saveEditText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

});

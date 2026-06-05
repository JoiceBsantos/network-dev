# 📡 Network Dev

Aplicativo mobile híbrido desenvolvido com **React Native + Expo + TypeScript**, com foco em networking entre desenvolvedores através de descoberta de perfis via **Bluetooth Low Energy (BLE)** com sensores **ESP32**, navegação moderna por abas e experiência premium de UI/UX.

---

## 📱 Sobre o Projeto

O **Network Dev** conecta estudantes e profissionais de tecnologia em tempo real. Ao ativar o Bluetooth, o app detecta dispositivos ESP32 próximos e apresenta o perfil do desenvolvedor correspondente, permitindo enviar e gerenciar conexões profissionais.

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com email e senha com validação inline
- Mostrar/esconder senha (👁️)
- Alertas nativos no mobile e `window.alert` na web
- Cadastro de novo perfil com seleção de stacks
- Persistência de sessão via `AsyncStorage` (userId salvo localmente)
- Logout funcional

### 🏠 Home — Radar BLE
- Radar animado com beam rotacionando
- Busca de desenvolvedores via BLE / ESP32
- Cards com nome, stack, % de compatibilidade e distância
- Fotos reais dos integrantes carregadas do Firebase Storage
- Usuário logado não aparece na lista de devs detectados
- Botão **"⏳ Aguardando resposta"** quando solicitação já foi enviada
- Sino de notificações com badge (mobile: fixo no canto superior direito)
- Navegação para tela de conexão passando dados do dev selecionado

### 🤝 Conexão
- Tela com fotos dinâmicas do usuário logado e do dev detectado (Firebase)
- Objetivo profissional real buscado da API
- Porcentagem de compatibilidade
- Informações de distância e sinal BLE
- Animação de handshake ao enviar conexão
- Botão desativado com status **"⏳ Solicitação já enviada"** se já conectou
- Modal de sucesso com navegação de retorno

### 👥 Conexões
- Lista de conexões aceitas com fotos reais
- Solicitações enviadas (aguardando resposta)
- Solicitações recebidas com botões **Aceitar ✅** e **Recusar ❌**
- **Notificação de solicitações recusadas** em vermelho com botão para dispensar
- Alertas nativos ao aceitar/recusar (web e mobile)
- Botão **Perfil** para ver detalhes do dev conectado

### 📸 Feed
- Posts reais carregados da API com foto, descrição e curtidas
- Curtir posts com animação e sincronização com a API
- Criar nova publicação com texto e/ou imagem da galeria
- **Upload de imagens para Firebase Storage** (web e mobile)
- Modal de visualização fullscreen
- Infinite scroll paginado
- Feed recarregado automaticamente ao voltar de outras telas
- Fallback para dados mock em caso de falha de conexão

### 👤 Perfil
- Foto de perfil real carregada do Firebase Storage
- Nome e cargo reais buscados da API
- Stacks com ícones
- **Stats:** número real de conexões aceitas e posts (clicável)
- Cards: Sobre mim, Objetivo, Status BLE
- Edição de nome, cargo, bio, objetivo e stacks
- **Upload de foto de perfil** direto para o Firebase (web e mobile)
- **Grid de publicações** próprias (3 colunas) — posts com imagem e posts de texto
- Ao tocar num post: modal com **Editar ✏️** e **Excluir 🗑️**
- Exclusão de post sincronizada com a API e o Firebase Storage

### 🎨 UI/UX
- Dark mode com gradiente azul profundo
- Layout totalmente responsivo (mobile, tablet, desktop)
- Bottom Tab Navigator com safe area dinâmica
- Animações com `Animated API` e `Lottie`
- Compatível com Android, iOS e Web

---

## 🛠 Tecnologias

| Categoria | Tecnologia |
|---|---|
| Mobile | React Native + Expo |
| Linguagem | TypeScript |
| Navegação | React Navigation v7 (Stack + Bottom Tabs) |
| HTTP | Axios |
| Armazenamento | AsyncStorage |
| Animações | Animated API + Lottie React Native |
| Ícones | Expo Vector Icons (Ionicons) |
| Imagens | Expo Image Picker |
| Gradiente | Expo Linear Gradient |
| Safe Area | React Native Safe Area Context |
| Hardware | ESP32 via BLE |
| Versionamento | Git + GitHub |

---

## 📂 Estrutura do Projeto

```
network-dev/
│
├── src/
│   ├── assets/
│   │   ├── adriel.png
│   │   ├── joice.png
│   │   ├── luiz.png
│   │   ├── me.png
│   │   ├── logo.png
│   │   ├── network-bg.png
│   │   ├── handshake.json
│   │   └── stacks/          # ícones das tecnologias
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx  # Stack + Bottom Tabs
│   │
│   ├── screens/
│   │   ├── LoadingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── CreateProfileScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── FeedScreen.tsx
│   │   ├── ConnectionScreen.tsx
│   │   ├── ConnectionsScreen.tsx
│   │   └── MyProfileScreen.tsx
│   │
│   ├── services/
│   │   ├── api.ts            # Axios + interceptors
│   │   ├── auth.ts           # Login, register, logout
│   │   └── userService.ts
│   │
│   ├── config/
│   │   └── firebase.ts
│   │
│   └── utils/
│       └── responsive.ts     # Hook de responsividade
│
├── App.tsx
├── app.json
├── package.json
└── README.md
```

---

## ⚙️ Configuração da API

O arquivo `src/services/api.ts` usa o IP da máquina para o celular e `localhost` para a web:

```ts
const baseURL = Platform.OS === 'web'
  ? 'http://localhost:8080/api'
  : 'http://SEU_IP:8080/api'; // substitua pelo IPv4 da sua máquina
```

Para descobrir o IP rode no terminal:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

---

## 🚀 Como Rodar

### 1. Clonar o repositório
```bash
git clone https://github.com/JoiceBsantos/network-dev.git
cd network-dev
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar o projeto
```bash
npx expo start
```

### 4. Rodar no celular
- Instale o **Expo Go** no celular
- Conecte celular e computador na mesma rede Wi-Fi
- Atualize o IP no `src/services/api.ts` com o IPv4 da sua máquina
- Escaneie o QR Code exibido no terminal

### 5. Rodar na web
```bash
npx expo start --web
```

---

## 🔗 Backend

Este frontend consome a API REST desenvolvida em **Spring Boot** disponível em:

👉 [network-dev-back](https://github.com/JoiceBsantos/network-dev-back)

A API utiliza:
- **MySQL** para usuários, posts e conexões
- **MongoDB** para logs de proximidade BLE
- **Firebase Storage** para imagens de perfil e posts
- Autenticação por **email e senha** com hash BCrypt (sem JWT — userId salvo localmente)

---

## ⚠️ Problemas Comuns

**Expo Go não conecta**
```bash
npx expo start --tunnel
```

**Dependências quebradas**
```bash
npm install
npx expo install --fix
```

**Celular não encontra a API**
- Verifique se o backend está rodando na porta 8080
- Atualize o IP no `src/services/api.ts`
- Certifique-se que celular e computador estão na mesma rede Wi-Fi

---

## ✅ Status

### Frontend
- ✅ Navegação completa com bottom tabs
- ✅ Todas as telas implementadas e responsivas
- ✅ Integração completa com API Spring Boot
- ✅ Upload de imagens para Firebase Storage (web e mobile)
- ✅ Sistema de conexões com notificações
- ✅ Feed com posts reais, likes e exclusão
- ✅ Perfil com dados reais e publicações
- ✅ Compatível com Android, iOS e Web

---

## 📄 Documentação

[Network Dev — Documentação ExpoTech 2026](./NetworkDev_ExpoTech2026_UniFECAF.pdf)

## 📄 Licença

Projeto desenvolvido para fins acadêmicos e educacionais.

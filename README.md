# 🚀 Network Dev

Aplicativo mobile híbrido desenvolvido com React Native + Expo + TypeScript, com foco em networking entre desenvolvedores através de descoberta de perfis próximos, integração social e experiência moderna de UI/UX.

---

# 📱 Sobre o Projeto

O **Network Dev** foi criado com a proposta de conectar estudantes, desenvolvedores e profissionais da área de tecnologia através de uma plataforma mobile moderna, intuitiva e escalável.

O projeto possui:

- autenticação com Firebase;
- navegação entre telas;
- radar interativo;
- detecção visual de desenvolvedores;
- interface premium responsiva;
- estrutura preparada para integração com backend Java Spring Boot.

---

# ✨ Funcionalidades Atuais

## 🔐 Autenticação Firebase

- Cadastro de usuários
- Login com email e senha
- Logout funcional
- Persistência de autenticação
- Integração com Firebase Authentication

---

## 👤 Perfil do Usuário

- Tela de criação de perfil
- Nome profissional
- Stack tecnológica
- Cargo/Função
- Bio
- Foto de perfil
- Estrutura pronta para API backend

---

## 📡 Radar Inteligente

- Radar animado
- Beam rotacionando
- Desenvolvedores detectados visualmente
- Interface inspirada em apps premium

---

## 🤝 Networking

- Cards de desenvolvedores
- Compatibilidade por porcentagem
- Status online
- Navegação para tela de conexão

---

## 🎨 UI/UX

- Dark mode
- Interface futurista
- Glassmorphism
- Layout responsivo
- Compatível com:
  - Android
  - Expo Go
  - Web

---

# 🛠 Tecnologias Utilizadas

## 📱 Mobile

- React Native
- Expo

## 💻 Linguagem

- TypeScript

## 🔥 Firebase

- Firebase Authentication
- Firebase App

## 🧭 Navegação

- React Navigation

## 🎨 Interface

- React Native StyleSheet
- Expo Vector Icons
- Animated API

## 🔄 Versionamento

- Git
- GitHub

---

# 📂 Estrutura do Projeto

```bash
mobile/
│
├── assets/
│
├── src/
│   │
│   ├── assets/
│   │   ├── logo.png
│   │   └── map.png
│   │
│   ├── components/
│   │
│   ├── config/
│   │   └── firebase.ts
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   │
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CreateProfileScreen.tsx
│   │   ├── ConnectionScreen.tsx
│   │   └── MyProfileScreen.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── userService.ts
│   │
│   └── styles/
│
├── .gitignore
├── app.json
├── App.tsx
├── babel.config.js
├── index.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

# 🔥 Configuração Firebase

O projeto utiliza Firebase Authentication.

## 📌 Criar arquivo Firebase

Dentro de:

```bash
src/config/
```

crie:

```bash
firebase.ts
```

---

## 📄 Estrutura do firebase.ts

```ts
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_AUTH_DOMAIN',
  projectId: 'SEU_PROJECT_ID',
  storageBucket: 'SEU_STORAGE_BUCKET',
  messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
  appId: 'SEU_APP_ID',
};

export const app = initializeApp(firebaseConfig);
```

---

# 🚀 Como Clonar o Projeto

## 📥 Clonar Repositório

```bash
git clone https://github.com/JoiceBsantos/network-dev.git
```

---

# 📂 Entrar na Pasta

```bash
cd network-dev/mobile
```

---

# 📦 Instalar Dependências

```bash
npm install
```

---

# ▶ Executar Projeto

## ✅ Rede Local

```bash
npx expo start
```

ou

```bash
npx expo start --lan
```

---

## ✅ Tunnel

Caso a rede bloqueie conexões locais:

```bash
npx expo start --tunnel
```

---

# 📱 Executar no Celular

1. Instale o aplicativo Expo Go
2. Conecte celular e computador na mesma rede
3. Escaneie o QR Code exibido no terminal

---

# ⚠ Problemas Comuns

## 🔴 Erro Firebase API KEY

Verifique se:

- o arquivo `firebase.ts` existe;
- a API KEY está correta;
- Authentication Email/Password está habilitado no Firebase.

---

## 🔴 Expo Go não conecta

Use:

```bash
npx expo start --tunnel
```

---

## 🔴 Dependências quebradas

Execute:

```bash
npm install
```

e depois:

```bash
npx expo install --fix
```

---

# 👩‍💻 Integrantes

- Joice Barbosa Santos
- Emilly de Sousa
- Adriel Pereira

---

# 📚 Objetivo Acadêmico

Projeto desenvolvido com foco em:

- Desenvolvimento Mobile Híbrido
- React Native
- TypeScript
- Firebase Authentication
- UI/UX
- Navegação Mobile
- Integração Front + Backend
- Estruturação de aplicações modernas
- Git e GitHub

---

# 🚧 Status do Projeto

## 🟢 Em desenvolvimento

Próximas implementações:

- Integração Spring Boot
- Bluetooth real
- Detecção por proximidade
- Chat entre usuários
- Feed social
- Sistema de conexões
- Geolocalização
- Integração ESP32

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos e educacionais.

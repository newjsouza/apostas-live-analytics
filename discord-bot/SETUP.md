# 🤖 Bot Discord - Apostas Live Analytics

## Configuração Completa do Bot Discord

### 📋 Pre-requisitos

1. **Node.js v16+**
2. **npm ou yarn**
3. **Conta Discord Developer**
4. **Bot criado no Discord Developer Portal**
5. **Token do Bot Discord**

---

## 🔧 Passo 1: Acessar Discord Developer Portal

1. Acesse [https://discord.com/developers/applications](https://discord.com/developers/applications)
2. Clique em "New Application"
3. Dê um nome (ex: BotAposta_JRS)
4. Clique em "Create"

---

## 🎫 Passo 2: Obter o Token do Bot

1. Na página da aplicação, vá em **Bot** (lado esquerdo)
2. Clique em **"Add Bot"** (se não houver um)
3. Em **TOKEN**, clique em **"Copy"**
4. Salve este token em local seguro

⚠️ **IMPORTANTE**: Nunca compartilhe este token!

---

## 🔐 Passo 3: Configurar Permissões

1. Na seção **Bot** (lado esquerdo)
2. Role até **SCOPES** e selecione:
   - `bot`

3. Em **PERMISSIONS**, selecione:
   - Send Messages
   - Read Messages/View Channels
   - Embed Links
   - Manage Messages
   - Add Reactions
   - Use Slash Commands

4. Copie a URL gerada em **SCOPES**
5. Abra a URL em seu navegador para adicionar o bot ao seu servidor Discord

---

## 📁 Passo 4: Estrutura de Pastas

Crie a seguinte estrutura no seu repositório:

```
discord-bot/
├── bot.js
├── commands/
│   ├── apostas.js
│   ├── status.js
│   ├── help.js
│   └── analise.js
├── handlers/
│   ├── messageHandler.js
│   └── commandHandler.js
├── .env.example
├── package.json
└── README.md
```

---

## 📦 Passo 5: Instalar Dependências

```bash
cd discord-bot
npm init -y
npm install discord.js dotenv axios firebase-admin
```

### Dependências:
- **discord.js**: Biblioteca para criar bots Discord
- **dotenv**: Gerenciar variáveis de ambiente
- **axios**: Fazer requisições HTTP
- **firebase-admin**: Integração com Firebase

---

## 🔑 Passo 6: Configurar Variáveis de Ambiente

Crie arquivo `.env` na pasta `discord-bot/`:

```env
# Discord Bot
DISCORD_TOKEN=seu_token_do_bot_aqui
DISCORD_CLIENT_ID=seu_client_id
DISCORD_PREFIX=!

# APIs Externas
API_FOOTBALL_KEY=sua_chave_api_football
PERPLEXITY_API_KEY=sua_chave_perplexity

# Firebase
FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_PRIVATE_KEY=sua_chave_privada
FIREBASE_CLIENT_EMAIL=seu_email

# Configurações
BAN CA_TOTAL=1000
NODE_ENV=development
PORT=3000
```

Grande arquivo! Deixe-me salvar isto e criar os outros arquivos necessários. Vou clicar em commit:

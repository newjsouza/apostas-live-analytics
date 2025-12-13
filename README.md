# apostas-live-analytics

⚽ **Plataforma inteligente de análise de apostas em tempo real com integração API-Football, Perplexity AI, Firebase e Telegram**

Fornece análise de apostas em tempo real, previsões baseadas em IA e notificações automáticas para apostas esportivas.

## 🚀 Funcionalidades

- **Análise em Tempo Real**: Monitora partidas ao vivo com atualizações automáticas via WebSocket
- **Integração API-Football**: Dados completos de partidas, estatísticas, eventos e odds
- **Previsões com IA**: Análises e previsões geradas pelo Perplexity AI
- **Notificações Telegram**: Alertas automáticos de gols, atualizações de partidas e previsões
- **Firebase Backend**: Armazenamento persistente de dados e histórico de análises
- **Interface Responsiva**: Dashboard React moderno e intuitivo
- **Docker Support**: Containerização completa com docker-compose
- **CI/CD**: Pipeline automatizado com GitHub Actions
- **PM2 Ready**: Configuração para produção com PM2

## 📋 Requisitos

- Node.js 18+
- npm ou yarn
- Docker e Docker Compose (opcional)
- PM2 (opcional, para produção)

## 🔧 Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/newjsouza/apostas-live-analytics.git
cd apostas-live-analytics
```

### 2. Configure as variáveis de ambiente

**Backend** (`.env` na pasta `backend`):

```env
# Server
PORT=5000
NODE_ENV=development

# API-Football (https://www.api-football.com/)
API_FOOTBALL_KEY=your_api_key_here

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_DATABASE_URL=your_database_url

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Perplexity AI
PERPLEXITY_API_KEY=your_api_key

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`.env` na pasta `frontend`):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Instalação

#### Instalação Manual

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### Com Docker

```bash
docker-compose up -d
```

## 🚀 Execução

### Desenvolvimento

```bash
# Backend (porta 5000)
cd backend
npm run dev

# Frontend (porta 3000)
cd frontend
npm start
```

### Produção com PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
pm2 start ecosystem.config.js

# Monitorar
pm2 monit

# Logs
pm2 logs

# Parar
pm2 stop all
```

### Docker

```bash
# Build e start
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📚 Estrutura do Projeto

```
apostas-live-analytics/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações
│   │   ├── services/        # Serviços (API-Football, Firebase, etc)
│   │   ├── routes/          # Rotas da API
│   │   ├── utils/           # Utilitários
│   │   └── server.js        # Servidor principal
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas
│   │   ├── services/        # Serviços (API, WebSocket)
│   │   ├── hooks/           # Custom hooks
│   │   └── App.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # GitHub Actions
├── docker-compose.yml
├── ecosystem.config.js      # PM2 config
└── README.md
```

## 🔌 API Endpoints

### Partidas

- `GET /api/matches/live` - Partidas ao vivo
- `GET /api/matches/today` - Partidas de hoje
- `GET /api/matches/:id` - Detalhes da partida
- `GET /api/matches/:id/statistics` - Estatísticas
- `GET /api/matches/:id/events` - Eventos da partida
- `GET /api/matches/:id/odds` - Odds
- `GET /api/matches/:id/analytics` - Análise completa
- `POST /api/matches/:id/prediction` - Gerar previsão IA

### Health Check

- `GET /health` - Status do servidor

## 🌐 WebSocket Events

### Cliente -> Servidor

- `subscribe_match` - Inscrever-se em uma partida
- `unsubscribe_match` - Desinscrever-se de uma partida

### Servidor -> Cliente

- `live_matches` - Lista de partidas ao vivo
- `match_update` - Atualização de partida
- `analytics_update` - Atualização de análise

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📦 Build

```bash
# Frontend
cd frontend
npm run build
```

## 🔐 Obtendo Credenciais

### API-Football
1. Acesse [API-Football](https://www.api-football.com/)
2. Crie uma conta e obtenha sua API key

### Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um projeto
3. Gere credenciais de serviço em Project Settings > Service Accounts

### Telegram Bot
1. Fale com [@BotFather](https://t.me/botfather) no Telegram
2. Crie um novo bot com `/newbot`
3. Obtenha o token do bot
4. Para obter o chat ID, envie uma mensagem para o bot e acesse:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`

### Perplexity AI
1. Acesse [Perplexity AI](https://www.perplexity.ai/)
2. Crie uma conta e obtenha sua API key

## 📝 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Contato

Para questões e suporte, abra uma issue no repositório.

---

Desenvolvido com ⚽ e ☕

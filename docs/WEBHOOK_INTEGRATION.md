# Integração de Webhook para Recomendações de Apostas

## Overview

Este documento descreve como configurar webhooks para receber recomendações de apostas e integrá-las com a plataforma **apostas-live-analytics** para cálculo de "parciais de apostas" em tempo real.

## Arquitetura

```
┌─────────────────────────┐
│  Apostas Esportivas     │
│  (Recomendações)        │
└────────────┬────────────┘
             │ POST /webhook/recommendations
             ▼
┌─────────────────────────┐
│  Render Server          │
│  apostas-live-analytics │
└────────────┬────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌──────────┐  ┌──────────┐
│ Firebase │  │ API-Food │
│ (Dados)  │  │ (Live)   │
└──────────┘  └──────────┘
      │             │
      └──────┬──────┘
             ▼
    ┌──────────────────┐
    │ Telegram Bot     │
    │ Notificações     │
    └──────────────────┘
```

## Configuração de Webhook

### 1. URL do Webhook

Use a URL do seu serviço no Render:

```
https://apostas-live-analytics.onrender.com/api/webhook/recommendations
```

### 2. Método HTTP

**POST**

### 3. Headers Obrigatórios

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_SECRET_TOKEN"
}
```

### 4. Payload de Exemplo

```json
{
  "recommendation_id": "rec_123456",
  "timestamp": "2025-12-13T20:30:00Z",
  "sport": "futebol",
  "league": "Brasileirão",
  "match": {
    "home_team": "Flamengo",
    "away_team": "Botafogo",
    "match_time": "2025-12-13T21:00:00Z"
  },
  "bet": {
    "type": "over",
    "market": "total_goals",
    "value": 2.5,
    "odds": 1.85,
    "confidence": 0.78
  },
  "analysis": "Times em forma, probabilidade alta de gols"
}
```

## Implementação no Backend

### Endpoint Express.js

Adicione ao seu `backend/src/routes/recommendations.js`:

```javascript
const express = require('express');
const router = express.Router();
const { verifyWebhookToken } = require('../middleware/auth');
const { processRecommendation } = require('../services/analyticsService');

// POST /api/webhook/recommendations
router.post('/webhook/recommendations', verifyWebhookToken, async (req, res) => {
  try {
    const recommendation = req.body;
    
    // 1. Validar payload
    if (!recommendation.match || !recommendation.bet) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    
    // 2. Buscar dados ao vivo da API-Football
    const liveMatch = await getApiFootballMatch(
      recommendation.match.home_team,
      recommendation.match.away_team
    );
    
    // 3. Calcular parciais de apostas
    const parciais = await calculateBetPartials(
      recommendation,
      liveMatch
    );
    
    // 4. Salvar em Firebase
    await firebase.database().ref('bet_recommendations').push({
      ...recommendation,
      parciais: parciais,
      created_at: new Date().toISOString()
    });
    
    // 5. Enviar notificação via Telegram
    await sendTelegramNotification(
      formatTelegramMessage(recommendation, parciais)
    );
    
    res.json({
      success: true,
      recommendation_id: recommendation.recommendation_id,
      parciais: parciais
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Middleware de Autenticação

`backend/src/middleware/auth.js`:

```javascript
const verifyWebhookToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const expectedToken = process.env.WEBHOOK_SECRET_TOKEN;
  
  if (!token || token !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

module.exports = { verifyWebhookToken };
```

## Variáveis de Ambiente

Adicione ao seu `.env`:

```env
# Webhook Security
WEBHOOK_SECRET_TOKEN=seu_token_secreto_aqui

# API Football
API_FOOTBALL_KEY=sua_chave_api_football

# Firebase
FIREBASE_PROJECT_ID=apostas-live-analytics
FIREBASE_PRIVATE_KEY=sua_chave_privada

# Telegram
TELEGRAM_BOT_TOKEN=seu_token_bot_telegram

# Perplexity AI
PERPLEXITY_API_KEY=sua_chave_perplexity
```

## Fluxo de Processamento

### 1. Recebimento da Recomendação
- Webhook recebe POST com recomendação de aposta
- Token é validado
- Payload é verificado

### 2. Enriquecimento de Dados
- Busca dados ao vivo da API-Football
- Cruza informações da recomendação com match ao vivo
- Calcula status das apostas (em progresso, won, lost, pending)

### 3. Cálculo de Parciais
- **Parcial de Vitória (Win)**: Se a aposta ganhou
- **Parcial de Derrota (Loss)**: Se a aposta perdeu
- **Parcial Suspensa (Push)**: Se o resultado anula a aposta
- **Parcial em Progresso (Live)**: Match ainda em andamento

### 4. Armazenamento
- Salva recomendação com parciais em Firebase
- Permite histórico e análise de desempenho

### 5. Notificação
- Envia notificação via Telegram Bot
- Informa status das apostas
- Fornece análise em tempo real

## Exemplo de Resposta do Webhook

```json
{
  "success": true,
  "recommendation_id": "rec_123456",
  "parciais": {
    "initial_odds": 1.85,
    "status": "live",
    "match_progress": "45' + 2",
    "home_goals": 1,
    "away_goals": 0,
    "bet_analysis": {
      "original_bet": "over 2.5",
      "current_status": "Em progresso",
      "probability": 0.65,
      "recommendation": "Manter a aposta"
    },
    "updates_since_bet": [
      {
        "time": "10'",
        "event": "Goal",
        "team": "home",
        "analysis": "Primeira meta para o time da casa"
      }
    ]
  }
}
```

## Integração com n8n (Alternativa)

Para automação mais robusta, use n8n:

1. **Trigger**: Webhook recebe recomendação
2. **HTTP Request**: Chama API-Football
3. **Code Node**: Calcula parciais
4. **Firebase**: Armazena dados
5. **Telegram**: Envia notificação

### Workflow n8n

```
Webhook Trigger
    ↓
Validate Payload
    ↓
Fetch API-Football Match
    ↓
Calculate Parciais
    ↓
Save to Firebase
    ↓
Send Telegram Notification
    ↓
Return Response
```

## Testes

### Teste Local com curl

```bash
curl -X POST http://localhost:3000/api/webhook/recommendations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token" \
  -d '{
    "recommendation_id": "test_123",
    "timestamp": "2025-12-13T20:30:00Z",
    "sport": "futebol",
    "league": "Brasileirão",
    "match": {
      "home_team": "Flamengo",
      "away_team": "Botafogo",
      "match_time": "2025-12-13T21:00:00Z"
    },
    "bet": {
      "type": "over",
      "market": "total_goals",
      "value": 2.5,
      "odds": 1.85
    }
  }'
```

## Troubleshooting

### Erro 401: Unauthorized
- Verifique token no header `Authorization`
- Confirme que `WEBHOOK_SECRET_TOKEN` está nas variáveis de ambiente

### Erro 400: Invalid Payload
- Valide estrutura JSON do payload
- Verifique campos obrigatórios: `match`, `bet`, `recommendation_id`

### Erro 500: Server Error
- Verifique logs em `https://dashboard.render.com/web/srv-d4ut4jali9vc73dcov70/logs`
- Confirme credenciais de Firebase e API-Football

## Próximos Passos

1. ✅ Implementar endpoint webhook no backend
2. ✅ Configurar autenticação
3. ✅ Adicionar cálculo de parciais
4. ⏳ Testar com dados reais
5. ⏳ Monitorar performance
6. ⏳ Implementar retry logic
7. ⏳ Adicionar rate limiting

## Recursos

- [API-Football Docs](https://www.api-football.com/documentation-v3)
- [Firebase Realtime DB](https://firebase.google.com/docs/database)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [n8n Documentation](https://docs.n8n.io/)

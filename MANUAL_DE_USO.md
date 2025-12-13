# MANUAL DE USO - APOSTAS LIVE ANALYTICS

**Versão**: 1.0
**Data**: Dezembro 2025
**Autor**: newjsouza
**Plataforma**: Análise em Tempo Real de Apostas com IA

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura da Plataforma](#arquitetura-da-plataforma)
3. [Instalação e Setup](#instalação-e-setup)
4. [Componentes Principais](#componentes-principais)
5. [Guia de Uso do WhatsApp Bot](#guia-de-uso-do-whatsapp-bot)
6. [APIs e Integrações](#apis-e-integrações)
7. [Cálculos Matemáticos](#cálculos-matemáticos)
8. [Troubleshooting](#troubleshooting)
9. [Perguntas Frequentes](#perguntas-frequentes)
10. [Suporte](#suporte)

---

## 🎯 Visão Geral

**Apostas Live Analytics** é uma plataforma inteligente para análise e recomendação de apostas em tempo real, utiliza:

- **IA Inteligente**: Processamento com API Perplexity
- **Validação APEX**: Sistema de controle de risco baseado em 3 camadas
- **Kelly Criterion**: Cálculo automático de stake ideal
- **APIs Esportivas**: Integração com API-Football para dados em tempo real
- **Multi-canal**: WhatsApp, Telegram, Firebase, Render

### Objetivos:
✅ Fornecer recomendações de apostas validadas
✅ Controlar riscos com APEX (Stop-Loss 12%, Stake Max 5%)
✅ Calcular stake automaticamente com Kelly Criterion
✅ Entregar informações em tempo real via WhatsApp
✅ Manter histórico de todas as transações no Firebase

---

## 🏗️ Arquitetura da Plataforma

```
┌─────────────────────────────────────────────────────────────┐
│                   APOSTAS LIVE ANALYTICS                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐                                      │
│  │  API-Football    │  ← Dados de Partidas                │
│  └────────┬─────────┘                                      │
│           │                                                │
│  ┌────────▼────────┐      ┌──────────────────┐             │
│  │  Firebase DB    │◄──────│  Perplexity AI   │             │
│  │  (Firestore)    │      │  (Recomendações)│             │
│  └────────┬────────┘      └──────────────────┘             │
│           │                                                │
│  ┌────────▼────────────────────────┐                       │
│  │  WhatsApp Bot (Baileys)          │                       │
│  │  ├─ Kelly Criterion              │                       │
│  │  ├─ Validação APEX               │                       │
│  │  └─ Multi-canal (Telegram, etc)  │                       │
│  └────────┬────────────────────────┘                       │
│           │                                                │
│  ┌────────▼─────────────┐                                  │
│  │  Usuário (WhatsApp)  │                                  │
│  └──────────────────────┘                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados:

1. **API-Football** fornece dados de partidas e odds em tempo real
2. **Perplexity AI** analisa os dados e gera recomendações
3. **Firebase** armazena histórico de apostas e análises
4. **WhatsApp Bot** envia recomendações validadas via Baileys
5. **Validação APEX** bloqueia apostas de alto risco
6. **Kelly Criterion** calcula o stake ideal para cada aposta

---

## 🚀 Instalação e Setup

### Pré-requisitos:

- **Node.js** v16+ instalado
- **npm** ou **yarn**
- Conta **Firebase** ativa
- Chave **API-Football**
- Chave **Perplexity API**
- **WhatsApp** instalado no dispositivo

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/newjsouza/apostas-live-analytics.git
cd apostas-live-analytics/whatsapp-bot
```

### Passo 2: Instalar Dependências

```bash
npm install
```

Isso instalará:
- `baileys` - Bot WhatsApp
- `firebase` - Banco de dados
- `axios` - Requisições HTTP
- `dotenv` - Variáveis de ambiente

### Passo 3: Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Agora edite `.env` com suas chaves:

```env
# API-Football
API_FOOTBALL_KEY=sua_chave_aqui
API_FOOTBALL_HOST=v3.football-data.org

# Firebase
FIREBASE_API_KEY=sua_chave_aqui
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto
FIREBASE_STORAGE_BUCKET=seu_bucket
FIREBASE_MESSAGING_SENDER_ID=seu_id
FIREBASE_APP_ID=seu_app_id

# Perplexity AI
PERPLEXITY_API_KEY=sua_chave_aqui

# Configurações do Bot
BOT_MODE=production  # development ou production
LOG_LEVEL=info       # debug, info, warn, error
```

### Passo 4: Iniciar o Bot

```bash
npm start
```

Você verá um QR Code no terminal. **Escaneie com o WhatsApp** do seu celular.

⚠️ **Importante**: Mantenha o terminal aberto enquanto o bot estiver ativo.

---

## 🖣️ Componentes Principais

### 1. **WhatsApp Bot (bot.js)**

- Conecta usando Baileys (biblioteca não-oficial)
- Recebe mensagens JSON com dados de apostas
- Valida cada aposta com APEX
- Calcula stake com Kelly Criterion
- Envia resposta com aprovação ou rejeição

### 2. **Firebase (Firestore)**

Coletas:
- `fixtures` - Dados de partidas
- `bets` - Histórico de apostas
- `users` - Configuração de usuários
- `analytics` - Métricas e relatórios

### 3. **API-Football**

Endpoints utilizados:
- `/fixtures` - Lista de partidas
- `/odds` - Odds disponíveis
- `/leagues` - Campeonatos
- `/standings` - Tabelas

### 4. **Perplexity AI**

- Analisa tendências de apostas
- Gera recomendações
- Validar probabilidades
- Explica decisões

---

## 📱 Guia de Uso do WhatsApp Bot

### Comandos Disponíveis

#### 1. **/help** - Listar Comandos

```
/help
```

Resposta:
```
Comandos disponíveis:
/help - Esta mensagem
/status - Status da banca
/odds - Últimas odds
/history - Histórico
/settings - Configurações
```

#### 2. **/status** - Ver Status da Banca

```
/status
```

Resposta:
```
🏆 STATUS DA BANCA

Banca Total: R$ 1000,00
Ganhos: R$ 150,00
Perdas: R$ 50,00
Lucro Líquido: R$ 100,00
Rentabilidade: 10%

Apostas Ativas: 3
Apostas Ganhas: 5
Apostas Perdidas: 1

Taxa de Acerto: 83.3%
⚠️ Stop-Loss (12%): R$ 120,00 (12% faltando)
```

#### 3. **/odds** - Últimas Odds

```
/odds
```

Resposta:
```
📊 Últimas Odds (API-Football)

[Flamengo vs Vasco]
Over 2.5: 1.75
Over 1.5: 1.35
Vitória Flamengo: 2.10

[São Paulo vs Corinthians]
Empate: 3.50
Over 2.5: 1.65
```

#### 4. Enviar Aposta (JSON)

Formato:

```json
{
  "fixture_id": 71823,
  "market": "Over 2.5 Gols",
  "line": 2.5,
  "probabilidade": 0.65,
  "odds": 1.75
}
```

Envie como mensagem no WhatsApp. O bot responderá:

```
✅ APOSTA VALIDADA

Partida: [Flamengo vs Vasco]
Mercado: Over 2.5 Gols

Análise APEX:
✓ Stop-Loss: OK (Margem: 12%)
✓ Stake Máximo: OK (5% da banca)
✓ Probabilidade: OK (65% > 40%)

Cálculo Kelly Criterion:
Formula: f = (P × O - 1) / (O - 1) × 0.25
P (Prob): 0.65
O (Odds): 1.75
Stake Recomendado: R$ 45,00 (4.5% da banca)

💰 RESUMO:
Apostar: R$ 45,00
Retorno Potencial: R$ 78,75
Lucro Esperado: R$ 33,75

⚠️ Dica: Mantenha disciplina e siga o stake recomendado.
```

---

## 🔗 APIs e Integrações

### API-Football

**Endpoint**: https://v3.football-data.org

**Autenticação**: Header `X-Auth-Token`

**Exemplo - Listar Fixtures**:

```bash
curl -X GET "https://v3.football-data.org/v1/fixtures" \
  -H "X-Auth-Token: YOUR_API_KEY"
```

**Resposta**:

```json
{
  "fixtures": [
    {
      "id": 71823,
      "homeTeam": "Flamengo",
      "awayTeam": "Vasco",
      "utcDate": "2024-01-15T20:30:00Z",
      "status": "SCHEDULED",
      "odds": {
        "over25": 1.75,
        "under25": 2.10
      }
    }
  ]
}
```

### Firebase Realtime

**Coleção**: `/bets`

**Estrutura**:

```json
{
  "user_id": "5511987654321",
  "fixture_id": 71823,
  "market": "Over 2.5",
  "stake": 45.00,
  "odds": 1.75,
  "potential_return": 78.75,
  "status": "pending",
  "created_at": "2024-01-15T20:00:00Z",
  "result": null
}
```

### Perplexity AI

**Endpoint**: https://api.perplexity.ai/chat/completions

**Modelo**: pplx-7b-chat

**Exemplo**:

```bash
curl -X POST "https://api.perplexity.ai/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "pplx-7b-chat",
    "messages": [
      {
        "role": "user",
        "content": "Qual é a probabilidade de Over 2.5 gols em Flamengo vs Vasco?"
      }
    ]
  }'
```

---

## 📏 Cálculos Matemáticos

### 1. Kelly Criterion

**Fórmula**:
```
f = (P × O - 1) / (O - 1) × F
```

Onde:
- **f** = Fração ideal da banca a apostar
- **P** = Probabilidade do evento (0 a 1)
- **O** = Odds da aposta
- **F** = Fração de segurança APEX (0.25)

**Exemplo**:
- Probabilidade: 65% (0.65)
- Odds: 1.75
- Banca: R$ 1000

```
f = (0.65 × 1.75 - 1) / (1.75 - 1) × 0.25
f = (1.1375 - 1) / 0.75 × 0.25
f = 0.1375 / 0.75 × 0.25
f = 0.1833 × 0.25
f = 0.04583

Stake = 0.04583 × 1000 = R$ 45,83
```

### 2. Validação APEX (3 Camadas)

#### Camada 1: Stop-Loss Diário (12%)

```javascript
if (bancaAtual < (bancaInicial * 0.88)) {
  retornar "Bot bloqueado - Stop-Loss acionado";
}
```

#### Camada 2: Stake Máximo (5% da Banca)

```javascript
if (stake > (banca * 0.05)) {
  stake = banca * 0.05;
  console.log(`Stake reduzido para R$ ${stake}`);
}
```

#### Camada 3: Probabilidade Mínima (40%)

```javascript
if (probabilidade < 0.40) {
  retornar "Aposta rejeitada - Probabilidade < 40%";
}
```

---

## 🔧 Troubleshooting

### Problema 1: "Bot não conecta ao WhatsApp"

**Soluções**:

1. Verifique Node.js v16+:
   ```bash
   node --version
   ```

2. Delete pasta `auth/` e reconecte:
   ```bash
   rm -rf auth/
   npm start
   ```

3. Escaneie QR Code novamente

4. Verifique internet ativa

### Problema 2: "API_FOOTBALL_KEY não configurada"

**Solução**:

1. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Adicione sua chave:
   ```env
   API_FOOTBALL_KEY=sua_chave_123456
   ```

3. Reinicie:
   ```bash
   npm start
   ```

### Problema 3: "Stake não é calculada"

**Causa**: Probabilidade ou odds inválidas

**Solução**:

- Probabilidade entre 0 e 1: `0.65` (não 65)
- Odds deve ser > 1: `1.75` (não 0.75)
- Exemplo válido:
  ```json
  {
    "probabilidade": 0.65,
    "odds": 1.75
  }
  ```

### Problema 4: "Firebase não salva dados"

**Solução**:

1. Verifique credenciais no `.env`
2. Teste conexão:
   ```bash
   npm run test:firebase
   ```
3. Verifique Firestore Rules (Público para teste)

---

## ❓ Perguntas Frequentes

### P: Qual é a taxa de acerto do bot?

**R**: Depende da qualidade das recomendações da IA e da aderência ao Kelly Criterion. Em testes:
- Taxa esperada: 55-65%
- Com disciplina: 70%+

### P: Posso usar em produção?

**R**: Sim, mas com cuidados:
- Comece com banca pequena
- Acompanhe os primeiros 100 jogos
- Valide as recomendações manualmente

### P: O Kelly Criterion garante lucro?

**R**: Não. Kelly garante **crescimento exponencial** com probabilidades corretas:
- Se P > 40% e O válido: Crescimento esperado
- Se P < 40%: Banca diminui

### P: Como resetar a banca?

**R**: Delete dados no Firebase:

1. Vá para Firebase Console
2. Firestore > Coleta `bets`
3. Delete documentos antigos
4. Ou crie novo projeto

### P: Posso usar WhatsApp Business?

**R**: Sim, com a API Oficial:

```javascript
// Em vez de Baileys, use:
const client = new WhatsAppWebClient({
  accessToken: 'seu_token_oficial'
});
```

### P: Como integrar Telegram?

**R**: Use bot-telegram:

```bash
npm install node-telegram-bot-api
```

Depois, no bot.js:

```javascript
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

bot.on('message', async (msg) => {
  // Processar mesma lógica de apostas
});
```

---

## 🏆 Métricas e KPIs

### Dashboard Recomendado

```
📋 ANÁLISE MENSAL

Banca Inicial: R$ 1000
Banca Atual: R$ 1150
Lucro Líquido: R$ 150
Rentabilidade: +15% ao mês

Apostas Totais: 25
Ganhas: 18 (72%)
Perdidas: 7 (28%)

Maior Vitória: R$ 85,50
Maior Derrota: -R$ 45,00

Razao Ganho/Perda: 1:1.5
Expectáncia Matemática: +R$ 6/aposta
```

---

## 🚧 Suporte

### Recursos

- 📄 **Documentação**: [GitHub Wiki](https://github.com/newjsouza/apostas-live-analytics/wiki)
- 📃 **Issues**: [Reportar bugs](https://github.com/newjsouza/apostas-live-analytics/issues)
- 📚 **API-Football Docs**: https://www.api-football.com/documentation
- 🤖 **Perplexity Docs**: https://docs.perplexity.ai
- 💫 **Firebase Docs**: https://firebase.google.com/docs

### Comunidade

Conecte-se com outros usuários:

- GitHub Discussions
- Discord: [Comunidade Apostas Analytics]
- WhatsApp: [Grupo de Suporte]

---

## 📜 Versão do Documento

| Versão | Data | Alterações |
|---------|------|---------------|
| 1.0 | 2024-12-15 | Versão Inicial |
| 1.1 (Planejado) | 2024-12-31 | Suporte a Telegram |
| 2.0 (Planejado) | 2025-02-01 | Dashboard Web |

---

## © Licença

**MIT License** © 2025 newjsouza

Você é livre para:
- ✓ Usar em produção
- ✓ Modificar
- ✓ Distribuir
- ✗ Remover citação de autor

---

## 🙋 Agradecimentos

Manutenedores de bibliotecas criticas:

- **Baileys** - Comunidade WhatsApp
- **Firebase** - Google Cloud
- **API-Football** - Dados esportivos
- **Perplexity AI** - Análises inteligentes

---

**”O sucesso nas apostas não é sorte, é disciplina + matemática + tecnologia.”**

**Desenvolvido com ❤️ para a comunidade de apostadores inteligentes.**

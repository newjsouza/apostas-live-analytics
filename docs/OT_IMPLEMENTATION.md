# Apostas Live Analytics - OT Implementation Documentation

## Project Overview
A real-time sports betting analytics platform integrating live match data, betting predictions, and multi-channel notifications via WhatsApp, Telegram, and Firebase.

## Architecture Stack

### Core APIs & Data Sources

#### 1. API-Football (api-football.com)
Provider of comprehensive football data with +1,100 competitions coverage.

**Key Endpoints:**
- **Fixtures**: `GET v3.football.api-sports.io/fixtures?league={league_id}&season={year}&status={status}`
  - Parameters: league, season, status (LIVE, FT, etc.)
  - Real-time updates every 15 seconds

- **Standings**: `GET v3.football.api-sports.io/standings?league={league_id}&season={year}`
  - League tables and rankings
  - Position, points, goal differential

- **Statistics**: `GET v3.football.api-sports.io/statistics?fixture={fixture_id}`
  - Team/player stats
  - Possession, shots, passes

- **Live Events**: `GET v3.football.api-sports.io/events?fixture={fixture_id}`
  - Real-time game events (goals, cards, substitutions)
  - 15-second update frequency

- **Predictions**: `GET v3.football.api-sports.io/predictions?fixture={fixture_id}`
  - AI-generated match predictions
  - Winner probabilities, correct score odds
  - Uses 6 different algorithms

- **Odds**: `GET v3.football.api-sports.io/odds?fixture={fixture_id}`
  - Pre-match and live odds
  - Multiple bookmakers coverage
  - Betting markets (moneyline, spreads, totals)

#### 2. Betting Odds APIs

**The Odds API** (the-odds-api.com)
- Real-time odds from 100+ sportsbooks
- Markets: moneyline, spreads, totals, props
- Player props and alternate lines

**OddsJam** (oddsjam.com)
- Fastest odds data (processes 1M odds/second)
- 100+ sportsbook feeds
- Pre-game and in-play odds
- Injury reports and player news

**OpticOdds** (opticodds.com)
- 200+ sportsbook data feeds
- Sub-second latency
- Full line coverage (mains, alternates, props, outrights)

#### 3. Sportmonks Football API
- Advanced predictions and machine learning models
- 1350+ leagues coverage
- 20+ prediction markets
- Fixture statistics and team data

### Cloud & Database Infrastructure

#### Firebase (Cloud Backend)
**Account**: apostasnewjsouza@gmail.com

**Services to Configure:**
1. **Firestore Database**
   - Real-time match data storage
   - Fixture results and statistics
   - User betting slips and history
   - Collections:
     - `/fixtures/{fixtureId}` - Match data
     - `/odds/{oddsId}` - Betting lines
     - `/predictions/{predictionId}` - AI predictions
     - `/users/{userId}/bets` - User bets
     - `/alerts/{alertId}` - Notifications log

2. **Realtime Database**
   - Live score streaming
   - Event updates (goals, cards, etc.)
   - User presence tracking

3. **Cloud Functions**
   - API polling triggers
   - Data transformation and enrichment
   - WhatsApp/Telegram message sending
   - Prediction calculation and storage

4. **Authentication**
   - Email/password for admin users
   - Service accounts for API integrations

### Deployment Platform: Render (render.com)

**Backend Service Architecture:**
```
Render Web Service (Node.js/Python)
├── API Polling Worker (5-15 min intervals)
├── WebSocket Server (Real-time updates)
├── REST API Endpoints
└── Worker Threads (Background jobs)
```

**Environment Variables to Configure:**
```
API_FOOTBALL_KEY=your_key
THE_ODDS_API_KEY=your_key
ODDSJAM_API_KEY=your_key
PERPLEXITY_API_KEY=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
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_key
TELEGRAM_BOT_TOKEN=your_token
WHATSAPP_PHONE_ID=your_phone_id
WHATSAPP_API_TOKEN=your_token
RENDER_API_KEY=your_render_key
```

### Multi-Channel Notification System

#### 1. WhatsApp Business Platform
**Account**: apostasnewjsouza@gmail.com (via Meta)

**Message Templates:**
- Live match alerts with score updates
- Betting recommendation notifications
- Odds movement alerts
- Parlay/accumulator reminders

**Integration Points:**
- Cloud API endpoint: `https://graph.facebook.com/v17.0/{PHONE_ID}/messages`
- Template variables for dynamic content
- Media support (match images, stats graphs)

#### 2. Telegram Bot
**Implementation Details:**
- Bot Token: Configure in Render environment
- Commands:
  - `/bet` - Place a bet
  - `/odds LEAGUE` - Get current odds
  - `/live` - Live match updates
  - `/stats TEAM` - Team statistics
  - `/predictions` - AI predictions
  - `/subscribe` - Enable notifications

**Message Types:**
- Text updates (scores, goals, cards)
- Inline buttons (quick bet placement)
- Inline keyboards (league selection)
- Media (match images, stats)

#### 3. Firebase Cloud Messaging (FCM)
- App notifications (if mobile app developed)
- Web push notifications
- Topic-based subscriptions (per league/team)

### Data Pipeline Architecture

```
API-Football/Odds APIs
       |
       v
[Render Polling Worker]
  (Fetch every 15 seconds for live, 5 min for fixtures)
       |
       v
[Data Transformation & Enrichment]
  - Normalize data formats
  - Calculate statistics
  - Generate predictions
       |
       v
[Firebase Firestore]
  - Store raw data
  - Maintain history
       |
       +-----> [Alert Engine]
       |         - Check prediction thresholds
       |         - Identify odds movements
       |         - Find value bets
       |
       +-----> [Notification Service]
               - WhatsApp messages
               - Telegram updates
               - Firebase notifications
```

## Integration Steps

### Phase 1: API Setup
1. **API-Football**
   - Register at api-football.com
   - Obtain API key
   - Test endpoints in Postman
   - Document response formats

2. **Betting Odds APIs**
   - Register at The Odds API
   - Register at OddsJam (optional for higher frequency)
   - Test market data endpoints
   - Verify sportsbook coverage

3. **Perplexity API**
   - API Key: `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`
   - Integrate for AI-powered insights and analysis
   - Use for generating betting recommendations

### Phase 2: Firebase Setup
1. Create Firebase project
2. Set up Firestore database with collections
3. Configure Cloud Functions
4. Set up service account authentication
5. Deploy initial Cloud Functions for data ingestion

### Phase 3: Render Deployment
1. Create Render account and link GitHub repo
2. Configure environment variables
3. Deploy Node.js/Python backend service
4. Set up background workers for API polling
5. Configure webhooks for real-time updates

### Phase 4: WhatsApp Integration
1. Access Meta Business Manager
2. Create WhatsApp Business Account
3. Configure message templates
4. Set up webhooks for incoming messages
5. Implement Cloud API client library

### Phase 5: Telegram Integration
1. Create Telegram Bot via @BotFather
2. Implement bot handlers in backend
3. Deploy message queue for reliability
4. Set up scheduled messages

### Phase 6: Testing
1. API endpoint testing (all data sources)
2. Real-time data streaming tests
3. Notification delivery tests
4. Load testing (handle concurrent requests)
5. End-to-end workflow tests

## Betting Recommendations Module

**Integrated from**: @Apostas platform data

**Features:**
- Value bet identification (odds > AI model probability)
- Parlay optimization (combination analysis)
- Streak analysis (hot/cold teams)
- Injury impact assessment
- Weather influence on match outcome
- Head-to-head historical performance

**Data Source Integration:**
- Combine API-Football statistics
- Perplexity AI analysis for insights
- Odds movement tracking
- Market consensus analysis

## Monitoring & Analytics

**Metrics to Track:**
- API response times
- Data freshness (latency from source)
- Prediction accuracy (track vs. actual results)
- Notification delivery rates
- User engagement metrics
- ROI on recommended bets

**Tools:**
- Render logs and monitoring
- Firebase Analytics
- Telegram bot analytics
- WhatsApp delivery reports

## Security Considerations

1. **API Keys**: Store in Render environment variables only
2. **Database**: Enable Firestore security rules
3. **Authentication**: Implement OAuth for admin panel
4. **Data Encryption**: Enable Firebase encryption at rest
5. **Rate Limiting**: Implement API request throttling
6. **User Data**: GDPR compliance for EU users

## Next Steps

1. [ ] Create Firebase project and configure Firestore
2. [ ] Set up Render deployment environment
3. [ ] Implement API polling worker service
4. [ ] Configure WhatsApp message templates
5. [ ] Set up Telegram bot handlers
6. [ ] Implement betting recommendations engine
7. [ ] Deploy and test end-to-end
8. [ ] Set up monitoring and alerts
9. [ ] Configure data backup strategy
10. [ ] Launch beta testing with limited users

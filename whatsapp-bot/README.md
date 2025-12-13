# WhatsApp Bot para Apostas Live Analytics

Bot inteligente com integracao de apostas, Kelly Criterion e validacao APEX.

## Caracteristicas

- Recepcao de Webhooks de apostas
- Validacao APEX (Stop-Loss 12%, Stake maximo 5%)
- Kelly Criterion automatico (fracao 0.25)
- Calculo de Parciais em tempo real
- Integracao API-Football
- Multi-canal (WhatsApp, Telegram, Firebase)

## Instalacao

```bash
cd apostas-live-analytics/whatsapp-bot
npm install
cp .env.example .env
```

Configure suas chaves no arquivo `.env` e execute:

```bash
npm start
```

Escaneie o QR Code com WhatsApp para conectar.

## Comandos

- `/help` - Listar comandos
- `/status` - Ver status da banca
- `/odds` - Ultimas odds
- JSON - Processar recomendacao de aposta

## Formato de Aposta (JSON)

```json
{
  "fixture_id": 71823,
  "market": "Over 2.5 Gols",
  "line": 2.5,
  "probabilidade": 0.65,
  "odds": 1.75
}
```

## Validacao APEX

Todas as apostas passam por 3 filtros:

1. **Stop-Loss Diario (12%)**  
   Se perdeu 12% da banca, bot bloqueia

2. **Stake Maximo (5%)**  
   Aposta nao pode exceder 5% da banca

3. **Probabilidade Minima (40%)**  
   Rejeita apostas com prob < 40%

## Kelly Criterion

Formula: `f = (P * O - 1) / (O - 1) * 0.25`

Onde:
- P = Probabilidade
- O = Odds
- 0.25 = Fracao de seguranca APEX

## Opcoes de Implantacao

1. **Baileys (Nao Oficial)**
   - Simples e rapido
   - Uso: Desenvolvimento

2. **API Oficial Meta**
   - Suporte oficial
   - Requer WhatsApp Business
   - Uso: Producao

3. **Plataformas Prontas**
   - Zenvia, ManyChat, Chat-API, BotPress

## Arquivos

- `bot.js` - Bot principal (Baileys)
- `package.json` - Dependencias
- `.env.example` - Template de variaveis
- `auth/` - Credenciais WhatsApp

## Troubleshooting

**Bot nao conecta**
- Use Node.js v16+
- Delete pasta `auth/` e reconecte
- Escaneie QR Code novamente

**API_FOOTBALL_KEY nao configurada**
- Copie `.env.example` para `.env`
- Adicione sua chave

**Stake nao calculada**
- Probabilidade entre 0 e 1 (0.65 = 65%)
- Odds > 1 (use 1.75, nao 0.75)

## Licenca

MIT © 2025 newjsouza

Desenvolvido para Apostas Live Analytics

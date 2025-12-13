// Bot WhatsApp com Baileys
// Integra recomendações de apostas, Kelly Criterion e validação APEX

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, MessageType } = require('@baileys/baileys');
const QRCode = require('qrcode-terminal');
const pino = require('pino');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configurações
const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const BANCA_TOTAL = parseFloat(process.env.BANCA_TOTAL || '1000');
const KELLY_FRACTION = 0.25; // Kelly Fracionado (padrão APEX)

// Estado global
let bancaAtual = BANCA_TOTAL;
let perdaDiariaAtual = 0;
const limitePerda = BANCA_TOTAL * 0.12; // Stop-Loss 12%

// Funções de Validação APEX
function validarRegrasAPEX(stake, probabilidade) {
  const mensagens = [];
  
  // Regra 1.1: Stop-Loss Diário
  if (perdaDiariaAtual >= limitePerda) {
    return {
      aprovado: false,
      mensagens: ['❌ STOP-LOSS DIÁRIO ATINGIDO (12%). Operações suspensas!'],
      stake: 0
    };
  }
  
  // Regra 1.3: Stake máximo 5% da banca
  const stakeMaximo = BANCA_TOTAL * 0.05;
  if (stake > stakeMaximo) {
    mensagens.push(`⚠️ Stake ajustado: ${stake} → ${stakeMaximo.toFixed(2)}`);
    stake = stakeMaximo;
  }
  
  // Validar probabilidade
  if (probabilidade < 0.4) {
    return {
      aprovado: false,
      mensagens: ['❌ Probabilidade muito baixa (<40%)'],
      stake: 0
    };
  }
  
  return {
    aprovado: true,
    mensagens: ['✅ Aprovado pela validação APEX'],
    stake: stake
  };
}

// Calcular stake via Kelly Criterion (fórmula: (P*O-1)/(O-1)*fração)
function calcularStakeKelly(probabilidade, odds, frac = KELLY_FRACTION) {
  const kellyPercentual = (probabilidade * odds - 1) / (odds - 1);
  const stakeKelly = (kellyPercentual * frac) * bancaAtual;
  return Math.max(10, Math.min(stakeKelly, BANCA_TOTAL * 0.05));
}

// ConsultarAPI-Football
async function consultarEstatisticas(fixtureId) {
  try {
    const url = `https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`;
    const response = await axios.get(url, {
      headers: { 'x-rapidapi-key': API_FOOTBALL_KEY }
    });
    return response.data.response || null;
  } catch (error) {
    console.error('Erro ao consultar API-Football:', error.message);
    return null;
  }
}

// Processar recomendações de apostas
async function processarRecomendacao(dados) {
  console.log('\n📊 PROCESSANDO RECOMENDAÇÃO:', dados);
  
  const { fixture_id, market, line, probabilidade, odds } = dados;
  
  // 1. Validação APEX
  const stake = calcularStakeKelly(probabilidade, odds);
  const validacao = validarRegrasAPEX(stake, probabilidade);
  
  if (!validacao.aprovado) {
    return {
      status: 'BLOQUEADO',
      mensagens: validacao.mensagens
    };
  }
  
  // 2. Consultar dados ao vivo
  const stats = await consultarEstatisticas(fixture_id);
  
  // 3. Análise de Parciais
  const resposta = {
    status: 'APROVADO',
    jogo_id: fixture_id,
    mercado: market,
    linha_alvo: line,
    odds: odds,
    probabilidade: (probabilidade * 100).toFixed(2) + '%',
    stake_recomendada: validacao.stake.toFixed(2),
    validacao: validacao.mensagens,
    timestamp: new Date().toISOString()
  };
  
  return resposta;
}

// Inicializar Bot
async function iniciarBot() {
  const logger = pino({ level: 'silent' });
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  
  const bot = makeWASocket({
    auth: state,
    logger: logger,
    printQRInTerminal: true
  });
  
  // QR Code para conexão
  bot.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('\n📱 ESCANEIE O QR CODE ABAIXO COM SEU WHATSAPP:\n');
      QRCode.generate(qr, { small: true });
    }
    
    if (connection === 'connecting') {
      console.log('🔄 Conectando...');
    }
    
    if (connection === 'open') {
      console.log('\n✅ BOT CONECTADO COM SUCESSO!\n');
      console.log('Aguardando mensagens...');
    }
    
    if (connection === 'close') {
      const shouldRetry = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('\n⚠️ Desconectado:', lastDisconnect?.error?.message);
      if (shouldRetry) {
        console.log('Reconectando em 3 segundos...');
        setTimeout(iniciarBot, 3000);
      }
    }
  });
  
  // Salvar credenciais
  bot.ev.on('creds.update', saveCreds);
  
  // Processar Mensagens
  bot.ev.on('messages.upsert', async (m) => {
    if (!m.messages) return;
    
    const msg = m.messages[0];
    if (msg.key.fromMe) return;
    
    const chatId = msg.key.remoteJid;
    const texto = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const isGroup = chatId.includes('@g.us');
    
    console.log(`\n📨 [${isGroup ? 'GRUPO' : 'PRIVADO'}] ${texto}`);
    
    // Comandos do bot
    if (texto.toLowerCase() === '/help') {
      const help = `
🤖 *BOT APOSTAS LIVE ANALYTICS*\n
Comandos disponíveis:\n
/status - Ver status da banca\n/odds - Últimas odds\n/help - Este menu\n/recomendacao - Simular aposta\n
Envie uma recomendação em JSON:\n{"fixture_id": 123, "market": "Over 2.5", "line": 2.5, "probabilidade": 0.65, "odds": 1.8}`;
      
      await bot.sendMessage(chatId, { text: help });
    }
    
    if (texto.toLowerCase() === '/status') {
      const status = `
💰 *STATUS DA BANCA*\n
Banca Total: R$ ${BANCA_TOTAL.toFixed(2)}\nBanca Atual: R$ ${bancaAtual.toFixed(2)}\nPerda Diária: R$ ${perdaDiariaAtual.toFixed(2)}\nLimite Stop-Loss: R$ ${limitePerda.toFixed(2)}\n
Status: ${perdaDiariaAtual >= limitePerda ? '❌ STOP-LOSS ATIVO' : '✅ OPERACIONAL'}`;
      
      await bot.sendMessage(chatId, { text: status });
    }
    
    // Processar JSON de recomendação
    try {
      const json = JSON.parse(texto);
      if (json.fixture_id && json.market) {
        const resultado = await processarRecomendacao(json);
        const resposta = JSON.stringify(resultado, null, 2);
        await bot.sendMessage(chatId, { text: '```' + resposta + '```' });
      }
    } catch (e) {
      // Não é JSON, ignorar
    }
  });
}

// Iniciar
if (!API_FOOTBALL_KEY) {
  console.error('❌ ERRO: API_FOOTBALL_KEY não configurada no .env');
  process.exit(1);
}

iniciarBot().catch(console.error);

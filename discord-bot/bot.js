const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const PREFIX = process.env.DISCORD_PREFIX || '!';
let bancaAtual = parseFloat(process.env.BANCA_TOTAL || '1000');
let perdaDiariaAtual = 0;

// Bot Ready
client.on('ready', () => {
  console.log(`\n✅ Bot conectado como ${client.user.tag}`);
  client.user.setActivity('/help - Apostas Live Analytics', { type: 'WATCHING' });
});

// Message Handler
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  // Comandos com Prefix
  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    try {
      switch(command) {
        case 'help':
          enviarHelp(message);
          break;
        case 'status':
          enviarStatus(message);
          break;
        case 'analise':
          analisarAposta(message, args);
          break;
        case 'odds':
          obterOdds(message, args);
          break;
        default:
          message.reply('❌ Comando não reconhecido. Use `!help`');
      }
    } catch (error) {
      console.error('Erro ao processar comando:', error);
      message.reply('❌ Erro ao processar comando.');
    }
  }
  
  // JSON de Aposta
  if (message.content.startsWith('{') && message.content.includes('fixture_id')) {
    try {
      const json = JSON.parse(message.content);
      processarRecomendacao(message, json);
    } catch (e) {
      // Não é JSON válido
    }
  }
});

// Enviar Help
function enviarHelp(message) {
  const helpEmbed = {
    color: 0x00ff00,
    title: '🤖 Bot Apostas Live Analytics',
    description: 'Sistema inteligente de análise de apostas com Kelly Criterion e validação APEX',
    fields: [
      {
        name: '📋 Comandos',
        value: '`!help` - Este menu\n`!status` - Status da banca\n`!analise` - Análise de aposta\n`!odds` - Últimas odds',
        inline: false
      },
      {
        name: '💰 Formatos',
        value: '**JSON de Aposta:**\n```json\n{\n  "fixture_id": 123,\n  "market": "Over 2.5",\n  "line": 2.5,\n  "probabilidade": 0.65,\n  "odds": 1.8\n}\n```',
        inline: false
      }
    ],
    footer: {
      text: 'Apostas Live Analytics'
    }
  };
  message.reply({ embeds: [helpEmbed] });
}

// Enviar Status
function enviarStatus(message) {
  const statusEmbed = {
    color: 0x0099ff,
    title: '💰 Status da Banca',
    fields: [
      { name: 'Banca Total', value: `R$ ${parseFloat(process.env.BANCA_TOTAL || '1000').toFixed(2)}`, inline: true },
      { name: 'Banca Atual', value: `R$ ${bancaAtual.toFixed(2)}`, inline: true },
      { name: 'Perda Diária', value: `R$ ${perdaDiariaAtual.toFixed(2)}`, inline: true },
      { name: 'Status', value: perdaDiariaAtual >= (parseFloat(process.env.BANCA_TOTAL || '1000') * 0.12) ? '❌ STOP-LOSS ATIVO' : '✅ OPERACIONAL', inline: false }
    ],
    footer: { text: 'Atualizado em ' + new Date().toLocaleString('pt-BR') }
  };
  message.reply({ embeds: [statusEmbed] });
}

// Processar Recomendação
async function processarRecomendacao(message, dados) {
  const { fixture_id, market, line, probabilidade, odds } = dados;
  
  if (!fixture_id || !market) {
    message.reply('❌ JSON inválido. Use o formato correto.');
    return;
  }
  
  // Cálculo Kelly
  const stake = calcularStakeKelly(probabilidade, odds);
  
  // Validação APEX
  const validacao = validarRegrasAPEX(stake, probabilidade);
  
  if (!validacao.aprovado) {
    message.reply({ embeds: [{
      color: 0xff0000,
      title: '❌ Aposta Bloqueada',
      fields: validacao.mensagens.map(m => ({ name: '⚠️', value: m }))
    }] });
    return;
  }
  
  // Resposta
  const resultadoEmbed = {
    color: 0x00ff00,
    title: '✅ Aposta Aprovada',
    fields: [
      { name: 'Jogo', value: `#${fixture_id}`, inline: true },
      { name: 'Mercado', value: market, inline: true },
      { name: 'Probabilidade', value: `${(probabilidade * 100).toFixed(2)}%`, inline: true },
      { name: 'Odds', value: odds.toString(), inline: true },
      { name: 'Stake Recomendada', value: `R$ ${stake.toFixed(2)}`, inline: true },
      { name: 'Validação', value: validacao.mensagens.join('\n'), inline: false }
    ],
    footer: { text: 'Apostas Live Analytics' }
  };
  
  message.reply({ embeds: [resultadoEmbed] });
}

// Validação APEX
function validarRegrasAPEX(stake, probabilidade) {
  const limitePerda = parseFloat(process.env.BANCA_TOTAL || '1000') * 0.12;
  const mensagens = [];
  
  if (perdaDiariaAtual >= limitePerda) {
    return {
      aprovado: false,
      mensagens: ['❌ STOP-LOSS DIÁRIO ATINGIDO (12%). Operações suspensas!']
    };
  }
  
  const stakeMaximo = parseFloat(process.env.BANCA_TOTAL || '1000') * 0.05;
  if (stake > stakeMaximo) {
    stake = stakeMaximo;
    mensagens.push(`⚠️ Stake ajustado para máximo: R$ ${stakeMaximo.toFixed(2)}`);
  }
  
  if (probabilidade < 0.4) {
    return {
      aprovado: false,
      mensagens: ['❌ Probabilidade muito baixa (<40%)']
    };
  }
  
  mensagens.push('✅ Validação APEX OK');
  
  return {
    aprovado: true,
    mensagens: mensagens,
    stake: stake
  };
}

// Kelly Criterion
function calcularStakeKelly(probabilidade, odds, frac = 0.25) {
  const KELLY_FRACTION = frac;
  const kellyPercentual = (probabilidade * odds - 1) / (odds - 1);
  const stakeKelly = (kellyPercentual * KELLY_FRACTION) * bancaAtual;
  return Math.max(10, Math.min(stakeKelly, bancaAtual * 0.05));
}

// Análise de Aposta
function analisarAposta(message, args) {
  const analiseEmbed = {
    color: 0xffaa00,
    title: '📊 Análise de Aposta',
    description: 'Envie um JSON com os dados da aposta para análise completa',
    fields: [
      {
        name: 'Exemplo:',
        value: '```json\n{\n  "fixture_id": 123,\n  "market": "Over 2.5",\n  "line": 2.5,\n  "probabilidade": 0.65,\n  "odds": 1.8\n}\n```'
      }
    ]
  };
  message.reply({ embeds: [analiseEmbed] });
}

// Obter Odds
async function obterOdds(message, args) {
  message.reply('Em desenvolvimento...');
}

// Login
client.login(process.env.DISCORD_TOKEN);

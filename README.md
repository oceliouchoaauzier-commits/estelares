# 🌟 ESTELARES - Agente Pessoal Modular

**Versão:** 0.1.0  
**Status:** ✅ Pronto para Usar!

## 📋 O que é?

**ESTELARES** é uma arquitetura modular para criar um agente pessoal inteligente com segurança de ponta e integração com OpenAI GPT-4.

### ✨ Características
- ✅ Arquitetura Modular Escalável
- ✅ Sem Credenciais no Frontend
- ✅ Interface Responsiva
- ✅ Suporte a Voz (Web Speech API)
- ✅ Sistema de Comandos
- ✅ Memória Persistente
- ✅ Rate Limiting & Proteção
- ✅ OpenAI GPT-4 Integration
- ✅ **Pronto para rodar agora!** 🚀

## 🚀 Quick Start (3 passos)

### 1️⃣ Instalar dependências
```bash
cd backend
npm install
```

### 2️⃣ Iniciar o backend
```bash
npm start
```

### 3️⃣ Abrir o frontend (em outro terminal)
```bash
python -m http.server 8000
# ou: npx http-server . -p 8000
```

**Acesse:** http://localhost:8000 ✨

---

## 📚 Módulos

| Módulo | Descrição | Status |
|--------|-----------|--------|
| **Core** | Núcleo central da aplicação | ✅ |
| **Chat** | Histórico de mensagens | ✅ |
| **Memory** | Persistência local com localStorage | ✅ |
| **Commands** | Sistema de comandos customizados | ✅ |
| **Tools** | Ferramentas seguras e validadas | ✅ |
| **Voice** | Web Speech API para entrada por voz | ⏳ |
| **AI** | Abstração para serviços de IA | ✅ |
| **App** | Integração e UI principal | ⏳ |

---

## 🔒 Segurança

✅ **Zero Credenciais no Frontend** - Todas as chaves no Backend  
✅ **Rate Limiting** - Máx 100 requisições por 15 min  
✅ **CORS** - Apenas localhost:8000 autorizado  
✅ **Input Validation** - Sanitização rigorosa de inputs  
✅ **Helmet Headers** - Proteção HTTP headers  
✅ **Chave Protegida** - `.env` no `.gitignore`

---

## 📡 Endpoints da API

### Health Check
```bash
GET http://localhost:3001/health
```

### Chat com IA ⭐
```bash
POST http://localhost:3001/api/chat
Content-Type: application/json

{
  "message": "Olá! Como você está?",
  "systemPrompt": "Você é um assistente amigável",
  "conversationId": "optional-uuid"
}
```

### Inference Custom
```bash
POST http://localhost:3001/api/inference
{
  "prompt": "Escreva um poema",
  "maxTokens": 2000,
  "temperature": 0.7
}
```

---

## 📖 Documentação Completa

Para guia detalhado, troubleshooting e configurações avançadas:  
→ Veja [SETUP.md](./SETUP.md)

---

## 🛠️ Scripts

```bash
npm start      # Produção
npm run dev    # Desenvolvimento com auto-reload
npm test       # Testes
```

---

## 📋 Estrutura

```
estelares/
├── backend/
│   ├── server.js         # ✅ Servidor pronto
│   ├── routes/chat.js    # ✅ API de chat
│   ├── .env              # ✅ Com sua chave!
│   ├── .gitignore        # ✅ Seguro
│   └── package.json      # ✅ Dependências
├── js/                   # 🎨 Frontend (a integrar)
├── css/                  # 🎨 Estilos
├── index.html           # 📄 Página principal
└── SETUP.md             # 📖 Guia completo
```

---

## 🎯 Status do Projeto

- ✅ Backend Express configurado
- ✅ Integração OpenAI GPT-4
- ✅ Endpoints de Chat e Inference
- ✅ Rate Limiting e Segurança
- ✅ Variáveis de ambiente (.env)
- ⏳ Frontend (próximo passo)
- ⏳ Web Speech API
- ⏳ Banco de dados

---

## 💡 Próximos Passos

1. Testar os endpoints (curl ou Postman)
2. Integrar endpoints no frontend em `js/`
3. Implementar UI para chat
4. Adicionar Web Speech API para voz
5. Persistência em banco de dados

---

## 📚 Referências

- [OpenAI GPT-4](https://platform.openai.com/docs/models)
- [Express.js](https://expressjs.com/)
- [Node.js](https://nodejs.org/docs/)

---

**Pronto para começar! 🎉**

Dúvidas? → [Issues](https://github.com/oceliouchoaauzier-commits/estelares/issues)

## 🚀 ESTELARES - Guia de Setup Completo

### 📋 Pré-requisitos

- **Node.js** 16+ ([Instalar](https://nodejs.org/))
- **npm** ou **yarn**
- **Chave OpenAI API** ✅ Você já tem!

---

## ⚙️ Instalação

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/oceliouchoaauzier-commits/estelares.git
cd estelares
```

### 2️⃣ Instalar dependências do Backend

```bash
cd backend
npm install
```

Isso instalará:
- ✅ express (servidor web)
- ✅ openai (SDK do OpenAI)
- ✅ dotenv (variáveis de ambiente)
- ✅ cors (controle de origem)
- ✅ helmet (segurança HTTP)
- ✅ express-rate-limit (limite de requisições)
- ✅ validator (sanitização de inputs)
- ✅ uuid (geração de IDs)
- ✅ nodemon (desenvolvimento)

### 3️⃣ Variáveis de Ambiente

✅ **Já configurado!** O arquivo `backend/.env` está pronto com sua chave.

Para verificar:
```bash
cat backend/.env
```

Se precisar mudar a porta ou FRONTEND_URL, edite o arquivo `.env`

### 4️⃣ Iniciar o Backend

Na pasta `backend/`:

```bash
npm start
```

ou para desenvolvimento com recarregamento automático:

```bash
npm run dev
```

Você verá:
```
🚀 ESTELARES Backend running on http://localhost:3001
📡 Frontend: http://localhost:8000
🔐 Environment: development
```

### 5️⃣ Iniciar o Frontend (em outro terminal)

Na **raiz do projeto** (não em `backend/`):

```bash
python -m http.server 8000
```

ou com Node.js:

```bash
npx http-server . -p 8000
```

Acesse: **http://localhost:8000** ✨

---

## ✅ Teste Rápido

Verifique se está funcionando:

```bash
# Terminal 3 - Teste o health check
curl http://localhost:3001/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2026-09-15T..."
}
```

### Teste o Chat

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Olá! Me diga um piada",
    "systemPrompt": "Você é um assistente engraçado"
  }'
```

---

## 📡 Endpoints Disponíveis

### 1. Health Check
```bash
GET http://localhost:3001/health

# Resposta:
{
  "status": "ok",
  "timestamp": "2026-09-15T19:30:00Z"
}
```

### 2. Chat com IA
```bash
POST http://localhost:3001/api/chat
Content-Type: application/json

{
  "message": "Sua mensagem aqui",
  "systemPrompt": "Instrução para a IA (opcional)",
  "conversationId": "uuid-opcional"
}

# Resposta:
{
  "id": "uuid-da-resposta",
  "conversationId": "uuid-da-conversa",
  "message": "Resposta da IA...",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 50,
    "total_tokens": 60
  },
  "timestamp": "2026-09-15T19:30:00Z"
}
```

### 3. Inference (Prompt Customizado)
```bash
POST http://localhost:3001/api/inference
Content-Type: application/json

{
  "prompt": "Escreva um poema sobre programação",
  "maxTokens": 2000,
  "temperature": 0.7
}

# Resposta:
{
  "result": "Resultado do prompt...",
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 100,
    "total_tokens": 105
  },
  "timestamp": "2026-09-15T19:30:00Z"
}
```

---

## 🔐 Segurança

✅ **Credenciais protegidas** - API key apenas no backend  
✅ **Rate Limiting** - Max 100 requisições a cada 15 min  
✅ **CORS** - Apenas localhost:8000 autorizado  
✅ **Helmet** - Headers de segurança HTTP ativados  
✅ **Input Validation** - Todos os inputs sanitizados  

---

## 🐛 Troubleshooting

### ❌ "Cannot find module 'express'"
```bash
cd backend
npm install
```

### ❌ "Port 3001 already in use"
```bash
# Use outra porta:
PORT=3002 npm start

# Ou encerre o processo usando a porta 3001
```

### ❌ "Error: Invalid API key"
```bash
# Verifique o .env
cat backend/.env | grep OPENAI_API_KEY

# Certifique-se de que a chave começa com "sk-"
```

### ❌ "CORS error - Origin not allowed"
```bash
# Edite backend/.env:
FRONTEND_URL=http://seu_ip:8000
# Depois reinicie o backend
```

### ❌ "Cannot connect to http://localhost:3001"
```bash
# Verifique se o backend está rodando
ps aux | grep "node server.js"

# Se não estiver, inicie:
cd backend && npm start
```

---

## 📚 Estrutura de Pastas

```
estelares/
├── backend/
│   ├── server.js           # 🔧 Servidor principal
│   ├── routes/
│   │   └── chat.js        # 💬 Rota de chat
│   ├── .env               # 🔐 Variáveis (com sua chave!)
│   ├── .env.example       # 📋 Template
│   ├── .gitignore         # 🛡️ Proteção de .env
│   ├── package.json       # 📦 Dependências
│   └── node_modules/      # (criado após npm install)
├── js/                    # 🎨 Frontend JavaScript
├── css/                   # 🎨 Estilos
├── index.html            # 📄 Página principal
├── SETUP.md              # 📖 Este guia
└── README.md             # 📖 Leia-me
```

---

## 🎯 Próximas Etapas

1. ✅ **Backend pronto** - rodando em `localhost:3001`
2. ✅ **API configurada** - com sua chave OpenAI
3. 📝 **Frontend** - integrar os endpoints em `js/`
4. 🎤 **Voz** - ativar Web Speech API
5. 💾 **Banco de dados** - adicionar persistência
6. 🎨 **UI/UX** - melhorar interface

---

## 📖 Scripts Disponíveis

```bash
# Na pasta backend/
npm start      # Iniciar em produção
npm run dev    # Iniciar com nodemon (auto-reload)
npm test       # Executar testes (quando configurados)
```

---

## 🔗 Referências

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Express.js Guide](https://expressjs.com/en/starter/basic-routing.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 💡 Dicas

- 🔄 Use `npm run dev` em desenvolvimento para recarregar automaticamente
- 📊 Monitore o uso de tokens nas respostas (economia de custos)
- 🚀 Quando colocar em produção, mude `NODE_ENV=production`
- 🔒 NUNCA commite o arquivo `.env` (está no `.gitignore`)

---

**Tudo pronto! 🎉 Seu agente pessoal está quase funcionando!**

Alguma dúvida? Abra uma [Issue](https://github.com/oceliouchoaauzier-commits/estelares/issues)

/**
 * ESTELARES - AI Module
 * 
 * Responsabilidade: Interface/Abstração para conexão com IA
 * 
 * IMPORTANTE:
 * - NÃO contém chaves de API
 * - NÃO contém tokens
 * - NÃO contém credenciais
 * - NÃO faz chamadas falsas
 * - Apenas define a interface para futura integração
 * 
 * A implementação real virá posteriormente através de servidor backend
 */

class AIModule {
    constructor() {
        this.configured = false;
        this.provider = null;
        this.model = null;
        this.conversationHistory = [];
        
        console.log('[AI] Módulo carregado (abstração)');
        console.log('[AI] ⚠️  Nenhum provedor de IA configurado ainda');
    }

    /**
     * Inicializa o módulo de IA
     * Verifica se está configurado
     * @returns {promise}
     */
    async init() {
        console.log('[AI] Verificando configuração...');
        
        // Verifica se há configuração salva
        // Isso seria recuperado do módulo de configuração futuramente
        
        if (!this.configured) {
            console.warn('[AI] Módulo não configurado. Use configure() antes de usar.');
        }
        
        return true;
    }

    /**
     * Configura o provedor de IA
     * Deve ser chamado APENAS pelo servidor/backend
     * @param {object} config - Configuração (NÃO deve incluir chaves)
     */
    configure(config) {
        if (!config || typeof config !== 'object') {
            throw new Error('[AI] Configuração inválida');
        }

        // Verifica se não há chaves sensíveis
        const sensibleKeys = ['apiKey', 'token', 'secret', 'password', 'credential'];
        for (const key of Object.keys(config)) {
            if (sensibleKeys.some(s => key.toLowerCase().includes(s))) {
                throw new Error('[AI] Configuração não pode conter chaves sensíveis!');
            }
        }

        this.provider = config.provider || null;
        this.model = config.model || null;
        this.configured = !!this.provider;

        console.log(`[AI] ✓ Configurado para: ${this.provider} (${this.model})`);
    }

    /**
     * Envia mensagem para a IA
     * Requer que esteja configurado
     * @param {string} message - Mensagem do usuário
     * @returns {promise} - Resposta da IA
     */
    async sendMessage(message) {
        if (!this.configured) {
            throw new Error('[AI] IA não configurada. Configure antes de usar.');
        }

        if (!message || typeof message !== 'string') {
            throw new Error('[AI] Mensagem inválida');
        }

        console.log('[AI] Aguardando resposta...');

        try {
            // Aqui a chamada real seria feita através de um endpoint seguro no backend
            // O frontend NUNCA faz chamadas diretas a APIs externas com credenciais
            
            const response = await this.callBackendAI(message);
            
            // Armazena no histórico
            this.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });

            this.conversationHistory.push({
                role: 'assistant',
                content: response.message,
                timestamp: new Date().toISOString()
            });

            return response;
        } catch (error) {
            console.error('[AI] Erro ao processar:', error.message);
            throw error;
        }
    }

    /**
     * Chamada ao backend (será implementado futuramente)
     * @private
     * @param {string} message - Mensagem
     * @returns {promise}
     */
    async callBackendAI(message) {
        // Esta chamada será implementada quando o backend estiver pronto
        // Exemplo futura implementação:
        // const response = await fetch('/api/ai/chat', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ message, history: this.conversationHistory })
        // });
        // return response.json();

        console.warn('[AI] callBackendAI não implementado. Aguardando backend.');
        throw new Error('Backend de IA não disponível. Sistema em desenvolvimento.');
    }

    /**
     * Limpa histórico de conversa
     */
    clearHistory() {
        this.conversationHistory = [];
        console.log('[AI] Histórico limpo');
    }

    /**
     * Retorna histórico da conversa
     * @returns {array}
     */
    getHistory() {
        return [...this.conversationHistory];
    }

    /**
     * Retorna status da IA
     * @returns {object}
     */
    getStatus() {
        return {
            configured: this.configured,
            provider: this.provider,
            model: this.model,
            historyLength: this.conversationHistory.length,
            ready: this.configured
        };
    }

    /**
     * Retorna informação sobre configuração necessária
     * @returns {object}
     */
    getSetupInfo() {
        return {
            status: 'not_configured',
            message: 'Módulo de IA aguardando configuração do backend',
            requirements: [
                '- Backend com endpoint /api/ai/chat',
                '- Autenticação segura',
                '- Chaves de API armazenadas no servidor',
                '- Validação de requisições'
            ],
            notes: 'O frontend nunca deve conter credenciais de IA'
        };
    }
}

export default AIModule;

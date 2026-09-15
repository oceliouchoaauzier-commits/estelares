/**
 * ESTELARES - Chat Module
 * 
 * Responsabilidade: Gerenciamento de mensagens e histórico
 * - Adicionar mensagem
 * - Recuperar histórico
 * - Limpar histórico
 * - Exportar/Importar histórico
 */

class ChatModule {
    constructor() {
        this.messages = [];
        this.maxMessages = 1000; // Limite de segurança
        
        console.log('[CHAT] Módulo carregado');
    }

    /**
     * Adiciona uma mensagem ao histórico
     * @param {string} role - 'user' ou 'assistant'
     * @param {string} content - Conteúdo da mensagem
     * @param {object} metadata - Dados adicionais (opcional)
     * @returns {object} - Mensagem adicionada
     */
    addMessage(role, content, metadata = {}) {
        if (!['user', 'assistant'].includes(role)) {
            throw new Error(`[CHAT] Role inválido: ${role}. Use 'user' ou 'assistant'`);
        }

        if (typeof content !== 'string' || content.trim() === '') {
            throw new Error('[CHAT] Conteúdo da mensagem não pode ser vazio');
        }

        // Protege contra overflow
        if (this.messages.length >= this.maxMessages) {
            console.warn('[CHAT] Limite de mensagens atingido. Removendo mensagens antigas...');
            this.messages = this.messages.slice(-Math.floor(this.maxMessages * 0.8));
        }

        const message = {
            id: this.generateId(),
            role: role,
            content: content.trim(),
            timestamp: new Date().toISOString(),
            ...metadata
        };

        this.messages.push(message);
        console.log(`[CHAT] Mensagem adicionada (${role})`);

        return message;
    }

    /**
     * Recupera o histórico completo
     * @returns {array}
     */
    getHistory() {
        return [...this.messages];
    }

    /**
     * Recupera últimas N mensagens
     * @param {number} count - Quantidade de mensagens
     * @returns {array}
     */
    getLastMessages(count = 10) {
        return this.messages.slice(-count);
    }

    /**
     * Recupera uma mensagem por ID
     * @param {string} id - ID da mensagem
     * @returns {object|null}
     */
    getMessage(id) {
        return this.messages.find(m => m.id === id) || null;
    }

    /**
     * Limpa o histórico completamente
     * @returns {number} - Quantidade de mensagens removidas
     */
    clearHistory() {
        const count = this.messages.length;
        this.messages = [];
        console.log(`[CHAT] Histórico limpo (${count} mensagens removidas)`);
        return count;
    }

    /**
     * Remove as últimas N mensagens
     * @param {number} count - Quantidade a remover
     */
    removeLastMessages(count = 1) {
        const removed = this.messages.splice(-count);
        console.log(`[CHAT] ${count} mensagens removidas`);
        return removed;
    }

    /**
     * Retorna estatísticas do histórico
     * @returns {object}
     */
    getStats() {
        const userMessages = this.messages.filter(m => m.role === 'user').length;
        const assistantMessages = this.messages.filter(m => m.role === 'assistant').length;

        return {
            totalMessages: this.messages.length,
            userMessages,
            assistantMessages,
            firstMessage: this.messages[0]?.timestamp || null,
            lastMessage: this.messages[this.messages.length - 1]?.timestamp || null
        };
    }

    /**
     * Exporta o histórico em JSON
     * @returns {string}
     */
    exportHistory() {
        return JSON.stringify({
            exportedAt: new Date().toISOString(),
            version: '0.1.0',
            stats: this.getStats(),
            messages: this.messages
        }, null, 2);
    }

    /**
     * Importa histórico de JSON
     * @param {string} jsonData - Dados em JSON
     * @returns {number} - Quantidade de mensagens importadas
     */
    importHistory(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (!Array.isArray(data.messages)) {
                throw new Error('Formato inválido: esperado array de mensagens');
            }

            const imported = [];
            for (const msg of data.messages) {
                if (msg.role && msg.content) {
                    imported.push({
                        ...msg,
                        id: msg.id || this.generateId()
                    });
                }
            }

            this.messages = imported;
            console.log(`[CHAT] ${imported.length} mensagens importadas`);
            return imported.length;
        } catch (error) {
            console.error('[CHAT] Erro ao importar histórico:', error.message);
            throw error;
        }
    }

    /**
     * Gera ID único para mensagem
     * @private
     * @returns {string}
     */
    generateId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export default ChatModule;

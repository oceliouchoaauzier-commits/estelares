/**
 * ESTELARES - Main Application
 * 
 * Responsabilidade: Integração de todos os módulos
 * - Carrega módulos
 * - Conecta interface com lógica
 * - Gerencia eventos
 * - Orquestra a aplicação
 */

import EstelaresCore from './core/estelares.js';
import ChatModule from './chat/chat.js';
import MemoryModule from './memory/memory.js';
import CommandsModule from './commands/commands.js';
import ToolsModule from './tools/tools.js';
import VoiceModule from './voice/voice.js';
import AIModule from './ai/ai.js';

class App {
    constructor() {
        this.core = new EstelaresCore();
        this.chat = new ChatModule();
        this.memory = new MemoryModule();
        this.commands = new CommandsModule();
        this.tools = new ToolsModule();
        this.voice = new VoiceModule();
        this.ai = new AIModule();

        this.messageContainer = null;
        this.inputField = null;
        this.sendBtn = null;
        this.voiceBtn = null;
        this.clearBtn = null;
        this.statusElement = null;
    }

    /**
     * Inicializa a aplicação
     * @returns {promise}
     */
    async init() {
        try {
            console.log('========================================');
            console.log('ESTELARES - Inicializando');
            console.log('========================================');

            // Registra módulos no núcleo
            this.core.registerModule('chat', this.chat);
            this.core.registerModule('memory', this.memory);
            this.core.registerModule('commands', this.commands);
            this.core.registerModule('tools', this.tools);
            this.core.registerModule('voice', this.voice);
            this.core.registerModule('ai', this.ai);

            // Inicializa núcleo
            await this.core.initialize();

            // Inicializa interface
            this.initializeUI();

            // Registra comandos padrão
            this.registerDefaultCommands();

            // Atualiza status
            this.updateStatus('ready');

            console.log('========================================');
            console.log('✓ ESTELARES Pronto para uso');
            console.log('========================================');

            return true;
        } catch (error) {
            console.error('Erro ao inicializar:', error);
            this.updateStatus('error');
            return false;
        }
    }

    /**
     * Inicializa elementos da interface
     * @private
     */
    initializeUI() {
        this.messageContainer = document.getElementById('messages');
        this.inputField = document.getElementById('input');
        this.sendBtn = document.getElementById('send-btn');
        this.voiceBtn = document.getElementById('voice-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.statusElement = document.getElementById('status');

        if (!this.messageContainer || !this.inputField) {
            throw new Error('Elementos da interface não encontrados');
        }

        // Event listeners
        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        this.voiceBtn.addEventListener('click', () => this.handleVoiceToggle());
        this.clearBtn.addEventListener('click', () => this.handleClearHistory());

        // Carrega histórico salvo
        this.loadHistory();

        console.log('[APP] Interface inicializada');
    }

    /**
     * Registra comandos padrão
     * @private
     */
    registerDefaultCommands() {
        // Comando: /calc
        this.commands.register(
            'calc',
            async (args) => {
                const result = this.tools.safeCalculate(args);
                return `Resultado: ${result}`;
            },
            {
                description: 'Calcula expressão matemática',
                aliases: ['calculadora', 'math']
            }
        );

        // Comando: /help
        this.commands.register(
            'help',
            async () => {
                const cmds = this.commands.listCommands();
                let help = 'Comandos disponíveis:\n';
                for (const cmd of cmds) {
                    help += `\n/${cmd.name} - ${cmd.description}`;
                    if (cmd.aliases.length > 0) {
                        help += ` (aliases: ${cmd.aliases.join(', ')})`;
                    }
                }
                return help;
            },
            {
                description: 'Mostra lista de comandos'
            }
        );

        // Comando: /clear
        this.commands.register(
            'clear',
            async () => {
                const count = this.chat.clearHistory();
                this.messageContainer.innerHTML = '';
                return `Histórico limpo (${count} mensagens removidas)`;
            },
            {
                description: 'Limpa histórico de conversa'
            }
        );

        // Comando: /status
        this.commands.register(
            'status',
            async () => {
                const info = this.core.getInfo();
                return `ESTELARES ${info.version}\nMódulos: ${info.modules.join(', ')}\nStatus: ${info.initialized ? 'Pronto' : 'Erro'}`;
            },
            {
                description: 'Mostra status da aplicação'
            }
        );

        console.log('[APP] Comandos padrão registrados');
    }

    /**
     * Manipula envio de mensagem
     * @private
     */
    async handleSendMessage() {
        const message = this.inputField.value.trim();

        if (!message) {
            return;
        }

        // Limpa input
        this.inputField.value = '';
        this.inputField.focus();

        // Desabilita botão
        this.sendBtn.disabled = true;

        try {
            // Adiciona mensagem do usuário
            this.chat.addMessage('user', message);
            this.displayMessage('user', message);

            // Verifica se é comando
            if (message.startsWith('/')) {
                await this.handleCommand(message);
            } else {
                // Envia para IA
                await this.handleAIResponse(message);
            }
        } catch (error) {
            console.error('Erro:', error);
            this.displayMessage('assistant', `Erro: ${error.message}`);
        } finally {
            this.sendBtn.disabled = false;
        }
    }

    /**
     * Manipula execução de comando
     * @private
     */
    async handleCommand(message) {
        const parts = message.slice(1).split(' ');
        const commandName = parts[0];
        const args = parts.slice(1).join(' ');

        try {
            const result = await this.commands.execute(commandName, args);
            this.chat.addMessage('assistant', result);
            this.displayMessage('assistant', result);
        } catch (error) {
            this.chat.addMessage('assistant', `Comando não encontrado: ${commandName}`);
            this.displayMessage('assistant', `Comando não encontrado: ${commandName}`);
        }
    }

    /**
     * Manipula resposta de IA
     * @private
     */
    async handleAIResponse(message) {
        try {
            const response = await this.ai.sendMessage(message);
            this.chat.addMessage('assistant', response.message);
            this.displayMessage('assistant', response.message);
        } catch (error) {
            const errorMsg = 'IA não está configurada. Configure antes de usar.';
            this.chat.addMessage('assistant', errorMsg);
            this.displayMessage('assistant', errorMsg);
        }
    }

    /**
     * Manipula ativação de voz
     * @private
     */
    async handleVoiceToggle() {
        if (!this.voice.isAvailable) {
            alert('Voz não disponível neste navegador');
            return;
        }

        if (this.voice.isListening) {
            this.voice.stopListening();
        } else {
            try {
                await this.voice.startListening((transcript, isFinal) => {
                    this.inputField.value = transcript;
                    if (isFinal) {
                        this.handleSendMessage();
                    }
                });
            } catch (error) {
                alert(`Erro de voz: ${error.message}`);
            }
        }
    }

    /**
     * Manipula limpeza de histórico
     * @private
     */
    handleClearHistory() {
        if (confirm('Limpar histórico de conversa?')) {
            this.chat.clearHistory();
            this.messageContainer.innerHTML = '';
        }
    }

    /**
     * Exibe mensagem na interface
     * @private
     */
    displayMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString();

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        this.messageContainer.appendChild(messageDiv);

        // Scroll para última mensagem
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;

        // Salva histórico
        this.saveHistory();
    }

    /**
     * Salva histórico na memória
     * @private
     */
    saveHistory() {
        const history = this.chat.getHistory();
        this.memory.set('chat_history', history);
    }

    /**
     * Carrega histórico da memória
     * @private
     */
    loadHistory() {
        const saved = this.memory.get('chat_history', null);
        if (saved && Array.isArray(saved)) {
            this.chat.messages = saved;
            for (const msg of saved) {
                this.displayMessage(msg.role, msg.content);
            }
        }
    }

    /**
     * Atualiza status na interface
     * @private
     */
    updateStatus(status) {
        if (!this.statusElement) return;

        const statusTexts = {
            initializing: 'Inicializando...',
            ready: 'Pronto',
            error: 'Erro'
        };

        this.statusElement.textContent = statusTexts[status] || status;
        this.statusElement.className = `header-status ${status}`;
    }
}

// Inicializa aplicação quando DOM está pronto
document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    await app.init();
});

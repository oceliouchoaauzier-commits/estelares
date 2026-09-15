/**
 * ESTELARES - Commands Module
 * 
 * Responsabilidade: Sistema de comandos
 * - Registrar comando
 * - Executar comando
 * - Verificar se comando existe
 * - Listar comandos disponíveis
 * 
 * Permite adicionar novos comandos sem modificar o núcleo
 */

class CommandsModule {
    constructor() {
        this.commands = new Map();
        this.commandHistory = [];
        this.maxHistory = 100;
        
        console.log('[COMMANDS] Módulo carregado');
    }

    /**
     * Registra um novo comando
     * @param {string} name - Nome do comando
     * @param {function} handler - Função que executa o comando
     * @param {object} options - Opções (description, aliases, etc)
     */
    register(name, handler, options = {}) {
        if (!name || typeof name !== 'string') {
            throw new Error('[COMMANDS] Nome do comando inválido');
        }

        if (typeof handler !== 'function') {
            throw new Error('[COMMANDS] Handler deve ser uma função');
        }

        if (this.commands.has(name)) {
            console.warn(`[COMMANDS] Comando '${name}' já existe. Substituindo...`);
        }

        const command = {
            name,
            handler,
            description: options.description || 'Sem descrição',
            aliases: options.aliases || [],
            requiresArg: options.requiresArg || false,
            createdAt: new Date().toISOString()
        };

        this.commands.set(name, command);
        
        // Registra aliases
        for (const alias of command.aliases) {
            this.commands.set(alias, command);
        }

        console.log(`[COMMANDS] ✓ Comando registrado: /${name}`);
        return this;
    }

    /**
     * Verifica se comando existe
     * @param {string} name - Nome do comando
     * @returns {boolean}
     */
    exists(name) {
        return this.commands.has(name);
    }

    /**
     * Executa um comando
     * @param {string} name - Nome do comando
     * @param {string} args - Argumentos
     * @returns {promise}
     */
    async execute(name, args = '') {
        if (!this.exists(name)) {
            throw new Error(`[COMMANDS] Comando '${name}' não encontrado`);
        }

        const command = this.commands.get(name);

        try {
            console.log(`[COMMANDS] Executando: /${name} ${args}`);
            const result = await command.handler(args);
            
            // Registra no histórico
            this.addToHistory(name, args, true, result);
            
            return result;
        } catch (error) {
            console.error(`[COMMANDS] Erro ao executar '${name}':`, error);
            this.addToHistory(name, args, false, error.message);
            throw error;
        }
    }

    /**
     * Lista todos os comandos disponíveis
     * @returns {array}
     */
    listCommands() {
        const commands = [];
        for (const [name, cmd] of this.commands) {
            // Evita duplicar comandos/aliases
            if (cmd.name === name) {
                commands.push({
                    name: cmd.name,
                    description: cmd.description,
                    aliases: cmd.aliases
                });
            }
        }
        return commands;
    }

    /**
     * Remove um comando
     * @param {string} name - Nome do comando
     * @returns {boolean}
     */
    remove(name) {
        if (!this.commands.has(name)) {
            console.warn(`[COMMANDS] Comando '${name}' não existe`);
            return false;
        }

        const command = this.commands.get(name);
        this.commands.delete(name);

        // Remove aliases
        for (const alias of command.aliases) {
            this.commands.delete(alias);
        }

        console.log(`[COMMANDS] ✓ Comando removido: ${name}`);
        return true;
    }

    /**
     * Adiciona ao histórico de execução
     * @private
     */
    addToHistory(name, args, success, result) {
        if (this.commandHistory.length >= this.maxHistory) {
            this.commandHistory.shift();
        }

        this.commandHistory.push({
            name,
            args,
            success,
            result,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Retorna histórico de comandos
     * @returns {array}
     */
    getHistory() {
        return [...this.commandHistory];
    }

    /**
     * Limpa histórico
     */
    clearHistory() {
        this.commandHistory = [];
    }
}

export default CommandsModule;

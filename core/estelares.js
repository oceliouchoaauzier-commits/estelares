/**
 * ESTELARES - Core Module
 * 
 * Responsabilidade: Núcleo central da aplicação
 * - Identidade da aplicação
 * - Versão
 * - Inicialização
 * - Registro de módulos
 * - Recuperação de módulos
 * 
 * Não depende de provedor específico de IA
 */

class EstelaresCore {
    constructor() {
        this.name = 'ESTELARES';
        this.version = '0.1.0';
        this.description = 'Agente Pessoal Modular';
        this.modules = new Map();
        this.initialized = false;
        this.errors = [];
        
        console.log(`[ESTELARES CORE] Inicializando ${this.name} v${this.version}`);
    }

    /**
     * Registra um módulo no núcleo
     * @param {string} name - Nome do módulo
     * @param {object} module - Instância do módulo
     */
    registerModule(name, module) {
        if (this.modules.has(name)) {
            console.warn(`[ESTELARES CORE] Módulo '${name}' já está registrado. Substituindo...`);
        }
        
        this.modules.set(name, module);
        console.log(`[ESTELARES CORE] ✓ Módulo '${name}' registrado`);
        
        return this;
    }

    /**
     * Recupera um módulo registrado
     * @param {string} name - Nome do módulo
     * @returns {object|null} - Módulo ou null se não encontrado
     */
    getModule(name) {
        if (!this.modules.has(name)) {
            console.error(`[ESTELARES CORE] Módulo '${name}' não encontrado`);
            return null;
        }
        
        return this.modules.get(name);
    }

    /**
     * Verifica se um módulo está registrado
     * @param {string} name - Nome do módulo
     * @returns {boolean}
     */
    hasModule(name) {
        return this.modules.has(name);
    }

    /**
     * Lista todos os módulos registrados
     * @returns {array} - Lista de nomes dos módulos
     */
    listModules() {
        return Array.from(this.modules.keys());
    }

    /**
     * Inicializa o núcleo
     * @returns {promise}
     */
    async initialize() {
        try {
            console.log(`[ESTELARES CORE] Inicializando módulos...`);
            
            // Aqui cada módulo poderia ter seu próprio init() se necessário
            for (const [name, module] of this.modules) {
                if (typeof module.init === 'function') {
                    try {
                        await module.init();
                        console.log(`[ESTELARES CORE] ✓ Módulo '${name}' inicializado`);
                    } catch (error) {
                        console.error(`[ESTELARES CORE] ✗ Erro ao inicializar '${name}':`, error);
                        this.errors.push({ module: name, error: error.message });
                    }
                }
            }

            this.initialized = true;
            console.log(`[ESTELARES CORE] ✓ ${this.name} pronto para uso`);
            return true;
        } catch (error) {
            console.error(`[ESTELARES CORE] ✗ Erro fatal na inicialização:`, error);
            this.errors.push({ module: 'core', error: error.message });
            return false;
        }
    }

    /**
     * Retorna informações sobre a aplicação
     * @returns {object}
     */
    getInfo() {
        return {
            name: this.name,
            version: this.version,
            description: this.description,
            initialized: this.initialized,
            modules: this.listModules(),
            errors: this.errors
        };
    }

    /**
     * Retorna o status atual
     * @returns {string}
     */
    getStatus() {
        if (!this.initialized) {
            return this.errors.length > 0 ? 'error' : 'initializing';
        }
        return 'ready';
    }
}

// Exporta como módulo ES6
export default EstelaresCore;

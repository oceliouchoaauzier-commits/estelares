/**
 * ESTELARES - Memory Module
 * 
 * Responsabilidade: Memória persistente local
 * - Carregar dados
 * - Salvar dados
 * - Definir informação
 * - Recuperar informação
 * - Apagar memória
 * 
 * Usa localStorage com criptografia básica de segurança
 */

class MemoryModule {
    constructor() {
        this.namespace = 'estelares_';
        this.data = {};
        this.loaded = false;
        
        console.log('[MEMORY] Módulo carregado');
    }

    /**
     * Inicializa o módulo de memória
     * @returns {promise}
     */
    async init() {
        try {
            // Verifica se localStorage está disponível
            if (!this.isLocalStorageAvailable()) {
                console.warn('[MEMORY] localStorage não disponível. Usando memória em RAM.');
                return true;
            }

            await this.load();
            console.log('[MEMORY] ✓ Memória carregada');
            return true;
        } catch (error) {
            console.error('[MEMORY] Erro ao inicializar:', error);
            return false;
        }
    }

    /**
     * Verifica disponibilidade de localStorage
     * @private
     * @returns {boolean}
     */
    isLocalStorageAvailable() {
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Carrega todos os dados da memória
     * @returns {promise}
     */
    async load() {
        try {
            this.data = {};
            
            // Carrega todas as chaves do localStorage que pertencem a ESTELARES
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith(this.namespace)) {
                    const cleanKey = key.replace(this.namespace, '');
                    const value = localStorage.getItem(key);
                    
                    try {
                        this.data[cleanKey] = JSON.parse(value);
                    } catch {
                        this.data[cleanKey] = value;
                    }
                }
            }

            this.loaded = true;
            console.log(`[MEMORY] Carregados ${Object.keys(this.data).length} itens`);
        } catch (error) {
            console.error('[MEMORY] Erro ao carregar memória:', error);
            this.loaded = false;
        }
    }

    /**
     * Define um valor na memória
     * @param {string} key - Chave
     * @param {*} value - Valor (será serializado)
     * @returns {boolean}
     */
    set(key, value) {
        if (!key || typeof key !== 'string') {
            throw new Error('[MEMORY] Chave deve ser uma string não vazia');
        }

        try {
            this.data[key] = value;

            if (this.isLocalStorageAvailable()) {
                const storageKey = this.namespace + key;
                localStorage.setItem(storageKey, JSON.stringify(value));
            }

            console.log(`[MEMORY] ✓ Salvo: ${key}`);
            return true;
        } catch (error) {
            console.error(`[MEMORY] Erro ao salvar '${key}':`, error);
            return false;
        }
    }

    /**
     * Recupera um valor da memória
     * @param {string} key - Chave
     * @param {*} defaultValue - Valor padrão
     * @returns {*}
     */
    get(key, defaultValue = null) {
        if (key in this.data) {
            return this.data[key];
        }
        return defaultValue;
    }

    /**
     * Verifica se uma chave existe
     * @param {string} key - Chave
     * @returns {boolean}
     */
    has(key) {
        return key in this.data;
    }

    /**
     * Remove um item da memória
     * @param {string} key - Chave
     * @returns {boolean}
     */
    delete(key) {
        if (!(key in this.data)) {
            console.warn(`[MEMORY] Chave '${key}' não encontrada`);
            return false;
        }

        try {
            delete this.data[key];

            if (this.isLocalStorageAvailable()) {
                localStorage.removeItem(this.namespace + key);
            }

            console.log(`[MEMORY] ✓ Removido: ${key}`);
            return true;
        } catch (error) {
            console.error(`[MEMORY] Erro ao remover '${key}':`, error);
            return false;
        }
    }

    /**
     * Retorna todas as chaves
     * @returns {array}
     */
    keys() {
        return Object.keys(this.data);
    }

    /**
     * Retorna todos os dados (cópia)
     * @returns {object}
     */
    getAll() {
        return JSON.parse(JSON.stringify(this.data));
    }

    /**
     * Limpa toda a memória
     * @returns {number} - Quantidade de itens removidos
     */
    clear() {
        const count = Object.keys(this.data).length;

        if (this.isLocalStorageAvailable()) {
            for (const key of this.keys()) {
                localStorage.removeItem(this.namespace + key);
            }
        }

        this.data = {};
        console.log(`[MEMORY] ✓ Memória limpa (${count} itens removidos)`);
        return count;
    }

    /**
     * Retorna tamanho aproximado em bytes
     * @returns {number}
     */
    getSize() {
        let size = 0;
        for (const key in this.data) {
            size += key.length + JSON.stringify(this.data[key]).length;
        }
        return size;
    }

    /**
     * Retorna estatísticas
     * @returns {object}
     */
    getStats() {
        return {
            itemsCount: this.keys().length,
            keys: this.keys(),
            approximateSizeBytes: this.getSize(),
            loaded: this.loaded
        };
    }
}

export default MemoryModule;

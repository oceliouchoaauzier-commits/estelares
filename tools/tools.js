/**
 * ESTELARES - Tools Module
 * 
 * Responsabilidade: Ferramentas locais
 * - Calculadora segura
 * - Extensível para outras ferramentas
 * 
 * NUNCA permite execução arbitrária de código
 */

class ToolsModule {
    constructor() {
        this.tools = new Map();
        
        console.log('[TOOLS] Módulo carregado');
        
        // Registra ferramentas nativas
        this.registerCalculator();
    }

    /**
     * Registra ferramenta de calculadora
     * @private
     */
    registerCalculator() {
        this.tools.set('calculator', {
            name: 'calculator',
            description: 'Calculadora segura',
            execute: (expression) => this.safeCalculate(expression)
        });
    }

    /**
     * Calcula expressão de forma SEGURA
     * Apenas operadores básicos permitidos
     * @param {string} expression - Expressão matemática
     * @returns {number|null}
     */
    safeCalculate(expression) {
        try {
            // Valida entrada
            if (!expression || typeof expression !== 'string') {
                throw new Error('Expressão inválida');
            }

            // Remove espaços
            expression = expression.trim();

            // Whitelist de caracteres permitidos
            const allowed = /^[0-9+\-*/().%\s.]*$/;
            if (!allowed.test(expression)) {
                throw new Error('Caracteres não permitidos na expressão');
            }

            // Bloqueia tentativas de acesso a variáveis globais
            const blocked = ['window', 'document', 'localStorage', 'eval', 'Function', 'constructor', 'prototype'];
            for (const term of blocked) {
                if (expression.toLowerCase().includes(term.toLowerCase())) {
                    throw new Error(`Termo bloqueado: ${term}`);
                }
            }

            // Limite de comprimento
            if (expression.length > 100) {
                throw new Error('Expressão muito longa');
            }

            // Executa com segurança usando Function constructor (não eval)
            // mas ainda com validação rigorosa
            const result = Function('"use strict"; return (' + expression + ')')();

            if (typeof result !== 'number' || !isFinite(result)) {
                throw new Error('Resultado inválido');
            }

            console.log(`[TOOLS] Cálculo: ${expression} = ${result}`);
            return result;
        } catch (error) {
            console.error(`[TOOLS] Erro ao calcular:`, error.message);
            throw new Error(`Erro no cálculo: ${error.message}`);
        }
    }

    /**
     * Executa uma ferramenta registrada
     * @param {string} toolName - Nome da ferramenta
     * @param {*} args - Argumentos
     * @returns {*}
     */
    execute(toolName, args) {
        if (!this.tools.has(toolName)) {
            throw new Error(`[TOOLS] Ferramenta '${toolName}' não encontrada`);
        }

        const tool = this.tools.get(toolName);
        console.log(`[TOOLS] Executando: ${toolName}`);

        return tool.execute(args);
    }

    /**
     * Lista ferramentas disponíveis
     * @returns {array}
     */
    listTools() {
        const list = [];
        for (const [name, tool] of this.tools) {
            list.push({
                name: tool.name,
                description: tool.description
            });
        }
        return list;
    }

    /**
     * Verifica se ferramenta existe
     * @param {string} name - Nome
     * @returns {boolean}
     */
    hasTool(name) {
        return this.tools.has(name);
    }

    /**
     * Registra nova ferramenta (apenas internamente)
     * @private
     */
    registerTool(name, description, executeFunction) {
        if (typeof executeFunction !== 'function') {
            throw new Error('[TOOLS] Execute deve ser uma função');
        }

        this.tools.set(name, {
            name,
            description,
            execute: executeFunction
        });

        console.log(`[TOOLS] ✓ Ferramenta registrada: ${name}`);
    }
}

export default ToolsModule;

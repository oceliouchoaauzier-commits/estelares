/**
 * ESTELARES - Voice Module
 * 
 * Responsabilidade: Interface para entrada/saída de voz
 * - Preparada para Web Speech API
 * - Graceful degradation se não disponível
 * - Não quebra a aplicação sem voz
 */

class VoiceModule {
    constructor() {
        this.isAvailable = this.checkAvailability();
        this.isListening = false;
        this.recognition = null;
        this.synthesis = null;
        
        if (this.isAvailable) {
            this.initializeRecognition();
            this.initializeSynthesis();
            console.log('[VOICE] Módulo carregado (disponível)');
        } else {
            console.log('[VOICE] Módulo carregado (não disponível neste navegador)');
        }
    }

    /**
     * Verifica disponibilidade de Web Speech API
     * @private
     * @returns {boolean}
     */
    checkAvailability() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const speechSynthesis = window.speechSynthesis;
        return !!SpeechRecognition && !!speechSynthesis;
    }

    /**
     * Inicializa Speech Recognition
     * @private
     */
    initializeRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'pt-BR';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
    }

    /**
     * Inicializa Speech Synthesis
     * @private
     */
    initializeSynthesis() {
        this.synthesis = window.speechSynthesis;
    }

    /**
     * Inicia gravação de voz
     * @param {function} onResult - Callback com resultado
     * @returns {promise}
     */
    startListening(onResult) {
        if (!this.isAvailable) {
            console.warn('[VOICE] Voz não disponível');
            return Promise.reject(new Error('Voz não disponível'));
        }

        if (this.isListening) {
            console.warn('[VOICE] Já está escutando');
            return Promise.reject(new Error('Já está escutando'));
        }

        return new Promise((resolve, reject) => {
            this.isListening = true;

            this.recognition.onstart = () => {
                console.log('[VOICE] Escutando...');
            };

            this.recognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                if (onResult) {
                    onResult(transcript, event.results[event.results.length - 1].isFinal);
                }
            };

            this.recognition.onerror = (event) => {
                console.error('[VOICE] Erro:', event.error);
                this.isListening = false;
                reject(new Error(`Erro de voz: ${event.error}`));
            };

            this.recognition.onend = () => {
                console.log('[VOICE] Escuta encerrada');
                this.isListening = false;
                resolve();
            };

            this.recognition.start();
        });
    }

    /**
     * Para gravação de voz
     */
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            console.log('[VOICE] Gravação parada');
        }
    }

    /**
     * Fala um texto
     * @param {string} text - Texto a falar
     * @param {object} options - Opções (rate, pitch, volume)
     * @returns {promise}
     */
    speak(text, options = {}) {
        if (!this.isAvailable) {
            console.warn('[VOICE] Síntese de voz não disponível');
            return Promise.reject(new Error('Síntese não disponível'));
        }

        return new Promise((resolve, reject) => {
            try {
                // Cancela fala anterior
                this.synthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'pt-BR';
                utterance.rate = options.rate || 1;
                utterance.pitch = options.pitch || 1;
                utterance.volume = options.volume || 1;

                utterance.onend = () => {
                    console.log('[VOICE] Fala concluída');
                    resolve();
                };

                utterance.onerror = (event) => {
                    console.error('[VOICE] Erro ao falar:', event.error);
                    reject(new Error(`Erro de síntese: ${event.error}`));
                };

                console.log('[VOICE] Falando...');
                this.synthesis.speak(utterance);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Para síntese de voz
     */
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
            console.log('[VOICE] Fala parada');
        }
    }

    /**
     * Retorna status
     * @returns {object}
     */
    getStatus() {
        return {
            available: this.isAvailable,
            listening: this.isListening,
            speaking: this.synthesis ? this.synthesis.speaking : false
        };
    }

    /**
     * Lista vozes disponíveis
     * @returns {array}
     */
    getVoices() {
        if (!this.synthesis) return [];
        return this.synthesis.getVoices();
    }
}

export default VoiceModule;

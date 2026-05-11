class WordleModel {
    constructor() {
        // Agora você pode colocar palavras do tamanho que quiser!
        this.dictionaries = {
            'pt': ["TESTE", "CLASSE", "DADOS", "LOGICA", "PILHA", "SUITE", "ENGENHARIA"], // 10 letras!
            'en': ["CLEAN", "SMELL", "PRINT", "CODES", "FILES", "STACK", "DEVELOPER"] // 9 letras!
        };
        this.MAX_ATTEMPTS = 6;
        this.score = 0;
        this.round = 1;
    }

    setLanguage(lang) {
        this.language = lang;
        this.startNewGame();
    }

    // Inicia o jogo zerado
    startNewGame() {
        this.score = 0;
        this.round = 1;
        this.prepareRound();
    }

    // Prepara o round lendo o tamanho da palavra sorteada
    prepareRound() {
        this.selectNewWord();
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameOver = false;
        
        // Agora a matriz é gerada baseada no tamanho da palavra escolhida
        this.guessMatrix = Array(this.MAX_ATTEMPTS).fill().map(() => Array(this.WORD_LENGTH).fill(""));
    }

    selectNewWord() {
        const list = this.dictionaries[this.language];
        this.secretWord = list[Math.floor(Math.random() * list.length)].toUpperCase();
        
        // A MÁGICA ESTÁ AQUI: O sistema se calibra pelo tamanho da string.
        this.WORD_LENGTH = this.secretWord.length; 
    }

    checkGuess() {
        const guess = this.guessMatrix[this.currentRow].join("");
        const feedback = Array(this.WORD_LENGTH).fill(null);
        let secretWordPool = {};

        for (let char of this.secretWord) {
            secretWordPool[char] = (secretWordPool[char] || 0) + 1;
        }

        for (let i = 0; i < this.WORD_LENGTH; i++) {
            if (guess[i] === this.secretWord[i]) {
                feedback[i] = { char: guess[i], status: 'correct' };
                secretWordPool[guess[i]]--; 
                this.score += 10;
            }
        }

        for (let i = 0; i < this.WORD_LENGTH; i++) {
            if (feedback[i] !== null) continue;
            if (this.secretWord.includes(guess[i]) && secretWordPool[guess[i]] > 0) {
                feedback[i] = { char: guess[i], status: 'present' };
                secretWordPool[guess[i]]--; 
                this.score += 5;
            } else {
                feedback[i] = { char: guess[i], status: 'absent' };
            }
        }

        return { feedback, isWin: guess === this.secretWord };
    }
}
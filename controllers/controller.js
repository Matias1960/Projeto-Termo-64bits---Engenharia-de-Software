class WordleController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        document.querySelectorAll('.btn-idioma').forEach(btn => {
            btn.onclick = () => this.startGame(btn.dataset.lang);
        });
        window.onkeydown = (e) => this.handleInput(e.key.toUpperCase());
    }

    startGame(lang) {
        this.model.setLanguage(lang); // Inicia e já descobre o tamanho da palavra
        document.getElementById('tela-inicio').style.display = 'none';
        document.getElementById('tela-jogo').style.display = 'flex';
        this.view.instructions.innerText = lang === 'pt' ? "ADIVINHE A PALAVRA" : "GUESS THE WORD";
        
        // Zera pontuação visual se voltar ao menu principal
        this.view.scoreDisplay.innerText = this.model.score;
        this.view.roundDisplay.innerText = this.model.round;
        
        this.view.renderBoard(this.model.guessMatrix);
    }

    handleInput(key) {
        if (this.model.gameOver) return;

        if (key === "BACKSPACE" && this.model.currentCol > 0) {
            this.model.currentCol--;
            this.model.guessMatrix[this.model.currentRow][this.model.currentCol] = "";
            this.view.updateTile(this.model.currentRow, this.model.currentCol, "");
        } 
        // Adaptação: Bloqueia o Enter somente quando a linha estiver cheia, independente do tamanho
        else if (key === "ENTER" && this.model.currentCol === this.model.WORD_LENGTH) {
            const result = this.model.checkGuess();
            this.view.applyColors(this.model.currentRow, result.feedback);
            this.view.scoreDisplay.innerText = this.model.score;

            if (result.isWin) {
                this.view.showGameOver(true, this.model.secretWord, this.model.language);
                this.nextRound();
            } else {
                this.model.currentRow++;
                this.model.currentCol = 0;
                if (this.model.currentRow === this.model.MAX_ATTEMPTS) {
                    this.model.gameOver = true;
                    this.view.showGameOver(false, this.model.secretWord, this.model.language);
                }
            }
        } 
        // Adaptação: Só aceita letra se ainda tiver espaço na linha dinâmica
        else if (/^[A-Z]$/.test(key) && this.model.currentCol < this.model.WORD_LENGTH) {
            this.model.guessMatrix[this.model.currentRow][this.model.currentCol] = key;
            this.view.updateTile(this.model.currentRow, this.model.currentCol, key);
            this.model.currentCol++;
        }
    }

    nextRound() {
        this.model.round++;
        this.model.prepareRound(); // Sorteia a nova palavra e redimensiona a matriz sozinha
        this.view.roundDisplay.innerText = this.model.round;
        this.view.renderBoard(this.model.guessMatrix);
    }
}
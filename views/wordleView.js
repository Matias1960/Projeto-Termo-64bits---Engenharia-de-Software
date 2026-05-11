class WordleView {
    constructor() {
        this.board = document.getElementById("board");
        this.scoreDisplay = document.getElementById("score-val");
        this.roundDisplay = document.getElementById("round-val");
        this.instructions = document.getElementById("msg-instr");
    }

    renderBoard(matrix) {
        this.board.innerHTML = "";
        if (!matrix || matrix.length === 0) return;

        // Lê a quantidade de letras dinamicamente da matriz do Model
        const columns = matrix[0].length; 

        matrix.forEach((row, rowIndex) => {
            const rowDiv = document.createElement("div");
            rowDiv.className = "linha";
            
            // INJEÇÃO DE CSS: O JavaScript dita quantas colunas existem no Grid
            rowDiv.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            
            row.forEach((char, colIndex) => {
                const tile = document.createElement("div");
                tile.className = "tile";
                tile.id = `t-${rowIndex}-${colIndex}`;
                tile.innerText = char;
                rowDiv.appendChild(tile);
            });
            this.board.appendChild(rowDiv);
        });
    }

    updateTile(row, col, char) {
        const tile = document.getElementById(`t-${row}-${col}`);
        if (tile) {
            tile.innerText = char;
            char !== "" ? tile.classList.add('pop') : tile.classList.remove('pop');
        }
    }

    applyColors(row, feedback) {
        feedback.forEach((item, index) => {
            const tile = document.getElementById(`t-${row}-${index}`);
            const colors = { correct: "#00ff41", present: "#ffcc00", absent: "#333333" };
            tile.style.background = colors[item.status];
            tile.style.color = item.status === 'absent' ? "#666" : "#000";
            tile.classList.remove('pop');
        });
    }

    showGameOver(win, word, lang) {
        const msg = win ? "MISSION ACCOMPLISHED!" : `GAME OVER! WORD: ${word}`;
        alert(msg);
    }
}
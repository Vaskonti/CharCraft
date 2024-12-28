
class Character {
    constructor(character, color) {
        this.character = character;
        this.color = color;
    }

    displayDetails() {
        console.log(`character: ${this.character}, color: ${this.color}`);
    }
}

class DrawingBoard {
    constructor(boardSize, mouseRadius) {
        this.boardSize = boardSize;
        this.mouseRadius = mouseRadius;
        this.boardMatrix = Array(boardSize / 2).fill().map(() => Array(boardSize).fill());
        this.draw_color = "#FFFFFF"
        this.draw_character = '#'
        this.default_character = ' '
        this.resetBoard();
    }

    resetBoard() {
        const textColor = "#000000";
        this.boardMatrix.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                this.boardMatrix[rowIndex][colIndex] = new Character(this.default_character, textColor);
            });
        });
    }

    setDefaultCharacter(character) {
        this.default_character = character
    }

    redrawBoard(container) {
        let boardHTML = "";
        this.boardMatrix.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellId = `cell-${rowIndex}-${colIndex}`;
                const elementHTML = `<span id="${cellId}" style="color: ${cell.color};">${cell.character}</span>`;
                boardHTML += elementHTML;
            });
            boardHTML += `<br>`;
        });
        container.innerHTML = boardHTML;
    }

    updateCell(row, col) {
        const cellId = `cell-${row}-${col}`;
        const cell = document.getElementById(cellId);

        if (cell) {
            const character = this.boardMatrix[row][col];
            cell.style.color = character.color;
            cell.textContent = character.character;
        }
    }

    /* pass string color in format "#XXXXXX" */
    setDrawColor(color) {
        this.draw_color = color
    }

    setDrawCharacter(character) {
        this.draw_character = character
    }

    draw(x, y, drawBoardRect) {
        const cellWidth = drawBoardRect.width / this.boardMatrix[0].length;
        const cellHeight = drawBoardRect.height / this.boardMatrix.length;

        const clickedCol = Math.floor((x - drawBoardRect.left) / cellWidth);
        const clickedRow = Math.floor((y - drawBoardRect.top) / cellHeight);

        for (let i = -this.mouseRadius; i <= this.mouseRadius; i++) {
            for (let j = -this.mouseRadius; j <= this.mouseRadius; j++) {
                const coloredRow = clickedRow + i;
                const coloredCol = clickedCol + j;

                if (
                    coloredRow >= 0 && coloredRow < this.boardMatrix.length &&
                    coloredCol >= 0 && coloredCol < this.boardMatrix[0].length
                ) {
                    this.boardMatrix[coloredRow][coloredCol].character = this.draw_character;
                    this.boardMatrix[coloredRow][coloredCol].color = this.draw_color;
                    this.updateCell(coloredRow, coloredCol);
                }
            }
        }
    }
}

class DrawingBoardUI {
    constructor(drawingBoard) {
        this.drawingBoard = drawingBoard;
        this.mouseHold = false;
        this.drawBoardElement = null;

        this.init();
    }
    // TODO: maybe if board is too big for user resolution make the symbols smaller? 
    init() {
        window.addEventListener("load", () => {
            const collection = document.getElementsByClassName("draw-board");
            if (collection.length === 0) {
                console.log("Board doesn't exist.");
                return;
            }

            this.drawBoardElement = collection[0];
            this.drawingBoard.redrawBoard(this.drawBoardElement);

            document.addEventListener("click", (e) => this.draw(e));
            document.addEventListener("mouseup", () => (this.mouseHold = false));
            document.addEventListener("mousedown", () => (this.mouseHold = true));
            document.addEventListener("mousemove", (e) => {
                if (this.mouseHold) this.draw(e);
            });
        });
    }

    draw(event) {
        const { clientX, clientY } = event;
        const drawBoardRect = this.drawBoardElement.getBoundingClientRect();
        this.drawingBoard.draw(clientX, clientY, drawBoardRect);
    }
}

//TODO: make it dynamic
const boardSize = 100;
const mouseRadius = 0;
const drawingBoard = new DrawingBoard(boardSize, mouseRadius);
const drawingBoardUI = new DrawingBoardUI(drawingBoard);


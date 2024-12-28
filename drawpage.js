
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

    drawCharacter(x, y) {
        for (let i = -this.mouseRadius; i <= this.mouseRadius; i++) {
            for (let j = -this.mouseRadius; j <= this.mouseRadius; j++) {
                const coloredRow = x + i;
                const coloredCol = y + j;

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

    drawLine(fromX, fromY, toX, toY) {
        let dx = Math.abs(toX - fromX);
        let dy = Math.abs(toY - fromY);
        let sx = fromX < toX ? 1 : -1;
        let sy = fromY < toY ? 1 : -1;
        let err = dx - dy;

        while (true) {
            this.drawCharacter(fromX, fromY);

            if (fromX === toX && fromY === toY) break;

            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                fromX += sx;
            }
            if (e2 < dx) {
                err += dx;
                fromY += sy;
            }
        }
    }
}

class DrawingBoardUI {
    constructor(drawingBoard) {
        this.drawingBoard = drawingBoard;
        this.isMouseDown = false;
        this.drawBoardElement = null;
        this.lastDrawnCell = null
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
            document.addEventListener("mouseup", () => (this.isMouseDown = false));
            document.addEventListener("mousedown", (e) => this.mouseDown(e));
            document.addEventListener("mousemove", (e) => this.mouseMove(e));
        });
    }

    getClickedCell(event) {
        const drawBoardRect = this.drawBoardElement.getBoundingClientRect();

        const cellWidth = drawBoardRect.width / this.drawingBoard.boardMatrix[0].length;
        const cellHeight = drawBoardRect.height / this.drawingBoard.boardMatrix.length;

        const clickedCol = Math.floor((event.clientX - drawBoardRect.left) / cellWidth);
        const clickedRow = Math.floor((event.clientY - drawBoardRect.top) / cellHeight);

        return { clickedRow, clickedCol };
    }

    mouseDown(event) {
        this.isMouseDown = true;
        this.lastClickedCell = this.getClickedCell(event);
    }

    mouseMove(event) {
        if (!this.isMouseDown || !this.lastClickedCell) {
            return;
        }

        const currentCell = this.getClickedCell(event);

        if (!(currentCell.clickedRow !== this.lastClickedCell.clickedRow ||
                currentCell.clickedCol !== this.lastClickedCell.clickedCol
        )) {
            return;
        }

        this.drawingBoard.drawLine(
            this.lastClickedCell.clickedRow,
            this.lastClickedCell.clickedCol,
            currentCell.clickedRow,
            currentCell.clickedCol
        );

        this.lastClickedCell = currentCell;
    }

    draw(event) {
        const { clickedRow, clickedCol } = this.getClickedCell(event);
        
        this.drawingBoard.drawCharacter(clickedRow, clickedCol);
    }
}

//TODO: make it dynamic
const boardSize = 100;
const mouseRadius = 0;
const drawingBoard = new DrawingBoard(boardSize, mouseRadius);
const drawingBoardUI = new DrawingBoardUI(drawingBoard);



class Character {
    constructor(character, color) {
        this.character = character;
        this.color = color;
    }

    displayDetails() {
        console.log(`character: ${this.character}, color: ${this.color}`);
    }
}

const emptyCharacter = ' '

const DrawType = {
    SQUARE: 'square',
    CIRCLE: 'circle',
};
Object.freeze(DrawType);

class DrawingBoard {
    constructor(sizeX, sizeY) {
        this.boardSize = boardSize;
        this.mouseRadius = 1;
        this.boardMatrix = Array(sizeY).fill().map(() => Array(sizeX).fill());
        this.drawColor = "#FFFFFF"
        this.drawCharacter = '0'
        this.defaultCharacter = emptyCharacter
        this.drawType = DrawType.CIRCLE
        this.resetBoard();
    }

    setMouseRadius(mouseRadius) {
        this.mouseRadius = mouseRadius;
    }

    setDrawType(drawType) {
        this.drawType = drawType;
    }

    setBoardSize(sizeX, sizeY) {
        this.boardMatrix = Array(sizeY).fill().map(() => Array(sizeX).fill());
        this.resetBoard();
    }

    fillBoardWithCharacter(character) {
        this.boardMatrix.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                this.boardMatrix[rowIndex][colIndex] = new Character(character, this.drawColor);
            });
        });
    }

    clearBoard() {
        this.fillBoardWithCharacter(emptyCharacter);
    }

    resetBoard() {
        this.fillBoardWithCharacter(this.defaultCharacter);
    }

    setDefaultCharacter(character) {
        this.defaultCharacter = character
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
        this.drawColor = color
    }

    setDrawCharacter(character) {
        this.drawCharacter = character
    }


    drawCharacter(x, y) {
        for (let i = -this.mouseRadius; i <= this.mouseRadius; i++) {
            for (let j = -this.mouseRadius; j <= this.mouseRadius; j++) {
                const coloredRow = x + i;
                const coloredCol = y + j;
                if (this.drawType == DrawType.CIRCLE &&
                    (coloredRow - x)**2 + (coloredCol - y)**2 > this.mouseRadius**2
                )
                {
                    continue;
                }
                if (
                    coloredRow >= 0 && coloredRow < this.boardMatrix.length &&
                    coloredCol >= 0 && coloredCol < this.boardMatrix[0].length
                ) {
                    this.boardMatrix[coloredRow][coloredCol].character = this.drawCharacter;
                    this.boardMatrix[coloredRow][coloredCol].color = this.drawColor;
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

    exportBoardAsJSON() {
        return JSON.stringify(this.boardMatrix);
    }

    importBoardFromJSON(boardData) {
        this.boardMatrix = JSON.parse(boardData);
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


    saveBoard() { /* TODO: test */
        const fileContent = this.drawingBoard.exportBoardAsJSON();
        const blob = new Blob([fileContent], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "drawing.json";
        a.click();
        URL.revokeObjectURL(a.href);
    }

    loadBoard(event) { /* TODO: test */
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const boardData = e.target.result;
            this.drawingBoard.importBoardFromJSON(boardData);
            this.drawingBoard.redrawBoard(this.drawBoardElement);
        };
        reader.readAsText(file);
    }

}

const boardSize = 100;
const mouseRadius = 2;
const drawingBoard = new DrawingBoard(boardSize, boardSize/2);
drawingBoard.setMouseRadius(mouseRadius);
drawingBoard.setDrawType(DrawType.CIRCLE);
const drawingBoardUI = new DrawingBoardUI(drawingBoard);

//TODO: can we use unittesting framework like jest?
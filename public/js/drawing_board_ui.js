const { DrawingBoard } = require('./drawing_board.js');

class DrawingBoardUI {
    constructor(drawingBoard) {
        this.drawingBoard = drawingBoard;
        this.isMouseDown = false;
        this.drawBoardElement = null;
        this.lastDrawnCell = null
    }

    // TODO: maybe if board is too big for user resolution make the symbols smaller? 
    init() {
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
    }

    getClickedCellCoordinates(clickEvent) {
        const drawBoardRect = this.drawBoardElement.getBoundingClientRect();

        const cellWidth = drawBoardRect.width / this.drawingBoard.boardMatrix[0].length;
        const cellHeight = drawBoardRect.height / this.drawingBoard.boardMatrix.length;

        const clickedCol = Math.floor((clickEvent.clientX - drawBoardRect.left) / cellWidth);
        const clickedRow = Math.floor((clickEvent.clientY - drawBoardRect.top) / cellHeight);

        return { clickedRow, clickedCol };
    }

    mouseDown(event) {
        this.isMouseDown = true;
        this.lastClickedCell = this.getClickedCellCoordinates(event);
    }

    mouseMove(event) {
        if (!this.isMouseDown || !this.lastClickedCell) {
            return;
        }

        const currentCell = this.getClickedCellCoordinates(event);

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
        const { clickedRow, clickedCol } = this.getClickedCellCoordinates(event);

        this.drawingBoard.drawCharacterOnPoint(clickedRow, clickedCol);
    }

    

    saveBoard() {
        const fileContent = this.drawingBoard.exportBoardAsJSON();
        const blob = new Blob([fileContent], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "drawing.json";
        a.click();
        URL.revokeObjectURL(a.href);
    }

    loadBoard(event) {
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

module.exports = { DrawingBoardUI };
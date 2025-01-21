import { CharacterBoard } from '../../src/js/character_board.js';
import { Brush, ToolType, BrushShape } from './brush.js';

export class DrawingBoardUI {
    constructor(drawingBoard, brush) {
        this.drawingBoard = drawingBoard;
        this.isMouseDown = false;
        this.drawBoardElement = null;
        this.lastDrawnCell = null;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.brush = brush;
    }

    init() {
        const collection = document.getElementsByClassName("draw-board");
        if (collection.length === 0) {
            console.log("Board doesn't exist.");
            return;
        }

        this.drawBoardElement = collection[0];
        this.drawingBoard.initialiseContainer(this.drawBoardElement);

        this.captureDrawEvents();
        this.disableAndCaptureScrollAndZoom();

        const rect = this.drawBoardElement.getBoundingClientRect();
        this.offsetX = 0; //rect.left;
        this.offsetY = 0; //rect.top;
        this.drawBoardElement.style.transformOrigin = `${0} ${0}`;
        this.updateTransform();
    }

    /* returns cleanup function */
    captureDrawEvents() {
        const mouseUpHandler = () => { this.isMouseDown = false; };

        this.drawBoardElement.addEventListener("click", (e) => this.draw(e));
        this.drawBoardElement.addEventListener("mouseup", mouseUpHandler);
        this.drawBoardElement.addEventListener("mousedown", (e) => this.mouseDown(e));
        this.drawBoardElement.addEventListener("mousemove", (e) => this.mouseMove(e));


        return () => {
            this.drawBoardElement.removeEventListener("click", this.draw);
            this.drawBoardElement.removeEventListener("mouseup", mouseUpHandler);
            this.drawBoardElement.removeEventListener("mousedown", this.mouseDown);
            this.drawBoardElement.removeEventListener("mousemove", this.mouseMove);
        };
    }

    /* returns cleanup function */
    disableAndCaptureScrollAndZoom() {
        const wheelHandler = (event) => {
            event.preventDefault();
            if (event.ctrlKey) {
                /* Deprecated */
            } else {
                this.handleZoom(event)
            }
        };
    
        const keyHandler = (event) => {
            const keysToPrevent = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " "];
            if (keysToPrevent.includes(event.key)) {
                event.preventDefault();

            }
        };
    
        document.addEventListener("wheel", wheelHandler, { passive: false });
        document.addEventListener("keydown", keyHandler);
    
        return () => {
            document.removeEventListener("wheel", wheelHandler, { passive: false });
            document.removeEventListener("keydown", keyHandler);
        };
    }

    getClickedCellCoordinates(clickEvent) {
        const drawBoardRect = this.drawBoardElement.getBoundingClientRect();
    
        const computedStyle = window.getComputedStyle(this.drawBoardElement);

        const paddingLeft = parseFloat(computedStyle.paddingLeft || 0);
        const paddingTop = parseFloat(computedStyle.paddingTop || 0);
        const borderLeft = parseFloat(computedStyle.borderLeftWidth || 0);
        const borderTop = parseFloat(computedStyle.borderTopWidth || 0);
    
        /* Calculate actual drawable area */
        const drawableWidth = drawBoardRect.width - paddingLeft - borderLeft * 2;
        const drawableHeight = drawBoardRect.height - paddingTop - borderTop * 2;

        const cellWidth = drawableWidth / this.drawingBoard.boardMatrix[0].length;
        const cellHeight = drawableHeight / this.drawingBoard.boardMatrix.length;
    
        /* Adjust mouse coordinates to account for padding and border */
        const offsetX = clickEvent.clientX - (drawBoardRect.left + paddingLeft + borderLeft);
        const offsetY = clickEvent.clientY - (drawBoardRect.top + paddingTop + borderTop);
    
        const clickedCol = Math.floor(offsetX / cellWidth);
        const clickedRow = Math.floor(offsetY / cellHeight);
    
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

        if (currentCell.clickedRow !== this.lastClickedCell.clickedRow || currentCell.clickedCol !== this.lastClickedCell.clickedCol) {
            this.brush.drawLine(
                this.drawingBoard,
                this.lastClickedCell.clickedRow,
                this.lastClickedCell.clickedCol,
                currentCell.clickedRow,
                currentCell.clickedCol
            );
            this.lastClickedCell = currentCell;
        }
    }

    draw(event) {
        const { clickedRow, clickedCol } = this.getClickedCellCoordinates(event);
        this.brush.drawOnPosition(this.drawingBoard, clickedRow, clickedCol);
    }

    handleZoom(event) {
        const xs = (event.clientX - this.offsetX) / this.scale;
        const ys = (event.clientY - this.offsetY) / this.scale;
    
        const zoomFactor = 0.1;
        const zoomIn = event.deltaY < 0;
        const scaleDelta = zoomIn ? 1 + zoomFactor : 1 - zoomFactor;
    
        const newScale = this.scale * scaleDelta;
    
        // Adjust offsets to keep the zoom centered on the mouse position
        this.offsetX = event.clientX - xs*newScale;
        this.offsetY = event.clientY - ys*newScale;
    
        this.scale = newScale;
    
        this.updateTransform();
    }

    updateTransform() {
        this.drawBoardElement.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.scale})`;
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
            this.drawingBoard.initialiseContainer(this.drawBoardElement);
        };
        reader.readAsText(file);
    }
}
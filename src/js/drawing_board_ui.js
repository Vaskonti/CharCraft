import { CharacterBoard } from './character_board.js';
import { Brush, ToolType, BrushShape, BrushType } from './brush.js';

export class DrawingBoardUI {
    constructor(drawingBoard, brush) {
        this.drawingBoard = drawingBoard;
        this.isLeftMouseDown = false;
        this.isRightMouseDown = false;
        this.drawBoardElement = null;
        this.lastLeftMoveCell = null;
        this.lastRightMoveCoordinates = null;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.brush = brush;
        this.captureMouseEventsCleanupCallback = null;
        this.disableAndCaptureScrollAndZoomCleanupCallback = null;

    }

    init() {
        const collection = document.getElementsByClassName("draw-board");
        if (collection.length === 0) {
            console.log("Board doesn't exist.");
            return;
        }

        this.drawBoardElement = collection[0];
        this.drawBoardElement.style.transformOrigin = `${0} ${0}`;
        
        this.updateTransform();
        this.drawingBoard.initialiseContainer(this.drawBoardElement);

        window.oncontextmenu = function ()
        {
            return false; //cancel default menu
        }
    }

    enableBoardUI() {
        this.captureMouseEventsCleanupCallback = this.captureMouseEvents();
        this.disableAndCaptureScrollAndZoomCleanupCallback = this.disableAndCaptureScrollAndZoom();
    }

    disableBoardUI() {
        this.captureMouseEventsCleanupCallback();
        this.disableAndCaptureScrollAndZoomCleanupCallback()
    }

    /* returns cleanup function */
    captureMouseEvents() {
        const clickHandler = (event) => { 
            if (event.button === 0)
            {
                this.draw(event); 
            }
            else
            {
                /* nothing to do */
            }
        };

        const mouseUpHandler = (event) => { 
            if (event.button === 0)
            {
                this.isLeftMouseDown = false;
            }
            else
            {
                this.isRightMouseDown = false;
            }
        };

        const LeftMouseDownHandler = (event) => { 
            if (event.button === 0)
            {
                this.leftMouseDown(event);
            }
        };

        const rightMouseDownHandler = (event) => {
            if (event.button !== 0)
            {
                this.rightMouseDown(event);
            }
        }

        const mouseMoveHandler = (event) => { 
            if (this.isLeftMouseDown)
            {
                this.leftMouseMove(event);
            }
            if (this.isRightMouseDown)
            {
                this.rightMouseMove(event);
            }
        };

        this.drawBoardElement.addEventListener("click", clickHandler); // prevent drawing when clicking outside the board.
        this.drawBoardElement.addEventListener("mousedown", LeftMouseDownHandler);

        document.addEventListener("mousedown", rightMouseDownHandler);
        document.addEventListener("mouseup", mouseUpHandler); // can turn off drawing even when outside the board.
        document.addEventListener("mousemove", mouseMoveHandler);


        return () => {
            this.drawBoardElement.removeEventListener("click", clickHandler);
            this.drawBoardElement.removeEventListener("mousedown", LeftMouseDownHandler);

            document.removeEventListener("mousedown", rightMouseDownHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
            document.removeEventListener("mousemove", mouseMoveHandler);
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

    leftMouseDown(event) {
        this.isLeftMouseDown = true;
        this.lastLeftMoveCell = this.getClickedCellCoordinates(event);
    }

    rightMouseDown(event) {
        this.isRightMouseDown = true;
        this.lastRightMoveCoordinates = { clientX: event.clientX, clientY: event.clientY };
    }

    leftMouseMove(event) {
        if (!this.isLeftMouseDown || !this.lastLeftMoveCell) {
            return;
        }

        const currentCell = this.getClickedCellCoordinates(event);

        if (currentCell.clickedRow !== this.lastLeftMoveCell.clickedRow || currentCell.clickedCol !== this.lastLeftMoveCell.clickedCol) {
            this.brush.drawLine(
                this.drawingBoard,
                this.lastLeftMoveCell.clickedRow,
                this.lastLeftMoveCell.clickedCol,
                currentCell.clickedRow,
                currentCell.clickedCol
            );
            this.lastLeftMoveCell = currentCell;
        }
    }

    rightMouseMove(event) {
        this.offsetX -= this.lastRightMoveCoordinates.clientX - event.clientX;
        this.offsetY -= this.lastRightMoveCoordinates.clientY - event.clientY;
        this.lastRightMoveCoordinates = { clientX: event.clientX, clientY: event.clientY };
        this.updateTransform();
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
        reader.onload = (event) => {
            const boardData = e.target.result;
            this.drawingBoard.importBoardFromJSON(boardData);
            this.drawingBoard.initialiseContainer(this.drawBoardElement);
        };
        reader.readAsText(file);
    }


    registerColorButtons(buttons, dataName = 'data-color') {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const color = button.getAttribute(dataName);
                this.brush.setDrawColor(color);
            });
        });
    }

    registerClearButtons(clearButtons) {
        clearButtons.forEach(button => {
            button.addEventListener('click', () => {
                if(confirm("Are you sure you want to clear everything?")) {
                    this.drawingBoard.clearBoard();
                }
            });
        });
    }

    registerToolButtons(toolButtons, dataName = 'data-style') {
        toolButtons.forEach(button => {
            const strType = button.getAttribute(dataName);
            if (strType == "bucket") {
                button.addEventListener('click', () => {
                    this.brush.setToolType(ToolType.BUCKET);
                });
            }
            else if (strType == "brush") {
                button.addEventListener('click', () => {
                    this.brush.setToolType(ToolType.NORMAL);
                });
            }
        });
    }

    registerDrawButtons(drawButtons, dataName = 'data-draw') {
        drawButtons.forEach(button => {
            const strType = button.getAttribute(dataName);
            if (strType == "circle") {
                button.addEventListener('click', () => {
                    this.brush.setBrushShape(BrushShape.CIRCLE);
                });
            }
            else if (strType == "square") {
                button.addEventListener('click', () => {
                    this.brush.setBrushShape(BrushShape.NORMAL);
                });
            }
        });
    }

    registerBrushButtons(brushButtons, dataName = 'data-brush') {
        brushButtons.forEach(button => {
            const strType = button.getAttribute(dataName);
            if (strType == "normal") {
                button.addEventListener('click', () => {
                    this.brush.setBrushType(BrushType.NORMAL);
                });
            }
            else if (strType == "color-only") {
                button.addEventListener('click', () => {
                    this.brush.setBrushType(BrushType.COLOR_ONLY);
                });
            }
            else if (strType == "character-only") {
                button.addEventListener('click', () => {
                    this.brush.setBrushType(BrushType.CHARACTER_ONLY);
                });
            }
            else if (strType == "embolden") {
                button.addEventListener('click', () => {
                    this.brush.setBrushType(BrushType.EMBOLDEN_CHARACTER);
                });
            }
            else if (strType == "fade") {
                button.addEventListener('click', () => {
                    this.brush.setBrushType(BrushType.FADE_CHARACTER);
                });
            }
        });
    }
}
import { DrawingBoardUI } from './js/drawing_board_ui.js';
import { Board } from './js/board.js';
import { Brush, BrushType, DrawType} from './js/brush.js';

document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 100;
    const mouseRadius = 1;
    const drawingBoard = new Board(boardSize/2, boardSize);
    const brush = new Brush();
    brush.setMouseRadius(mouseRadius);
    brush.setDrawType(DrawType.CIRCLE);
    brush.setBrushType(BrushType.NORMAL);
    const drawingBoardUI = new DrawingBoardUI(drawingBoard, brush);
    drawingBoardUI.init();

    const colorButtons = document.querySelectorAll('.color-buttons button');
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.getAttribute('data-color');
            brush.setDrawColor(color);
        });
    });

    const clearButtons = document.querySelectorAll('.clear-buttons button');
    clearButtons.forEach(button => {
        button.addEventListener('click', () => {
            drawingBoard.clearBoard();
        });
    });

    const brushButtons = document.querySelectorAll('.brush-buttons button');
    brushButtons.forEach(button => {
        const strType = button.getAttribute('data-style');
        if (strType == "bucket") {
            button.addEventListener('click', () => {
                brush.setBrushType(BrushType.BUCKET);
            });
        }
        else if (strType == "brush") {
            button.addEventListener('click', () => {
                brush.setBrushType(BrushType.NORMAL);
            });
        }
    });
});
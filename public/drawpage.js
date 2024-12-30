import { DrawingBoardUI } from './js/drawing_board_ui.js';
import { DrawingBoard, DrawType } from './js/drawing_board.js';

document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 100;
    const mouseRadius = 2;
    const drawingBoard = new DrawingBoard(boardSize/2, boardSize);
    drawingBoard.setMouseRadius(mouseRadius);
    drawingBoard.setDrawType(DrawType.CIRCLE);
    const drawingBoardUI = new DrawingBoardUI(drawingBoard);
    drawingBoardUI.init();

    const colorButtons = document.querySelectorAll('.color-buttons button');
    console.log(drawingBoard);
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = getComputedStyle(button).backgroundColor;
            drawingBoard.setDrawColor(color);
            //console.log(`Selected color: ${color}`);
        });
    });
});
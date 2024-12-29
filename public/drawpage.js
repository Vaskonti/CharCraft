import { DrawingBoard, DrawType } from './js/drawing_board.js';
import DrawingBoardUI from './js/drawing_board_ui.js';

console.log("stuff");

const boardSize = 100;
const mouseRadius = 2;
const drawingBoard = new DrawingBoard(boardSize/2, boardSize);
drawingBoard.setMouseRadius(mouseRadius);
drawingBoard.setDrawType(DrawType.CIRCLE);
const drawingBoardUI = new DrawingBoardUI(drawingBoard);
import { DrawingBoardUI } from './js/drawing_board_ui.js';
import { CanvasBoard } from './js/canvas_board.js';
import { TextBoard } from './js/text_board.js';
import { Brush, ToolType, BrushShape, BrushType} from './js/brush.js';
import { ImageConverter, ImageParseOptions } from './js/image_converter.js';
import { CharacterBoard } from '../src/js/character_board.js';
document.addEventListener('DOMContentLoaded', () => {

    let img = new Image();
    img.src = '../assets/fine.png';
    const boardSize = 50;
    const cellWidth = 10;
    const cellHeight = cellWidth*1.3;
    const mouseRadius = 1;
    img.onload = () => {
        const options = new ImageParseOptions();
        options.darkCharacterThreshold = 0;
        options.brightnessFactor = 1.2;
        options.staticVolumeIncrease = 0;
        options.gammaCorrection = 0.5;
        options.useReducedSet = false;
        options.edgeDetection = false;
        options.edgeDetectionThreshold = 245;
        options.resolutionX = boardSize*2;
        options.resolutionY = boardSize;
        let drawingBoard = ImageConverter.parseImageToBoard(img, options);
        drawingBoard = CharacterBoard.parseCopyBoard(drawingBoard, CanvasBoard, [cellWidth, cellHeight]);
        const brush = new Brush();
        brush.setMouseRadius(mouseRadius);
        brush.setBrushShape(BrushShape.CIRCLE);
        brush.setToolType(ToolType.NORMAL);
        const drawingBoardUI = new DrawingBoardUI(drawingBoard, brush);
        drawingBoardUI.init();

        const colorButtons = document.querySelectorAll('#color-pallet button');
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

        const toolButtons = document.querySelectorAll('.tool-buttons button');
        toolButtons.forEach(button => {
            const strType = button.getAttribute('data-style');
            if (strType == "bucket") {
                button.addEventListener('click', () => {
                    brush.setToolType(ToolType.BUCKET);
                });
            }
            else if (strType == "brush") {
                button.addEventListener('click', () => {
                    brush.setToolType(ToolType.NORMAL);
                });
            }
        });

        const drawButtons = document.querySelectorAll('.draw-buttons button');
        drawButtons.forEach(button => {
            const strType = button.getAttribute('data-draw');
            if (strType == "circle") {
                button.addEventListener('click', () => {
                    brush.setBrushShape(BrushShape.CIRCLE);
                });
            }
            else if (strType == "square") {
                button.addEventListener('click', () => {
                    brush.setBrushShape(BrushShape.NORMAL);
                });
            }
        });


        const brushButtons = document.querySelectorAll('.brush-buttons button');
        brushButtons.forEach(button => {
            const strType = button.getAttribute('data-brush');
            if (strType == "normal") {
                button.addEventListener('click', () => {
                    brush.setBrushType(BrushType.NORMAL);
                });
            }
            else if (strType == "color-only") {
                button.addEventListener('click', () => {
                    brush.setBrushType(BrushType.COLOR_ONLY);
                });
            }
            else if (strType == "character-only") {
                button.addEventListener('click', () => {
                    brush.setBrushType(BrushType.CHARACTER_ONLY);
                });
            }
            else if (strType == "embolden") {
                button.addEventListener('click', () => {
                    brush.setBrushType(BrushType.EMBOLDEN_CHARACTER);
                });
            }
            else if (strType == "fade") {
                button.addEventListener('click', () => {
                    brush.setBrushType(BrushType.FADE_CHARACTER);
                });
            }
        });
    }
});
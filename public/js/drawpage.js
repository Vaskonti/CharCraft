import { DrawingBoardUI } from '../../src/js/drawing_board_ui.js';
import { CanvasBoard } from '../../src/js/canvas_board.js';
import { Brush, ToolType, BrushShape, BrushType} from '../../src/js/brush.js';
import { ImageConverter, ImageParseOptions } from '../../src/js/image_converter.js';
import { CharacterBoard } from '../../src/js/character_board.js';


const imageInput = document.getElementById('image-input');
const openPopup = document.getElementById('image-loader-btn');
const imagePopup = document.getElementById('image-popup');
const closePopup = document.getElementById('close-popup');
const cancelSettings = document.getElementById('cancel-settings');
const applySettings = document.getElementById('apply-settings');
const previewCanvasSection = document.getElementById('preview-canvas-section');

const resolutionXInput = document.getElementById('resolutionX');
const resolutionYInput = document.getElementById('resolutionY');
const brightnessInput = document.getElementById('brightness');
const gammaInput = document.getElementById('gamma');
const useReducedSetInput = document.getElementById('use-reduced-set');
const edgeDetectionInput = document.getElementById('edge-detection');
const edgeDetectionStrength = document.getElementById('edge-detection-strength');

var previewCanvasBoard = new CanvasBoard(0, 0);
let img = new Image();

const boardSize = 100;
const cellWidth = 12;
const cellHeight = cellWidth*1.3;

let drawingBoard = new CanvasBoard(boardSize, boardSize*1.5, cellWidth, cellHeight);
const brush = new Brush();
var drawingBoardUI = null;
var mouseRadius = 1;

const downloadButton = document.getElementById('download-btn');

function getImageOptions() {
    const options = new ImageParseOptions();
    options.brightnessFactor = parseFloat(brightnessInput.value);
    options.gammaCorrection = parseFloat(gammaInput.value);
    options.resolutionX = parseInt(resolutionXInput.value);
    options.resolutionY = parseInt(resolutionYInput.value);
    options.useReducedSet = useReducedSetInput.checked;
    options.edgeDetection = edgeDetectionInput.checked;
    options.edgeDetectionThreshold = parseFloat(edgeDetectionStrength.value);

    return options;
}

function loadPreviewBoard() {
    const options = getImageOptions();
    previewCanvasBoard = ImageConverter.parseImageToBoard(img, options);
    previewCanvasBoard = CharacterBoard.parseCopyBoard(previewCanvasBoard, CanvasBoard, [cellWidth, cellHeight]);
    previewCanvasBoard.initialiseContainer(previewCanvasSection);
}

function showPopup() {
    imagePopup.classList.remove('hidden');
    drawingBoardUI.disableBoardUI();
}

function hidePopup() {
    imagePopup.classList.add('hidden');
    drawingBoardUI.enableBoardUI();
}


document.addEventListener('DOMContentLoaded', () => {
    brush.setMouseRadius(mouseRadius);
    brush.setBrushShape(BrushShape.CIRCLE);
    brush.setToolType(ToolType.BRUSH);
    drawingBoardUI = new DrawingBoardUI(drawingBoard, brush);
    drawingBoardUI.init();
    drawingBoardUI.enableBoardUI();

    const palletButtons = document.querySelectorAll("#color-pallet button");
    drawingBoardUI.registerColorButtons(palletButtons, 'data-color');
    const clearButtons = document.querySelectorAll('.clear-buttons button');
    drawingBoardUI.registerClearButtons(clearButtons);
    const toolButtons = document.querySelectorAll('.tool-buttons button');
    drawingBoardUI.registerToolButtons(toolButtons, 'data-style');
    const drawButtons = document.querySelectorAll('.draw-buttons button');
    drawingBoardUI.registerDrawButtons(drawButtons, 'data-draw');
    const brushButtons = document.querySelectorAll('.brush-buttons button');
    drawingBoardUI.registerBrushButtons(brushButtons, 'data-brush');

    const asciiKeyBtn = document.getElementById("character-picker-btn");

    let isWaitingForKey = false;
    let currentAsciiChar = null;

    asciiKeyBtn.addEventListener("click", () => {
        asciiKeyBtn.textContent = " ";
        isWaitingForKey = true;
    });

    document.addEventListener("keydown", (event) => {
        if (isWaitingForKey) {
            currentAsciiChar = event.key;
            if (currentAsciiChar == "Shift")
            {
                secondAsciiChar = event.key;
            }
            asciiKeyBtn.textContent = currentAsciiChar;
            brush.setDrawCharacter(currentAsciiChar);
            isWaitingForKey = false;
        }
    });

    const colorPickerInput = document.getElementById("color-picker");
    const colorPickerBtn = document.querySelector(".color-picker-btn");

    drawingBoardUI.registerColorPicker(colorPickerBtn, colorPickerInput);

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            img.src = reader.result;
            img.onload = () => {
                loadPreviewBoard();
            };
        };
        reader.readAsDataURL(file);
      });


    //TODO: maybe add the other options?
    const allImageOptionInputs = [
        resolutionXInput, 
        resolutionYInput, 
        brightnessInput, 
        gammaInput, 
        useReducedSetInput, 
        edgeDetectionInput, 
        edgeDetectionStrength
    ];

    allImageOptionInputs.forEach(button => {
        button.addEventListener('change', (_) => {
            loadPreviewBoard();
            drawingBoardUI.disableBoardUI();
        });
    });

    openPopup.addEventListener('click', () => {
        showPopup();
    });

    applySettings.addEventListener('click', () => {
        drawingBoard = ImageConverter.parseImageToBoard(img, getImageOptions());
        drawingBoard = CharacterBoard.parseCopyBoard(drawingBoard, CanvasBoard, [cellWidth, cellHeight]);
        drawingBoardUI = new DrawingBoardUI(drawingBoard, brush);
        drawingBoardUI.init();
        hidePopup();
    });

    closePopup.addEventListener('click', () => {
        hidePopup();
    });

    cancelSettings.addEventListener('click', () => {
        hidePopup();
    });

    let filename = null;

    downloadButton.addEventListener('click', () => {
        const canvas = drawingBoard.canvas;
        const imageURL = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = filename || 'ascii_image.png';
        link.click();
    });

    //TODO: Implement save to profile

    const brushSizeBtn = document.getElementById("brush-size-btn");
    const brushSizeSlider = document.getElementById("brush-size");

    brushSizeBtn.addEventListener("click", () => {
        brushSizeSlider.classList.toggle("hidden");
    });

    brushSizeSlider.addEventListener("input", () => {
        brushSizeBtn.textContent = brushSizeSlider.value;
        brush.setMouseRadius(brushSizeSlider.value);
    });

    const centerBtn = document.getElementById("center-btn");
    centerBtn.addEventListener("click", () => {
        drawingBoardUI.centerCanvas();
    });

});


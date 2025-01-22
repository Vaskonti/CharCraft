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
    previewCanvasBoard = CharacterBoard.parseCopyBoard(previewCanvasBoard, CanvasBoard, [4, 4]);
    previewCanvasBoard.initialiseContainer(previewCanvasSection);
    //previewCanvasBoard.canvas.style.width = "100%";
    //previewCanvasBoard.canvas.style.height = "100%";
    previewCanvasBoard.canvas.style.maxWidth = "100%";
    previewCanvasBoard.canvas.style.maxHeight = "100%";
}

var drawingBoardUI = null;
const brush = new Brush();
let mouseRadius = 1;

const boardSize = 100;
const cellWidth = 12;
const cellHeight = cellWidth*1.3;

const downloadButton = document.getElementById('download-btn');

document.addEventListener('DOMContentLoaded', () => {
    let drawingBoard = new CanvasBoard(boardSize, boardSize*1.5, cellWidth, cellHeight);
    brush.setMouseRadius(mouseRadius);
    brush.setBrushShape(BrushShape.CIRCLE);
    brush.setToolType(ToolType.NORMAL);
    let drawingBoardUI = new DrawingBoardUI(drawingBoard, brush);
    drawingBoardUI.init();

    const colorButtons = document.querySelectorAll('#color-pallet button');
    drawingBoardUI.registerColorButtons(colorButtons, 'data-color');
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

    colorPickerBtn.addEventListener("click", () => {
        colorPickerInput.click();
    });

    colorPickerInput.addEventListener("input", (event) => {
        const selectedColor = event.target.value;
        colorPickerBtn.style.backgroundColor = selectedColor;
        colorPickerBtn.setAttribute("data-color", selectedColor);
    });

    const palletButtons = document.querySelectorAll("#color-pallet button");

    function removeSelection(type) {
        if (type == "pallet") palletButtons.forEach((btn) => btn.classList.remove("selected"));
        if (type == "tool") toolButtons.forEach((btn) => btn.classList.remove("selected"));
        if (type == "draw") drawButtons.forEach((btn) => btn.classList.remove("selected"));
        if (type == "brush") brushButtons.forEach((brush_buttons) => brush_buttons.classList.remove("selected"));
        
    }

    palletButtons.forEach((palletButton) => {
        palletButton.addEventListener("click", () => {
            removeSelection("pallet");
            palletButton.classList.add("selected");
        });
    });

    toolButtons.forEach((toolButton) => {
        toolButton.addEventListener("click", () => {
            removeSelection("tool");
            toolButton.classList.add("selected");
        });
    });

    drawButtons.forEach((drawButton) => {
        drawButton.addEventListener("click", () => {
            removeSelection("draw");
            drawButton.classList.add("selected");
        });
    });

    brushButtons.forEach((brushButton) => {
        brushButton.addEventListener("click", () => {
            removeSelection("brush");
            brushButton.classList.add("selected");
        });
    });

    openPopup.addEventListener('click', () => imagePopup.classList.remove('hidden'));
    closePopup.addEventListener('click', () => imagePopup.classList.add('hidden'));
    cancelSettings.addEventListener('click', () => imagePopup.classList.add('hidden'));

    //TODO: add remove image
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            img.src = reader.result;
            img.onload = () => {
                loadPreviewBoard();
            };
          };
          reader.readAsDataURL(file);
        }
      });


    //TODO: maybe add the other options?
    const allButtons = [ // todo: rename
        resolutionXInput, 
        resolutionYInput, 
        brightnessInput, 
        gammaInput, 
        useReducedSetInput, 
        edgeDetectionInput, 
        edgeDetectionStrength
    ];

    allButtons.forEach(button => {
        button.addEventListener('change', (_) => {
            loadPreviewBoard();
        });
    });

    applySettings.addEventListener('click', () => {
        imagePopup.classList.add('hidden')
        drawingBoard = ImageConverter.parseImageToBoard(img, getImageOptions());
        drawingBoard = CharacterBoard.parseCopyBoard(drawingBoard, CanvasBoard, [cellWidth, cellHeight]);
        drawingBoardUI = new DrawingBoardUI(drawingBoard, brush);
        drawingBoardUI.init();
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

    //TODO: Implement local save and save to profile

});
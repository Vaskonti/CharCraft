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
        options.brightnessFactor = 1;
        options.staticVolumeIncrease = 10;
        options.gammaCorrection = 1;
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
                if(confirm("Are you sure you want to clear everything?")) {
                drawingBoard.clearBoard();
                }
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

        //TODO: Fix image upload
        const imageInput = document.getElementById("image-loader");

        imageInput.addEventListener("click", async (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = async (e) => {
                    const img = new Image();
                    img.src = e.target.result;

                    img.onload = () => {
                        drawingBoard = ImageConverter.parseImageToBoard(img, options);
                        drawingBoard = CharacterBoard.parseCopyBoard(drawingBoard, CanvasBoard, [cellWidth, cellHeight]);
                    };
                };

            }
        });

        //TODO: Implement local save and save to profile
    }

    

    const pallet_buttons = document.querySelectorAll("#color-pallet button");
    const tool_buttons = document.querySelectorAll(".tool-buttons button");
    const draw_buttons = document.querySelectorAll(".draw-buttons button");
    const brush_buttons  = document.querySelectorAll(".brush-buttons button");


    function removeSelection(type) {
        if (type == "pallet") pallet_buttons.forEach((btn) => btn.classList.remove("selected"));
        if (type == "tool") tool_buttons.forEach((btn) => btn.classList.remove("selected"));
        if (type == "draw") draw_buttons.forEach((btn) => btn.classList.remove("selected"));
        if (type == "brush") brush_buttons.forEach((brush_buttons) => brush_buttons.classList.remove("selected"));
        
    }

    pallet_buttons.forEach((pallet_buttons) => {
        pallet_buttons.addEventListener("click", () => {
            removeSelection("pallet");
            pallet_buttons.classList.add("selected");
        });
    });

    tool_buttons.forEach((tool_buttons) => {
        tool_buttons.addEventListener("click", () => {
            removeSelection("tool");
            tool_buttons.classList.add("selected");
        });
    });

    draw_buttons.forEach((draw_buttons) => {
        draw_buttons.addEventListener("click", () => {
            removeSelection("draw");
            draw_buttons.classList.add("selected");
        });
    });

    brush_buttons.forEach((brush_buttons) => {
        brush_buttons.addEventListener("click", () => {
            removeSelection("brush");
            brush_buttons.classList.add("selected");
        });
    });

    

});
const { describe, test, expect, beforeEach } = require('@jest/globals');
import { DrawingBoardUI } from '../../public/src/js/drawing_board_ui.js';
import { TextBoard } from '../../public/src/js/text_board.js';
import { Brush, BrushShape, ToolType } from '../../public/src/js/brush.js';

describe('DrawingBoardUI Tests', () => {
    let board, brush, boardUI, drawBoardElement;

    beforeEach(() => {
        document.body.innerHTML = `<div class="draw-board"></div>`; // mock
        board = new TextBoard(20, 20);
        brush = new Brush()
        brush.setDrawCharacter('@');
        brush.setDrawColor("#FF0000");
        boardUI = new DrawingBoardUI(board, brush);
        boardUI.init();
        drawBoardElement = document.querySelector('.draw-board');

        drawBoardElement.getBoundingClientRect = jest.fn(() => ({ // mock getBoundingClientRect
            width: 200,
            height: 200,
            top: 0,
            left: 0,
            right: 200,
            bottom: 200,
        }));

        global.URL.createObjectURL = jest.fn(() => 'mocked-url');
    });

    test('should initialize UI on load', () => {
        expect(drawBoardElement).not.toBeNull();
        expect(boardUI.drawBoardElement).not.toBeNull();

        const drawBoardRect = drawBoardElement.getBoundingClientRect();
        expect(drawBoardRect.width).toBeGreaterThan(0);
        expect(drawBoardRect.height).toBeGreaterThan(0);
    });

    test('should detect clicked cell correctly', () => {
        const fakeEvent = {
            clientX: 50,
            clientY: 50,
        };
        const cell = boardUI.getClickedCellCoordinates(fakeEvent);
        expect(cell).toHaveProperty('clickedRow');
        expect(cell).toHaveProperty('clickedCol');

        const drawBoardRect = drawBoardElement.getBoundingClientRect();
        const cellWidth = drawBoardRect.width / boardUI.drawingBoard.boardMatrix[0].length;
        const cellHeight = drawBoardRect.height / boardUI.drawingBoard.boardMatrix.length;
        const clickedCol = Math.floor((fakeEvent.clientX - drawBoardRect.left) / cellWidth);
        const clickedRow = Math.floor((fakeEvent.clientY - drawBoardRect.top) / cellHeight);
        expect(cell.clickedCol).toEqual(clickedCol);
        expect(cell.clickedRow).toEqual(clickedRow);
    });

    test('should draw character on click', () => {
        const fakeEvent = {
            clientX: 50,
            clientY: 50,
        };
        boardUI.draw(fakeEvent);
        const { clickedRow, clickedCol } = boardUI.getClickedCellCoordinates(fakeEvent);
        const cell = board.boardMatrix[clickedRow][clickedCol]; 
        expect(cell.character).toBe('@');
        expect(cell.color).toBe('#FF0000');
    });

    test('should not draw outside board boundaries', () => {
        const fakeEvent = {
            clientX: 9999,  // Out of bounds
            clientY: 9999,  // Out of bounds
        };
        const initialMatrix = JSON.stringify(board.boardMatrix);
        boardUI.draw(fakeEvent);
        expect(JSON.stringify(board.boardMatrix)).toEqual(initialMatrix);  // No change should occur
    });

    test('should draw a line between two points', () => {
        brush.setMouseRadius(1);
        const startEvent = { clientX: 0, clientY: 0 };
        const endEvent = { clientX: 100, clientY: 100 };

        boardUI.leftMouseDown(startEvent);
        boardUI.leftMouseMove(endEvent);

        const startCell = boardUI.getClickedCellCoordinates(startEvent);
        const endCell = boardUI.getClickedCellCoordinates(endEvent);

        expect(board.boardMatrix[startCell.clickedRow][startCell.clickedCol].character).toBe('@');
        expect(board.boardMatrix[endCell.clickedRow][endCell.clickedCol].character).toBe('@');

        const rowDiff = Math.abs(startCell.clickedRow - endCell.clickedRow);
        const colDiff = Math.abs(startCell.clickedCol - endCell.clickedCol);
        expect(rowDiff).toBeGreaterThan(0);
        expect(colDiff).toBeGreaterThan(0);
    });

    test('should save the board to a file', () => {
        board.fillBoardWithCharacter('X');
        global.URL.revokeObjectURL = jest.fn();
        
        const spy = jest.spyOn(document, 'createElement').mockReturnValue({
            setAttribute: jest.fn(),
            click: jest.fn(),
        });

        const downloadSpy = jest.fn();
        spy.mockReturnValueOnce({
            setAttribute: jest.fn(),
            click: downloadSpy,
            href: 'mocked-url',
        });
        
        boardUI.saveBoard();
        
        expect(spy).toHaveBeenCalled();
        expect(downloadSpy).toHaveBeenCalled();
    });

    test('should load the board from a file', () => {
        const boardData = JSON.stringify(board.boardMatrix);
        
        const fakeEvent = {
            target: {
                files: [{
                    name: 'drawing.json',
                    type: 'application/json',
                    size: boardData.length,
                    text: () => Promise.resolve(boardData),
                }]
            }
        };

        global.FileReader = jest.fn(function() {
            this.readAsText = jest.fn((file) => {
                const reader = this;
                reader.onload({ target: { result: boardData } });
            });
        });

        const spy = jest.spyOn(boardUI.drawingBoard, 'initialiseContainer');
        boardUI.loadBoard(fakeEvent);

        expect(spy).toHaveBeenCalled();
        expect(JSON.stringify(board.boardMatrix)).toEqual(boardData);
    });

    /* deprecated for now */
    // test('should enable and disable board UI correctly', () => {
    //     const mockCleanupMouseEvents = jest.fn();
    //     const mockCleanupScrollAndZoom = jest.fn();

    //     jest.spyOn(boardUI, 'captureMouseEvents').mockReturnValue(mockCleanupMouseEvents);
    //     jest.spyOn(boardUI, 'disableAndCaptureScrollAndZoom').mockReturnValue(mockCleanupScrollAndZoom);

    //     boardUI.enableBoardUI();
    //     expect(boardUI.captureMouseEvents).toHaveBeenCalled();
    //     expect(boardUI.disableAndCaptureScrollAndZoom).toHaveBeenCalled();

    //     boardUI.disableBoardUI();
    //     expect(mockCleanupMouseEvents).toHaveBeenCalled();
    //     expect(mockCleanupScrollAndZoom).toHaveBeenCalled();
    // });

    test('should handle right mouse button drag for panning', () => {
        const initalPosition = { offsetX: boardUI.offsetX, offsetY: boardUI.offsetY };
        const startEvent = { clientX: 100, clientY: 100, button: 2 };
        const moveEvent = { clientX: 120, clientY: 110 };

        boardUI.rightMouseDown(startEvent);
        expect(boardUI.isRightMouseDown).toBe(true);
        expect(boardUI.lastRightMoveCoordinates).toEqual({ clientX: 100, clientY: 100 });

        boardUI.rightMouseMove(moveEvent);
        expect(boardUI.offsetX - initalPosition.offsetX).toBe(20);
        expect(boardUI.offsetY - initalPosition.offsetY).toBe(10);
    });

    test('should link tool buttons and update brush tool type', () => {
        document.body.innerHTML += `
            <button class="tool-button" data-style="bucket"></button>
            <button class="tool-button" data-style="brush"></button>`;

        const buttons = document.querySelectorAll('.tool-button');
        boardUI.registerToolButtons(buttons, 'data-style');

        buttons[0].click();
        expect(brush.toolType).toBe(ToolType.BUCKET);

        buttons[1].click();
        expect(brush.toolType).toBe(ToolType.NORMAL);
    });

    test('should link brush shape buttons and update brush shape', () => {
        document.body.innerHTML += `
            <button class="shape-button" data-draw="circle"></button>
            <button class="shape-button" data-draw="square"></button>`;

        const buttons = document.querySelectorAll('.shape-button');
        boardUI.registerDrawButtons(buttons, 'data-draw');

        buttons[0].click();
        expect(brush.brushShape).toBe(BrushShape.CIRCLE);

        buttons[1].click();
        expect(brush.brushShape).toBe(BrushShape.NORMAL);
    });

    test('should link color buttons and update brush color', () => {
        document.body.innerHTML += `
            <button class="color-button" data-color="#FF0000"></button>
            <button class="color-button" data-color="#00FF00"></button>`;

        const buttons = document.querySelectorAll('.color-button');
        boardUI.registerColorButtons(buttons, 'data-color');

        buttons[0].click();
        expect(brush.drawColor).toBe('#FF0000');

        buttons[1].click();
        expect(brush.drawColor).toBe('#00FF00');
    });

    test('should link clear buttons and clear the board', () => {
        document.body.innerHTML += `<button class="clear-button"></button>`;

        const button = document.querySelector('.clear-button');
        jest.spyOn(window, 'confirm').mockReturnValue(true);
        jest.spyOn(board, 'clearBoard');

        boardUI.registerClearButtons([button]);
        button.click();

        expect(window.confirm).toHaveBeenCalled();
        expect(board.clearBoard).toHaveBeenCalled();
    });

    test('should handle zooming properly', () => {
        const zoomInEvent = { clientX: 100, clientY: 100, deltaY: -1, ctrlKey: false };
        const zoomOutEvent = { clientX: 100, clientY: 100, deltaY: 1, ctrlKey: false };

        boardUI.handleZoom(zoomInEvent);
        expect(boardUI.scale).toBeGreaterThan(1);

        boardUI.handleZoom(zoomOutEvent);
        expect(boardUI.scale).toBeLessThan(1);
    });


    test('should center the canvas properly', () => {
        const mockBoardElement = {
            getBoundingClientRect: jest.fn().mockReturnValue({
                width: 500,
                height: 300,
            }),
            style: {
                transform: '',
            },
        };
    
        Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
        Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });
    
        boardUI.drawBoardElement = mockBoardElement;
        boardUI.scale = 1;
    
        boardUI.centerCanvas();
    
        expect(boardUI.offsetX).toBeCloseTo((800 - 500) / 2);
        expect(boardUI.offsetY).toBeCloseTo((600 - 300) / 2);
        expect(mockBoardElement.style.transform).toBe(`translate(${boardUI.offsetX}px, ${boardUI.offsetY}px) scale(1)`);
    });


});
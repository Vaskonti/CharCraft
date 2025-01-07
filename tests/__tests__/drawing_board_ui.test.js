const { describe, test, expect, beforeEach } = require('@jest/globals');
import { DrawingBoardUI } from '../../public/js/drawing_board_ui.js';
import { TextBoard } from '../../public/js/text_board.js';
import { Brush } from '../../public/js/brush.js';

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

        boardUI.mouseDown(startEvent);
        boardUI.mouseMove(endEvent);

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

        const spy = jest.spyOn(boardUI.drawingBoard, 'fillBoardContainer');
        boardUI.loadBoard(fakeEvent);

        expect(spy).toHaveBeenCalled();
        expect(JSON.stringify(board.boardMatrix)).toEqual(boardData);
    });

    test('should redraw the board correctly after loading', () => {
        board.fillBoardWithCharacter('O');
        const boardJSON = board.exportBoardAsJSON();
        const newBoard = new TextBoard(20, 20);
        newBoard.importBoardFromJSON(boardJSON);
        const spy = jest.spyOn(newBoard, 'fillBoardContainer');
        
        newBoard.fillBoardContainer(document.querySelector('.draw-board'));

        expect(spy).toHaveBeenCalled();
        expect(newBoard.boardMatrix[0][0].character).toBe('O');
        expect(newBoard.boardMatrix[19][19].character).toBe('O');
    });
});
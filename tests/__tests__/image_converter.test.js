import { ImageConverter, ImageParseOptions } from '../../public/src/js/image_converter.js';
import { CharacterBoard } from '../../public/src/js/character_board.js';
import { Character } from '../../public/src/js/character.js';

const img = {
    width: 10,
    height: 10,
    data: new Uint8ClampedArray(10 * 10 * 4).fill(255) // Mock white image
};

describe('ImageConverter Class Tests', () => {
    let options, img;

    beforeEach(() => {
        options = new ImageParseOptions();
        img = new Image();
        img.src = Buffer.alloc(100 * 100 * 4);
        img.width = 100;
        img.height = 100;
        Object.defineProperty(img, 'complete', { value: true });
    });

    test('should throw an error for invalid image input', () => {
        expect(() => ImageConverter.parseImageToBoard(null)).toThrow("Invalid image provided.");
        expect(() => ImageConverter.parseImageToBoard({})).toThrow("Invalid image provided.");
    });

    test('should parse image into a board correctly', () => {
        const board = ImageConverter.parseImageToBoard(img, options);
        expect(board).toBeInstanceOf(CharacterBoard);
        expect(board.boardMatrix.length).toBe(100);
        expect(board.boardMatrix[0].length).toBe(100);
    });

    test('should apply brightness factor correctly', () => {
        options.brightnessFactor = 0.5;
        const pixels = { data: new Uint8ClampedArray([100, 100, 100, 255]) };
        ImageConverter.applyBrightnessFactor(pixels, options);
        expect(pixels.data[0]).toBe(50);
        expect(pixels.data[1]).toBe(50);
        expect(pixels.data[2]).toBe(50);
    });

    test('should apply gamma correction correctly', () => {
        options.gammaCorrection = 2.0;
        const pixels = { data: new Uint8ClampedArray([100, 100, 100, 255]) };
        ImageConverter.applyGammaCorrection(pixels, options);
        expect(Math.round(pixels.data[0])).toBe(39); // Approximate gamma-corrected value
    });

    test('should apply edge detection correctly', () => {
        options.edgeDetection = true;
        const pixels = {
            width: 3,
            height: 3,
            data: new Uint8ClampedArray([
                0, 0, 0, 255, 50, 50, 50, 255, 100, 100, 100, 255,
                0, 0, 0, 255, 50, 50, 50, 255, 100, 100, 100, 255,
                0, 0, 0, 255, 50, 50, 50, 255, 100, 100, 100, 255,
            ])
        };
        ImageConverter.applyEdgeDetection(pixels, options);
        expect(pixels.data[4 * 4]).toBe(0); // Example: Check pixel intensity after edge detection
    });

    test('should create board from pixels correctly', () => {
        const pixels = {
            width: 5,
            height: 5,
            data: new Uint8ClampedArray(5 * 5 * 4).fill(255),
        };
        const board = ImageConverter.createBoardFromPixels(pixels, options);
        expect(board).toBeInstanceOf(CharacterBoard);
        expect(board.boardMatrix.length).toBe(5);
        expect(board.boardMatrix[0].length).toBe(5);
    });

    test('should map pixel to character correctly', () => {
        const pixel = { red: 100, green: 100, blue: 100, alpha: 255 };
        const character = ImageConverter.getPixelSymbol(pixel, options);
        expect(character).toBeDefined(); // Verify it matches the visibility rank
    });

    test('should get pixel correctly from ImageData', () => {
        const pixels = { width: 3, data: new Uint8ClampedArray([
            255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255,
            255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255,
            255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255,
        ]) };
        const pixel = ImageConverter.getPixel(pixels, 0, 1);
        expect(pixel.red).toBe(0);
        expect(pixel.green).toBe(255);
        expect(pixel.blue).toBe(0);
        expect(pixel.alpha).toBe(255);
    });

    test('should generate scaled image pixels correctly', () => {
        options.resolutionX = 100;
        options.resolutionY = 100;
        const scaledPixels = ImageConverter.getImagePixels(img, options);
        expect(scaledPixels).toBeDefined();
    });
});
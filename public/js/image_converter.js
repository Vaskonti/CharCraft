import { Character } from '../../src/js/character.js';
import { asciiVisibilityRank, emptyCharacter } from '../../src/js/utils.js';
import { Board } from './board.js'
 
export class ImageConverter {
    static parseImageToBoard(img, ResolutionX = null, ResolutionY = null) {

        if (!img || !img.width || !img.height) {
            throw new Error("Invalid image provided.");
        }

        if (!ResolutionX)
        {
            ResolutionX = img.width;
        }
        if (!ResolutionY)
        {
            ResolutionY = img.height;
        }
        const pixels = ImageConverter.getImagePixels(img, ResolutionX, ResolutionY);
        const board = new Board(img.width, img.height);
        for (let i = 0; i < board.boardMatrix.length; i += 1) {
            for (let j = 0; j < board.boardMatrix[0].length; j += 1) {
                const pixel = ImageConverter.getPixel(pixels, i, j);
                board.boardMatrix[i][j].character = ImageConverter.getPixelSymbol(pixel);
                board.boardMatrix[i][j].color = ImageConverter.getPixelColorHex(pixel);
            }
        }
        return board;
    }

    /* returns values of pixel in 0-counted row, col */
    static getPixel(pixels, row, col) {
        /* Pixels should be a UInt8ClampedArray. So no rows exist. Gotta calculate the position it on my own.
            Each pixel is worth 4 values. pixels.width returns number of pixels, not values in a row. 
            https://developer.mozilla.org/en-US/docs/Web/API/ImageData, documentation*/
        const rowOffset = row * 4 * pixels.width;
        const colOffset = col * 4;
        const position = rowOffset + colOffset;
        return {red: pixels.data[position], 
                green: pixels.data[position + 1], 
                blue: pixels.data[position + 2], 
                alpha: pixels.data[position + 3],
            }
    }

    static getImagePixels(img, resolutionX, resolutionY) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        // Determine the scaling factor based on the larger dimension to preserve the aspect ratio
        const scaleX = resolutionX / img.width;
        const scaleY = resolutionY / img.height;
        const scale = Math.min(scaleX, scaleY);

        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        canvas.width = drawWidth;
        canvas.height = drawHeight;
        ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
        const pixels = ctx.getImageData(0, 0, drawWidth, drawHeight);
        return pixels;
    }

    static getPixelSymbol(pixel) {
        const alpha = pixel.alpha; // TODO: consider alpha in some images
        if (alpha === 0) return emptyCharacter;

        const averageColor = (pixel.red + pixel.green + pixel.blue)/3;
        const characterIndex = Math.floor((averageColor / 255) * asciiVisibilityRank.length);
        const character = asciiVisibilityRank[characterIndex];

        return character;
    }

    static getPixelColorHex(pixel) {
        const red = pixel.red.toString(16).padStart(2, '0');
        const green = pixel.green.toString(16).padStart(2, '0');
        const blue = pixel.blue.toString(16).padStart(2, '0');
        return `#${red}${green}${blue}`;
    }
}
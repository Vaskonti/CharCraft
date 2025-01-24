import { Character } from './character.js';
import { asciiVisibilityRank, reducedAsciiVisibilityRank, emptyCharacter } from './utils.js';
import { CharacterBoard } from './character_board.js'
 
export class ImageConverter {
    static parseImageToBoard(img, options = new ImageParseOptions()) {

        if (!img || !img.width || !img.height) {
            throw new Error("Invalid image provided.");
        }

        options.resolutionX = options.resolutionX || img.width;
        options.resolutionY = options.resolutionY || img.height;

        const pixels = ImageConverter.getImagePixels(img, options);
        ImageConverter.applyImageProcessing(pixels, options);
        const board = ImageConverter.createBoardFromPixels(pixels, options);
        return board;
    }


    static applyImageProcessing(pixels, options) {
        const width = pixels.width;
        const height = pixels.height;

        // Precompute gamma correction and edge threshold for efficiency
        const gammaLookup = new Array(256).fill(0).map((_, i) => 
            Math.min(Math.pow(i / 255, options.gammaCorrection) * 255, 255)
        );

        const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
        const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        const outputData = new Uint8ClampedArray(pixels.data.length);

        // Loop through each pixel for combined processing
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const pixelIndex = (y * width + x) * 4;

                // Apply brightness and gamma correction
                const r = Math.min(pixels.data[pixelIndex] * options.brightnessFactor, 255);
                const g = Math.min(pixels.data[pixelIndex + 1] * options.brightnessFactor, 255);
                const b = Math.min(pixels.data[pixelIndex + 2] * options.brightnessFactor, 255);
                const correctedR = gammaLookup[Math.floor(r)];
                const correctedG = gammaLookup[Math.floor(g)];
                const correctedB = gammaLookup[Math.floor(b)];

                // Compute intensity for edge detection
                let Gx = 0, Gy = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const neighborIndex = ((y + ky) * width + (x + kx)) * 4;
                        const intensity = 
                            pixels.data[neighborIndex] * 0.3 +
                            pixels.data[neighborIndex + 1] * 0.59 +
                            pixels.data[neighborIndex + 2] * 0.11;

                        Gx += intensity * sobelX[(ky + 1) * 3 + (kx + 1)];
                        Gy += intensity * sobelY[(ky + 1) * 3 + (kx + 1)];
                    }
                }

                const magnitude = Math.sqrt(Gx * Gx + Gy * Gy);

                // Apply edge detection
                if (magnitude > options.edgeDetectionThreshold) {
                    outputData[pixelIndex] = 0;
                    outputData[pixelIndex + 1] = 0;
                    outputData[pixelIndex + 2] = 0;
                    outputData[pixelIndex + 3] = 0;
                } else {
                    outputData[pixelIndex] = correctedR;
                    outputData[pixelIndex + 1] = correctedG;
                    outputData[pixelIndex + 2] = correctedB;
                    outputData[pixelIndex + 3] = pixels.data[pixelIndex + 3]; // Preserve alpha
                }
            }
        }

        // Copy results back to pixels
        pixels.data.set(outputData);
    }

    static createBoardFromPixels(pixels, options) {
        const board = new CharacterBoard(pixels.height, pixels.width);
        for (let i = 0; i < board.boardMatrix.length; i += 1) {
            for (let j = 0; j < board.boardMatrix[0].length; j += 1) {
                const pixel = ImageConverter.getPixel(pixels, i, j);
                board.boardMatrix[i][j].character = ImageConverter.getPixelSymbol(pixel, options);
                board.boardMatrix[i][j].color = ImageConverter.getPixelColorHex(pixel);
            }
        }
        return board;
    }

    static applyBrightnessFactor(pixels, options) {
        if (options.brightnessFactor == 1.0) {
            return;
        }
        for (let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i] = Math.min(pixels.data[i] * options.brightnessFactor, 255);
            pixels.data[i + 1] = Math.min(pixels.data[i + 1] * options.brightnessFactor, 255);
            pixels.data[i + 2] = Math.min(pixels.data[i + 2] * options.brightnessFactor, 255);
        }
    }

    static applyGammaCorrection(pixels, options) {
        if (options.gammaCorrection == 1.0) {
            return;
        }
        for (let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i] = Math.min(Math.pow(pixels.data[i] / 255, options.gammaCorrection) * 255, 255);
            pixels.data[i + 1] = Math.min(Math.pow(pixels.data[i + 1] / 255, options.gammaCorrection) * 255, 255);
            pixels.data[i + 2] = Math.min(Math.pow(pixels.data[i + 2] / 255, options.gammaCorrection) * 255, 255);
        }
    }

    static applyEdgeDetection(pixels, options) {
        if (!options.edgeDetection) {
            return;
        }
        const width = pixels.width;
        const height = pixels.height;
        const outputData = new Uint8ClampedArray(pixels.data.length);
        const sobelX = [
            -1, 0, 1,
            -2, 0, 2,
            -1, 0, 1,
        ];
        const sobelY = [
            -1, -2, -1,
             0,  0,  0,
             1,  2,  1,
        ];
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let Gx = 0, Gy = 0;
    
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
                        const intensity = pixels.data[pixelIndex] * 0.3 +
                                          pixels.data[pixelIndex + 1] * 0.59 +
                                          pixels.data[pixelIndex + 2] * 0.11;
    
                        Gx += intensity * sobelX[(ky + 1) * 3 + (kx + 1)];
                        Gy += intensity * sobelY[(ky + 1) * 3 + (kx + 1)];
                    }
                }
            
    
                const magnitude = Math.sqrt(Gx * Gx + Gy * Gy);
                const normalized = Math.min(255, magnitude);
    
                const outputIndex = (y * width + x) * 4;
                if (normalized > options.edgeDetectionThreshold) {
                    outputData[outputIndex] = 0; 
                    outputData[outputIndex + 1] = 0; 
                    outputData[outputIndex + 2] = 0;
                    outputData[outputIndex + 3] = 0;
                } else {
                    outputData[outputIndex] = pixels.data[outputIndex];
                    outputData[outputIndex + 1] = pixels.data[outputIndex + 1];
                    outputData[outputIndex + 2] = pixels.data[outputIndex + 2];
                    outputData[outputIndex + 3] = pixels.data[outputIndex + 3];
                }
            }
        }
    
        for (let i = 0; i < pixels.data.length; i++) {
            pixels.data[i] = outputData[i];
        }
    }

    /* returns values of pixel in 0-counted row, col */
    static getPixel(pixels, row, col) {
        /* Pixels should be a UInt8ClampedArray. So no rows exist. Gotta calculate the position it on my own.
            Each pixel is worth 4 values. pixels.width returns number of pixels, not values in a row. 
            https://developer.mozilla.org/en-US/docs/Web/API/ImageData, documentation*/
        const rowOffset = row * 4 * pixels.width;
        const colOffset = col * 4;
        const position = rowOffset + colOffset;
        const pixel = { 
            red: pixels.data[position], 
            green: pixels.data[position + 1], 
            blue: pixels.data[position + 2], 
            alpha: pixels.data[position + 3],
            }
        return pixel;
    }

    static getImagePixels(img, options) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        // Determine the scaling factor based on the larger dimension to preserve the aspect ratio
        const scaleX = options.resolutionX / img.width;
        const scaleY = options.resolutionY / img.height;
        const scale = Math.min(scaleX, scaleY);

        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;
        canvas.width = drawWidth;
        canvas.height = drawHeight;
        ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
        const pixels = ctx.getImageData(0, 0, drawWidth, drawHeight);
        return pixels;
    }

    static getPixelSymbol(pixel, options) {
        const alpha = pixel.alpha; // TODO: consider alpha in some images
        if (alpha === 0) return emptyCharacter;

        const averageColor = (pixel.red + pixel.green + pixel.blue)/3;
        
        if (options.darkCharacterTreshold > averageColor)
        {
            return emptyCharacter;
        }
        
        const length = options.useReducedSet ? reducedAsciiVisibilityRank.length :  asciiVisibilityRank.length;
        const index = Math.floor((averageColor / 255) * length) + options.staticVolumeIncrease;
        const characterIndex = Math.min(length - 1, index);
        const character = options.useReducedSet ? reducedAsciiVisibilityRank[characterIndex] : asciiVisibilityRank[characterIndex];

        return character;
    }

    static getPixelColorHex(pixel) {
        const red = pixel.red.toString(16).padStart(2, '0');
        const green = pixel.green.toString(16).padStart(2, '0');
        const blue = pixel.blue.toString(16).padStart(2, '0');
        return `#${red}${green}${blue}`;
    }
}


export class ImageParseOptions {
    constructor(darkCharacterTreshold = 0,
                staticVolumeIncrease = 0,
                brightnessFactor = 1.0,
                gammaCorrection = 1.0,
                useReducedSet = false,
                edgeDetection = false,
                edgeDetectionThreshold = 150,
                resolutionX = null,
                resolutionY = null) {
        this.darkCharacterThreshold = darkCharacterTreshold;
        this.staticVolumeIncrease = staticVolumeIncrease;
        this.brightnessFactor = brightnessFactor;
        this.gammaCorrection = gammaCorrection;
        this.useReducedSet = useReducedSet;
        this.edgeDetection = edgeDetection;
        this.edgeDetectionThreshold = edgeDetectionThreshold;
        this.resolutionX = resolutionX;
        this.resolutionY = resolutionY;
    }
}
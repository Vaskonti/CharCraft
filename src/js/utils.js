

export const emptyCharacter = ' '
export const defaultColor = "#FFFFFF"
export const defaultBackgroundColor = "#000000"
export const asciiVisibilityRank = emptyCharacter + ".-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@";
export const reducedAsciiVisibilityRank = emptyCharacter + ".-=oa#@";
export const densityCache = {};
export const densityIndexCache = {};
export const canvasFont = "Georgia";//TODO: find better font

export function precomputeDensityForReducedVisibilityRank() {
    for (let i = 0; i < reducedAsciiVisibilityRank.length; i += 1) {
        densityCache[reducedAsciiVisibilityRank[i]] = computeCharacterDensity(reducedAsciiVisibilityRank[i]);
        densityIndexCache[reducedAsciiVisibilityRank[i]] = i;
    }
}

/* This function calculates the density of a given character by determining 
    how much of its rendered area is visually "filled" (i.e., has visible pixels) between 0 and 1.
    Stores the character in cache. When called later the function returns immediately.*/
export function computeCharacterDensity(character) {
    if (character in densityCache)
    {
        return densityCache[character];
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 10;
    canvas.height = 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `10px ${canvasFont}`;
    ctx.fillText(character, 0, 10);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let filledPixels = 0;
    for (let i = 0; i < imageData.length; i += 4) {
        const alpha = imageData[i + 3];
        if (alpha > 128) filledPixels++;
    }

    const density = filledPixels / (canvas.width * canvas.height);
    return density;
}


/* This function returns the index of a character in the visibilityRank with the closest density heuristic. NOTE:: the visibility ranks MUST be precomputed. 
    Keeps character in densityIndexCache so it doesn't always compute */
export function getVisibilityRankIndexOfCharacter(character) {
    if (character in densityIndexCache)
    {
        return densityIndexCache[character];
    }
    let closest_density_distance = 100;
    let best_rank_index = 0;
    const character_density = computeCharacterDensity(character);
    for (let i = 0; i < reducedAsciiVisibilityRank.length; i += 1) {
        const density_distance = Math.abs(densityCache[reducedAsciiVisibilityRank[i]] - character_density);
        if (density_distance < closest_density_distance)
        {
            best_rank_index = i;
            closest_density_distance = density_distance;
        }
    }
    densityIndexCache[character] = best_rank_index;
    return best_rank_index;
}

precomputeDensityForReducedVisibilityRank();
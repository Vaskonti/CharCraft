import { 
    asciiVisibilityRank, 
    reducedAsciiVisibilityRank, 
    precomputeDensityForReducedVisibilityRank, 
    getVisibilityRankIndexOfCharacter, 
    densityCache, 
    densityIndexCache 
  } from '../../src/js/utils.js'; 
  
  beforeAll(() => {
    precomputeDensityForReducedVisibilityRank();
  });
  
  describe('Visibility Rank Mapping', () => {
    it('should map each character in asciiVisibilityRank to a character in reducedAsciiVisibilityRank', () => {
      for (const character of asciiVisibilityRank) {
        const index = getVisibilityRankIndexOfCharacter(character);
  
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(reducedAsciiVisibilityRank.length);
  
        const mappedCharacter = reducedAsciiVisibilityRank[index];
        expect(mappedCharacter).toBeDefined();
      }
    });
  });
  
  describe('Density Cache', () => {
    it('should precompute densities for all characters in reducedAsciiVisibilityRank', () => {
      for (const character of reducedAsciiVisibilityRank) {
        expect(densityCache[character]).not.toBeUndefined();
        expect(typeof densityCache[character]).toBe('number');
        expect(densityCache[character]).toBeGreaterThanOrEqual(0);
        expect(densityCache[character]).toBeLessThanOrEqual(1);
      }
    });
  });
  
  describe('Density Index Cache', () => {
    it('should precompute density index for all characters in reducedAsciiVisibilityRank', () => {
      for (const character of reducedAsciiVisibilityRank) {
        expect(densityIndexCache[character]).not.toBeUndefined();
        expect(typeof densityIndexCache[character]).toBe('number');
        expect(densityIndexCache[character]).toBeGreaterThanOrEqual(0);
        expect(densityIndexCache[character]).toBeLessThan(reducedAsciiVisibilityRank.length);
      }
    });
  });
  
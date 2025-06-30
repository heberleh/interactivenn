import { generateAllCombinations, getActiveCombinations } from '../svgTemplates';

describe('SVG Template Utilities', () => {
  describe('generateAllCombinations', () => {
    it('should generate all combinations for 2 sets', () => {
      const combinations = generateAllCombinations(2);
      expect(combinations).toEqual(['a', 'b', 'ab']);
    });

    it('should generate all combinations for 3 sets', () => {
      const combinations = generateAllCombinations(3);
      expect(combinations).toEqual(['a', 'b', 'ab', 'c', 'ac', 'bc', 'abc']);
    });

    it('should generate correct number of combinations', () => {
      expect(generateAllCombinations(2)).toHaveLength(3); // 2^2 - 1
      expect(generateAllCombinations(3)).toHaveLength(7); // 2^3 - 1
      expect(generateAllCombinations(4)).toHaveLength(15); // 2^4 - 1
    });
  });

  describe('getActiveCombinations', () => {
    it('should return active combinations for sets with intersections', () => {
      const sets = {
        A: ['1', '2', '3'],
        B: ['2', '3', '4'],
        C: ['3', '4', '5']
      };
      
      const activeCombinations = getActiveCombinations(sets);
      
      // Erwarte dass alle Kombinationen mit Schnittmengen enthalten sind
      expect(activeCombinations).toContain('a'); // Set A
      expect(activeCombinations).toContain('b'); // Set B
      expect(activeCombinations).toContain('c'); // Set C
      expect(activeCombinations).toContain('ab'); // A ∩ B = ['2', '3']
      expect(activeCombinations).toContain('ac'); // A ∩ C = ['3']
      expect(activeCombinations).toContain('bc'); // B ∩ C = ['3', '4']
      expect(activeCombinations).toContain('abc'); // A ∩ B ∩ C = ['3']
    });

    it('should not return combinations with empty intersections', () => {
      const sets = {
        A: ['1', '2'],
        B: ['3', '4']
      };
      
      const activeCombinations = getActiveCombinations(sets);
      
      expect(activeCombinations).toContain('a');
      expect(activeCombinations).toContain('b');
      expect(activeCombinations).not.toContain('ab'); // Keine Schnittmenge
    });

    it('should handle empty sets', () => {
      const sets = {
        A: [],
        B: ['1', '2']
      };
      
      const activeCombinations = getActiveCombinations(sets);
      
      expect(activeCombinations).not.toContain('a'); // Leeres Set
      expect(activeCombinations).toContain('b');
      expect(activeCombinations).not.toContain('ab');
    });

    it('should handle single element sets', () => {
      const sets = {
        A: ['1'],
        B: ['1'],
        C: ['2']
      };
      
      const activeCombinations = getActiveCombinations(sets);
      
      expect(activeCombinations).toContain('a');
      expect(activeCombinations).toContain('b');
      expect(activeCombinations).toContain('c');
      expect(activeCombinations).toContain('ab'); // A ∩ B = ['1']
      expect(activeCombinations).not.toContain('ac'); // A ∩ C = []
      expect(activeCombinations).not.toContain('bc'); // B ∩ C = []
      expect(activeCombinations).not.toContain('abc'); // A ∩ B ∩ C = []
    });
  });
});

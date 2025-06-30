import { setService, cleanElementList, updateIntersections } from './setOperations';

describe('SetService', () => {
  it('should compute the union of all sets', () => {
    const sets = [['a', 'b'], ['b', 'c'], ['d']];
    expect(Array.from(setService.getUnionOfAllSets(sets)).sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('should compute the union as array', () => {
    const sets = [['x', 'y'], ['y', 'z']];
    expect(setService.getUnionOfAllSetsArray(sets).sort()).toEqual(['x', 'y', 'z']);
  });

  it('should return correct percentage string', () => {
    expect(setService.getPercentageString(2, 10)).toBe('20.0');
    expect(setService.getPercentageString(0, 10)).toBe('0.0');
    expect(setService.getPercentageString(5, 0)).toBe('0.0');
  });
});

describe('Array.prototype.contains', () => {
  it('should return true if element exists', () => {
    expect(['a', 'b', 'c'].contains('b')).toBe(true);
  });
  it('should return false if element does not exist', () => {
    expect(['a', 'b', 'c'].contains('x')).toBe(false);
  });
});

describe('Array.prototype.subtract', () => {
  it('should subtract elements', () => {
    expect(['a', 'b', 'c'].subtract(['b'])).toEqual(['a', 'c']);
    expect(['a', 'b', 'c'].subtract(['x'])).toEqual(['a', 'b', 'c']);
  });
});

describe('cleanElementList', () => {
  it('should trim, remove empty and duplicates', () => {
    expect(cleanElementList([' a ', 'b', '', 'b', 'c', ' ', '\n', 'a'])).toEqual(['a', 'b', 'c']);
  });
});

describe('updateIntersections', () => {
  it('should compute intersections and intersection sets', () => {
    const allSetsNames = ['A', 'B'];
    const sets = { A: ['1', '2'], B: ['2', '3'] };
    const { intersections, intersectionsSet } = updateIntersections(allSetsNames, sets);
    expect(intersections['A']).toBe(1); // '1' only in A
    expect(intersections['AB']).toBe(1); // '2' in both
    expect(intersections['B']).toBe(1); // '3' only in B
    expect(intersectionsSet['A']).toEqual(['1']);
    expect(intersectionsSet['AB']).toEqual(['2']);
    expect(intersectionsSet['B']).toEqual(['3']);
  });
});

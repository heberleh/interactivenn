import { loadAndCustomizeSVGTemplate } from '../svgTemplateLoader';

// Mock fetch
global.fetch = jest.fn();

describe('svgTemplateLoader', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('loadAndCustomizeSVGTemplate', () => {
    const mockSVG = `
      <?xml version="1.0" encoding="UTF-8"?>
      <svg>
        <text id="abc" style="font-size:20px">abc</text>
        <text id="a" style="font-size:20px">a</text>
        <path id="regionA" style="fill:#ff0000;fill-opacity:0.3"/>
        <path id="regionB" style="fill:#00ff00;fill-opacity:0.3"/>
      </svg>
    `;

    it('should load and customize SVG template successfully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        text: () => Promise.resolve(mockSVG)
      });

      const labelMap = { 'abc': '123', 'a': 'Set A' };
      const colorMap = { 'regionA': '#blue', 'regionB': '#red' };
      
      const result = await loadAndCustomizeSVGTemplate(
        'test.svg',
        labelMap,
        colorMap,
        0.7,
        24
      );

      expect(fetch).toHaveBeenCalledWith('/svg-templates/test.svg');
      expect(result).toContain('123'); // Label ersetzt
      expect(result).toContain('Set A'); // Label ersetzt
      expect(result).toContain('font-size:24px'); // Font-Size ersetzt
      expect(result).toContain('fill-opacity:0.7'); // Opazität ersetzt
    });

    it('should handle fetch errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(
        loadAndCustomizeSVGTemplate('nonexistent.svg', {}, {})
      ).rejects.toThrow('Network error');
    });

    it('should replace labels in text elements', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        text: () => Promise.resolve('<text id="region1">old label</text>')
      });

      const result = await loadAndCustomizeSVGTemplate(
        'test.svg',
        { 'region1': 'new label' },
        {}
      );

      expect(result).toContain('new label');
      expect(result).not.toContain('old label');
    });

    it('should replace opacity values', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        text: () => Promise.resolve('<path style="fill-opacity:0.5"/>') 
      });

      const result = await loadAndCustomizeSVGTemplate(
        'test.svg',
        {},
        {},
        0.8
      );

      expect(result).toContain('fill-opacity:0.8');
      expect(result).not.toContain('fill-opacity:0.5');
    });

    it('should replace font-size values', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        text: () => Promise.resolve('<text style="font-size:16px">test</text>')
      });

      const result = await loadAndCustomizeSVGTemplate(
        'test.svg',
        {},
        {},
        0.5,
        22
      );

      expect(result).toContain('font-size:22px');
      expect(result).not.toContain('font-size:16px');
    });
  });
});

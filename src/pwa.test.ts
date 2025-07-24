import { describe, it, expect } from 'vitest';
import manifest from '../public/manifest.json';

describe('PWA Configuration', () => {
  describe('manifest.json content', () => {
    it('should have a short_name', () => {
      expect(manifest.short_name).toBe('FansWorld');
    });

    it('should have a name', () => {
      expect(manifest.name).toBe('FansWorld - Premium Creator Platform');
    });

    it('should have icons', () => {
      expect(manifest.icons).toBeInstanceOf(Array);
      expect(manifest.icons.length).toBeGreaterThan(0);

      const icon192 = manifest.icons.find((icon) => icon.sizes === '192x192');
      expect(icon192).toEqual({
        src: 'logo192.png',
        type: 'image/png',
        sizes: '192x192',
      });

      const icon512 = manifest.icons.find((icon) => icon.sizes === '512x512');
      expect(icon512).toEqual({
        src: 'logo512.png',
        type: 'image/png',
        sizes: '512x512',
      });
    });

    it('should have a valid start_url, display, theme_color, and background_color', () => {
      expect(manifest.start_url).toBe('.');
      expect(manifest.display).toBe('standalone');
      expect(manifest.theme_color).toBe('#000000');
      expect(manifest.background_color).toBe('#111111');
    });
  });
});
import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
const manifestPath = path.resolve(__dirname, './public/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

describe('PWA Configuration', () => {
  describe('index.html head tags', () => {
    beforeAll(() => {
      // Load index.html into the DOM for testing static tags
      const htmlPath = path.join(process.cwd(), 'index.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
      document.documentElement.innerHTML = htmlContent;
    });

    it('should have the correct apple-touch-icon link', () => {
      const appleTouchIcon = document.querySelector<HTMLLinkElement>(
        'link[rel="apple-touch-icon"]',
      );
      expect(appleTouchIcon).not.toBeNull();
      expect(appleTouchIcon?.getAttribute('href')).toBe('/logo192.png');
    });

    it('should have a manifest link', () => {
      const manifestLink = document.querySelector<HTMLLinkElement>(
        'link[rel="manifest"]',
      );
      expect(manifestLink).not.toBeNull();
      expect(manifestLink?.getAttribute('href')).toBe('/manifest.json');
    });

    it('should have a theme-color meta tag', () => {
      const themeColorMeta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
      );
      expect(themeColorMeta).not.toBeNull();
      expect(themeColorMeta?.getAttribute('content')).toBe('#000000');
    });
  });

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
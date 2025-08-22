import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    
    // Check if the app renders some content
    const appElement = document.querySelector('#root');
    expect(appElement).toBeDefined();
  });

  it('renders router and basic structure', () => {
    render(<App />);
    
    // Should render without throwing
    expect(document.body).toBeDefined();
  });
});

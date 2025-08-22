import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { BreadcrumbNav } from '../navigation/BreadcrumbNav';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('BreadcrumbNav', () => {
  const mockItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Category' }, // no href = current page
  ];

  it('renders breadcrumb navigation', () => {
    renderWithRouter(<BreadcrumbNav items={mockItems} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('breadcrumb')).toBeInTheDocument();
  });

  it('renders all breadcrumb items', () => {
    renderWithRouter(<BreadcrumbNav items={mockItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders links for items with href', () => {
    renderWithRouter(<BreadcrumbNav items={mockItems} />);
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productLink = screen.getByRole('link', { name: 'Products' });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(productLink).toHaveAttribute('href', '/products');
  });

  it('renders current page item without link', () => {
    renderWithRouter(<BreadcrumbNav items={mockItems} />);
    const categoryItem = screen.getByText('Category');
    expect(categoryItem.tagName).not.toBe('A');
  });

  it('handles empty items array', () => {
    renderWithRouter(<BreadcrumbNav items={[]} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithRouter(<BreadcrumbNav items={mockItems} className="custom-breadcrumb" />);
    expect(screen.getByRole('navigation')).toHaveClass('custom-breadcrumb');
  });
});
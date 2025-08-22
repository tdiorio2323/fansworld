import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState, NoDataEmptyState, NoResultsEmptyState, NoContentEmptyState } from '../empty-states/EmptyState';

describe('EmptyState Components', () => {
  describe('EmptyState', () => {
    it('renders with title and description', () => {
      render(
        <EmptyState 
          title="No items found" 
          description="Try adjusting your search criteria"
        />
      );
      
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument();
    });

    it('renders with custom icon', () => {
      const CustomIcon = () => <svg data-testid="custom-icon">Custom</svg>;
      render(
        <EmptyState 
          title="Custom Empty State"
          description="With custom icon"
          icon={<CustomIcon />}
        />
      );
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('renders action button when provided', () => {
      render(
        <EmptyState 
          title="No items" 
          description="Get started by adding an item"
          action={<button>Add Item</button>}
        />
      );
      
      expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <EmptyState 
          title="Test" 
          description="Test description"
          className="custom-empty-state"
        />
      );
      
      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toHaveClass('custom-empty-state');
    });
  });

  describe('NoDataEmptyState', () => {
    it('renders default no data state', () => {
      render(<NoDataEmptyState />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.getByText('There\'s no data to display at the moment.')).toBeInTheDocument();
    });

    it('accepts custom props', () => {
      render(<NoDataEmptyState title="Custom No Data" description="Custom description" />);
      expect(screen.getByText('Custom No Data')).toBeInTheDocument();
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });
  });

  describe('NoResultsEmptyState', () => {
    it('renders default no results state', () => {
      render(<NoResultsEmptyState />);
      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search criteria or filters.')).toBeInTheDocument();
    });

    it('accepts custom props', () => {
      render(<NoResultsEmptyState title="No matches" description="Refine your search" />);
      expect(screen.getByText('No matches')).toBeInTheDocument();
      expect(screen.getByText('Refine your search')).toBeInTheDocument();
    });
  });

  describe('NoContentEmptyState', () => {
    it('renders default no content state', () => {
      render(<NoContentEmptyState />);
      expect(screen.getByText('No content yet')).toBeInTheDocument();
      expect(screen.getByText('Get started by creating your first item.')).toBeInTheDocument();
    });

    it('accepts custom props', () => {
      render(<NoContentEmptyState title="Empty workspace" description="Start building" />);
      expect(screen.getByText('Empty workspace')).toBeInTheDocument();
      expect(screen.getByText('Start building')).toBeInTheDocument();
    });
  });
});
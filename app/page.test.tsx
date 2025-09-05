
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CabanaHomePage from './page';

// Mock the next/link component
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
      return <a href={href}>{children}</a>;
    },
  };
});

describe('CabanaHomePage', () => {
  it('renders the hero section with correct text and links', () => {
    render(<CabanaHomePage />);

    // Check for the main heading
    expect(screen.getByText(/Your Premium Content/i)).toBeInTheDocument();
    expect(screen.getByText(/Destination/i)).toBeInTheDocument();

    // Check for the introductory paragraph
    expect(
      screen.getByText(
        /Connect with exclusive creators, access premium content, and join a community of passionate subscribers./i
      )
    ).toBeInTheDocument();

    // Check for the main action buttons
    const exploreLink = screen.getByRole('link', { name: /Explore Creators/i });
    expect(exploreLink).toBeInTheDocument();
    expect(exploreLink).toHaveAttribute('href', '/discover');

    const registerLink = screen.getByRole('link', { name: /Become a Creator/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/auth/register');
  });

  it('renders the features section', () => {
    render(<CabanaHomePage />);
    expect(screen.getByText(/Why Choose Cabana?/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium Content/i)).toBeInTheDocument();
    expect(screen.getByText(/Direct Connection/i)).toBeInTheDocument();
    expect(screen.getByText(/Secure & Fast/i)).toBeInTheDocument();
  });

  it('renders the stats section', () => {
    render(<CabanaHomePage />);
    expect(screen.getByText(/10K\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Creators/i)).toBeInTheDocument();
    expect(screen.getByText(/100K\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Happy Subscribers/i)).toBeInTheDocument();
    expect(screen.getByText(/1M\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Content Pieces/i)).toBeInTheDocument();
    expect(screen.getByText(/\$5M\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Creator Earnings/i)).toBeInTheDocument();
  });

  it('renders the trust section', () => {
    render(<CabanaHomePage />);
    expect(screen.getByText(/Bank-Level Security/i)).toBeInTheDocument();
    expect(screen.getByText(/Creator-First Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/Growing Community/i)).toBeInTheDocument();
  });

  it('renders the CTA section', () => {
    render(<CabanaHomePage />);
    expect(screen.getByText(/Ready to Get Started?/i)).toBeInTheDocument();
    const ctaLink = screen.getByRole('link', { name: /Start Exploring/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/discover');
  });
});

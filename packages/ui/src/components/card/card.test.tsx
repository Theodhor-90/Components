import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card.js';

describe('Card', () => {
  it('Card renders without crashing', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('CardHeader renders without crashing', () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('CardTitle renders without crashing', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('CardDescription renders without crashing', () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('CardContent renders without crashing', () => {
    render(<CardContent>Body</CardContent>);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('CardFooter renders without crashing', () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders a fully composed card', () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="card-header">
          <CardTitle data-testid="card-title">Title</CardTitle>
          <CardDescription data-testid="card-description">Description</CardDescription>
        </CardHeader>
        <CardContent data-testid="card-content">Content</CardContent>
        <CardFooter data-testid="card-footer">Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('card-description')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
  });

  it('Card has correct data-slot', () => {
    render(<Card data-testid="card">Card</Card>);
    expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card');
  });

  it('CardHeader has correct data-slot', () => {
    render(<CardHeader data-testid="card-header">Header</CardHeader>);
    expect(screen.getByTestId('card-header')).toHaveAttribute('data-slot', 'card-header');
  });

  it('CardTitle has correct data-slot', () => {
    render(<CardTitle data-testid="card-title">Title</CardTitle>);
    expect(screen.getByTestId('card-title')).toHaveAttribute('data-slot', 'card-title');
  });

  it('CardDescription has correct data-slot', () => {
    render(<CardDescription data-testid="card-description">Description</CardDescription>);
    expect(screen.getByTestId('card-description')).toHaveAttribute('data-slot', 'card-description');
  });

  it('CardContent has correct data-slot', () => {
    render(<CardContent data-testid="card-content">Content</CardContent>);
    expect(screen.getByTestId('card-content')).toHaveAttribute('data-slot', 'card-content');
  });

  it('CardFooter has correct data-slot', () => {
    render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
    expect(screen.getByTestId('card-footer')).toHaveAttribute('data-slot', 'card-footer');
  });

  it('Card applies base styling', () => {
    render(<Card data-testid="card">Card</Card>);
    expect(screen.getByTestId('card')).toHaveClass(
      'rounded-xl',
      'border',
      'bg-card',
      'text-card-foreground',
      'shadow-sm',
    );
  });

  it('CardHeader applies base styling', () => {
    render(<CardHeader data-testid="card-header">Header</CardHeader>);
    expect(screen.getByTestId('card-header')).toHaveClass('flex', 'flex-col', 'p-6');
  });

  it('CardContent applies base styling', () => {
    render(<CardContent data-testid="card-content">Content</CardContent>);
    expect(screen.getByTestId('card-content')).toHaveClass('p-6', 'pt-0');
  });

  it('CardFooter applies base styling', () => {
    render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
    expect(screen.getByTestId('card-footer')).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
  });

  it('CardTitle applies base styling', () => {
    render(<CardTitle data-testid="card-title">Title</CardTitle>);
    expect(screen.getByTestId('card-title')).toHaveClass('font-semibold', 'tracking-tight');
  });

  it('CardDescription applies base styling', () => {
    render(<CardDescription data-testid="card-description">Description</CardDescription>);
    expect(screen.getByTestId('card-description')).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('each sub-component merges custom className', () => {
    render(
      <Card data-testid="card" className="custom-class">
        <CardHeader data-testid="card-header" className="custom-class">
          <CardTitle data-testid="card-title" className="custom-class">
            Title
          </CardTitle>
          <CardDescription data-testid="card-description" className="custom-class">
            Description
          </CardDescription>
        </CardHeader>
        <CardContent data-testid="card-content" className="custom-class">
          Content
        </CardContent>
        <CardFooter data-testid="card-footer" className="custom-class">
          Footer
        </CardFooter>
      </Card>,
    );

    expect(screen.getByTestId('card')).toHaveClass('custom-class', 'rounded-xl');
    expect(screen.getByTestId('card-header')).toHaveClass('custom-class', 'flex');
    expect(screen.getByTestId('card-title')).toHaveClass('custom-class', 'font-semibold');
    expect(screen.getByTestId('card-description')).toHaveClass(
      'custom-class',
      'text-muted-foreground',
    );
    expect(screen.getByTestId('card-content')).toHaveClass('custom-class', 'p-6');
    expect(screen.getByTestId('card-footer')).toHaveClass('custom-class', 'items-center');
  });

  it('Card forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'card');
  });

  it('fully composed card has no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

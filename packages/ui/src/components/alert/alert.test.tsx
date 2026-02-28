import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';

import { Alert, AlertDescription, AlertTitle } from './alert.js';

describe('Alert', () => {
  it('Alert renders without crashing', () => {
    render(<Alert>Content</Alert>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('AlertTitle renders without crashing', () => {
    render(<AlertTitle>Title</AlertTitle>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('AlertDescription renders without crashing', () => {
    render(<AlertDescription>Description</AlertDescription>);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('Alert has role="alert"', () => {
    render(<Alert>Alert content</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('Alert applies default variant classes', () => {
    render(<Alert data-testid="alert">Default</Alert>);
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('bg-background', 'text-foreground');
  });

  it('Alert applies destructive variant classes', () => {
    render(
      <Alert variant="destructive" data-testid="alert">
        Destructive
      </Alert>,
    );
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass(
      'border-destructive/50',
      'text-destructive',
      'dark:border-destructive',
    );
  });

  it('renders a fully composed alert', () => {
    render(
      <Alert data-testid="alert">
        <svg data-testid="icon" aria-hidden="true" />
        <div data-testid="content">
          <AlertTitle data-testid="alert-title">Heads up!</AlertTitle>
          <AlertDescription data-testid="alert-description">Details</AlertDescription>
        </div>
      </Alert>,
    );

    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByTestId('alert')).toHaveClass(
      '[&>svg+div]:translate-y-[-3px]',
      '[&:has(svg)]:pl-11',
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('alert-title')).toBeInTheDocument();
    expect(screen.getByTestId('alert-description')).toBeInTheDocument();
  });

  it('Alert has correct data-slot', () => {
    render(<Alert data-testid="alert">Alert</Alert>);
    expect(screen.getByTestId('alert')).toHaveAttribute('data-slot', 'alert');
  });

  it('AlertTitle has correct data-slot', () => {
    render(<AlertTitle data-testid="alert-title">Title</AlertTitle>);
    expect(screen.getByTestId('alert-title')).toHaveAttribute('data-slot', 'alert-title');
  });

  it('AlertDescription has correct data-slot', () => {
    render(<AlertDescription data-testid="alert-description">Description</AlertDescription>);
    expect(screen.getByTestId('alert-description')).toHaveAttribute(
      'data-slot',
      'alert-description',
    );
  });

  it('Alert merges custom className', () => {
    render(
      <Alert className="custom-class" data-testid="alert">
        Alert
      </Alert>,
    );
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveClass('custom-class');
    expect(alert).toHaveClass('rounded-lg');
  });

  it('AlertTitle merges custom className', () => {
    render(
      <AlertTitle className="custom-class" data-testid="alert-title">
        Title
      </AlertTitle>,
    );
    const title = screen.getByTestId('alert-title');
    expect(title).toHaveClass('custom-class');
    expect(title).toHaveClass('font-medium');
  });

  it('AlertDescription merges custom className', () => {
    render(
      <AlertDescription className="custom-class" data-testid="alert-description">
        Description
      </AlertDescription>,
    );
    const description = screen.getByTestId('alert-description');
    expect(description).toHaveClass('custom-class');
    expect(description).toHaveClass('text-sm');
  });

  it('AlertTitle applies base styling', () => {
    render(<AlertTitle data-testid="alert-title">Title</AlertTitle>);
    expect(screen.getByTestId('alert-title')).toHaveClass('font-medium', 'tracking-tight');
  });

  it('AlertDescription applies base styling', () => {
    render(<AlertDescription data-testid="alert-description">Description</AlertDescription>);
    expect(screen.getByTestId('alert-description')).toHaveClass('text-sm');
  });

  it('Alert forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Content</Alert>);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'alert');
  });

  it('fully composed alert has no accessibility violations', async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>Details</AlertDescription>
      </Alert>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('destructive variant has no accessibility violations', async () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

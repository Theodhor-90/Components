import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it } from 'vitest';

import { toast, Toaster } from './sonner.js';

function TestToaster(): React.JSX.Element {
  return (
    <>
      <Toaster />
      <button type="button" onClick={() => toast('Test toast')}>
        Show Toast
      </button>
    </>
  );
}

afterEach(() => {
  document.documentElement.classList.remove('dark');
  toast.dismiss();
});

describe('Sonner', () => {
  it('renders Toaster without crashing', () => {
    render(<Toaster />);

    expect(document.querySelector('[data-slot="sonner"]')).toBeInTheDocument();
  });

  it('toast appears when toast() is called', async () => {
    const user = userEvent.setup();
    render(<TestToaster />);

    await user.click(screen.getByRole('button', { name: 'Show Toast' }));

    await waitFor(() => {
      expect(screen.getByText('Test toast')).toBeInTheDocument();
    });
  });

  it('success toast renders', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Toaster />
        <button type="button" onClick={() => toast.success('Success!')}>
          Show Success
        </button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Show Success' }));

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
  });

  it('error toast renders', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Toaster />
        <button type="button" onClick={() => toast.error('Error!')}>
          Show Error
        </button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Show Error' }));

    await waitFor(() => {
      expect(screen.getByText('Error!')).toBeInTheDocument();
    });
  });

  it('info toast renders', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Toaster />
        <button type="button" onClick={() => toast.info('Info!')}>
          Show Info
        </button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Show Info' }));

    await waitFor(() => {
      expect(screen.getByText('Info!')).toBeInTheDocument();
    });
  });

  it('warning toast renders', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Toaster />
        <button type="button" onClick={() => toast.warning('Warning!')}>
          Show Warning
        </button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Show Warning' }));

    await waitFor(() => {
      expect(screen.getByText('Warning!')).toBeInTheDocument();
    });
  });

  it('data-slot on toaster container', () => {
    render(<Toaster />);

    expect(document.querySelector('[data-slot="sonner"]')).toBeInTheDocument();
  });

  it('toast with description renders', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Toaster />
        <button type="button" onClick={() => toast('Title', { description: 'Description text' })}>
          Show Description
        </button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Show Description' }));

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });
  });

  it('toasts auto-dismiss after configured duration', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Toaster duration={100} />
        <button type="button" onClick={() => toast('Auto dismiss')}>
          Show Auto Dismiss
        </button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Show Auto Dismiss' }));
    expect(screen.getByText('Auto dismiss')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
      },
      { timeout: 1200 },
    );
  });

  it('applies semantic token styles in light mode', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Toaster theme="light" />
        <button type="button" onClick={() => toast('Light theme toast')}>
          Show Light
        </button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Show Light' }));

    await waitFor(() => {
      expect(screen.getByText('Light theme toast')).toBeInTheDocument();
    });

    const toastText = screen.getByText('Light theme toast');
    const toastElement = toastText.closest('[data-sonner-toast]') ?? toastText.parentElement;
    expect(toastElement).not.toBeNull();

    if (!(toastElement instanceof HTMLElement)) {
      throw new Error('Toast element is missing');
    }

    expect(toastElement).toHaveStyle({
      background: 'var(--background)',
      color: 'var(--foreground)',
    });
    expect(toastElement.getAttribute('style')).toContain('var(--border)');
  });

  it('uses dark theme and applies semantic token styles when document has dark class', async () => {
    document.documentElement.classList.add('dark');

    const user = userEvent.setup();
    render(
      <>
        <Toaster />
        <button type="button" onClick={() => toast('Dark theme toast')}>
          Show Dark
        </button>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Show Dark' }));

    await waitFor(() => {
      expect(screen.getByText('Dark theme toast')).toBeInTheDocument();
    });

    const toasterContainer = document.querySelector('[data-slot="sonner"]');
    expect(toasterContainer).toHaveAttribute('data-theme', 'dark');

    const toastText = screen.getByText('Dark theme toast');
    const toastElement = toastText.closest('[data-sonner-toast]') ?? toastText.parentElement;
    expect(toastElement).not.toBeNull();

    if (!(toastElement instanceof HTMLElement)) {
      throw new Error('Toast element is missing');
    }

    expect(toastElement).toHaveStyle({
      background: 'var(--background)',
      color: 'var(--foreground)',
    });
    expect(toastElement.getAttribute('style')).toContain('var(--border)');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Toaster />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});

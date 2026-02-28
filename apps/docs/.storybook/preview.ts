import type { Preview } from '@storybook/react-vite';

import '@components/ui/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
  decorators: [],
};

export default preview;

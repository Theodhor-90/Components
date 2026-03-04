export type CodeBlockProps = React.ComponentProps<'div'> & {
  /** The code content to display. */
  children: string;
  /** Show line numbers in the gutter. Defaults to false. */
  showLineNumbers?: boolean;
  /** Language label displayed in the header bar. Display only, no syntax highlighting. */
  language?: string;
};

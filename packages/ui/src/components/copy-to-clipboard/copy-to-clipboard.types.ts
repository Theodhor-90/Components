export type CopyToClipboardProps = React.ComponentProps<'button'> & {
  /** The text value to copy to the system clipboard. */
  text: string;
  /** Render as the child element instead of a <button>, merging props and behavior. */
  asChild?: boolean;
};

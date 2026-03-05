import { cn } from '../../lib/utils.js';
import { CopyToClipboard } from '../copy-to-clipboard/copy-to-clipboard.js';
import {
  codeBlockHeaderStyles,
  codeBlockLineNumberStyles,
  codeBlockPreStyles,
  codeBlockStyles,
} from './code-block.styles.js';
import type { CodeBlockProps } from './code-block.types.js';

export type { CodeBlockProps } from './code-block.types.js';

export function CodeBlock({
  className,
  children,
  showLineNumbers = false,
  language,
  ref,
  ...props
}: CodeBlockProps) {
  const lines = children.split('\n');
  const gutterWidthClass =
    lines.length >= 100 ? 'min-w-[4ch]' : lines.length >= 10 ? 'min-w-[3ch]' : 'min-w-[2ch]';

  return (
    <div data-slot="code-block" className={cn(codeBlockStyles, className)} ref={ref} {...props}>
      {language ? (
        <div className={codeBlockHeaderStyles}>
          <span>{language}</span>
          <CopyToClipboard text={children} />
        </div>
      ) : (
        <CopyToClipboard text={children} className="absolute top-2 right-2" />
      )}
      <pre className={codeBlockPreStyles}>
        <code>
          {showLineNumbers
            ? lines.map((line, index) => (
                <span className="flex" key={index}>
                  <span className={cn(codeBlockLineNumberStyles, gutterWidthClass)}>
                    {index + 1}
                  </span>
                  <span>{line || '\u00a0'}</span>
                </span>
              ))
            : children}
        </code>
      </pre>
    </div>
  );
}

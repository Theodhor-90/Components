import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { cn } from '../../lib/utils.js';
import {
  resizableHandleGripStyles,
  resizableHandleStyles,
  resizablePanelGroupStyles,
} from './resizable.styles.js';
import type {
  ResizableHandleProps,
  ResizablePanelGroupProps,
  ResizablePanelProps,
} from './resizable.types.js';

export type {
  ResizableHandleProps,
  ResizablePanelGroupProps,
  ResizablePanelProps,
} from './resizable.types.js';

export function ResizablePanelGroup({ className, ...props }: ResizablePanelGroupProps) {
  return (
    <PanelGroup
      data-slot="resizable-panel-group"
      className={cn(resizablePanelGroupStyles, className)}
      {...props}
    />
  );
}

export function ResizablePanel({ ...props }: ResizablePanelProps) {
  return <Panel data-slot="resizable-panel" {...props} />;
}

export function ResizableHandle({ withHandle, className, ...props }: ResizableHandleProps) {
  return (
    <PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(resizableHandleStyles, className)}
      {...props}
    >
      {withHandle && (
        <div className={resizableHandleGripStyles}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </div>
      )}
    </PanelResizeHandle>
  );
}

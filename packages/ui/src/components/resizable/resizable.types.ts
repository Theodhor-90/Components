import type { PanelGroupProps, PanelProps, PanelResizeHandleProps } from 'react-resizable-panels';

export type ResizablePanelGroupProps = PanelGroupProps;
export type ResizablePanelProps = PanelProps;
export type ResizableHandleProps = PanelResizeHandleProps & {
  withHandle?: boolean;
};

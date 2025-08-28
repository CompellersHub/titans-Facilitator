import * as React from "react";

type VisuallyHiddenProps = React.HTMLAttributes<HTMLElement> & {
  as?: keyof React.JSX.IntrinsicElements;
};

export const VisuallyHidden = React.forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({ as = "span", style, ...props }, ref) => {
    const Component = as as React.ElementType;
    return (
      <Component
        ref={ref}
        style={{
          border: 0,
          clip: "rect(0 0 0 0)",
          height: "1px",
          margin: "-1px",
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          width: "1px",
          whiteSpace: "nowrap",
          ...style,
        }}
        {...props}
      />
    );
  }
);

VisuallyHidden.displayName = "VisuallyHidden";

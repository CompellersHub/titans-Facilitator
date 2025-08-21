import * as React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onCheckedChange, className = "", ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={e => onCheckedChange(e.target.checked)}
        className={
          `h-4 w-4 rounded border border-gray-300 bg-white text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-900 dark:border-gray-700 dark:checked:bg-primary dark:checked:border-primary transition-colors ${className}`
        }
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

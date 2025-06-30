import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-[44px] touch-manipulation",
          "text-base sm:text-sm",
          "transition-all duration-200",
          "focus:border-ring focus:bg-background/95",
          "active:bg-background/90",
          "-webkit-tap-highlight-color: transparent",
          "-webkit-appearance: none",
          "appearance: none",
          "hover:border-input/80 hover:bg-background/95",
          "focus:scale-[1.01] focus:shadow-sm",
          "will-change-transform",
          className
        )}
        ref={ref}
        autoComplete={props.autoComplete || "off"}
        autoCapitalize={props.autoCapitalize || "off"}
        autoCorrect={props.autoCorrect || "off"}
        spellCheck={props.spellCheck || false}
        onTouchStart={(e) => {
          if (navigator.vibrate && typeof navigator.vibrate === 'function') {
            navigator.vibrate(20);
          }
          
          if (props.onTouchStart) {
            props.onTouchStart(e);
          }
        }}
        onFocus={(e) => {
          const target = e.currentTarget;
          target.style.transform = 'scale(1.01)';
          
          if (window.innerWidth <= 768) {
            setTimeout(() => {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }
          
          if (props.onFocus) {
            props.onFocus(e);
          }
        }}
        onBlur={(e) => {
          const target = e.currentTarget;
          target.style.transform = 'scale(1)';
          
          if (props.onBlur) {
            props.onBlur(e);
          }
        }}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

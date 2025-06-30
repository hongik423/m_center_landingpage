import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 active:scale-95",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline active:text-primary/80",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[44px] min-w-[44px]",
        sm: "h-9 rounded-md px-3 min-h-[40px] min-w-[40px]",
        lg: "h-11 rounded-md px-8 min-h-[48px] min-w-[48px]",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // 🔥 모바일 터치 최적화 스타일
    const mobileOptimizedClassName = cn(
      buttonVariants({ variant, size, className }),
      // 터치 최적화
      "relative overflow-hidden",
      // 터치 피드백 효과
      "before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-150",
      "active:before:opacity-100",
      // WebKit 최적화
      "-webkit-tap-highlight-color: transparent",
      "touch-action: manipulation",
      "user-select: none",
      "-webkit-user-select: none",
      // 접근성 개선
      "cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-offset-2"
    );

    return (
      <Comp
        className={mobileOptimizedClassName}
        ref={ref}
        // 🔥 터치 이벤트 최적화
        onTouchStart={(e) => {
          // 터치 시작 시 시각적 피드백
          const target = e.currentTarget as HTMLElement;
          target.style.transform = 'scale(0.98)';
          
          // 모바일 진동 피드백 (지원하는 디바이스에서)
          if (navigator.vibrate && typeof navigator.vibrate === 'function') {
            navigator.vibrate(50);
          }
          
          // 원래 onTouchStart 호출
          if (props.onTouchStart && typeof props.onTouchStart === 'function') {
            props.onTouchStart(e);
          }
        }}
        onTouchEnd={(e) => {
          // 터치 종료 시 원래 크기로
          const target = e.currentTarget as HTMLElement;
          target.style.transform = 'scale(1)';
          
          // 원래 onTouchEnd 호출
          if (props.onTouchEnd && typeof props.onTouchEnd === 'function') {
            props.onTouchEnd(e);
          }
        }}
        onTouchCancel={(e) => {
          // 터치 취소 시 원래 크기로
          const target = e.currentTarget as HTMLElement;
          target.style.transform = 'scale(1)';
          
          // 원래 onTouchCancel 호출
          if (props.onTouchCancel && typeof props.onTouchCancel === 'function') {
            props.onTouchCancel(e);
          }
        }}
        // 🔥 접근성 개선
        role={asChild ? undefined : "button"}
        tabIndex={props.disabled ? -1 : 0}
        aria-disabled={props.disabled}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

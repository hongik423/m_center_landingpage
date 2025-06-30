import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    interactive?: boolean;
    touchOptimized?: boolean;
  }
>(({ className, interactive = false, touchOptimized = true, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      // 🔥 모바일 터치 최적화
      touchOptimized && [
        "touch-manipulation select-none",
        "-webkit-tap-highlight-color: transparent",
        "transition-all duration-200 ease-out",
      ],
      // 인터랙티브 카드 스타일
      interactive && [
        "cursor-pointer hover:shadow-md hover:-translate-y-1",
        "active:scale-[0.98] active:shadow-sm",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "relative overflow-hidden",
        // 터치 피드백 효과
        "before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-150",
        "active:before:opacity-100",
      ],
      className
    )}
    // 🔥 터치 이벤트 처리 (interactive일 때만)
    {...(interactive && touchOptimized && {
      onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => {
        // 진동 피드백
        if (navigator.vibrate && typeof navigator.vibrate === 'function') {
          navigator.vibrate(30);
        }
        
        // 시각적 피드백
        const target = e.currentTarget;
        target.style.transform = 'scale(0.98)';
        
        // 원래 이벤트 호출
        if (props.onTouchStart) {
          props.onTouchStart(e);
        }
      },
      onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => {
        // 원래 크기로 복원
        const target = e.currentTarget;
        target.style.transform = 'scale(1)';
        
        // 원래 이벤트 호출
        if (props.onTouchEnd) {
          props.onTouchEnd(e);
        }
      },
      onTouchCancel: (e: React.TouchEvent<HTMLDivElement>) => {
        // 터치 취소 시 원래 크기로
        const target = e.currentTarget;
        target.style.transform = 'scale(1)';
        
        // 원래 이벤트 호출
        if (props.onTouchCancel) {
          props.onTouchCancel(e);
        }
      }
    })}
    // 🔥 접근성 개선 (interactive일 때만)
    {...(interactive && {
      tabIndex: 0,
      role: "button"
    })}
    {...props}
  >
    {children}
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      // 🔥 모바일 최적화
      "touch-manipulation",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      // 🔥 모바일 반응형 타이포그래피
      "text-lg sm:text-xl lg:text-2xl",
      "touch-manipulation select-text",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      // 🔥 모바일 가독성 개선
      "text-sm sm:text-base leading-relaxed",
      "touch-manipulation select-text",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 pt-0",
      // 🔥 모바일 패딩 최적화
      "px-4 sm:px-6",
      "touch-manipulation",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0",
      // 🔥 모바일 푸터 최적화
      "px-4 sm:px-6 gap-2 sm:gap-4",
      "touch-manipulation",
      "flex-wrap sm:flex-nowrap",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

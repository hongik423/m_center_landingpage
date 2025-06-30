"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      "min-h-[48px] touch-manipulation overflow-x-auto scrollbar-hide",
      "w-full sm:w-auto sm:min-w-0",
      "-webkit-overflow-scrolling: touch overscroll-contain",
      "flex-nowrap gap-1",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      "min-h-[40px] min-w-[60px] touch-manipulation cursor-pointer select-none",
      "active:scale-95 active:bg-background/80 transition-all duration-150",
      "-webkit-tap-highlight-color: transparent",
      "hover:bg-background/50 hover:text-foreground/80",
      "relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-150",
      "active:before:opacity-100",
      "data-[state=active]:font-semibold data-[state=active]:scale-100",
      "data-[state=active]:ring-1 data-[state=active]:ring-primary/20",
      "flex-shrink-0",
      className
    )}
    onTouchStart={(e) => {
      if (navigator.vibrate && typeof navigator.vibrate === 'function') {
        navigator.vibrate(30);
      }
      
      const target = e.currentTarget;
      target.style.transform = 'scale(0.95)';
      
      if (props.onTouchStart) {
        props.onTouchStart(e);
      }
    }}
    onTouchEnd={(e) => {
      const target = e.currentTarget;
      target.style.transform = 'scale(1)';
      
      if (props.onTouchEnd) {
        props.onTouchEnd(e);
      }
    }}
    onTouchCancel={(e) => {
      const target = e.currentTarget;
      target.style.transform = 'scale(1)';
      
      if (props.onTouchCancel) {
        props.onTouchCancel(e);
      }
    }}
    onClick={(e) => {
      e.preventDefault();
      
      if (props.onClick) {
        props.onClick(e);
      }
    }}
    role="tab"
    tabIndex={props.disabled ? -1 : 0}
    aria-disabled={props.disabled}
    {...props}
  >
    {children}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "touch-manipulation",
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95",
      "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95",
      "overflow-auto -webkit-overflow-scrolling: touch",
      className
    )}
    role="tabpanel"
    tabIndex={0}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent } 
import * as React from "react"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "h-full w-full relative flex flex-col resize-horizontal overflow-auto",
      className
    )}
    {...props}
  />
))

ResizablePanel.displayName = "ResizablePanel"

const ResizableHandle = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    withHandle?: boolean
  }
>(({ className, withHandle, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-px h-full items-center justify-center bg-border hover:bg-accent cursor-col-resize after:absolute after:inset-0 after:w-1 after:h-full after:bg-current after:mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:z-10 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:mx-auto data-[panel-group-direction=vertical]:after:my-1/2 data-[panel-group-direction=vertical]:after:-translate-y-1/2",
      className
    )}
    role="separator"
    tabIndex={0}
    {...props}
  >
    {withHandle ? (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    ) : null}
  </div>
))

ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
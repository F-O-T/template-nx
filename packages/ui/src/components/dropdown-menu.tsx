"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@packages/ui/lib/utils";
import { useIsMobile } from "@packages/ui/hooks/use-mobile";
import { ChevronRightIcon, CheckIcon } from "lucide-react";

const DropdownMenuContext = React.createContext<{
  isMobile: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  isMobile: false,
  open: false,
  onOpenChange: () => {},
});

function useDropdownMenu() {
  return React.useContext(DropdownMenuContext);
}

function DropdownMenu({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  children,
  ...props
}: MenuPrimitive.Root.Props) {
  const isMobile = useIsMobile();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = openProp ?? uncontrolledOpen;
  const onOpenChange = onOpenChangeProp ?? setUncontrolledOpen;
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => onOpenChange?.(nextOpen, undefined as never),
    [onOpenChange],
  );

  const ctx = React.useMemo(
    () => ({ isMobile, open, onOpenChange: handleOpenChange }),
    [isMobile, open, handleOpenChange],
  );

  if (isMobile) {
    return (
      <DropdownMenuContext.Provider value={ctx}>
        <DrawerPrimitive.Root data-slot="dropdown-menu" open={open} onOpenChange={handleOpenChange}>
          {children as React.ReactNode}
        </DrawerPrimitive.Root>
      </DropdownMenuContext.Provider>
    );
  }

  return (
    <DropdownMenuContext.Provider value={ctx}>
      <MenuPrimitive.Root
        data-slot="dropdown-menu"
        open={open}
        onOpenChange={onOpenChange}
        {...props}
      >
        {children}
      </MenuPrimitive.Root>
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  const { isMobile } = useDropdownMenu();

  if (isMobile) {
    return (
      <DrawerPrimitive.Trigger
        data-slot="dropdown-menu-trigger"
        className={className as string}
        {...(props as React.ComponentProps<typeof DrawerPrimitive.Trigger>)}
      />
    );
  }

  return (
    <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" className={className} {...props} />
  );
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  const { isMobile } = useDropdownMenu();

  if (isMobile) {
    return (
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs" />
        <DrawerPrimitive.Content
          data-slot="dropdown-menu-content"
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[80vh] flex-col overflow-y-auto rounded-t-lg border-t bg-popover p-2 text-popover-foreground",
            className,
          )}
        >
          <div className="mx-auto mb-2 mt-2 h-1 w-[100px] shrink-0 rounded-full bg-muted" />
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    );
  }

  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  className,
  ...props
}: React.ComponentProps<"div"> & MenuPrimitive.Group.Props) {
  const { isMobile } = useDropdownMenu();

  if (isMobile) {
    return <div data-slot="dropdown-menu-group" className={className} {...props} />;
  }

  return <MenuPrimitive.Group data-slot="dropdown-menu-group" className={className} {...props} />;
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: (React.ComponentProps<"div"> & MenuPrimitive.GroupLabel.Props) & {
  inset?: boolean;
}) {
  const { isMobile } = useDropdownMenu();
  const classes = cn("px-2 py-2 text-sm text-muted-foreground data-inset:pl-7", className);

  if (isMobile) {
    return (
      <div
        data-slot="dropdown-menu-label"
        data-inset={inset}
        className={classes}
        {...(props as React.ComponentProps<"div">)}
      />
    );
  }

  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={classes}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  onSelect,
  ...props
}: (React.ComponentProps<"div"> & MenuPrimitive.Item.Props) & {
  inset?: boolean;
  variant?: "default" | "destructive";
  onSelect?: () => void;
}) {
  const { isMobile, onOpenChange } = useDropdownMenu();
  const classes = cn(
    "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-lg px-2 py-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
    className,
  );

  if (isMobile) {
    return (
      <button
        type="button"
        data-slot="dropdown-menu-item"
        data-inset={inset}
        data-variant={variant}
        className={cn(classes, "w-full active:bg-accent active:text-accent-foreground")}
        onClick={() => {
          onSelect?.();
          onOpenChange(false);
        }}
        {...(props as React.ComponentProps<"button">)}
      />
    );
  }

  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={classes}
      onClick={onSelect}
      {...props}
    />
  );
}

function DropdownMenuSub({ children, ...props }: MenuPrimitive.SubmenuRoot.Props) {
  const { isMobile } = useDropdownMenu();

  if (isMobile) {
    return <div data-slot="dropdown-menu-sub">{children as React.ReactNode}</div>;
  }

  return (
    <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props}>
      {children}
    </MenuPrimitive.SubmenuRoot>
  );
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  const { isMobile } = useDropdownMenu();
  const classes = cn(
    "flex cursor-default items-center gap-2 rounded-lg px-2 py-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  );

  if (isMobile) {
    return (
      <button
        type="button"
        data-slot="dropdown-menu-sub-trigger"
        data-inset={inset}
        className={cn(classes, "w-full active:bg-accent active:text-accent-foreground")}
        {...(props as React.ComponentProps<"button">)}
      >
        {children}
        <ChevronRightIcon className="ml-auto" />
      </button>
    );
  }

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={classes}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  const { isMobile } = useDropdownMenu();

  if (isMobile) {
    return (
      <div data-slot="dropdown-menu-sub-content" className={cn("pl-4", className)}>
        {children}
      </div>
    );
  }

  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "w-auto min-w-[96px] rounded-lg bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className,
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </DropdownMenuContent>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  onCheckedChange,
  ...props
}: (React.ComponentProps<"button"> & MenuPrimitive.CheckboxItem.Props) & {
  inset?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const { isMobile, onOpenChange } = useDropdownMenu();
  const classes = cn(
    "relative flex cursor-default items-center gap-2 rounded-lg py-2 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  );

  if (isMobile) {
    return (
      <button
        type="button"
        data-slot="dropdown-menu-checkbox-item"
        data-inset={inset}
        className={cn(classes, "w-full active:bg-accent active:text-accent-foreground")}
        onClick={() => {
          onCheckedChange?.(!checked);
          onOpenChange(false);
        }}
        {...(props as React.ComponentProps<"button">)}
      >
        <span
          className="pointer-events-none absolute right-2 flex items-center justify-center"
          data-slot="dropdown-menu-checkbox-item-indicator"
        >
          {checked && <CheckIcon />}
        </span>
        {children}
      </button>
    );
  }

  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={classes}
      checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  children,
  ...props
}: React.ComponentProps<"div"> & MenuPrimitive.RadioGroup.Props) {
  const { isMobile } = useDropdownMenu();

  if (isMobile) {
    return (
      <div data-slot="dropdown-menu-radio-group" {...(props as React.ComponentProps<"div">)}>
        {children}
      </div>
    );
  }

  return (
    <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props}>
      {children}
    </MenuPrimitive.RadioGroup>
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  value,
  onSelect,
  ...props
}: (React.ComponentProps<"button"> & MenuPrimitive.RadioItem.Props) & {
  inset?: boolean;
  onSelect?: () => void;
}) {
  const { isMobile, onOpenChange } = useDropdownMenu();
  const classes = cn(
    "relative flex cursor-default items-center gap-2 rounded-lg py-2 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  );

  if (isMobile) {
    return (
      <button
        type="button"
        data-slot="dropdown-menu-radio-item"
        data-inset={inset}
        className={cn(classes, "w-full active:bg-accent active:text-accent-foreground")}
        onClick={() => {
          onSelect?.();
          onOpenChange(false);
        }}
        {...(props as React.ComponentProps<"button">)}
      >
        <span
          className="pointer-events-none absolute right-2 flex items-center justify-center"
          data-slot="dropdown-menu-radio-item-indicator"
        >
          <CheckIcon />
        </span>
        {children}
      </button>
    );
  }

  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={classes}
      value={value}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div"> & MenuPrimitive.Separator.Props) {
  const { isMobile } = useDropdownMenu();

  if (isMobile) {
    return (
      <div
        data-slot="dropdown-menu-separator"
        role="separator"
        className={cn("-mx-1 h-px bg-border", className)}
        {...(props as React.ComponentProps<"div">)}
      />
    );
  }

  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-sm tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};

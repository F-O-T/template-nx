import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
declare function DropdownMenu({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  children,
  ...props
}: MenuPrimitive.Root.Props): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuPortal({
  ...props
}: MenuPrimitive.Portal.Props): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuTrigger({
  className,
  ...props
}: MenuPrimitive.Trigger.Props): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuContent({
  align,
  alignOffset,
  side,
  sideOffset,
  className,
  children,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuGroup({
  className,
  ...props
}: React.ComponentProps<"div"> &
  MenuPrimitive.Group.Props): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuLabel({
  className,
  inset,
  ...props
}: (React.ComponentProps<"div"> & MenuPrimitive.GroupLabel.Props) & {
  inset?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuItem({
  className,
  inset,
  variant,
  onSelect,
  ...props
}: (React.ComponentProps<"div"> & MenuPrimitive.Item.Props) & {
  inset?: boolean;
  variant?: "default" | "destructive";
  onSelect?: () => void;
}): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuSub({
  children,
  ...props
}: MenuPrimitive.SubmenuRoot.Props): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuSubContent({
  align,
  alignOffset,
  side,
  sideOffset,
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  onCheckedChange,
  ...props
}: (React.ComponentProps<"button"> & MenuPrimitive.CheckboxItem.Props) & {
  inset?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuRadioGroup({
  children,
  ...props
}: React.ComponentProps<"div"> &
  MenuPrimitive.RadioGroup.Props): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuRadioItem({
  className,
  children,
  inset,
  value,
  onSelect,
  ...props
}: (React.ComponentProps<"button"> & MenuPrimitive.RadioItem.Props) & {
  inset?: boolean;
  onSelect?: () => void;
}): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div"> &
  MenuPrimitive.Separator.Props): import("react/jsx-runtime").JSX.Element;
declare function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
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
//# sourceMappingURL=dropdown-menu.d.ts.map

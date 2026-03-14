'use client';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import type {
  ComponentProps,
  Dispatch,
  HTMLAttributes,
  MouseEventHandler,
  ReactElement,
  SetStateAction,
} from 'react';
import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { cn } from '@packages/ui/lib/utils';

type DialogStackContextType = {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  totalDialogs: number;
  setTotalDialogs: Dispatch<SetStateAction<number>>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  clickable: boolean;
};

const DialogStackContext = createContext<DialogStackContextType>({
  activeIndex: 0,
  setActiveIndex: () => {},
  totalDialogs: 0,
  setTotalDialogs: () => {},
  isOpen: false,
  setIsOpen: () => {},
  clickable: false,
});

type DialogStackChildProps = {
  index?: number;
};

export type DialogStackProps = {
  open?: boolean;
  clickable?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export const DialogStack = ({
  children,
  className,
  open,
  defaultOpen = false,
  onOpenChange,
  clickable = false,
}: DialogStackProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open !== undefined ? open : internalOpen;

  const setIsOpen = useCallback(
    (value: boolean) => {
      if (open === undefined) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [open, onOpenChange],
  );

  return (
    <DialogStackContext.Provider
      value={{
        activeIndex: 0,
        setActiveIndex: () => {},
        totalDialogs: 0,
        setTotalDialogs: () => {},
        isOpen,
        setIsOpen,
        clickable,
      }}
    >
      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        {className ? <div className={className}>{children}</div> : children}
      </DialogPrimitive.Root>
    </DialogStackContext.Provider>
  );
};

export type DialogStackTriggerProps = DialogPrimitive.Trigger.Props;

export const DialogStackTrigger = ({
  className,
  ...props
}: DialogStackTriggerProps) => {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-stack-trigger"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium text-sm',
        'ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'h-10 px-4 py-2',
        className,
      )}
      {...props}
    />
  );
};

export type DialogStackOverlayProps = DialogPrimitive.Backdrop.Props;

export const DialogStackOverlay = ({
  className,
  ...props
}: DialogStackOverlayProps) => {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-stack-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/80',
        'data-open:animate-in data-open:fade-in-0',
        'data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  );
};

export type DialogStackBodyProps = HTMLAttributes<HTMLDivElement> & {
  children:
    | ReactElement<DialogStackChildProps>[]
    | ReactElement<DialogStackChildProps>;
};

export const DialogStackBody = ({
  children,
  className,
  ...props
}: DialogStackBodyProps) => {
  const context = useContext(DialogStackContext);
  const [totalDialogs, setTotalDialogs] = useState(Children.count(children));
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <DialogStackContext.Provider
      value={{
        ...context,
        totalDialogs,
        setTotalDialogs,
        activeIndex,
        setActiveIndex,
      }}
    >
      <DialogPrimitive.Portal>
        <DialogStackOverlay />
        <div
          className={cn(
            'pointer-events-none fixed inset-0 z-50 mx-auto flex w-full max-w-lg flex-col items-center justify-center',
            className,
          )}
          {...props}
        >
          <div className="pointer-events-auto relative flex w-full flex-col items-center justify-center">
            {Children.map(children, (child, index) => {
              const childElement = child as ReactElement<{
                index: number;
                className?: string;
              }>;

              return cloneElement(childElement, {
                ...childElement.props,
                index,
              });
            })}
          </div>
        </div>
      </DialogPrimitive.Portal>
    </DialogStackContext.Provider>
  );
};

export type DialogStackContentProps = ComponentProps<'div'> & {
  index?: number;
  offset?: number;
};

export const DialogStackContent = ({
  children,
  className,
  index = 0,
  offset = 10,
  ...props
}: DialogStackContentProps) => {
  const context = useContext(DialogStackContext);

  const handleClick = () => {
    if (context.clickable && context.activeIndex > index) {
      context.setActiveIndex(index);
    }
  };

  const distanceFromActive = index - context.activeIndex;
  const translateY =
    distanceFromActive < 0
      ? `-${Math.abs(distanceFromActive) * offset}px`
      : `${Math.abs(distanceFromActive) * offset}px`;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: "This is a clickable dialog"
    // biome-ignore lint/a11y/useKeyWithClickEvents: "This is a clickable dialog"
    <div
      data-slot="dialog-stack-content"
      className={cn(
        'h-auto w-full rounded-lg border bg-background p-6 shadow-lg transition-all duration-300',
        className,
      )}
      onClick={handleClick}
      style={{
        top: 0,
        transform: `translateY(${translateY})`,
        width: `calc(100% - ${Math.abs(distanceFromActive) * 10}px)`,
        zIndex: 50 - Math.abs(context.activeIndex - index),
        position: distanceFromActive ? 'absolute' : 'relative',
        opacity: distanceFromActive > 0 ? 0 : 1,
        cursor:
          context.clickable && context.activeIndex > index
            ? 'pointer'
            : 'default',
      }}
      {...props}
    >
      <div
        className={cn(
          'h-full w-full transition-all duration-300',
          context.activeIndex !== index &&
            'pointer-events-none select-none opacity-0',
        )}
      >
        {children}
      </div>
    </div>
  );
};

export type DialogStackTitleProps = DialogPrimitive.Title.Props;

export const DialogStackTitle = ({
  className,
  ...props
}: DialogStackTitleProps) => (
  <DialogPrimitive.Title
    data-slot="dialog-stack-title"
    className={cn(
      'font-semibold text-lg leading-none tracking-tight',
      className,
    )}
    {...props}
  />
);

export type DialogStackDescriptionProps = DialogPrimitive.Description.Props;

export const DialogStackDescription = ({
  className,
  ...props
}: DialogStackDescriptionProps) => (
  <DialogPrimitive.Description
    data-slot="dialog-stack-description"
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
);

export type DialogStackHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DialogStackHeader = ({
  className,
  ...props
}: DialogStackHeaderProps) => (
  <div
    data-slot="dialog-stack-header"
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);

export type DialogStackFooterProps = HTMLAttributes<HTMLDivElement>;

export const DialogStackFooter = ({
  children,
  className,
  ...props
}: DialogStackFooterProps) => (
  <div
    data-slot="dialog-stack-footer"
    className={cn('flex items-center justify-end space-x-2 pt-4', className)}
    {...props}
  >
    {children}
  </div>
);

export type DialogStackNextProps = ComponentProps<'button'>;

export const DialogStackNext = ({
  children,
  className,
  onClick,
  ...props
}: DialogStackNextProps) => {
  const context = useContext(DialogStackContext);

  const handleNext: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (context.activeIndex < context.totalDialogs - 1) {
      context.setActiveIndex(context.activeIndex + 1);
    }
    onClick?.(e);
  };

  return (
    <button
      data-slot="dialog-stack-next"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      disabled={context.activeIndex >= context.totalDialogs - 1}
      onClick={handleNext}
      type="button"
      {...props}
    >
      {children || 'Next'}
    </button>
  );
};

export type DialogStackPreviousProps = ComponentProps<'button'>;

export const DialogStackPrevious = ({
  children,
  className,
  onClick,
  ...props
}: DialogStackPreviousProps) => {
  const context = useContext(DialogStackContext);

  const handlePrevious: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (context.activeIndex > 0) {
      context.setActiveIndex(context.activeIndex - 1);
    }
    onClick?.(e);
  };

  return (
    <button
      data-slot="dialog-stack-previous"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      disabled={context.activeIndex <= 0}
      onClick={handlePrevious}
      type="button"
      {...props}
    >
      {children || 'Previous'}
    </button>
  );
};

export type DialogStackCloseProps = DialogPrimitive.Close.Props;

export const DialogStackClose = ({
  className,
  ...props
}: DialogStackCloseProps) => (
  <DialogPrimitive.Close
    data-slot="dialog-stack-close"
    className={className}
    {...props}
  />
);

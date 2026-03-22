"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import CartDrawer from "./CartDrawer";
import clsx from "clsx";

const BUTTON_SIZE = 48;
const MARGIN = 12;
const DRAG_THRESHOLD = 6;
const STORAGE_KEY = "pps-cart-button-position";

/**
 * Keep this slightly larger than the actual visible header height
 * so the button never enters header territory.
 */
const HEADER_SAFE_BOTTOM = 92;

type Position = {
  x: number;
  y: number;
};

type FrameBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

function getFrameBounds(): FrameBounds {
  if (typeof window === "undefined") {
    return {
      minX: MARGIN,
      maxX: MARGIN,
      minY: HEADER_SAFE_BOTTOM + MARGIN,
      maxY: HEADER_SAFE_BOTTOM + MARGIN,
    };
  }

  return {
    minX: MARGIN,
    maxX: Math.max(MARGIN, window.innerWidth - BUTTON_SIZE - MARGIN),
    minY: HEADER_SAFE_BOTTOM + MARGIN,
    maxY: Math.max(
      HEADER_SAFE_BOTTOM + MARGIN,
      window.innerHeight - BUTTON_SIZE - MARGIN
    ),
  };
}

function clampToBounds(pos: Position, bounds: FrameBounds): Position {
  return {
    x: Math.min(Math.max(pos.x, bounds.minX), bounds.maxX),
    y: Math.min(Math.max(pos.y, bounds.minY), bounds.maxY),
  };
}

/**
 * Project any dragged point to the nearest edge of the allowed frame.
 * This keeps the cart moving only around the website perimeter,
 * not freely through the middle of the page.
 */
function projectToFrame(pos: Position): Position {
  if (typeof window === "undefined") return pos;

  const bounds = getFrameBounds();
  const clamped = clampToBounds(pos, bounds);

  const distanceToLeft = Math.abs(clamped.x - bounds.minX);
  const distanceToRight = Math.abs(clamped.x - bounds.maxX);
  const distanceToTop = Math.abs(clamped.y - bounds.minY);
  const distanceToBottom = Math.abs(clamped.y - bounds.maxY);

  const minDistance = Math.min(
    distanceToLeft,
    distanceToRight,
    distanceToTop,
    distanceToBottom
  );

  if (minDistance === distanceToLeft) {
    return { x: bounds.minX, y: clamped.y };
  }

  if (minDistance === distanceToRight) {
    return { x: bounds.maxX, y: clamped.y };
  }

  if (minDistance === distanceToTop) {
    return { x: clamped.x, y: bounds.minY };
  }

  return { x: clamped.x, y: bounds.maxY };
}

function getDefaultPosition(): Position {
  if (typeof window === "undefined") {
    return {
      x: MARGIN,
      y: HEADER_SAFE_BOTTOM + MARGIN,
    };
  }

  const bounds = getFrameBounds();

  return {
    x: bounds.maxX,
    y: bounds.minY,
  };
}

function getInitialPosition(): Position {
  if (typeof window === "undefined") return getDefaultPosition();

  const bounds = getFrameBounds();

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Position;

      const projected = projectToFrame(parsed);

      if (projected.x < bounds.maxX * 0.5) {
        return {
          x: bounds.maxX,
          y: projected.y,
        };
      }

      return projected;
    }
  } catch {}

  return {
    x: bounds.maxX,
    y: bounds.minY,
  };
}

export default function CartToggleButton() {
  const { cartItems, openCart } = useCart();

  const [position, setPosition] = useState<Position>(() => getInitialPosition());
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  const itemCount = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => projectToFrame(prev));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return;

    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (
      !dragRef.current.moved &&
      (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)
    ) {
      dragRef.current.moved = true;
      setIsDragging(true);
    }

    if (!dragRef.current.moved) return;

    const rawNext = {
      x: dragRef.current.originX + dx,
      y: dragRef.current.originY + dy,
    };

    setPosition(projectToFrame(rawNext));
  };

  const endDrag = (pointerId: number) => {
    if (dragRef.current.pointerId !== pointerId) return;

    dragRef.current.pointerId = null;

    window.setTimeout(() => {
      setIsDragging(false);
    }, 0);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const moved = dragRef.current.moved;
    endDrag(e.pointerId);

    if (!moved) {
      openCart();
    }
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    endDrag(e.pointerId);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open cart"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        className={clsx(
          "fixed z-40 flex items-center justify-center",
          "h-12 w-12 rounded-full border border-border bg-background",
          "shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
          "touch-none select-none",
          isDragging
            ? "scale-[1.05] shadow-[0_18px_50px_rgba(0,0,0,0.2)]"
            : "hover:scale-[1.03] hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)] active:scale-[0.95]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-foreground"
          aria-hidden="true"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>

        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[11px] font-semibold text-white shadow-sm">
            {itemCount}
          </span>
        )}
      </button>

      <CartDrawer />
    </>
  );
}
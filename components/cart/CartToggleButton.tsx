"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import CartDrawer from "./CartDrawer";
import clsx from "clsx";

const BUTTON_SIZE = 48;
const MARGIN = 12;
const DRAG_THRESHOLD = 6;
const STORAGE_KEY = "pps-cart-button-position";

type Position = {
  x: number;
  y: number;
};

function clampPosition(pos: Position): Position {
  if (typeof window === "undefined") return pos;

  const maxX = window.innerWidth - BUTTON_SIZE - MARGIN;
  const maxY = window.innerHeight - BUTTON_SIZE - MARGIN;

  return {
    x: Math.min(Math.max(pos.x, MARGIN), maxX),
    y: Math.min(Math.max(pos.y, MARGIN), maxY),
  };
}

function getInitialPosition(): Position {
  if (typeof window === "undefined") return { x: 0, y: 0 };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return clampPosition(JSON.parse(saved));
    }
  } catch {}

  return clampPosition({
    x: window.innerWidth - BUTTON_SIZE - MARGIN,
    y: window.innerWidth >= 1024
      ? window.innerHeight / 2 - BUTTON_SIZE / 2
      : 100,
  });
}

export default function CartToggleButton() {
  const { cartItems, openCart } = useCart();

  const [position, setPosition] = useState<Position>(() =>
    getInitialPosition()
  );
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

  /* =========================
     SAVE POSITION
  ========================= */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  }, [position]);

  /* =========================
     HANDLE RESIZE
  ========================= */
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => clampPosition(prev));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =========================
     DRAG LOGIC
  ========================= */
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

    setPosition(
      clampPosition({
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      })
    );
  };

  const endDrag = (pointerId: number) => {
    if (dragRef.current.pointerId !== pointerId) return;

    dragRef.current.pointerId = null;

    setTimeout(() => setIsDragging(false), 0);
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
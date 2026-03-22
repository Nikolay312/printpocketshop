"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import CartDrawer from "./CartDrawer";
import clsx from "clsx";

const BUTTON_WIDTH = 48;
const BUTTON_HEIGHT = 48;
const MARGIN = 12;
const DRAG_THRESHOLD = 6;
const STORAGE_KEY = "pps-cart-button-position";

/**
 * Keeps the button below the header / sign-in area on both desktop and mobile.
 */
const HEADER_SAFE_BOTTOM = 92;

/**
 * Motion tuning for smoother, more premium drag / snap feel.
 */
const FOLLOW_LERP = 0.22;
const SNAP_LERP = 0.16;
const SIDE_SWITCH_DEADZONE = 36;

type Side = "left" | "right";

type Position = {
  side: Side;
  y: number;
};

type VerticalBounds = {
  minY: number;
  maxY: number;
};

function getVerticalBounds(): VerticalBounds {
  if (typeof window === "undefined") {
    return {
      minY: HEADER_SAFE_BOTTOM + MARGIN,
      maxY: HEADER_SAFE_BOTTOM + MARGIN,
    };
  }

  return {
    minY: HEADER_SAFE_BOTTOM + MARGIN,
    maxY: Math.max(
      HEADER_SAFE_BOTTOM + MARGIN,
      window.innerHeight - BUTTON_HEIGHT - MARGIN
    ),
  };
}

function clampY(y: number, bounds: VerticalBounds): number {
  return Math.min(Math.max(y, bounds.minY), bounds.maxY);
}

function getXForSide(side: Side): number {
  if (typeof window === "undefined") {
    return MARGIN;
  }

  return side === "left"
    ? MARGIN
    : Math.max(MARGIN, window.innerWidth - BUTTON_WIDTH - MARGIN);
}

/**
 * Default position:
 * right side, directly under the sign-in button / header area.
 */
function getDefaultPosition(): Position {
  const bounds = getVerticalBounds();

  return {
    side: "right",
    y: bounds.minY,
  };
}

function normalizePosition(pos: Partial<Position> | null | undefined): Position {
  const bounds = getVerticalBounds();
  const safeDefault = getDefaultPosition();

  if (!pos) return safeDefault;

  const side: Side = pos.side === "left" ? "left" : "right";
  const y =
    typeof pos.y === "number" && Number.isFinite(pos.y)
      ? clampY(pos.y, bounds)
      : safeDefault.y;

  return { side, y };
}

function getInitialPosition(): Position {
  if (typeof window === "undefined") return getDefaultPosition();

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return normalizePosition(JSON.parse(saved) as Partial<Position>);
    }
  } catch {}

  return getDefaultPosition();
}

export default function CartToggleButton() {
  const { cartItems, openCart } = useCart();

  const [position, setPosition] = useState<Position>(() => getInitialPosition());
  const [isDragging, setIsDragging] = useState(false);

  const positionRef = useRef<Position>(position);
  const animationFrameRef = useRef<number | null>(null);
  const targetRef = useRef<Position>(position);

  const dragRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    originSide: "right" as Side,
    originY: 0,
    moved: false,
    activeSide: "right" as Side,
  });

  const itemCount = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    const handleResize = () => {
      const next = normalizePosition(positionRef.current);
      targetRef.current = next;
      positionRef.current = next;
      setPosition(next);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const stopAnimation = () => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const animateToTarget = (lerp: number) => {
    stopAnimation();

    const tick = () => {
      const current = positionRef.current;
      const target = normalizePosition(targetRef.current);

      const nextY = current.y + (target.y - current.y) * lerp;
      const closeEnough = Math.abs(target.y - nextY) < 0.35;

      const next: Position = {
        side: target.side,
        y: closeEnough ? target.y : nextY,
      };

      positionRef.current = next;
      setPosition(next);

      if (!closeEnough || next.side !== target.side) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      animationFrameRef.current = null;
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    stopAnimation();

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originSide: positionRef.current.side,
      originY: positionRef.current.y,
      moved: false,
      activeSide: positionRef.current.side,
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

    const bounds = getVerticalBounds();
    const rawTargetY = dragRef.current.originY + dy;
    const nextY = clampY(rawTargetY, bounds);

    const midpoint = window.innerWidth / 2;
    const leftThreshold = midpoint - SIDE_SWITCH_DEADZONE;
    const rightThreshold = midpoint + SIDE_SWITCH_DEADZONE;

    let nextSide = dragRef.current.activeSide;

    if (e.clientX <= leftThreshold) {
      nextSide = "left";
    } else if (e.clientX >= rightThreshold) {
      nextSide = "right";
    }

    dragRef.current.activeSide = nextSide;

    targetRef.current = {
      side: nextSide,
      y: nextY,
    };

    animateToTarget(FOLLOW_LERP);
  };

  const endDrag = (pointerId: number) => {
    if (dragRef.current.pointerId !== pointerId) return;

    dragRef.current.pointerId = null;

    if (dragRef.current.moved) {
      targetRef.current = normalizePosition(targetRef.current);
      animateToTarget(SNAP_LERP);
    }

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
          left: `${getXForSide(position.side)}px`,
          top: `${position.y}px`,
        }}
        className={clsx(
          "fixed z-40 flex items-center justify-center",
          "h-12 w-12 rounded-full",
          "border border-black/5 bg-white/95 backdrop-blur-md",
          "shadow-[0_10px_24px_rgba(15,23,42,0.14),0_2px_8px_rgba(15,23,42,0.08)]",
          "touch-none select-none will-change-transform",
          "transition-[transform,box-shadow,background-color] duration-200 ease-out",
          isDragging
            ? "scale-[1.04] shadow-[0_16px_36px_rgba(15,23,42,0.2),0_4px_14px_rgba(15,23,42,0.12)]"
            : "hover:scale-[1.03] hover:shadow-[0_14px_30px_rgba(15,23,42,0.17),0_4px_12px_rgba(15,23,42,0.1)] active:scale-[0.96]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2"
        )}
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white to-slate-50" />

        <span className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-slate-900"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </span>

        {itemCount > 0 && (
          <span
            className={clsx(
              "absolute -right-1 -top-1 flex min-w-[20px] items-center justify-center rounded-full px-1.5",
              "h-5 text-[10px] font-semibold leading-none text-white",
              "bg-black shadow-[0_4px_10px_rgba(0,0,0,0.22)]"
            )}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      <CartDrawer />
    </>
  );
}
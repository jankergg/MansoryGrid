/**
 * Masonry layout implementation for CSS Grid Layout
 */

import React, { FC, useLayoutEffect, useRef } from "react";
import { Masonry } from "./Masonry";

interface MasonryLayoutProps {
  columns: number;
  colGap?: number;
  rowGap?: number;
  direction: "horizontal" | "vertical";
  children: React.ReactNode[];
}

export const MasonryLayout: FC<MasonryLayoutProps> = ({
  columns,
  direction = "horizontal",
  colGap = 12,
  rowGap = 12,
  children,
}) => {
  const shadowGridRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const grid = gridRef.current;
    const shadowGrid = shadowGridRef.current;

    const masonry =
      shadowGrid && grid
        ? new Masonry({ grid, shadowGrid, columns, direction, rowGap, colGap })
        : null;

    return () => {
      masonry?.destroy();
    };
  }, [colGap, columns, direction, rowGap]);

  return (
    <div className="masonry">
      <div className="masonry-shadow">
        <div
          ref={shadowGridRef}
          className="masonry-grid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${colGap}px`,
          }}
        >
          {children}
        </div>
      </div>
      <div
        ref={gridRef}
        className="masonry-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${colGap}px`,
        }}
      ></div>
    </div>
  );
};

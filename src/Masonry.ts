/**
 * Masonry layout implementation for CSS Grid Layout
 * @auther janko zhang
 */

import throttle from "lodash.throttle";

interface MasonryOptions {
  /**
   * shadowGrid is a reference to the grid that contains all the items originally passed to the MasonryLayout component.
   * */
  shadowGrid: HTMLElement;
  /**
   * grid is a reference to the grid that will contain the items after the MasonryLayout component has been mounted.
   * */
  grid: HTMLElement;
  /**
   * columns is the number of columns in the grid.
   * */
  columns: number;
  /**
   * direction is the direction of the grid layout, either horizontal or vertical.
   * in horizontal mode, items will be placed in columns from left to right, from top to bottom.
   * for example:
   * 1 2 3
   * 4 5 6
   * 7 8 9
   * in vertical mode, items will be placed in columns from top to bottom, from left to right.
   * for example:
   * 1 4 7
   * 2 5 8
   * 3 6 9
   * */
  direction: "horizontal" | "vertical";
  /**
   * rowGap is the gap between rows in the grid.
   * */
  rowGap?: number;
  /**
   * colGap is the gap between columns in the grid.
   * */
  colGap?: number;
}

export class Masonry {
  // an array that stores the columns element in the grid.
  private gridColumns: HTMLElement[] = [];
  // an array that stores the height of each column to avoid repetitive calculation.
  private gridColumnHeights: number[] = [];
  // the height of the mansonry grid.
  private gridHeight: number = 0;

  constructor(private options: MasonryOptions) {
    this.create();
  }

  create = () => {
    (window.visualViewport || window).addEventListener("resize", this.update);
    this.update();
  };

  destroy = () => {
    this.removeColumns();
    (window.visualViewport || window).removeEventListener(
      "resize",
      this.update
    );
  };

  private update = throttle(() => {
    this.gridHeight =
      this.options.shadowGrid.getBoundingClientRect().height / 2;
    this.initColumns();
  }, 50);

  private initColumns = () => {
    this.removeColumns();

    this.gridColumns = [];
    this.gridColumnHeights = [];
    for (let i = 0; i < this.options.columns; i++) {
      const column = document.createElement("div");

      column.classList.add("masonry-column");
      if (this.options.rowGap) {
        column.style.rowGap = `${this.options.rowGap}px`;
      }

      this.gridColumns.push(column);
      this.gridColumnHeights.push(0);
      this.options.grid.appendChild(column);
    }
    this.appendGridItems();
  };

  private removeColumns = () => {
    this.gridColumns.forEach((column) => {
      this.options.grid.removeChild(column);
    });
  };

  private getDistColumnIndex = () => {
    // if direction is horizontal, find the shortest column
    if (this.options.direction === "horizontal") {
      let minHeight = this.gridColumnHeights[0];
      let index = 0;
      for (let i = 1; i < this.options.columns; i++) {
        if (this.gridColumnHeights[i] < minHeight) {
          index = i;
          minHeight = this.gridColumnHeights[i];
        }
      }
      return index;
    }

    // if direction is vertical, find the first column that has enough space
    for (let i = 0; i < this.options.columns; i++) {
      if (this.gridColumnHeights[i] < this.gridHeight) {
        return i;
      }
    }
    return 0;
  };

  private appendGridItems = () => {
    const items = Array.from(this.options.shadowGrid.children) as HTMLElement[];
    items.forEach((item) => {
      const columnIndex = this.getDistColumnIndex();
      const column = this.gridColumns[columnIndex];
      const rowGap = this.options.rowGap || 0;

      this.gridColumnHeights[columnIndex] +=
        item.getBoundingClientRect().height + rowGap;

      column.appendChild(item.cloneNode(true));

      // update grid height
      const maxColumnHeight = Math.max(...this.gridColumnHeights);
      if (maxColumnHeight > this.gridHeight + window.innerHeight / 2) {
        this.gridHeight = maxColumnHeight - 1;
      }
    });
  };
}

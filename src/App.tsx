import "./styles.css";
import { MasonryLayout } from "./MasonryLayout";
import { data } from "./data";
import { useLayoutEffect, useState } from "react";

export const App = () => {
  const [columns, setColumns] = useState(3);
  const [isVertical, setIsVertical] = useState(false);

  useLayoutEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width > 800) {
        setColumns(3);
      } else {
        setColumns(2);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  return (
    <div className="app">
      <label htmlFor="direction">
        Vertical
        <input
          type="checkbox"
          checked={isVertical}
          id="direction"
          onChange={() => setIsVertical(!isVertical)}
        />
      </label>
      <MasonryLayout
        columns={columns}
        direction={isVertical ? "vertical" : "horizontal"}
      >
        {data.map((item: any, index: number) => (
          <div key={index} className="masonry-grid-item">
            <h2>
              [{index + 1}]-{item.title}
            </h2>
            <p>{item.text}</p>
          </div>
        ))}
      </MasonryLayout>
    </div>
  );
};

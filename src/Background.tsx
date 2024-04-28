import React from "react";
import "./Background.css"; // Ensure the CSS file is correctly linked

const Background: React.FC = () => {
  // Initialize a variable to keep track of the accumulated width
  let accumulatedWidth = 0;

  // Generate 40 divs with different widths and stack them horizontally with overlap
  const columns = Array.from({ length: 18 }, (_, index) => {
    const width = Math.random() * 10 + 1; // Width between 1% and 6%
    const translateY = 0 - index * (10 / 2); // Evenly distributes vertical positions from +100 to -100
    const left = accumulatedWidth;
    accumulatedWidth += width - 0.5; // Overlap the next div by 0.5% of the container's width

    return (
      <div
        key={index}
        className="background-column"
        style={{
          left: `${left}%`,
          width: `${width}%`,
          transform: `translateY(${translateY}%)`,
        }}
      ></div>
    );
  });

  return <div className="background">{columns}</div>;
};

export default Background;

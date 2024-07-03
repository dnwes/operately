import React from "react";

export function Logo(props: { width?: string; height?: string }) {
  const width = props.width || "22px";
  const height = props.height || "22px";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      viewBox="193.04 193.04 613.92 613.92"
      width={width}
      height={height}
    >
      <polygon points="602.32 806.96 397.68 806.96 397.68 602.32 602.32 806.96" fill="#024fac"></polygon>
      <polygon points="397.68 193.04 602.32 193.04 602.32 397.68 397.68 193.04" fill="#024fac"></polygon>
      <polygon
        points="602.32 193.04 602.32 397.68 602.32 602.32 602.32 806.96 806.96 602.32 806.96 397.68 602.32 193.04"
        fill="#3185ff"
      ></polygon>
      <polygon
        points="193.04 397.68 193.04 602.32 397.68 806.96 397.68 602.32 397.68 397.68 397.68 193.04 193.04 397.68"
        fill="#3185ff"
      ></polygon>
    </svg>
  );
}

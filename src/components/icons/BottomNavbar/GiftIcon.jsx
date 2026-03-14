import * as React from "react";

function GiftIcon({ className = "" }) {
  return (
    <svg
      width={39}
      height={39}
      viewBox="0 0 39 39"
      fill="none"
      className={className}
    >
      <path
        d="M1.5 29.5h36m-18-18l-4 8m4-8l4 8m-4-8h-9a5 5 0 010-10c7 0 9 10 9 10zm0 0h9a5 5 0 000-10c-7 0-9 10-9 10zm-11.6 26h23.2c2.24 0 3.36 0 4.216-.436a4 4 0 001.748-1.748c.436-.856.436-1.976.436-4.216V17.9c0-2.24 0-3.36-.436-4.216a4 4 0 00-1.748-1.748C34.46 11.5 33.34 11.5 31.1 11.5H7.9c-2.24 0-3.36 0-4.216.436a4 4 0 00-1.748 1.748C1.5 14.54 1.5 15.66 1.5 17.9v13.2c0 2.24 0 3.36.436 4.216a4 4 0 001.748 1.748c.856.436 1.976.436 4.216.436z"
        fill="none"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default GiftIcon;

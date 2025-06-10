import type React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    width="120"
    height="30"
    role="img"
    aria-labelledby="logoTitle"
    {...props}
  >
    <title id="logoTitle">Globalink CEO Logo</title>
    <style>
      {`
        .logo-text {
          font-family: 'Inter', sans-serif;
          font-size: 28px;
          font-weight: 600;
          fill: hsl(var(--sidebar-foreground));
        }
        .logo-highlight {
          fill: hsl(var(--sidebar-primary));
        }
        @media (prefers-color-scheme: dark) {
          .logo-text {
            fill: hsl(var(--sidebar-foreground));
          }
          .logo-highlight {
            fill: hsl(var(--sidebar-primary));
          }
        }
      `}
    </style>
    <text x="0" y="35" className="logo-text">
      Globalink<tspan className="logo-highlight">CEO</tspan>
    </text>
  </svg>
);

export default Logo;

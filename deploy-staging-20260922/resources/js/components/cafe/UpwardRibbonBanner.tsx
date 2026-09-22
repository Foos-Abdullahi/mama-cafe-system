import type React from "react";

interface UpwardRibbonBannerProps {
  className?: string;
  text?: string;
}

export const UpwardRibbonBanner: React.FC<UpwardRibbonBannerProps> = ({
  className = "",
  text = "COFFEE  •  BOBA  •  ICE CHOCOLATE",
}) => {
  return (
    <div className={`relative w-full select-none ${className}`}>
      <svg
        viewBox="0 0 520 115"
        className="h-auto w-full filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Rich 3D chocolate gradient matching MaMa Café brand palette */}
          <linearGradient id="chocolate-ribbon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4D2717" />
            <stop offset="35%" stopColor="#38190B" />
            <stop offset="75%" stopColor="#291106" />
            <stop offset="100%" stopColor="#1C0A03" />
          </linearGradient>

          {/* Golden border stroke gradient */}
          <linearGradient id="ribbon-border-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7A4522" />
            <stop offset="30%" stopColor="#D8A16F" />
            <stop offset="50%" stopColor="#F5D3B3" />
            <stop offset="70%" stopColor="#D8A16F" />
            <stop offset="100%" stopColor="#7A4522" />
          </linearGradient>

          {/* Top curve subtle light sheen */}
          <linearGradient id="ribbon-top-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(216, 161, 111, 0.1)" />
            <stop offset="50%" stopColor="rgba(255, 240, 220, 0.45)" />
            <stop offset="100%" stopColor="rgba(216, 161, 111, 0.1)" />
          </linearGradient>

          {/* Upward text arc path (convex bridge curve ⌒ matching Image 2) */}
          <path
            id="upward-text-arc"
            d="M 65, 87 Q 260, 46 455, 87"
            fill="none"
          />
        </defs>

        {/* 3D Fold shadows behind main banner ends */}
        <path
          d="M 60, 72 L 25, 54 L 42, 77 L 25, 100 L 60, 110 Z"
          fill="#120602"
        />
        <path
          d="M 460, 72 L 495, 54 L 478, 77 L 495, 100 L 460, 110 Z"
          fill="#120602"
        />

        {/* Main Ribbon Banner Body with upward arch */}
        <path
          d="M 60, 68 
             Q 260, 26 460, 68 
             L 495, 50 
             L 478, 75 
             L 495, 100 
             L 460, 108 
             Q 260, 66 60, 108 
             L 25, 100 
             L 42, 75 
             L 25, 50 
             Z"
          fill="url(#chocolate-ribbon-grad)"
          stroke="url(#ribbon-border-grad)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Top Edge Gloss Highlight */}
        <path
          d="M 60, 69.5 Q 260, 27.5 460, 69.5"
          stroke="url(#ribbon-top-sheen)"
          strokeWidth="1.8"
          fill="none"
        />

        {/* Vertical Tail Crease Shadow Lines */}
        <path d="M 60, 68 L 60, 108" stroke="rgba(0, 0, 0, 0.55)" strokeWidth="2.2" />
        <path d="M 460, 68 L 460, 108" stroke="rgba(0, 0, 0, 0.55)" strokeWidth="2.2" />

        {/* Curved White Bold Text along Path (Image 2 style) */}
        <text
          className="font-sans uppercase"
          fill="#FFFFFF"
          fontSize="17.5"
          letterSpacing="3.5"
          style={{
            filter: "drop-shadow(0px 1.5px 2px rgba(0, 0, 0, 0.95))",
            fontWeight: 900,
          }}
        >
          <textPath
            href="#upward-text-arc"
            startOffset="50%"
            textAnchor="middle"
          >
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

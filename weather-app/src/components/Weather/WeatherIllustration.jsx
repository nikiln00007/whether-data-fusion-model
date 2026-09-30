import React from 'react';
import './WeatherIllustration.css';

/* ============================================================
   Inline SVG weather illustrations — soft 3D glassmorphism
   ============================================================ */

const SunnyIllus = () => (
  <svg viewBox="0 0 200 200" className="weather-illus-svg illus-sun" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFE566"/>
        <stop offset="100%" stopColor="#FFB347"/>
      </radialGradient>
      <radialGradient id="cloudGrad" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#d4eaf7"/>
      </radialGradient>
      <filter id="softBlur"><feGaussianBlur stdDeviation="2"/></filter>
    </defs>
    {/* Sun */}
    <circle cx="80" cy="75" r="40" fill="url(#sunGrad)" opacity="0.95"/>
    <circle cx="80" cy="75" r="50" fill="url(#sunGrad)" opacity="0.15"/>
    {/* Rays */}
    {[0,45,90,135,180,225,270,315].map((angle, i) => (
      <line key={i}
        x1={80 + Math.cos(angle*Math.PI/180)*48}
        y1={75 + Math.sin(angle*Math.PI/180)*48}
        x2={80 + Math.cos(angle*Math.PI/180)*60}
        y2={75 + Math.sin(angle*Math.PI/180)*60}
        stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
    ))}
    {/* Big fluffy cloud */}
    <ellipse cx="120" cy="130" rx="55" ry="32" fill="url(#cloudGrad)"/>
    <ellipse cx="95"  cy="120" rx="40" ry="30" fill="url(#cloudGrad)"/>
    <ellipse cx="135" cy="115" rx="32" ry="26" fill="url(#cloudGrad)"/>
    <ellipse cx="115" cy="108" rx="28" ry="24" fill="url(#cloudGrad)"/>
    {/* Shadow under cloud */}
    <ellipse cx="118" cy="162" rx="50" ry="8" fill="rgba(0,0,0,0.07)" filter="url(#softBlur)"/>
  </svg>
);

const ThunderstormIllus = () => (
  <svg viewBox="0 0 200 200" className="weather-illus-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="stormCloud" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7a7f9e"/>
        <stop offset="100%" stopColor="#4a4f6e"/>
      </linearGradient>
      <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE566"/>
        <stop offset="100%" stopColor="#FFB347"/>
      </linearGradient>
    </defs>
    {/* Dark storm cloud */}
    <ellipse cx="100" cy="90" rx="65" ry="38" fill="url(#stormCloud)"/>
    <ellipse cx="75"  cy="78" rx="42" ry="34" fill="url(#stormCloud)"/>
    <ellipse cx="125" cy="75" rx="38" ry="30" fill="url(#stormCloud)"/>
    {/* Lightning bolt */}
    <polygon className="illus-lightning"
      points="108,128 94,155 104,155 88,185 118,152 106,152 120,128"
      fill="url(#boltGrad)"
      filter="drop-shadow(0 0 8px rgba(255,230,102,0.8))"/>
    {/* Rain drops */}
    {[[68,145],[82,155],[55,158],[42,148],[95,165]].map(([x,y],i) => (
      <ellipse key={i} className="rain-drop" cx={x} cy={y} rx="3" ry="6"
        fill="#8BBFE8" opacity="0.7" style={{animationDelay:`${i*0.2}s`}}/>
    ))}
  </svg>
);

const RainyIllus = () => (
  <svg viewBox="0 0 200 200" className="weather-illus-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="rainCloud" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#aabdd4"/>
        <stop offset="100%" stopColor="#7a99b8"/>
      </linearGradient>
    </defs>
    {/* Cloud */}
    <ellipse cx="100" cy="80" rx="62" ry="35" fill="url(#rainCloud)"/>
    <ellipse cx="75"  cy="68" rx="40" ry="32" fill="url(#rainCloud)"/>
    <ellipse cx="125" cy="65" rx="36" ry="28" fill="url(#rainCloud)"/>
    {/* Rain drops */}
    {[[65,120],[80,130],[95,122],[110,132],[125,120],[72,142],[87,150],[105,145],[118,150],[55,135]].map(([x,y],i) => (
      <line key={i} className="rain-drop" x1={x} y1={y} x2={x-3} y2={y+12}
        stroke="#5b9bd5" strokeWidth="2.5" strokeLinecap="round"
        style={{animationDelay:`${(i*0.15)%1.2}s`}}/>
    ))}
  </svg>
);

const SnowyIllus = () => (
  <svg viewBox="0 0 200 200" className="weather-illus-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="snowCloud" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dce9f5"/>
        <stop offset="100%" stopColor="#b8d0e8"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="80" rx="62" ry="35" fill="url(#snowCloud)"/>
    <ellipse cx="75"  cy="68" rx="40" ry="32" fill="url(#snowCloud)"/>
    <ellipse cx="125" cy="65" rx="36" ry="28" fill="url(#snowCloud)"/>
    {/* Snowflakes */}
    {[[65,120,0],[85,132,0.3],[105,125,0.6],[125,135,0.9],[70,148,1.2],[100,152,0.5],[55,138,0.8]].map(([x,y,delay],i) => (
      <text key={i} className="snow-flake" x={x} y={y}
        fontSize="14" fill="#6aaed6" textAnchor="middle"
        style={{animationDelay:`${delay}s`}}>❄</text>
    ))}
  </svg>
);

const FoggyIllus = () => (
  <svg viewBox="0 0 200 200" className="weather-illus-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fogGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(180,178,200,0.0)"/>
        <stop offset="20%" stopColor="rgba(180,178,200,0.9)"/>
        <stop offset="80%" stopColor="rgba(180,178,200,0.9)"/>
        <stop offset="100%" stopColor="rgba(180,178,200,0.0)"/>
      </linearGradient>
    </defs>
    {[70,95,115,135,155,80,105].map((y,i) => (
      <rect key={i} x="20" y={y} width="160" height="10" rx="5" fill="url(#fogGrad)" opacity={0.6 + i*0.05}/>
    ))}
    <circle cx="100" cy="55" r="28" fill="rgba(255,255,200,0.5)" filter="blur(4px)"/>
    <circle cx="100" cy="55" r="20" fill="#FFF8D6"/>
  </svg>
);

const NightIllus = () => (
  <svg viewBox="0 0 200 200" className="weather-illus-svg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="moonGrad" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fff9e6"/>
        <stop offset="100%" stopColor="#f0d080"/>
      </radialGradient>
    </defs>
    {/* Moon */}
    <circle cx="110" cy="85" r="45" fill="url(#moonGrad)"/>
    <circle cx="90" cy="68" r="38" fill="#1a1a4e"/>
    {/* Stars */}
    {[[50,40,3],[160,55,2],[40,90,2],[170,100,3],[55,130,2],[145,35,2],[80,160,2]].map(([x,y,r],i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.8}/>
    ))}
    {/* Small cloud */}
    <ellipse cx="90" cy="150" rx="48" ry="22" fill="rgba(100,90,160,0.5)"/>
    <ellipse cx="68" cy="140" rx="32" ry="22" fill="rgba(100,90,160,0.5)"/>
  </svg>
);

const HotIllus = () => (
  <svg viewBox="0 0 200 200" className="weather-illus-svg illus-sun" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="hotSun" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD700"/>
        <stop offset="100%" stopColor="#FF6B35"/>
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="55" fill="url(#hotSun)" opacity="0.98"/>
    <circle cx="100" cy="100" r="68" fill="url(#hotSun)" opacity="0.15"/>
    <circle cx="100" cy="100" r="80" fill="url(#hotSun)" opacity="0.07"/>
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => (
      <line key={i}
        x1={100 + Math.cos(angle*Math.PI/180)*62}
        y1={100 + Math.sin(angle*Math.PI/180)*62}
        x2={100 + Math.cos(angle*Math.PI/180)*78}
        y2={100 + Math.sin(angle*Math.PI/180)*78}
        stroke="#FF8C00" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
    ))}
  </svg>
);

const ILLUS_MAP = {
  clear: SunnyIllus,
  thunderstorm: ThunderstormIllus,
  rain: RainyIllus,
  snow: SnowyIllus,
  fog: FoggyIllus,
  night: NightIllus,
  hot: HotIllus,
};

/**
 * WeatherIllustration — renders the correct animated SVG per theme
 */
export default function WeatherIllustration({ theme = 'clear' }) {
  const Illus = ILLUS_MAP[theme] || SunnyIllus;
  return (
    <div className="illustration-wrap" aria-hidden="true">
      <Illus />
      {/* Decorative small floating clouds */}
      <svg className="illus-cloud-small" width="48" height="28" viewBox="0 0 48 28"
           style={{top:'10px',right:'5px'}}>
        <ellipse cx="24" cy="18" rx="22" ry="12" fill="rgba(255,255,255,0.7)"/>
        <ellipse cx="16" cy="14" rx="14" ry="12" fill="rgba(255,255,255,0.7)"/>
        <ellipse cx="32" cy="13" rx="12" ry="10" fill="rgba(255,255,255,0.7)"/>
      </svg>
      <svg className="illus-cloud-small" width="36" height="22" viewBox="0 0 36 22"
           style={{bottom:'20px',left:'0px'}}>
        <ellipse cx="18" cy="14" rx="16" ry="10" fill="rgba(255,255,255,0.6)"/>
        <ellipse cx="12" cy="11" rx="11" ry="9" fill="rgba(255,255,255,0.6)"/>
        <ellipse cx="25" cy="10" rx="9" ry="8" fill="rgba(255,255,255,0.6)"/>
      </svg>
    </div>
  );
}

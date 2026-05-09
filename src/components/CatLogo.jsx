export default function CatLogo({ className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 20 100 70" 
      className={className}
      fill="currentColor"
    >
      {/* Head */}
      <path d="M20 30 L30 45 C40 35, 60 35, 70 45 L80 30 L75 55 C80 75, 60 85, 50 85 C40 85, 20 75, 25 55 Z" />
      {/* Whiskers Left */}
      <path d="M 5 50 L 25 52 M 8 62 L 23 58" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Whiskers Right */}
      <path d="M 95 50 L 75 52 M 92 62 L 77 58" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Eyes */}
      <path d="M 35 52 Q 40 45 45 52" fill="none" stroke="var(--color-bg, #e5e5e5)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 65 52 Q 60 45 55 52" fill="none" stroke="var(--color-bg, #e5e5e5)" strokeWidth="4" strokeLinecap="round" />
      {/* Nose */}
      <polygon points="48,58 52,58 50,62" fill="var(--color-bg, #e5e5e5)" />
      {/* Open Laughing Mouth */}
      <path d="M 40 65 Q 50 85 60 65" fill="var(--color-bg, #e5e5e5)" />
    </svg>
  );
}

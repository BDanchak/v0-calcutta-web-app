"use client"

export function AnimatedSportsBalls() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[10%] left-0 animate-float-right opacity-20">
        <svg width="60" height="60" viewBox="0 0 100 100" className="text-primary">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          <path
            d="M50 5 L50 25 M50 75 L50 95 M5 50 L25 50 M75 50 L95 50 M20 20 L35 35 M65 35 L80 20 M20 80 L35 65 M65 65 L80 80"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute top-[30%] right-0 animate-float-left opacity-20">
        <svg width="70" height="70" viewBox="0 0 100 100" className="text-primary">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20 Q50 50 20 80 M80 20 Q50 50 80 80" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute top-[50%] left-0 animate-float-right-slow opacity-20">
        <svg width="55" height="55" viewBox="0 0 100 100" className="text-primary">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          <path
            d="M30 20 Q35 30 30 40 Q35 50 30 60 Q35 70 30 80 M70 20 Q65 30 70 40 Q65 50 70 60 Q65 70 70 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="absolute top-[70%] right-0 animate-float-left-slow opacity-20">
        <svg width="80" height="50" viewBox="0 0 120 80" className="text-primary">
          <ellipse cx="60" cy="40" rx="55" ry="35" fill="none" stroke="currentColor" strokeWidth="3" />
          <line x1="60" y1="5" x2="60" y2="75" stroke="currentColor" strokeWidth="2" />
          <line x1="45" y1="35" x2="45" y2="45" stroke="currentColor" strokeWidth="2" />
          <line x1="50" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="2" />
          <line x1="55" y1="27" x2="55" y2="53" stroke="currentColor" strokeWidth="2" />
          <line x1="65" y1="27" x2="65" y2="53" stroke="currentColor" strokeWidth="2" />
          <line x1="70" y1="30" x2="70" y2="50" stroke="currentColor" strokeWidth="2" />
          <line x1="75" y1="35" x2="75" y2="45" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute top-[20%] left-0 animate-float-right-fast opacity-20">
        <svg width="50" height="50" viewBox="0 0 100 100" className="text-primary">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M20 30 Q50 50 20 70 M80 30 Q50 50 80 70" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute top-[60%] right-0 animate-float-left-fast opacity-20">
        <svg width="65" height="65" viewBox="0 0 100 100" className="text-primary">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          <path
            d="M50 5 L50 25 M50 75 L50 95 M5 50 L25 50 M75 50 L95 50 M20 20 L35 35 M65 35 L80 20 M20 80 L35 65 M65 65 L80 80"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute top-[85%] left-0 animate-float-right opacity-20">
        <svg width="60" height="60" viewBox="0 0 100 100" className="text-primary">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20 Q50 50 20 80 M80 20 Q50 50 80 80" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}

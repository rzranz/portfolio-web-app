interface PhoneMockupProps {
  src: string
  alt: string
  className?: string
}

export function PhoneMockup({ src, alt, className = '' }: PhoneMockupProps) {
  return (
    <div className={`relative flex items-center justify-center py-4 select-none ${className}`}>
      {/* Outer Titanium Chassis Frame */}
      <div className="relative w-full max-w-[280px] sm:max-w-[315px] rounded-[48px] p-[3px] bg-gradient-to-b from-[#4a4756] via-[#2d2938] to-[#1c1a24] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.25)]">
        
        {/* Hardware Buttons - Left Side */}
        {/* Action Button */}
        <div className="absolute -left-[3px] top-[75px] w-[3px] h-6 bg-gradient-to-b from-[#565166] to-[#3a3647] rounded-l-[2px] shadow-sm pointer-events-none" />
        {/* Volume Up */}
        <div className="absolute -left-[3px] top-[115px] w-[3px] h-11 bg-gradient-to-b from-[#565166] to-[#3a3647] rounded-l-[2px] shadow-sm pointer-events-none" />
        {/* Volume Down */}
        <div className="absolute -left-[3px] top-[170px] w-[3px] h-11 bg-gradient-to-b from-[#565166] to-[#3a3647] rounded-l-[2px] shadow-sm pointer-events-none" />
        
        {/* Hardware Button - Right Side */}
        {/* Power / Lock Button */}
        <div className="absolute -right-[3px] top-[125px] w-[3px] h-16 bg-gradient-to-b from-[#565166] to-[#3a3647] rounded-r-[2px] shadow-sm pointer-events-none" />

        {/* Inner Bezel Container */}
        <div className="relative rounded-[45px] bg-[#0c0c0e] p-2.5 sm:p-3 overflow-hidden">
          
          {/* Top Bezel Sensor Bar (Speaker Earpiece & Minimal Camera Dot) */}
          <div className="relative w-full flex items-center justify-center pb-2 pt-0.5">
            {/* Earpiece slit */}
            <div className="w-10 h-1 bg-neutral-900 rounded-full border border-neutral-800/80" />
            {/* Camera lens reflection dot */}
            <div className="absolute right-12 w-2 h-2 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-indigo-950/60" />
            </div>
          </div>

          {/* Screen Display Viewport */}
          <div className="relative rounded-[32px] sm:rounded-[34px] overflow-hidden bg-black shadow-inner">
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="w-full h-auto block object-contain object-top"
            />

            {/* Subtle Glare / Specular Sheen Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] rounded-[32px] sm:rounded-[34px]" />
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-full flex items-center justify-center pt-2 pb-0.5">
            <div className="w-28 h-1 bg-neutral-700/60 rounded-full" />
          </div>
        </div>
      </div>

      {/* Realistic Floor Shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[75%] h-6 bg-black/70 blur-xl rounded-full pointer-events-none" />
    </div>
  )
}

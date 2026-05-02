
export const SpeedLines = () => null;

export const DigitalScanline = () => null;

export const HUDDecoration = () => (
  <div className="fixed inset-y-0 left-0 w-2 z-[90] pointer-events-none hidden 2xl:flex flex-col items-center justify-center gap-12 opacity-20">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="w-px h-24 bg-gradient-to-b from-transparent via-studio to-transparent" />
    ))}
  </div>
);


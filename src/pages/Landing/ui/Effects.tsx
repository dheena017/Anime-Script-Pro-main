import { motion } from 'framer-motion';

export const SpeedLines = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-studio/20"
          style={{
            width: '1px',
            height: '150px',
            left: `${(i * 3.33) % 100}%`,
            top: '-20%',
          }}
          animate={{
            top: '120%',
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 0.3 + (i % 10) * 0.04,
            repeat: Infinity,
            delay: (i % 50) * 0.1,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export const DigitalScanline = () => (
  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-10">
    <motion.div
      className="w-full h-[2px] bg-studio shadow-[0_0_15px_rgba(6,182,212,0.8)]"
      animate={{ top: ['-5%', '105%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ position: 'absolute' }}
    />
  </div>
);

export const HUDDecoration = () => (
  <div className="fixed inset-y-0 left-0 w-2 z-[90] pointer-events-none hidden 2xl:flex flex-col items-center justify-center gap-12 opacity-20">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="w-px h-24 bg-gradient-to-b from-transparent via-studio to-transparent" />
    ))}
  </div>
);

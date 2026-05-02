import { motion } from 'framer-motion';

export function NeuralPulseLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary Neural Pulse */}
      <motion.div
        animate={{
          opacity: [0.02, 0.05, 0.02],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] blur-[40px]"
      />

      {/* Secondary Pulse (Fuchsia) */}
      <motion.div
        animate={{
          opacity: [0.01, 0.03, 0.01],
          scale: [1.05, 1, 1.05],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        className="absolute top-1/4 left-1/4 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_center,rgba(192,38,211,0.03)_0%,transparent_70%)] blur-[30px]"
      />

      {/* Scanning Line Effect - Slowed down significantly */}
      <motion.div
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent blur-[2px]"
      />
    </div>
  );
}




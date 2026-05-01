import { motion } from 'framer-motion';

export function NeuralPulseLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary Neural Pulse */}
      <motion.div
        animate={{
          opacity: [0.03, 0.08, 0.03],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] blur-[120px]"
      />

      {/* Secondary Pulse (Fuchsia) */}
      <motion.div
        animate={{
          opacity: [0.02, 0.05, 0.02],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/4 left-1/4 w-[100vw] h-[100vh] bg-[radial-gradient(circle_at_center,rgba(192,38,211,0.05)_0%,transparent_70%)] blur-[100px]"
      />

      {/* Scanning Line Effect */}
      <motion.div
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent blur-sm"
      />
    </div>
  );
}



import { motion } from 'framer-motion';

export default function Packet({ seq, isAcknowledging = false }) {
  const variants = {
    initial: {
      y: isAcknowledging ? 0 : -100,
      opacity: 0,
      scale: 0.5
    },
    animate: {
      y: isAcknowledging ? 100 : 0,
      opacity: 1,
      scale: 1
    },
    exit: {
      y: isAcknowledging ? -100 : 100,
      opacity: 0,
      scale: 0.5
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className="w-14 h-14 bg-yellow-500 border-2 border-yellow-400 flex items-center justify-center rounded-lg shadow-lg text-gray-900 font-bold"
    >
      {seq}
    </motion.div>
  );
}
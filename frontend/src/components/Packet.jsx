import { motion } from 'framer-motion';

export default function Packet({ seq }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-12 h-12 bg-yellow-200 border flex items-center justify-center rounded"
    >
      {seq}
    </motion.div>
  );
}

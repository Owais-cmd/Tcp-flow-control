import React from 'react';
import { motion } from 'framer-motion';

export default function ControlPanel({ onSend, onAck, onFree, disabled }) {
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="flex gap-4 mt-6">
      <motion.button
        variants={buttonVariants}
        whileHover={!disabled && "hover"}
        whileTap={!disabled && "tap"}
        className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
        onClick={onSend}
        disabled={disabled}
      >
        Send
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover={!disabled && "hover"}
        whileTap={!disabled && "tap"}
        className={`bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
        }`}
        onClick={onAck}
        disabled={disabled}
      >
        ACK
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover={!disabled && "hover"}
        whileTap={!disabled && "tap"}
        className={`bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
        }`}
        onClick={onFree}
        disabled={disabled}
      >
        Free Buffer
      </motion.button>
    </div>
  );
}
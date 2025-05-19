import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Packet from './Packet';

export default function ReceiverBuffer({ buffer }) {
  return (
    <div className="border-2 border-gray-700 rounded-xl p-6 mb-8 bg-gray-800">
      <h2 className="text-xl font-bold text-gray-100 mb-4">Receiver Buffer</h2>
      <div className="flex gap-3 mt-4 min-h-[4rem]">
        <AnimatePresence>
          {buffer.map((seq, idx) => (
            <motion.div
              key={`${seq}-${idx}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-14 h-14 flex items-center justify-center bg-green-500 border-2 border-green-400 rounded-lg font-bold text-white"
            >
              {seq}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
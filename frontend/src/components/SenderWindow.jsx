import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SenderWindow({ base, nextSeqNum, max ,msim}) {
  let windowPackets=[]
  if(msim!==null){
    windowPackets = Array.from({ length:  msim-base }, (_, i) => base + i + 1);
  }else{
    windowPackets = Array.from({ length:  max }, (_, i) => base + i + 1);
  }

  return (
    <div className="border-2 border-gray-700 rounded-xl p-6 mb-8 bg-gray-800">
      <h2 className="text-xl font-bold text-gray-100 mb-4">Sender Window</h2>
      <div className="flex gap-3 mt-4">
        <AnimatePresence>
          {windowPackets.map((seq) => (
            <motion.div
              key={seq}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`w-14 h-14 flex items-center justify-center border-2 rounded-lg font-bold ${
                seq < nextSeqNum 
                  ? 'bg-blue-500 border-blue-400 text-white' 
                  : 'bg-gray-700 border-gray-600 text-gray-300'
              }`}
            >
              {seq}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
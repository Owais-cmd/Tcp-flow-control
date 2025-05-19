import React from 'react';

export default function SenderWindow({ base, nextSeqNum, max }) {
  const windowPackets = Array.from({ length: max }, (_, i) => base + i+1);

  return (
    <div className="border p-4 mb-4">
      <h2 className="text-lg font-bold">Sender Window</h2>
      <div className="flex gap-2 mt-2">
        {windowPackets.map((seq) => (
          <div
            key={seq}
            className={`w-12 h-12 flex items-center justify-center border rounded ${seq < nextSeqNum ? 'bg-blue-300' : 'bg-white'}`}
          >
            {seq}
          </div>
        ))}
      </div>
    </div>
  );
}

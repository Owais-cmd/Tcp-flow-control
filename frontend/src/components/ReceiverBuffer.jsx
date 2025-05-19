import React from 'react';

export default function ReceiverBuffer({ buffer }) {
  return (
    <div className="border p-4 mb-4">
      <h2 className="text-lg font-bold">Receiver Buffer</h2>
      <div className="flex gap-2 mt-2">
        {buffer.map((seq, idx) => (
          <div
            key={idx}
            className="w-12 h-12 flex items-center justify-center bg-green-300 border rounded"
          >
            {seq}
          </div>
        ))}
      </div>
    </div>
  );
}

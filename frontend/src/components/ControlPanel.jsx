import React from 'react';

export default function ControlPanel({ onSend, onAck, onFree }) {
  return (
    <div className="flex gap-4 mt-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onSend}>Send</button>
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={onAck}>ACK</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onFree}>Free Buffer</button>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { getStatus, sendPacket, ackPacket, freeBuffer } from './api';
import SenderWindow from './components/SenderWindow';
import ReceiverBuffer from './components/ReceiverBuffer';
import ControlPanel from './components/ControlPanel';
import "./index.css";

export default function App() {
  const [max, setMax] = useState(4);
  const [status, setStatus] = useState(null);

  const refresh = async () => {
    const res = await getStatus(max);
    setStatus(res.data);
  };

  useEffect(() => {
    refresh();
  }, [max]);

  const handleSend = async () => {
    try {
      await sendPacket(max);
      refresh();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleAck = async () => {
    try {
      await ackPacket(max);
      refresh();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleFree = async () => {
    try {
      await freeBuffer(max);
      refresh();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  if (!status) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">TCP Sliding Window Simulator</h1>
      <div className="mb-4">
        <label className="mr-2">Window Size:</label>
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(parseInt(e.target.value))}
          className="border px-2 py-1"
        />
      </div>
      <SenderWindow base={status.oldestAck} nextSeqNum={status.nextSeqNum} max={max} />
      <ReceiverBuffer buffer={status.receiverBuffer} />
      <ControlPanel onSend={handleSend} onAck={handleAck} onFree={handleFree} />
    </div>
  );
}

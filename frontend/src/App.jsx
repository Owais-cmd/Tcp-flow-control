import React, { useEffect, useState } from 'react';
import { getStatus, sendPacket, ackPacket, freeBuffer } from './api';
import SenderWindow from './components/SenderWindow';
import ReceiverBuffer from './components/ReceiverBuffer';
import ControlPanel from './components/ControlPanel.jsx';
import { AnimatePresence } from 'framer-motion';
import Packet from './components/Packet';
import "./index.css";

export default function App() {
  const [max, setMax] = useState(4);
  const [status, setStatus] = useState(null);
  const [animatingPacket, setAnimatingPacket] = useState(null);
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  const refresh = async () => {
    const res = await getStatus(max);
    setStatus(res.data);
  };

  useEffect(() => {
    refresh();
  }, [max]);

  const handleSend = async () => {
    try {
      const currentSeq = status.nextSeqNum;
      setAnimatingPacket(currentSeq);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      await sendPacket(max);
      await refresh();
      
      setTimeout(() => setAnimatingPacket(null), 500);
    } catch (err) {
      setAnimatingPacket(null);
      alert(err.response?.data?.message || 'Error sending packet');
    }
  };

  const handleAck = async () => {
    try {
      if (status.receiverBuffer.length > 0) {
        const ackPacketNum = status.receiverBuffer[0];
        setIsAcknowledging(true);
        setAnimatingPacket(ackPacketNum);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        await ackPacket(max);
        await refresh();
        
        setTimeout(() => {
          setAnimatingPacket(null);
          setIsAcknowledging(false);
        }, 500);
      }
    } catch (err) {
      setAnimatingPacket(null);
      setIsAcknowledging(false);
      alert(err.response?.data?.message || 'Error acknowledging packet');
    }
  };

  const handleFree = async () => {
    try {
      await freeBuffer(max);
      await refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error freeing buffer');
    }
  };

  if (!status) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-100">TCP Sliding Window Simulator</h1>
        
        <div className="mb-6 bg-gray-800 p-4 rounded-lg">
          <label className="text-gray-300 mr-3">Window Size:</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(parseInt(e.target.value))}
            className="bg-gray-700 text-gray-100 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            min="1"
          />
        </div>

        <div className="space-y-8">
          <SenderWindow base={status.oldestAck} nextSeqNum={status.nextSeqNum} max={max} />
          <ReceiverBuffer buffer={status.receiverBuffer} />
          
          <AnimatePresence>
            {animatingPacket && (
              <div className="packet-animation" style={{
                left: isAcknowledging ? '75%' : '25%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                <Packet seq={animatingPacket} isAcknowledging={isAcknowledging} />
              </div>
            )}
          </AnimatePresence>
        </div>

        <ControlPanel 
          onSend={handleSend} 
          onAck={handleAck} 
          onFree={handleFree}
          disabled={animatingPacket !== null}
        />
      </div>
    </div>
  );
}
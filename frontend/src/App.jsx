import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SenderWindow from './components/SenderWindow';
import ReceiverBuffer from './components/ReceiverBuffer';
import Packet from './components/Packet';
import "./index.css";

export default function App() {
  const [windowSize, setWindowSize] = useState(4);
  const [message, setMessage] = useState('');
  const [packets, setPackets] = useState([]);
  const [base, setBase] = useState(0);
  const [nextSeqNum, setNextSeqNum] = useState(0);
  const [receiverBuffer, setReceiverBuffer] = useState([]);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [animatingPacket, setAnimatingPacket] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const createPackets = (msg) => {
    return msg.split('').map((char, index) => ({
      id: index,
      data: char,
      sent: false,
      acknowledged: false
    }));
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSend = async () => {
    if (!message || isProcessing) return;
    
    setIsProcessing(true);
    const newPackets = createPackets(message);
    setPackets(newPackets);
    setBase(0);
    setNextSeqNum(0);
    setReceiverBuffer([]);
    setReceivedMessage('');

    while (nextSeqNum < newPackets.length) {
      // Send packets within window
      while (nextSeqNum < Math.min(base + windowSize, newPackets.length)) {
        const packet = newPackets[nextSeqNum];
        setAnimatingPacket({ id: packet.id, data: packet.data });
        await sleep(500); // Animation time
        
        setReceiverBuffer(prev => [...prev, packet]);
        setNextSeqNum(prev => prev + 1);
        setAnimatingPacket(null);
        await sleep(200);
      }

      // Process acknowledgments
      while (base < nextSeqNum) {
        const packet = newPackets[base];
        setAnimatingPacket({ id: packet.id, data: packet.data, isAcknowledging: true });
        await sleep(500);
        
        setReceivedMessage(prev => prev + packet.data);
        setReceiverBuffer(prev => prev.slice(1));
        setBase(prev => prev + 1);
        setAnimatingPacket(null);
        await sleep(200);
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-100">TCP Message Simulator</h1>
        
        <div className="space-y-4 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to send"
              className="flex-1 bg-gray-700 text-gray-100 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              disabled={isProcessing}
            />
            <input
              type="number"
              value={windowSize}
              onChange={(e) => setWindowSize(parseInt(e.target.value))}
              className="w-24 bg-gray-700 text-gray-100 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              min="1"
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              disabled={isProcessing || !message}
              className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-colors ${
                isProcessing || !message ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              Send
            </button>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Received Message:</h2>
            <p className="text-gray-100 font-mono">{receivedMessage || 'Waiting for message...'}</p>
          </div>
        </div>

        <div className="space-y-8 relative">
          <SenderWindow base={base} nextSeqNum={nextSeqNum} max={windowSize} packets={packets} />
          <ReceiverBuffer buffer={receiverBuffer} />
          
          <AnimatePresence>
            {animatingPacket && (
              <div className="packet-animation" style={{
                position: 'absolute',
                left: animatingPacket.isAcknowledging ? '75%' : '25%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}>
                <Packet seq={animatingPacket.id} data={animatingPacket.data} isAcknowledging={animatingPacket.isAcknowledging} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
// src/MessageSimulator.jsx
import React, { useState } from 'react';
import Packet from './Packet'; // Assuming you already have this
import { useEffect } from 'react';
import ReceiverBuffer from './ReceiverBuffer'; // Optional
import SenderWindow from './SenderWindow'; // Optional
import { AnimatePresence } from 'framer-motion';
import { getStatus, sendPacket, ackPacket } from '../api';
import '../index.css';

export default function MessageSimulator() {
    const [status, setStatus] = useState(null);
    const [animatingPacket, setAnimatingPacket] = useState(null);
    const [isAcknowledging, setIsAcknowledging] = useState(false);
    const [message,setMessage]= useState("");
    const [receivedMessage,setRecievedMessage] = useState("");
    const [msim,setmsim]=useState(4);
    const [windowSize,setWindowSize]=useState(4);
  
    const refresh = async () => {
      const res = await getStatus(msim);
      setStatus(res.data);
      
      return res.data;
    };

     useEffect(() => {
        refresh();
      }, [msim]);
  
    
  

    const spiltMessage=async()=>{
      const messageMap = new Map();
      const packetSize = 3;
    for (let i = 0; i < message.length; i += packetSize) {
       const packetNumber = i / packetSize;
  const packet = message.slice(i, i + packetSize);
  messageMap.set(packetNumber, packet);
}
      return messageMap;

    }
    

    const handleSendMessage = async () => {
      const messageMap = await spiltMessage();
      setmsim(messageMap.size);
      const totalPackets = messageMap.size;

      let base = 0;
      //let windowSize=6;
      let received = '';
      const sentPackets = new Set();

      while (base < totalPackets) {
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
    // SEND phase: try to send as many packets as allowed in the window
        let random=Math.random()*(windowSize)+base
        console.log(random)
        
      for (let i = base; i < random && i < totalPackets; i++) {
         if (!sentPackets.has(i)) {
           setAnimatingPacket(i + 1); // +1 for display
           await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
           await sendPacket(totalPackets);
           sentPackets.add(i);
           setAnimatingPacket(null);
          }
      }
      if(random>totalPackets){
        for (let i = base;  i < totalPackets; i++) {
         if (!sentPackets.has(i)) {
           setAnimatingPacket(i + 1); // +1 for display
           await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
           await sendPacket(totalPackets);
           sentPackets.add(i);
           setAnimatingPacket(null);
          }
        }
      }

    // Refresh status again to get latest receiver buffer
      const newStatus = await refresh();
       // returns the fresh status
      const updatedBuffer = newStatus?.receiverBuffer;
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
      const ackPacketNum = updatedBuffer && updatedBuffer.length > 0 ? updatedBuffer[0] : null;

      if (ackPacketNum !== null) {
      setIsAcknowledging(true);
      setAnimatingPacket(ackPacketNum);

      await new Promise(resolve => setTimeout(resolve, 500));
      await ackPacket(msim);

      const postAckStatus = await refresh(); // get updated buffer again

      const ackedPacket = messageMap.get(ackPacketNum-1);
      if (ackedPacket) {
          received += ackedPacket;
          setRecievedMessage(received);
      }
      base=base+1;
      setAnimatingPacket(null);
      setIsAcknowledging(false);
     }


    // Delay before next loop
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};



    
    
  
    if (!status) return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Message Sliding Window Simulator</h1>

        <div className="mb-6 bg-gray-800 p-4 rounded-lg">

          <label className="mr-2">Window Size:</label>
          <input
            type="text"
            value={windowSize}
            onChange={(e) => setWindowSize(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded w-64"
          />
          

          

          <label className="mr-2">Message:</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded w-64"
          />

          <button
            onClick={handleSendMessage}
            className="ml-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Send Message
          </button>
        </div>

        <div className="mb-6">
          <SenderWindow base={status.oldestAck} nextSeqNum={status.nextSeqNum} max={null} msim={msim}/>
          <ReceiverBuffer buffer={status.receiverBuffer} />
        </div>

        <div className="mb-6">
          <label className="text-gray-300 mr-2">Received Message:</label>
          <input
            type="text"
            value={receivedMessage}
            readOnly
            className="bg-gray-700 text-white p-2 rounded w-96"
          />
        </div>


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
    </div>
  );
}

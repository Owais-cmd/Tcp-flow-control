import axios from 'axios';
const BASE = 'http://localhost:3000/api';

export const getStatus = (max) => axios.get(`api/status/${max}`);
export const sendPacket = (max) => axios.post(`api/send/${max}`);
export const ackPacket = (max) => axios.post(`api/ack/${max}`);
export const freeBuffer = (max) => axios.post(`api/free-buffer/${max}`);

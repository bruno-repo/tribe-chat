import axios from 'axios';
import type { Message, Participant } from '../store/ChatStore';

const API_BASE = 'https://dummy-chat-server.tribechat.com/api';

export const fetchInfo = async () => {
  const res = await axios.get(`${API_BASE}/info`);
  return res.data;
};

export const fetchLatestMessages = async (): Promise<Message[]> => {
  const res = await axios.get(`${API_BASE}/messages/latest`);
  console.log(res.data);
  return res.data;
};

export const fetchAllMessages = async (): Promise<Message[]> => {
  const res = await axios.get(`${API_BASE}/messages/all`);
  return res.data;
};

export const fetchOlderMessages = async (refUuid: string): Promise<Message[]> => {
  const res = await axios.get(`${API_BASE}/messages/older/${refUuid}`);
  return res.data;
};

export const fetchMessageUpdates = async (time: number): Promise<Message[]> => {
  const res = await axios.get(`${API_BASE}/messages/updates/${time}`);
  return res.data;
};

export const sendMessage = async (text: string): Promise<Message> => {
  const res = await axios.post(`${API_BASE}/messages/new`, { text });
  return res.data;
};

export const fetchParticipants = async (): Promise<Participant[]> => {
  const res = await axios.get(`${API_BASE}/participants/all`);
  return res.data;
};

export const fetchParticipantUpdates = async (time: number): Promise<Participant[]> => {
  const res = await axios.get(`${API_BASE}/participants/updates/${time}`);
  return res.data;
};
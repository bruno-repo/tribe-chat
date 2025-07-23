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

// export const fetchOlderMessages = async (refUuid: string): Promise<Message[]> => {
//   const res = await axios.get(`${API_BASE}/messages/older/${refUuid}`);
//   return res.data;
// };

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

// Simulated delay helper (for demo)
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock API call to fetch older messages before a certain timestamp.
 * @param beforeTimestamp Timestamp to fetch messages before.
 * @param limit Number of messages to fetch.
 * @returns Promise resolving to an array of Message objects.
 */
export async function fetchOlderMessages(
  beforeTimestamp: number,
  limit = 20
): Promise<Message[]> {
  // Simulate network delay
  await delay(500);

  // TODO: Replace this with your real API fetching logic

  // Example mock data: generate `limit` messages with older timestamps
  const olderMessages: Message[] = Array.from({ length: limit }).map((_, i) => {
    const sentAt = beforeTimestamp - (i + 1) * 60000; // 1 min apart
    return {
      uuid: `mock-uuid-${sentAt}`,
      text: `Older message from ${new Date(sentAt).toLocaleTimeString()}`,
      authorUuid: 'participant-1',
      sentAt,
      updatedAt: sentAt,
      replyToMessageUuid: undefined,
      attachments: [],
      reactions: [],
    };
  });

  return olderMessages;
}

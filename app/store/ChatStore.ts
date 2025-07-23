import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import ParticipantSheet from '../components/ParticipantSheet';

export interface Message {
  uuid: string;
  text: string;
  authorUuid: string;
  sentAt: number;
  updatedAt?: number;
  replyToMessageUuid?: string;
  attachments: Attachment[];
  reactions: Reaction[];
}

export type Attachment = {
  uuid: string;
  type: "image";
  url: string;
  width: number;
  height: number;
};

export type Reaction = {
  uuid: string;
  participantUuid: string;
  value: string;
};

export interface Participant {
  uuid: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  jobTitle?: string;
  createdAt: number;
  updatedAt: number;
}

export interface MessageGroupData {
  authorUuid: string;
  messages: Message[];
  firstSentAt: number;
}



interface ChatStore {
  // Persisted
  messages: Message[];
  participants: Participant[];
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
  setParticipants: (p: Participant[]) => void;
  getParticipant: (uuid: string) => Participant | undefined;
  clearMessages: () => void;
  clearParticipants: () => void;
  sendMessage: (text: string, replyToMessageUuid?: string) => void;
  

  // UI state (not persisted)
  replyToMessage: Message | null;
  setReplyToMessage: (msg: Message | null) => void;

  reactionSheetMessage: Message | null;
  setReactionSheetMessage: (msg: Message | null) => void;

  participantSheetOpen: boolean;
  setParticipantSheetOpen: (open: boolean) => void;

  imageModalUrl: string | null;
  setImageModalUrl: (url: string | null) => void;
  reactionListMessage?: Message;
  setReactionListMessage: (m?: Message) => void;
  participantSheetUser: Participant | null;
  setParticipantSheetUser: (user: Participant | null) => void;


  
}

type MyPersistOptions = PersistOptions<ChatStore, Partial<ChatStore>>;

function generateUUID() {
  // Simple UUID generator (replace with a proper library if preferred)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getCurrentUserUuid() {
  // Example stub, replace with your auth/user logic
  return 'e1c849b7-5b3b-4e2d-a39a-8726d3f943bb';
}


export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Persisted state
      messages: [],
      participants: [],
      setMessages: (msgs) => set({ messages: msgs }),
      addMessage: (msg) => set({ messages: [msg, ...get().messages] }),
      addOlderMessages: (olderMsgs: Message[]) => set((state) => ({
        // Append older messages at the end (since messages are reversed)
        messages: [...state.messages, ...olderMsgs.reverse()],
      })),
      setParticipants: (p) => set({ participants: p }),
      getParticipant: (uuid) => get().participants.find((p) => p.uuid === uuid),
      clearMessages: () => set({ messages: [] }),
      clearParticipants: () => set({ participants: [] }),
 
      // UI state (not persisted)
      replyToMessage: null,
      setReplyToMessage: (msg) => set({ replyToMessage: msg }),

      reactionSheetMessage: null,
      setReactionSheetMessage: (msg) => set({ reactionSheetMessage: msg }),

      participantSheetOpen: false,
      setParticipantSheetOpen: (open) => set({ participantSheetOpen: open }),

      imageModalUrl: null,
      setImageModalUrl: (url) => set({ imageModalUrl: url }),
      reactionListMessage: undefined,
      setReactionListMessage: (m) => set({ reactionListMessage: m }),

      participantSheetUser: null,
      setParticipantSheetUser: (user) => set({ participantSheetUser: user }),

      sendMessage: (text, replyToMessageUuid) => {
        const newMsg: Message = {
          uuid: generateUUID(),
          text,
          authorUuid: getCurrentUserUuid(),
          sentAt: Date.now(),
          updatedAt: Date.now(),
          replyToMessageUuid: replyToMessageUuid || undefined,
          attachments: [],
          reactions: []
        };
        set({ messages: [newMsg, ...get().messages] });
      }
    }),
    {
      name: 'chat-storage',
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
      partialize: (state) => ({
        messages: state.messages,
        participants: state.participants,
      }),
      
    } as MyPersistOptions
  )
);

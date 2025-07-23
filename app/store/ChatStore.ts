import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

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

  // UI state (not persisted)
  replyToMessage: Message | null;
  setReplyToMessage: (msg: Message | null) => void;

  reactionSheetMessage: Message | null;
  setReactionSheetMessage: (msg: Message | null) => void;

  participantSheetOpen: boolean;
  setParticipantSheetOpen: (open: boolean) => void;

  imageModalUrl: string | null;
  setImageModalUrl: (url: string | null) => void;
}

type MyPersistOptions = PersistOptions<ChatStore, Partial<ChatStore>>;

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Persisted state
      messages: [],
      participants: [],
      setMessages: (msgs) => set({ messages: msgs }),
      addMessage: (msg) => set({ messages: [msg, ...get().messages] }),
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

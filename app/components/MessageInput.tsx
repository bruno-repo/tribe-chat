import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useChatStore, Participant, Message } from '../store/ChatStore';
import { v4 as uuidv4 } from 'uuid';

export default function MessageInput() {
  const [text, setText] = useState('');
  const [mentionActive, setMentionActive] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);

  const participants = useChatStore((s) => s.participants);
  const addMessage = useChatStore((s) => s.addMessage);
  const replyToMessage = useChatStore((s) => s.replyToMessage);
  const setReplyToMessage = useChatStore((s) => s.setReplyToMessage);

  useEffect(() => {
    const mentionMatch = text.match(/@([\w]*)$/);
    if (mentionMatch) {
      setMentionActive(true);
      setMentionQuery(mentionMatch[1]);
    } else {
      setMentionActive(false);
      setMentionQuery('');
    }
  }, [text]);

  useEffect(() => {
    if (mentionActive) {
      const filtered = participants.filter((p) =>
        p.name.toLowerCase().startsWith(mentionQuery.toLowerCase())
      );
      setFilteredParticipants(filtered);
    } else {
      setFilteredParticipants([]);
    }
  }, [mentionActive, mentionQuery, participants]);

  function onSelectMention(participant: Participant) {
    const newText = text.replace(/@[\w]*$/, `@${participant.name} `);
    setText(newText);
    setMentionActive(false);
    setMentionQuery('');
  }

  function onSend() {
    if (text.trim().length === 0) return;

    const newMessage: Message = {
      uuid: uuidv4(),
      text: text.trim(),
      authorUuid: 'e1c849b7-5b3b-4e2d-a39a-8726d3f943bb', // replace with your current user ID logic
      sentAt: Date.now(),
      updatedAt: undefined,
      replyToMessageUuid: replyToMessage?.uuid || undefined,
      attachments: [],
      reactions: [],
    };

    addMessage(newMessage);
    setText('');
    setMentionActive(false);
    setMentionQuery('');
    if (replyToMessage) setReplyToMessage(null);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
      style={styles.container}
    >
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        multiline
      />

      {mentionActive && filteredParticipants.length > 0 && (
        <View style={styles.autocomplete}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={filteredParticipants}
            keyExtractor={(item) => item.uuid}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onSelectMention(item)}
                style={styles.autocompleteItem}
              >
                <Text>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      )}

      <Pressable onPress={onSend} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Send</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    textAlignVertical: 'top',
  },
  autocomplete: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
    maxHeight: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    zIndex: 1000,
  },
  autocompleteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sendButton: {
    marginTop: 6,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

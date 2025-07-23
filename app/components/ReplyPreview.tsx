import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useChatStore } from '../store/ChatStore';

export default function ReplyPreview() {
  const replyTo = useChatStore((s) => s.replyToMessage);
  const clearReply = useChatStore((s) => s.setReplyToMessage);
  const getParticipant = useChatStore((s) => s.getParticipant);

  if (!replyTo) return null;

  const author = getParticipant(replyTo.authorUuid);
  const authorName = author?.name || 'Unknown';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.replyBar} />
        <View style={styles.textContainer}>
          <Text style={styles.author}>{authorName}</Text>
          <Text numberOfLines={1} style={styles.messageText}>
            {replyTo.text?.trim() || replyTo.attachments.length > 0
              ? replyTo.text?.trim() || 'Media message'
              : 'Empty message'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => clearReply(null)} style={styles.closeButton}>
          <Feather name="x" size={18} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyBar: {
    width: 3,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 1.5,
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  author: {
    fontWeight: '600',
    fontSize: 13,
    color: '#007AFF',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  closeButton: {
    padding: 6,
  },
});
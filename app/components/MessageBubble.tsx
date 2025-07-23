import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useChatStore, Message } from '../store/ChatStore';

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const getParticipant = useChatStore((s) => s.getParticipant);
  const setReplyToMessage = useChatStore((s) => s.setReplyToMessage);
  const setReactionSheetMessage = useChatStore((s) => s.setReactionSheetMessage);
  const setImageModalUrl = useChatStore((s) => s.setImageModalUrl);
  const participant = getParticipant(message.authorUuid);

  const image = message.attachments.find((a) => a.type === 'image');
  const time = new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const reactionMap = message.reactions.reduce((acc, r) => {
    acc[r.value] = (acc[r.value] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <TouchableOpacity onLongPress={() => setReplyToMessage(message)}>
      <View style={styles.container}>
        <View style={styles.header}>
          {participant?.avatarUrl ? (
            <Image source={{ uri: participant.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{participant?.name?.[0]}</Text>
            </View>
          )}
          <Text style={styles.name}>{participant?.name || 'Unknown'}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>

        {message.replyToMessageUuid && (
          <View style={styles.replyPreview}>
            <Text style={styles.replyText}>Replying to a message...</Text>
          </View>
        )}

        <Text style={styles.text}>{message.text}</Text>

        {image && (
          <TouchableOpacity
            onPress={() => setImageModalUrl(image.url)}
            style={styles.imageContainer}
          >
            <Image
              source={{ uri: image.url }}
              style={[styles.image, { aspectRatio: image.width / image.height }]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {message.updatedAt && message.updatedAt !== message.sentAt && (
          <Text style={styles.edited}>(edited)</Text>
        )}

        {Object.keys(reactionMap).length > 0 && (
          <TouchableOpacity onPress={() => setReactionSheetMessage(message)} style={styles.reactionBar}>
            {Object.entries(reactionMap).map(([emoji, count]) => (
              <View key={emoji} style={styles.reaction}>
                <Text style={styles.reactionText}>{emoji} {count}</Text>
              </View>
            ))}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 12,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarInitial: {
    fontWeight: '600',
    color: '#333',
  },
  name: {
    fontWeight: 'bold',
    marginRight: 6,
    fontSize: 13,
  },
  time: {
    fontSize: 11,
    color: '#666',
  },
  text: {
    fontSize: 15,
    color: '#111',
  },
  edited: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  replyPreview: {
    backgroundColor: '#e8e8e8',
    padding: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    marginBottom: 6,
  },
  replyText: {
    fontSize: 13,
    color: '#555',
  },
  imageContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: undefined,
  },
  reactionBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  reaction: {
    backgroundColor: '#eee',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginRight: 6,
    marginTop: 4,
  },
  reactionText: {
    fontSize: 13,
  },
});

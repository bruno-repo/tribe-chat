import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Message, useChatStore } from '../store/ChatStore';
import { groupReactionsByEmoji } from '../utils/reactionUtils';


interface Props {
  group: {
    authorUuid: string;
    messages: Message[];
    firstSentAt: number;
  };
}

export default function MessageGroup({ group }: Props) {
  const getParticipant = useChatStore((s) => s.getParticipant);
  const setReplyToMessage = useChatStore((s) => s.setReplyToMessage);
  const setReactionSheetMessage = useChatStore((s) => s.setReactionSheetMessage);
  const setImageModalUrl = useChatStore((s) => s.setImageModalUrl);
  const allMessages = useChatStore((s) => s.messages);

  const participant = getParticipant(group.authorUuid);

  if (!participant) return null;

  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <View style={styles.container}>
      {/* Header with avatar, name, and time */}
      <View style={styles.header}>
        {participant.avatarUrl ? (
          <Image source={{ uri: participant.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text>{participant.name[0]}</Text>
          </View>
        )}
        <View>
          <Text style={styles.name}>{participant.name}</Text>
          <Text style={styles.time}>{formatTime(group.firstSentAt)}</Text>
        </View>
      </View>

      {/* Messages */}
      {group.messages.map((msg) => {
        // Find the actual replyToMessage from all messages by UUID
        const replyToMessage = msg.replyToMessageUuid
          ? allMessages.find((m) => m.uuid === msg.replyToMessageUuid)
          : undefined;

        return (
          <Pressable
            key={msg.uuid}
            onLongPress={() => setReplyToMessage(msg)}
            onPress={() => setReactionSheetMessage(msg)}
            style={styles.messageContainer}
          >
            {/* Reply preview */}
            {replyToMessage && (
              <View style={styles.replyPreview}>
                <Text style={styles.replyName}>
                  {getParticipant(replyToMessage.authorUuid)?.name || 'Unknown'}
                </Text>
                <Text style={styles.replyText} numberOfLines={1}>
                  {replyToMessage.text}
                </Text>
              </View>
            )}

            {/* Text */}
            {msg.text ? (
              <Text style={styles.messageText}>
                {msg.text}{' '}
                {msg.updatedAt !== undefined && msg.updatedAt !== msg.sentAt && (
                  <Text style={styles.edited}>(edited)</Text>
                )}
              </Text>
            ) : null}

            {/* Image attachments */}
            {msg.attachments.map((att) => (
              <Pressable key={att.uuid} onPress={() => setImageModalUrl(att.url)}>
                <Image source={{ uri: att.url }} style={styles.messageImage} />
              </Pressable>
            ))}

            {/* Reactions */}
            {msg.reactions.length > 0 && (
              <View style={styles.reactionsRow}>
                {Object.entries(groupReactionsByEmoji(msg.reactions)).map(([emoji, reactions]) => (
                  <View key={emoji} style={styles.reaction}>
                    <Text>
                      {emoji} {reactions.length}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { marginVertical: 8, paddingHorizontal: 12 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { fontWeight: '700', fontSize: 14 },
  time: { fontSize: 12, color: '#666' },
  messageContainer: { marginBottom: 8, paddingLeft: 44 },
  messageText: { fontSize: 15, lineHeight: 20, color: '#222' },
  edited: { fontSize: 12, color: '#888' },
  replyPreview: {
    borderLeftWidth: 2,
    borderLeftColor: '#999',
    paddingLeft: 8,
    marginBottom: 4,
  },
  replyName: { fontSize: 13, fontWeight: '500', color: '#555' },
  replyText: { fontSize: 13, color: '#888' },
  messageImage: { width: 200, height: 140, marginTop: 6, borderRadius: 8 },
  reactionsRow: { flexDirection: 'row', marginTop: 4 },
  reaction: {
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
});

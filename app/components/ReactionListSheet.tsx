import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import BottomSheet from './BottomSheet';
import { useChatStore } from '../store/ChatStore';
import { groupReactionsByEmoji } from '../utils/reactionUtils';

export default function ReactionListSheet() {
  const message = useChatStore((s) => s.reactionListMessage);
  const setReactionListMessage = useChatStore((s) => s.setReactionListMessage);
  const getParticipant = useChatStore((s) => s.getParticipant);
  const setParticipantSheetUser = useChatStore((s) => s.setParticipantSheetUser);

  if (!message) return null;

  const grouped = groupReactionsByEmoji(message.reactions);

  return (
    <BottomSheet onClose={() => setReactionListMessage(undefined)}>
      <Text style={styles.title}>Reactions</Text>

      {Object.entries(grouped).map(([emoji, reactions]) => (
        <View key={emoji} style={styles.emojiBlock}>
          <Text style={styles.emoji}>{emoji}</Text>
          {reactions.map((r) => {
            const participant = getParticipant(r.participantUuid);
            if (!participant) return null;

            return (
              <Pressable
                key={r.participantUuid}
                onPress={() => setParticipantSheetUser(participant)}
                style={styles.row}
              >
                {participant.avatarUrl ? (
                  <Image source={{ uri: participant.avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.initial}>{participant.name[0]}</Text>
                  </View>
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.name}>{participant.name}</Text>
                  {participant.jobTitle ? (
                    <Text style={styles.jobTitle}>{participant.jobTitle}</Text>
                  ) : null}
                  {participant.bio ? (
                    <Text style={styles.bio} numberOfLines={2}>{participant.bio}</Text>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  emojiBlock: { marginBottom: 20 },
  emoji: { fontSize: 20, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14, marginRight: 10 },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initial: { fontSize: 14, fontWeight: '600' },
  name: { fontSize: 15 },
  textContainer: { flex: 1 },
  jobTitle: { fontSize: 13, color: '#666' },
  bio: { fontSize: 12, color: '#888', marginTop: 2 },
});

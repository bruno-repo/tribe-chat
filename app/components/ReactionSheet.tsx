import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useChatStore } from '../store/ChatStore';

// Utility to group reactions by emoji and count them
function groupReactionsByEmoji(reactions: { value: string }[]) {
  return reactions.reduce<Record<string, number>>((acc, reaction) => {
    acc[reaction.value] = (acc[reaction.value] || 0) + 1;
    return acc;
  }, {});
}

export default function ReactionSheet() {
  const reactionSheet = useChatStore((s) => s.reactionSheetMessage);
  const closeSheet = () => useChatStore.getState().setReactionSheetMessage(null);

  if (!reactionSheet || !reactionSheet.reactions.length) return null;

  const groupedReactions = groupReactionsByEmoji(reactionSheet.reactions);

  return (
    <Modal transparent animationType="slide" visible={!!reactionSheet} onRequestClose={closeSheet}>
      <TouchableOpacity style={styles.backdrop} onPress={closeSheet} activeOpacity={1} />
      <View style={styles.sheet}>
        <Text style={styles.title}>Reactions</Text>
        <FlatList
          data={Object.entries(groupedReactions)}
          keyExtractor={([emoji]) => emoji}
          renderItem={({ item: [emoji, count] }) => (
            <View style={styles.row}>
              <Text style={styles.emoji}>{emoji}</Text>
              <Text style={styles.count}>{count}</Text>
            </View>
          )}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#00000088',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  count: {
    fontSize: 16,
  },
});
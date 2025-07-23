import React from 'react';
import { View, Text, FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useChatStore } from '../store/ChatStore';

export default function ParticipantSheet() {
  const participantsOpen = useChatStore((s) => s.participantSheetOpen);
  const closeSheet = () => useChatStore.getState().setParticipantSheetOpen(false);
  const participants = useChatStore((s) => s.participants);

  if (!participantsOpen) return null;

  return (
    <Modal transparent animationType="slide" visible={participantsOpen}>
      <TouchableOpacity style={styles.backdrop} onPress={closeSheet} />
      <View style={styles.sheet}>
        <Text style={styles.title}>Participants</Text>
        <FlatList
          data={participants}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
            </View>
          )}
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
    paddingVertical: 10,
  },
  name: {
    fontSize: 16,
  },
});

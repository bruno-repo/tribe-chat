import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import BottomSheet from './BottomSheet';
import { useChatStore } from '../store/ChatStore';

export default function ParticipantSheet() {
  const user = useChatStore((s) => s.participantSheetUser);
  const setUser = useChatStore((s) => s.setParticipantSheetUser);

  if (!user) return null;

  return (
    <BottomSheet onClose={() => setUser(null)}>
      <View style={styles.container}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initial}>{user.name[0]}</Text>
          </View>
        )}
        <Text style={styles.name}>{user.name}</Text>
        {user.jobTitle ? (
          <Text style={styles.jobTitle}>{user.jobTitle}</Text>
        ) : null}
        {user.bio ? (
          <Text style={styles.bio} numberOfLines={2}>{user.bio}</Text>
        ) : null}
        {/* Add more user details here if you have */}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  initial: {
    fontSize: 32,
    fontWeight: '700',
    color: '#555',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
  },
    jobTitle: { fontSize: 16, color: '#666', marginBottom: 6 },
  bio: { fontSize: 14, color: '#888', textAlign: 'center' },
});

import React from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useChatStore } from '../store/ChatStore';

export default function MessageImageModal() {
  const imageUrl = useChatStore((s) => s.imageModalUrl);
  const close = () => useChatStore.getState().setImageModalUrl(null);

  if (!imageUrl) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop}>
        {/* TouchableOpacity only around backdrop to close modal */}
        <TouchableOpacity style={styles.backdropTouchable} onPress={close} activeOpacity={1} />
        {/* Image not wrapped in TouchableOpacity to prevent closing when tapping on image */}
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },
});
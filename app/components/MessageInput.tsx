import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { sendMessage } from '../api/chatApi';
import { useChatStore } from '../store/ChatStore';

export default function MessageInput() {
  const [input, setInput] = useState('');
  const addMessage = useChatStore((s) => s.addMessage);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = await sendMessage(input.trim());
    addMessage(newMsg);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={input}
        onChangeText={setInput}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 16, paddingHorizontal: 12 },
  button: { marginLeft: 8, backgroundColor: '#007AFF', padding: 12, borderRadius: 16 },
  buttonText: { color: '#fff' },
});

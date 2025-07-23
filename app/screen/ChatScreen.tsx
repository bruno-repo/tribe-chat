import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { fetchLatestMessages, fetchParticipants } from '../api/chatApi';
import MessageGroup from '../components/MessageGroup';
import MessageImageModal from '../components/MessageImageModal';
import MessageInput from '../components/MessageInput';
import ParticipantSheet from '../components/ParticipantSheet';
import ReactionSheet from '../components/ReactionSheet';
import ReplyPreview from '../components/ReplyPreview';
import { Message, useChatStore } from '../store/ChatStore';



function groupMessages(messages: Message[]) {
  const groups = [];
  let currentGroup = null;

  for (const msg of messages) {
    if (!currentGroup || currentGroup.authorUuid !== msg.authorUuid) {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = {
        authorUuid: msg.authorUuid,
        messages: [msg],
        firstSentAt: msg.sentAt,
      };
    } else {
      currentGroup.messages.push(msg);
    }
  }
  if (currentGroup) groups.push(currentGroup);

  return groups;
}

export default function ChatScreen() {
  const { messages, setMessages, setParticipants } = useChatStore();

  useEffect(() => {
    const load = async () => {
      const [msgs, participants] = await Promise.all([
        fetchLatestMessages(),
        fetchParticipants(),
      ]);
      setMessages(msgs.reverse());
      setParticipants(participants);
    };
    load();
  }, [setMessages, setParticipants]);

  const groupedMessages = groupMessages(messages);

  return (
    <View style={styles.container}>
      <ReplyPreview />

      <FlatList
        data={groupedMessages}
        keyExtractor={(item, index) => item.authorUuid + '_' + item.firstSentAt}
        renderItem={({ item }) => <MessageGroup group={item} />}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      />

      <MessageInput />

      <ReactionSheet />
      <ParticipantSheet />
      <MessageImageModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

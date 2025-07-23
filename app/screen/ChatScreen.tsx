import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { fetchLatestMessages, fetchParticipants,fetchOlderMessages } from '../api/chatApi';
import MessageGroup from '../components/MessageGroup';
import MessageImageModal from '../components/MessageImageModal';
import MessageInput from '../components/MessageInput';
import ParticipantSheet from '../components/ParticipantSheet';
import ReactionSheet from '../components/ReactionSheet';
import ReplyPreview from '../components/ReplyPreview';
import ReactionListSheet from '../components/ReactionListSheet';
import { Message, useChatStore } from '../store/ChatStore';
import { formatDate, shouldInsertDateSeparator } from '../utils/dateSeperator';
import { ActivityIndicator } from 'react-native';


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
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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

 const loadOlderMessages = useCallback(async () => {
    if (loadingOlder || !hasMore) return;

    setLoadingOlder(true);

    const oldestMessage = messages[messages.length - 1];
    if (!oldestMessage) {
      setLoadingOlder(false);
      return;
    }

    // Pass sentAt as number or ISO string depending on your API
    // Here assuming number (timestamp in ms)
    const olderMsgs = await fetchOlderMessages(oldestMessage.sentAt);

    if (olderMsgs.length === 0) {
      setHasMore(false);
    } else {
      const currentMessages = useChatStore.getState().messages;
      useChatStore.getState().setMessages([
        ...currentMessages,
        ...olderMsgs.reverse(),
      ]);
    }

    setLoadingOlder(false);
  }, [loadingOlder, hasMore, messages, setMessages]);

  const groupedMessages = groupMessages(messages);

  return (
    <View style={styles.container}>
      <ReplyPreview />

      <FlatList
        data={groupedMessages}
        keyExtractor={(item, index) => item.authorUuid + '_' + item.firstSentAt}
        renderItem={({ item, index }) => {
          const prevGroup = groupedMessages[index + 1]; // because FlatList is inverted
          const showDate = shouldInsertDateSeparator(
            item.firstSentAt,
            prevGroup?.firstSentAt
          );

          return (
            <>
             <React.Fragment key={`${item.authorUuid}_${item.firstSentAt}`}>
              {showDate && (
                <View style={styles.dateSeparatorContainer}>
                  <Text style = {styles.dateSeparatorText}>
                    {formatDate(item.firstSentAt)}
                  </Text>
                </View>
              )}
              <MessageGroup group={item} />
             </React.Fragment>
            </>
          );
        }}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        onEndReached={loadOlderMessages}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
        loadingOlder ? (
          <View style={styles.loadingOlderContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        ) : null
      }
      />

      <ReactionListSheet />
      <ReactionSheet />
      <ParticipantSheet />
      <MessageImageModal />
      <MessageInput />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  dateSeparatorContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateSeparatorText: {
    fontSize: 13,
    color: '#999',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingOlderContainer: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

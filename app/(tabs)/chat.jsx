import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const route = useRoute();

  const storageKey = `@chat_messages_${route.params.email}`;

  useEffect(() => {
    console.log(route.params.email);

    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(storageKey);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };

    loadMessages();

    const socketConnection = io('http://192.168.1.5:3000');
    setSocket(socketConnection);

    socketConnection.on('receiveMessage', (message) => {
      console.log('Mensagem recebida:', message);
      setMessages((previousMessages) => {
        const updatedMessages = GiftedChat.append(previousMessages, message);
        saveMessages(updatedMessages);
        return updatedMessages;
      });
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const saveMessages = async (messages) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error('Erro ao salvar mensagens:', error);
    }
  };

  const onSend = (newMessages = []) => {
    if (socket) {
      const messageWithId = { ...newMessages[0], _id: newMessages[0]._id || uuid.v4() };
      socket.emit('sendMessage', messageWithId);
      saveMessages(messageWithId);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: route.params.email,
          name: 'User',
        }}
      />
    </View>
  );
};

export default ChatScreen;

import React, { useState, useEffect} from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client';
import { useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const route = useRoute();
  useEffect(() => {
    console.log(route.params.email);
    
    const socketConnection = io('http://192.168.1.5:3000'); 

    setSocket(socketConnection);

    socketConnection.on('receiveMessage', (message) => {
      console.log('Mensagem recebida:', message);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, message)
      );
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const onSend = (newMessages = []) => {
    if (socket) {
      const messageWithId = { ...newMessages[0], _id: newMessages[0]._id || uuid.v4() };
      
      socket.emit('sendMessage', messageWithId);
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

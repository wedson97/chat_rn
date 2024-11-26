import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Conectar ao servidor Socket.IO
    const socketConnection = io('http://192.168.1.5:3000'); // Substitua localhost pelo IP se for um dispositivo físico

    setSocket(socketConnection);

    // Ouvir mensagens recebidas do servidor
    socketConnection.on('receiveMessage', (message) => {
      console.log('Mensagem recebida:', message);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, message)
      );
    });

    return () => {
      // Limpar a conexão quando o componente for desmontado
      socketConnection.disconnect();
    };
  }, []);

  const onSend = (newMessages = []) => {
    if (socket) {
      // Adiciona um UUID à nova mensagem para garantir um identificador único
      const messageWithId = { ...newMessages[0], _id: newMessages[0]._id || uuid.v4() };
      
      // Envia a mensagem para o servidor
      socket.emit('sendMessage', messageWithId);
  
      // setMessages((previousMessages) =>
      //   GiftedChat.append(previousMessages, messageWithId)
      // );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1, // ID do usuário, você pode modificar conforme necessário
          name: 'User',
        }}
      />
    </View>
  );
};

export default ChatScreen;

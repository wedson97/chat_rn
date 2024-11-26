import { useState } from 'react';
import { StyleSheet, Button} from 'react-native';
import { View } from 'react-native-web';
import { Input } from 'react-native-elements';
import { router } from 'expo-router';

export default function login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  return (
    <View style={styles.container}>
            <Input
                placeholder='Enter your email'
                label='Email'
                leftIcon={{ type: 'material', name: 'email' }}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                placeholder='Enter your password'
                label='Password'
                leftIcon={{ type: 'material', name: 'lock' }}
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Button title='sign in' style={styles.button}onPress={() => router.push({
                                                                                    pathname: '/chat',
                                                                                    params: { email: email}
                                                                                    })}/>
            <Button title='register' style={styles.button} />
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        marginTop: 100,
    },
    button: {
        width: 370,
        marginTop: 10
    }
});
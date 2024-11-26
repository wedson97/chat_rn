from flask import Flask
from flask_socketio import SocketIO, emit
import uuid

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Permite todas as origens. Substitua "*" por uma URL específica para maior segurança.

@socketio.on('sendMessage')
def handle_message(message):
    # Adiciona um UUID como identificador único
    message['_id'] = str(uuid.uuid4())
    print(f"Mensagem recebida: {message}")
    emit('receiveMessage', message, broadcast=True)

@app.route('/')
def index():
    return "Servidor de chat ativo!"

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=3000)

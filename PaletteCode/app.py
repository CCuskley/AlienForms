
#!/usr/bin/env python

from flask import Flask, render_template, session, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room,close_room, rooms, disconnect
from flask_cors import CORS

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    print("index retrieved")
    return render_template('index.html')

if __name__ == '__main__':
    socketio.run(app,debug=True,use_reloader=True)


import os
import json
import datetime

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

numbers = []
for i in range(1,98):
    i = str(i)
    numbers.append(i)

messages = {"main" : ["this site is well good yeah", "totally man, pure rad"], "sports" : ["hello", "Hi mate"], "fashion" : ["I pure love dresses"], "numbers" : numbers}

@app.route("/")
def index():
    return render_template("index.html", chats = messages.keys())


@app.route("/<channel>")
def channel(channel):
    return jsonify({"messages": messages[channel]})

@app.route("/newchannel", methods=["POST", "GET"])
def newchannel():
    newchannel = request.values.get("channel")
    print(newchannel)
    if newchannel in messages.keys():
        return "false"
    else:    
        messages[newchannel] = []
        message = f"{newchannel} created"
        time = datetime.datetime.now()
        time = str(time)
        time = time[:-7]
        message = time + "  " + message
        messages[newchannel].append(message)
        return "true"

@socketio.on("submit message")  
def sendmessage(data):
    message = data["message"]
    page = data["page"]
    user = data["user"]
    x = datetime.datetime.now()
    x = str(x)
    x = x[:-7]
    message = user + " at " + x + ":     " + message
    if len(messages[page]) < 100:
        messages[page].append(message)
    else:
        del messages[page][0]
        messages[page].append(message)   
    emit("message sent", page, broadcast=True)

@socketio.on("newsvg")    
def newsvg(data):
    svg = data["svg"]
    page = data["page"]
    if len(messages[page]) < 100:
        messages[page].append(svg)
    else:
        del messages[page][0]
        messages[page].append(svg)   
    emit("message sent", page, broadcast=True)
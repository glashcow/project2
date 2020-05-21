import os
import json

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

messages = {"main" : ["this site is well good yeah", "totally man, pure rad"], "sports" : ["hello", "Hi mate"], "fashion" : ["I pure love dresses"]}

@app.route("/")
def index():
    return render_template("index.html", chats = messages.keys())


@app.route("/<channel>")
def channel(channel):
    return jsonify({"messages": messages[channel]})

#@app.route("/newchannel", methods=["POST", "GET"])
#def newchannel():
 #   req = request.form
  #  newchannel = req.get("channel")
   # print(newchannel)
    #if newchannel in messages.keys():
     #   return jsonify({"success": "false"})
    #else:    
     #   messages[newchannel] = []
      #  message = f"{newchannel} created"
       # messages[newchannel].append(message)
        #return jsonify({"success": "true"})
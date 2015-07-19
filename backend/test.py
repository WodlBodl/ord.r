
from pusher import Pusher
from flask import Flask
from flask import request
from flask import jsonify
import json
p = Pusher(
  app_id = u'130687',
  key = u'3e537abd69de47be577d',
  secret = u'896692d0c4c8adb87d8b',
  ssl = True,
  port = 443
)
# # privateChannel
# @app.route("/pusher/auth", methods=['POST'])
# def authenticate_channel():
#   socket_id =  request.form['socket_id']
#   channel = request.form['channel_name']
#   auth = pusher.authenticate(
#     channel=channel_name,
#     socket_id=socket_id
#   )
#   return auth


app = Flask('pavelapp')
#Presence Channel
@app.route("/pusher/auth", methods=['POST'])
def pusher_authentication():
    print 'GOT IT'
    print request.form['channel_name']
    print request.form['socket_id']
    auth = p.authenticate(
        channel = request.form['channel_name'],
        socket_id = request.form['socket_id']
        # custom_data = {
        #   u'user_id': u'1',
        #   u'user_info': {
        #     u'twitter': u'@pusher'
        #   }
        # }
    )
    print json.dumps(auth)
    return json.dumps(auth)


# channels = pusher.channels_info(u"presence-", [u'user_count'])
# #=> {u'channels': {u'presence-chatroom': {u'user_count': 2}, u'presence-notifications': {u'user_count': 1}}}

# users = pusher.users_info(u'presence-chatroom')
# #=> {u'users': [{u'id': u'1035'}, {u'id': u'4821'}]}

@app.route("/pusher/trigger", methods=['GET'])
def pusher_trigger():
    print 'yo'
    p.trigger('private-my_channel', 'assistance', {
        'fuckall': 'Awaiting response from the server...'
    })
    print 'yo2'
    return jsonify({'name': 'Mihai'})

if __name__ == "__main__":
    app.run(debug=True, port=5000)

# Table#1 channel, event is assistance. message "Awaiting Response ..."
def triggerAssitance(tableId):
    p.trigger(tableId, 'assistance', {
        'message': 'Awaiting response from the server...'
        }
    )
#Server responds to the assitance call
def triggerAssitanceResponse(tableId):
    p.trigger(tableId, 'assistanceResponse', {
        'message': 'Server is on the way!'
        }
    )

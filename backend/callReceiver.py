from flask import Flask
from flask import jsonify
from flask import request
from flask import url_for
from flask.ext.cors import CORS
from pusher import Pusher
# Importing our functions
import json
import restaurant
import customer
import triggers
import numpy as np

app = Flask('uploadReceiver', static_url_path = '')
cors = CORS(app)

p = Pusher(
  app_id = u'130687',
  key = u'3e537abd69de47be577d',
  secret = u'896692d0c4c8adb87d8b',
  ssl = True,
  port = 443
)

@app.route('/api/table/new', methods=['POST'])
def makeNewTable():
	tableNumber = request.form['number']
	tableId = restaurant.makeNewTable(tableNumber)
	return tableId

@app.route('/api/getMenu/<timeOfDay>', methods=['GET'])
def getMenu(timeOfDay):
	menu = restaurant.getMenu(timeOfDay)
	for item in menu:
		item['imgPath'] = request.url_root[:-1] + url_for('static', filename='images/'+item['name'].lower()+'.jpg')
	return jsonify({'menu':menu})

@app.route('/api/table/addOrder', methods=['POST'])
def addOrder():
	tableId = request.form['tableId']
	order = request.form['order']
	confirmation = restaurant.addOrder(tableId, order)
	# Open the waiting for order channel
	return {'confirmation': confirmation}

@app.route('/api/table/placeOrder', methods=['POST'])
def placeOrder():
	tableId = request.form['tableId']
	table = np.load(restaurant.tablesDirectory + tableId + '.npy')
	order = table['order']
	triggers.triggerOrderNotification(tableId, order)
	return {'confirmation': confirmation}

@app.route('/api/table/pay/<tableId>/<userId>', methods=['GET'])
def pay(tableId, userId):
	totalBill = getUserBill(tableId, userId)
	return jsonify({'cost': str(totalBill)})

@app.route("/pusher/auth_presence", methods=['POST'])
def pusher_authenticationPresence():
	tableId = request.form['channel_name'].split('-')[-1]
	table = np.load(restaurant.tablesDirectory + tableId + '.npy')
	table = table[0]
	userId = len(table['users'])
	auth = p.authenticate(
		channel = request.form['channel_name'],
		socket_id = request.form['socket_id'],
		custom_data = {
		  u'user_id': userId
		}
	)
	table['users'].append(userId)
	np.save(restaurant.tablesDirectory + tableId, [table])
	print json.dumps(auth)
	return json.dumps(auth)

@app.route("/pusher/auth_restaurant", methods=['POST'])
def pusher_authenticationRestaurant():
	auth = p.authenticate(
		channel = request.form['channel_name'],
		socket_id = request.form['socket_id']
	)
	print json.dumps(auth)
	return json.dumps(auth)

@app.route("/api/trigger/assistance/<tableId>", methods=['GET'])
def pusher_triggerAssistance(tableId):
	table = np.load(restaurant.tablesDirectory + '.npy')
	tableNumber = table['number']
	triggers.triggerAssitance(tableId, tableNumber)
	return jsonify({'status': 'done'})

@app.route("/api/trigger/assistanceResponse/<tableId>", methods=['GET'])
def pusher_triggerAssistanceResponse(tableId):
	triggers.triggerAssitanceResponse(tableId)
	return jsonify({'status': 'done'})

# channels = pusher.channels_info(u"presence-", [u'user_count'])
# #=> {u'channels': {u'presence-chatroom': {u'user_count': 2}, u'presence-notifications': {u'user_count': 1}}}

# users = pusher.users_info(u'presence-chatroom')
# #=> {u'users': [{u'id': u'1035'}, {u'id': u'4821'}]}

if __name__ == '__main__':
	app.run(host='0.0.0.0', debug = True, port = 4000)

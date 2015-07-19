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

app = Flask('uploadReceiver', static_url_path = '')
cors = CORS(app)

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

@app.route('/api/table/placeOrder', methods=['POST'])
def placeOrder():
	tableId = request.form['tableId']
	order = request.form['order']
	confirmation = restaurant.placeOrder(tableId, order)
	# Open the waiting for order channel
	return {'confirmation': confirmation}

# Begin listening on port 2010
if __name__ == '__main__':
	app.run(host='0.0.0.0', debug = True, port = 4000)
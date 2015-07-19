import time
import numpy as np
import os
import menus
import triggers

tablesDirectory = 'tables/'
if not os.path.exists(tablesDirectory):
	os.makedirs(tablesDirectory)

restaurantId = 'private-restaurant-233654524632'

def makeNewTable(tableNumber):
	tableList = []
	for (dirpath, dirnames, filenames) in os.walk(tablesDirectory):
		tableList.extend(filenames)

	for filename in tableList:
		table = np.load(tablesDirectory + filename)
		table = table[0]
		if (table['number'] == tableNumber) and (table['status'] == 'open'):
			print table
			return filename[:-4]

	tableId = str(int(time.time()))
	table = {
		'number' : tableNumber,
		'users': [],
		'order': [],
		'status': 'open'
	}
	np.save(tablesDirectory + str(tableId), [table])
	print table
	return tableId

def getMenu(timeOfDay):
	timeOfDay = int(timeOfDay)

	if timeOfDay < 7:
		return 'Closed'
	elif 7 <= timeOfDay < 12:
		return menus.breakfast
	elif 12 <= timeOfDay < 18:
		return menus.lunch
	elif 18 <= timeOfDay:
		return menus.dinner

def addOrder(tableId, order):
	table = np.load(tablesDirectory + tableId + '.npy')
	table = table[0]
	table['order'].append(order)
	print 'got table'
	np.save(tablesDirectory + tableId, [table])
	return {'confirmation': 'done'}

def getUserBill(tableId, userId):
	cost = 0
	table = np.load(tablesDirectory + tableId + '.npy')
	table = table[0]
	order = table['order'][int(userId)]

	for item in order:
		cost += float(item['price'][1:])

	return cost
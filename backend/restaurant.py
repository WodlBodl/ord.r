import time
import numpy as np
import os
import menus

tablesDirectory = 'tables/'

def makeNewTable(tableNumber):
	tableId = str(int(time.time()))
	table = {
		'number' : tableNumber
	}
	np.save('tables/' + str(tableId), [table])
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

def placeOrder(tableId, order):
	table = np.load(tablesDirectory + tableId + '.npy')
	table = table[0]

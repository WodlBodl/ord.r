import callReceiver as cr
import restaurant
import json


# Table#1 channel, event is assistance. message "Awaiting Response ..."
def triggerAssitance(tableId, tableNumber):
    #message to the client
    cr.p.trigger(tableId, 'assistance', {
        'message': 'Awaiting response from the server...'
        }
    )
    #message to the restaurant
    cr.p.trigger(restaurant.restaurantId, 'assistance', {
        'message':  tableNumber + ' requires assitance'
        }
    )

#Server responds to the assitance call and the instance of the call deletes itself
def triggerAssitanceResponse(tableId):
    cr.p.trigger(tableId, 'assistanceResponse', {
        'message': 'Server is on the way!'
        }
    )

def triggerOrderNotification(tableId, order):
    for obj in order:
        sendString = json.dumps(obj)
        print type(sendString)
        cr.p.trigger(restaurant.restaurantId, 'orderNotification', sendString)
    return 'ok'

def triggerPayment(tableId, order):
    total = 0

    for item in order:
        total += float(item['price'][1:])
    total = '$' + str(total)

    cr.p.trigger(tableId, 'payment', {
        'message': total
    })
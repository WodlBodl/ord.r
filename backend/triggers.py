import callReceiver as cr
# Table#1 channel, event is assistance. message "Awaiting Response ..."
def triggerAssitance(tableId):
    cr.p.trigger(tableId, 'assistance', {
        'message': 'Awaiting response from the server...'
        }
    )
#Server responds to the assitance call
def triggerAssitanceResponse(tableId):
    cr.p.trigger(tableId, 'assistanceResponse', {
        'message': 'Server is on the way!'
        }
    )

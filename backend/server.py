
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from tinydb import TinyDB, Query
from pydantic import BaseModel
import hashlib, uuid, json, traceback, requests
from classes.utils import Utils
from classes.connection_manager import ConnectionManager

FEE_ADDRESS = "bitcoincash:qr6hawqqypush820d2hsarw6v0rzmlhzmuhffsg2cg"
FEE_PERCENT = 0.05

db = TinyDB('./data/db.json')
rides = db.table('rides')
users = db.table('users')

app = FastAPI()



# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Body Models
class Ride(BaseModel):
    pickup: list
    dropoff: list
    bounty: float



# ENDPOINTS
@app.get("/")
def read_root():
    return {"Hello": "World"}

# GET ride
@app.get("/v1/rides")
def get_rides(coords: Optional[str] = None, radius: Optional[float] = None):
    result = rides.all()
    print(type(coords))
    print(coords)

    # filter
    if coords is None:
        print("returning all")
        return result
    else:
        result_filtered = []
        for ride in rides:
            pass
            #Utils.is_pickup_in_radius()
        return result_filtered

# POST ride
@app.post("/v1/rides")
def post_rides(ride: Ride):
    rId = str(uuid.uuid4())
    try:
        rides.insert({
            "id": rId,
            "riderId": 0,
            "driver": {
                "bch_address": None,
                "last_location": None
            },
            "pickup": ride.pickup,
            "dropoff": ride.dropoff,
            "bounty": ride.bounty,
            "bip70_invoice": None,
            "isClaimed": False,
            "status": "pending",
            "active": True
        })
        return {
            "success": True,
            "data": {
                "id": rId
            },
            "message": "Ride posted!"
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

# get specific ride
@app.get("/v1/rides/{r_id}")
def get_ride(r_id):
    try:
        Ride = Query() # tinydb query
        result = rides.search(Ride.id == r_id)

        return {
            "success": True,
            "data": result[0]
        }
    except Exception as e:
        print(str(e))
        return {
            "success": False,
            "message": "unable to get ride data"
        }


# WEBSOCKET 
manager = ConnectionManager()

subscriptions = {} # uuid:[websocket_connection]

def create_invoice(bch_address, bounty):
    fee = round(bounty * FEE_PERCENT, 8)

    resp = requests.post('https://pay.bitcoin.com/create_invoice', json={
        "outputs": [
            { 
                "address": bch_address, 
                "amount": round(bounty - fee, 8) * 100000000
            },
            {
                "address": FEE_ADDRESS, 
                "amount": fee * 100000000
            }
        ], 
        "memo": "Rides.cash Payment"
    })
    data = resp.json()

    return data["paymentUrl"]

async def remove_ws_from_subscriptions(websocket):
    for r_id in subscriptions.keys():
        subscriptions[r_id] = [ws for ws in subscriptions[r_id] if ws != websocket]


async def update_subscribers(r_id, data):
    print(subscriptions)
    if r_id in subscriptions:
        for websocket in subscriptions[r_id]:
            await websocket.send_text(json.dumps(data))


async def pub_subscribe(websocket, data):
    print("subscription request recieved")
    rId = data["data"]["id"]

    if rId not in subscriptions:
        subscriptions[rId] = []
    
    subscriptions[rId].append(websocket)

async def pub_claim_ride(websocket, data):
    r_id = data["data"]["id"]
    driver_bch_address = data["data"]["bch_address"]
    # update record
    Ride = Query() # tinydb query
    result = rides.search(Ride.id == r_id)
    print('-'*25)
    print(result)
    print('-'*25)
    result[0]["driver"]["bch_address"] = driver_bch_address
    result[0]["status"] = "claimed"
    # create invoice 
    payment_url = create_invoice(driver_bch_address, float(result[0]["bounty"]))
    result[0]["bip70_invoice"] = payment_url

    rides.clear_cache()
    rides.upsert(result[0], Ride.id == r_id)

    # update subscribers of claim
    await update_subscribers(r_id, {
        "event": "claimed",
        "data": {}
    })

    await websocket.send_text(json.dumps({
        "event": "redirect",
        "id": r_id
    }))

async def pub_cancel_ride(websocket, data):
    # update record
    Ride = Query() # tinydb query
    result = rides.search(Ride.id == data["data"]["id"])
    result[0]["active"] = False
    #rides.clear_cache()
    rides.upsert(result[0], rides.search(Ride.id == data["data"]["id"]))

async def pub_send_message(websocket, data):
    pass

async def pub_update_location(websocket, data):
    pass

event_map = {
    "pub_subscribe": pub_subscribe,
    "pub_claim_ride": pub_claim_ride,
    "pub_cancel_ride": pub_cancel_ride,
    "pub_send_message": pub_send_message
}

async def handle_message(websocket, data):
    try:
        data = json.loads(data)
        print(data)
        # check that event starts with "pub_"
        if not data["event"].startswith("pub_"):
            return
        else: 
            await event_map.get(data["event"], lambda: print("not a valid name"))(websocket, data)

    except Exception as e:
        print(str(e))
        traceback.print_exc()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await handle_message(websocket, data)
            #await manager.send_personal_message(f"You wrote: {data}", websocket)
            #await manager.broadcast(f"Client #{client_id} says: {data}")
    except WebSocketDisconnect:
        await remove_ws_from_subscriptions(websocket)
        manager.disconnect(websocket)
        #await manager.broadcast(f"Client #{client_id} left the chat")
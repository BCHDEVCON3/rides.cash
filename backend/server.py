
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from tinydb import TinyDB, Query
from pydantic import BaseModel
import hashlib, uuid
from classes.utils import Utils
from classes.connection_manager import ConnectionManager

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
            "driverId": None,
            "pickup": ride.pickup,
            "dropoff": ride.dropoff,
            "bounty": ride.bounty
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


# WEBSOCKET 
manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", websocket)
            #await manager.broadcast(f"Client #{client_id} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        #await manager.broadcast(f"Client #{client_id} left the chat")
import socketio
import logging

logger = logging.getLogger(__name__)

# Create a Socket.IO server within FastAPI (ASGI)
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

class SocketManager:
    def __init__(self, sio_server: socketio.AsyncServer):
        self.sio = sio_server
        self.register_handlers()

    def register_handlers(self):
        @self.sio.event
        async def connect(sid, environ):
            logger.info(f"Socket connected: {sid}")
            await self.sio.emit('connection_ack', {'data': 'Connected to BEOS Backend'}, room=sid)

        @self.sio.event
        async def disconnect(sid):
            logger.info(f"Socket disconnected: {sid}")

        @self.sio.on('join-city')
        async def handle_join_city(sid, city):
            logger.info(f"Socket {sid} joining city room: {city}")
            self.sio.enter_room(sid, f"city_{city}")

        @self.sio.on('join-blood-type')
        async def handle_join_blood_type(sid, blood_type):
            logger.info(f"Socket {sid} joining blood type room: {blood_type}")
            self.sio.enter_room(sid, f"type_{blood_type}")

    async def emit_to_city(self, city: str, event: str, data: dict):
        await self.sio.emit(event, data, room=f"city_{city}")

    async def emit_broadcast(self, event: str, data: dict):
        await self.sio.emit(event, data)

socket_manager = SocketManager(sio)

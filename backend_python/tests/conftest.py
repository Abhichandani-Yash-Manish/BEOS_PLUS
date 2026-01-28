import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from typing import AsyncGenerator

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

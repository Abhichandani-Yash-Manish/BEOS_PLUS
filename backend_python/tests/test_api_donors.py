import pytest
from httpx import AsyncClient
from app.core.config import settings

# Test against the mock/dev auth fallback
@pytest.mark.anyio
async def test_search_donors_no_auth_fail(client: AsyncClient):
    response = await client.get(f"{settings.API_V1_STR}/donors/")
    assert response.status_code == 401 # HTTPBearer raises 401 if no header

@pytest.mark.anyio
async def test_search_donors_success(client: AsyncClient):
    # Mock token for development auth bypass
    headers = {"Authorization": "Bearer mocktoken"}
    response = await client.get(f"{settings.API_V1_STR}/donors/", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

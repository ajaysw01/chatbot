from fastapi.testclient import TestClient
from main import app, ip_requests

client = TestClient(app)


def reset_rate_limit():
    ip_requests.clear()


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_chat_empty_message():
    reset_rate_limit()
    response = client.post("/chat", json={"message": "   "})
    assert response.status_code == 400
    assert response.json()["detail"] == "No input provided."

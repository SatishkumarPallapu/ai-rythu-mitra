from fastapi import status
from tests.test_main import client, test_db, db_session
import pytest


@pytest.fixture
def create_test_user(db_session):
    # Create a test user in the database
    user_data = {
        "name": "Test User",
        "email": "testreport@example.com",
        "password": "testpassword",
        "phone": "1234567890",
        "farm_location": "Test Location",
        "farm_size": 10.0,
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == status.HTTP_200_OK
    user = response.json()
    return user


def test_generate_report(test_db, create_test_user):
    user = create_test_user
    response = client.post("/reports/generate", headers={"Authorization": f"Bearer {user['access_token']}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.headers["content-type"] == "application/pdf"


def test_get_report_history(test_db, create_test_user):
    user = create_test_user
    # First, generate a report
    client.post("/reports/generate",  headers={"Authorization": f"Bearer {user['access_token']}"})
    # Get report history
    response = client.get("/reports/history", headers={"Authorization": f"Bearer {user['access_token']}"})
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) > 0
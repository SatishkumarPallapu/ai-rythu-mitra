from fastapi import status
from tests.test_main import client, test_db, db_session
from fastapi import UploadFile
from io import BytesIO
import os
import pytest


@pytest.fixture
def create_test_user(db_session):
    # Create a test user in the database
    user_data = {
        "name": "Test User",
        "email": "testsoil@example.com",
        "password": "testpassword",
        "phone": "1234567890",
        "farm_location": "Test Location",
        "farm_size": 10.0,
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == status.HTTP_200_OK
    user = response.json()
    return user


def test_analyze_soil(test_db, create_test_user):
    user = create_test_user
    # Create a dummy file
    file_content = b"This is a dummy soil report file content."
    file = (
        "soil_report.txt",
        BytesIO(file_content),
        "text/plain",
    )
    # Send the file to the /soil/analyze endpoint
    response = client.post(
        "/soil/analyze", files={"file": file}, headers={"Authorization": f"Bearer {user['access_token']}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["analysis"] is not None


def test_get_soil_reports(test_db, create_test_user):
    user = create_test_user
    # First, analyze a soil to generate a report
    file_content = b"This is a dummy soil report file content."
    file = (
        "soil_report.txt",
        BytesIO(file_content),
        "text/plain",
    )
    client.post(
        "/soil/analyze", files={"file": file},headers={"Authorization": f"Bearer {user['access_token']}"}
    )
    # Retrieve soil reports
    response = client.get("/soil/reports", headers={"Authorization": f"Bearer {user['access_token']}"})
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) > 0


def test_get_soil_report(test_db, create_test_user):
    user = create_test_user
    # First, analyze a soil to generate a report
    file_content = b"This is a dummy soil report file content."
    file = (
        "soil_report.txt",
        BytesIO(file_content),
        "text/plain",
    )
    analysis_response = client.post(
        "/soil/analyze", files={"file": file}, headers={"Authorization": f"Bearer {user['access_token']}"}
    )
    report_id = analysis_response.json()["report_id"]
    # Retrieve a specific soil report
    response = client.get(f"/soil/reports/{report_id}", headers={"Authorization": f"Bearer {user['access_token']}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["report_id"] == report_id
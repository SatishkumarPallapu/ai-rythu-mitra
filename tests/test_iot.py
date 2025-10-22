from fastapi import status
from tests.test_main import client, test_db, db_session
from datetime import datetime, timedelta

def test_receive_iot_data(test_db, db_session):
    response = client.post(
        "/iot/data",
        json={
            "field_id": "field123",
            "device_id": "esp32-1",
            "moisture": 65.0,
            "temperature": 28.5,
            "humidity": 70.2,
            "timestamp": datetime.now().isoformat(),
        },
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "received"
    assert response.json()["alerts"] == []



def test_get_iot_data(test_db, db_session):
    # First, add some data
    client.post(
        "/iot/data",
        json={
            "field_id": "field456",
            "device_id": "esp32-2",
            "moisture": 70.0,
            "temperature": 30.0,
            "humidity": 75.0,
            "timestamp": datetime.now().isoformat(),
        },
    )
    # Retrieve the data
    response = client.get("/iot/data/field456")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) > 0



def test_get_latest_reading(test_db, db_session):
    # First, add some data
    client.post(
        "/iot/data",
        json={
            "field_id": "field789",
            "device_id": "esp32-3",
            "moisture": 72.0,
            "temperature": 31.0,
            "humidity": 76.0,
            "timestamp": datetime.now().isoformat(),
        },
    )
    # Retrieve the latest reading
    response = client.get("/iot/latest/field789")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "success"



def test_get_field_stats(test_db, db_session):
    # First, add some data
    client.post(
        "/iot/data",
        json={
            "field_id": "field101",
            "device_id": "esp32-4",
            "moisture": 68.0,
            "temperature": 29.0,
            "humidity": 72.0,
            "timestamp": datetime.now().isoformat(),
        },
    )
    # Retrieve the field stats
    response = client.get("/iot/stats/field101")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["field_id"] == "field101"

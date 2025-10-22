from fastapi import status
from tests.test_main import client, test_db, db_session
import pytest


@pytest.fixture
def create_test_user(db_session):
    # Create a test user in the database
    user_data = {
        "name": "Test User",
        "email": "testmarket@example.com",
        "password": "testpassword",
        "phone": "1234567890",
        "farm_location": "Test Location",
        "farm_size": 10.0,
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == status.HTTP_200_OK
    user = response.json()
    return user


def test_create_listing(test_db, create_test_user):
    user = create_test_user
    response = client.post(
        "/marketplace/listings",
        json={
            "crop_name": "Wheat",
            "quantity": 100.0,
            "unit": "kg",
            "price_per_unit": 25.0,
            "location": "Test Location",
            "description": "High-quality wheat",
            "contact": "1234567890",
            "images": [],
        },
         headers={"Authorization": f"Bearer {user['access_token']}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["crop_name"] == "Wheat"


def test_get_listings(test_db, create_test_user):
    user = create_test_user

    # First, create a listing
    client.post(
        "/marketplace/listings",
        json={
            "crop_name": "Rice",
            "quantity": 50.0,
            "unit": "kg",
            "price_per_unit": 30.0,
            "location": "Test Location",
            "description": "High-quality rice",
            "contact": "1234567890",
            "images": [],
        },
         headers={"Authorization": f"Bearer {user['access_token']}"}
    )

    # Retrieve listings
    response = client.get("/marketplace/listings")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) > 0


def test_get_listing(test_db, create_test_user):
    user = create_test_user
    # First, create a listing
    create_response = client.post(
        "/marketplace/listings",
        json={
            "crop_name": "Corn",
            "quantity": 75.0,
            "unit": "kg",
            "price_per_unit": 20.0,
            "location": "Test Location",
            "description": "High-quality corn",
            "contact": "1234567890",
            "images": [],
        },
         headers={"Authorization": f"Bearer {user['access_token']}"}
    )
    listing_id = create_response.json()["id"]
    # Retrieve a specific listing
    response = client.get(f"/marketplace/listings/{listing_id}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["crop_name"] == "Corn"



def test_update_listing(test_db, create_test_user):
    user = create_test_user
    # First, create a listing
    create_response = client.post(
        "/marketplace/listings",
        json={
            "crop_name": "Barley",
            "quantity": 120.0,
            "unit": "kg",
            "price_per_unit": 28.0,
            "location": "Test Location",
            "description": "High-quality barley",
            "contact": "1234567890",
            "images": [],
        },
         headers={"Authorization": f"Bearer {user['access_token']}"}
    )
    listing_id = create_response.json()["id"]
    # Update the listing
    response = client.put(
        f"/marketplace/listings/{listing_id}",
        json={"price_per_unit": 30.0, "description": "Updated description"},
         headers={"Authorization": f"Bearer {user['access_token']}"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["price_per_unit"] == 30.0
    assert response.json()["description"] == "Updated description"



def test_delete_listing(test_db, create_test_user):
    user = create_test_user
    # First, create a listing
    create_response = client.post(
        "/marketplace/listings",
        json={
            "crop_name": "Oats",
            "quantity": 90.0,
            "unit": "kg",
            "price_per_unit": 22.0,
            "location": "Test Location",
            "description": "High-quality oats",
            "contact": "1234567890",
            "images": [],
        },
         headers={"Authorization": f"Bearer {user['access_token']}"}
    )
    listing_id = create_response.json()["id"]
    # Delete the listing
    response = client.delete(f"/marketplace/listings/{listing_id}",  headers={"Authorization": f"Bearer {user['access_token']}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "Listing deleted successfully"
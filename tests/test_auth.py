from fastapi import status
from tests.test_main import client, test_db, db_session

def test_register_user(test_db):
    response = client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpassword",
            "phone": "1234567890",
            "farm_location": "Test Location",
            "farm_size": 10.0,
        },
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["email"] == "test@example.com"


def test_register_user_existing_email(test_db):
    # Register the user first
    client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpassword",
            "phone": "1234567890",
            "farm_location": "Test Location",
            "farm_size": 10.0,
        },
    )
    # Try to register again with the same email
    response = client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpassword",
            "phone": "1234567890",
            "farm_location": "Test Location",
            "farm_size": 10.0,
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Email already registered"



def test_login_user(test_db):
    # First register a user
    client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "login@example.com",
            "password": "testpassword",
            "phone": "1234567890",
            "farm_location": "Test Location",
            "farm_size": 10.0,
        },
    )
    # Now try to log in
    response = client.post(
        "/auth/login", json={"email": "login@example.com", "password": "testpassword"}
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["email"] == "login@example.com"


def test_login_user_incorrect_password(test_db):
    # First register a user
    client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "incorrect@example.com",
            "password": "testpassword",
            "phone": "1234567890",
            "farm_location": "Test Location",
            "farm_size": 10.0,
        },
    )
    # Now try to log in with the wrong password
    response = client.post(
        "/auth/login",
        json={"email": "incorrect@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Invalid email or password"



def test_get_me(test_db):
    # First register a user
    register_response = client.post(
        "/auth/register",
        json={
            "name": "Test User",
            "email": "getme@example.com",
            "password": "testpassword",
            "phone": "1234567890",
            "farm_location": "Test Location",
            "farm_size": 10.0,
        },
    )
    # Get the access token from the registration response
    access_token = register_response.json()["access_token"]
    # Now try to get the current user
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["email"] == "getme@example.com"
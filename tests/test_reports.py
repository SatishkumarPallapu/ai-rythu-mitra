from fastapi import status
from tests.test_main import client, test_db, db_session
import pytest


def test_generate_report(test_db):
    response = client.post("/reports/generate")
    assert response.status_code == status.HTTP_200_OK
    assert response.headers["content-type"] == "application/pdf"


def test_get_report_history(test_db):
    # First, generate a report
    client.post("/reports/generate")
    # Get report history
    response = client.get("/reports/history")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) > 0
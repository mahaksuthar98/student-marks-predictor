from fastapi.testclient import TestClient

from src.api import app
from src import api
import src.prediction


client = TestClient(app)


# ==========================================
# TEST HOME ENDPOINT
# ==========================================

def test_home():

    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Student Marks Predictor API is running"


# ==========================================
# TEST HEALTH ENDPOINT
# ==========================================

def test_health():

    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"


# ==========================================
# TEST INVALID PREDICTION DATA
# ==========================================

def test_invalid_prediction():

    response = client.post(
        "/predict",
        json={
            "student_name": "",
            "study_hours": 6,
            "attendance": 85,
            "previous_marks": 75,
            "assignment_score": 80
        }
    )

    assert response.status_code == 422


# ==========================================
# TEST INVALID ATTENDANCE
# ==========================================

def test_invalid_attendance():

    response = client.post(
        "/predict",
        json={
            "student_name": "Rahul",
            "study_hours": 6,
            "attendance": 120,
            "previous_marks": 75,
            "assignment_score": 80
        }
    )

    assert response.status_code == 422


# ==========================================
# TEST INVALID PREVIOUS MARKS
# ==========================================

def test_invalid_previous_marks():

    response = client.post(
        "/predict",
        json={
            "student_name": "Rahul",
            "study_hours": 6,
            "attendance": 85,
            "previous_marks": 120,
            "assignment_score": 80
        }
    )

    assert response.status_code == 422


# ==========================================
# TEST INVALID ASSIGNMENT SCORE
# ==========================================

def test_invalid_assignment_score():

    response = client.post(
        "/predict",
        json={
            "student_name": "Rahul",
            "study_hours": 6,
            "attendance": 85,
            "previous_marks": 75,
            "assignment_score": 120
        }
    )

    assert response.status_code == 422


# ==========================================
# TEST NON-EXISTING PREDICTION
# ==========================================

def test_prediction_not_found():

    response = client.get("/predictions/999999")

    assert response.status_code == 404


# ==========================================
# TEST SUCCESSFUL PREDICTION
# ==========================================

def test_successful_prediction(monkeypatch):

    monkeypatch.setattr(
        api,
        "predict_and_save",
        lambda student_name,
        study_hours,
        attendance,
        previous_marks,
        assignment_score: 82.50
    )

    response = client.post(
        "/predict",
        json={
            "student_name": "Test Student",
            "study_hours": 6,
            "attendance": 85,
            "previous_marks": 75,
            "assignment_score": 80
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["student_name"] == "Test Student"

    assert data["study_hours"] == 6

    assert data["attendance"] == 85

    assert data["previous_marks"] == 75

    assert data["assignment_score"] == 80

    assert data["predicted_marks"] == 82.50


# ==========================================
# TEST PREDICTION SERVER ERROR
# ==========================================

def test_prediction_server_error(monkeypatch):

    def fake_predict_and_save(
        student_name,
        study_hours,
        attendance,
        previous_marks,
        assignment_score
    ):

        raise Exception("Database connection failed")

    monkeypatch.setattr(
        api,
        "predict_and_save",
        fake_predict_and_save
    )

    response = client.post(
        "/predict",
        json={
            "student_name": "Test Student",
            "study_hours": 6,
            "attendance": 85,
            "previous_marks": 75,
            "assignment_score": 80
        }
    )

    assert response.status_code == 500

    data = response.json()

    assert "Prediction failed" in data["detail"]


# ==========================================
# TEST GET ALL PREDICTIONS
# ==========================================

def test_get_all_predictions(monkeypatch):

    fake_records = [
        (
            1,
            "Rahul",
            6.0,
            85.0,
            75.0,
            80.0,
            82.50
        ),
        (
            2,
            "Amit",
            8.0,
            90.0,
            80.0,
            85.0,
            88.20
        )
    ]

    monkeypatch.setattr(
        api,
        "get_all_predictions",
        lambda: fake_records
    )

    response = client.get("/predictions")

    assert response.status_code == 200

    data = response.json()

    assert data["count"] == 2

    assert len(data["predictions"]) == 2

    assert data["predictions"][0][1] == "Rahul"


# ==========================================
# TEST GET PREDICTION BY ID
# ==========================================

def test_get_prediction_by_id(monkeypatch):

    fake_record = (
        1,
        "Rahul",
        6.0,
        85.0,
        75.0,
        80.0,
        82.50
    )

    monkeypatch.setattr(
        api,
        "get_prediction_by_id",
        lambda prediction_id: fake_record
    )

    response = client.get("/predictions/1")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1

    assert data["student_name"] == "Rahul"

    assert data["predicted_marks"] == 82.50


# ==========================================
# TEST SEARCH BY NAME
# ==========================================

def test_search_predictions_by_name(monkeypatch):

    fake_records = [
        (
            1,
            "Rahul",
            6.0,
            85.0,
            75.0,
            80.0,
            82.50
        )
    ]

    monkeypatch.setattr(
        api,
        "search_predictions_by_name",
        lambda name: fake_records
    )

    response = client.get(
        "/predictions/search/Rahul"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["count"] == 1

    assert data["predictions"][0][1] == "Rahul"


# ==========================================
# TEST UPDATE PREDICTION
# ==========================================

def test_update_prediction(monkeypatch):

    existing_record = (
        1,
        "Rahul",
        6.0,
        85.0,
        75.0,
        80.0,
        82.50
    )

    monkeypatch.setattr(
        api,
        "get_prediction_by_id",
        lambda prediction_id: existing_record
    )

    monkeypatch.setattr(
        api,
        "update_prediction",
        lambda *args: 1
    )

    monkeypatch.setattr(
        src.prediction,
        "predict_marks",
        lambda *args: 90.00
    )

    response = client.put(
        "/predictions/1",
        json={
            "student_name": "Rahul Updated",
            "study_hours": 8,
            "attendance": 90,
            "previous_marks": 80,
            "assignment_score": 85
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Prediction updated successfully"

    assert data["id"] == 1

    assert data["student_name"] == "Rahul Updated"

    assert data["predicted_marks"] == 90.00


# ==========================================
# TEST DELETE PREDICTION
# ==========================================

def test_delete_prediction(monkeypatch):

    monkeypatch.setattr(
        api,
        "delete_prediction",
        lambda prediction_id: 1
    )

    response = client.delete(
        "/predictions/1"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Prediction deleted successfully"

    assert data["id"] == 1
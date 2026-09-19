from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, Field

from .prediction import predict_and_save

from .database import (
    get_all_predictions,
    get_prediction_by_id,
    search_predictions_by_name,
    update_prediction,
    delete_prediction,
    get_deleted_predictions,
    restore_prediction,
    permanent_delete_prediction
)


# FASTAPI APPLICATION-----------------------------------------

app = FastAPI(
    title="Student Marks Predictor API",
    description="ML API for predicting student final marks",
    version="1.0.0"
)


# CORS CONFIGURATION----------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# REQUEST MODEL-------------------------------------------

class PredictionRequest(BaseModel):

    student_name: str = Field(min_length=1)

    study_hours: float = Field(ge=0)

    attendance: float = Field(
        ge=0,
        le=100
    )

    previous_marks: float = Field(
        ge=0,
        le=100
    )

    assignment_score: float = Field(
        ge=0,
        le=100
    )


# HOME API---------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "Student Marks Predictor API is running"
    }


# HEALTH CHECK API---------------------------------------

@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }


# PREDICTION API-------------------------------------

@app.post("/predict")
def predict_marks(data: PredictionRequest):

    try:

        predicted_marks = predict_and_save(
            data.student_name,
            data.study_hours,
            data.previous_marks,
            data.attendance,
            data.assignment_score
        )

        return {
            "student_name": data.student_name,
            "study_hours": data.study_hours,
            "attendance": data.attendance,
            "previous_marks": data.previous_marks,
            "assignment_score": data.assignment_score,
            "predicted_marks": round(
                float(predicted_marks),
                2
            )
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


# GET ALL ACTIVE PREDICTIONS-------------------------------------

@app.get("/predictions")
def get_predictions():

    records = get_all_predictions()

    return {
        "count": len(records),
        "predictions": records
    }


# SEARCH ACTIVE PREDICTION BY NAME----------------------------------

@app.get("/predictions/search/{name}")
def search_predictions(name: str):

    records = search_predictions_by_name(name)

    return {
        "count": len(records),
        "predictions": records
    }


# GET DELETED PREDICTIONS / TRASH-------------------------------------

@app.get("/trash")
def get_trash():

    records = get_deleted_predictions()

    return {
        "count": len(records),
        "predictions": records
    }


# RESTORE DELETED PREDICTION---------------------------------

@app.patch("/trash/{prediction_id}/restore")
def restore_prediction_api(
    prediction_id: int
):

    restored_rows = restore_prediction(
        prediction_id
    )

    if restored_rows == 0:

        raise HTTPException(
            status_code=404,
            detail="Deleted prediction not found"
        )

    return {
        "message": "Prediction restored successfully",
        "id": prediction_id
    }

# PERMANENT DELETE PREDICTION---------------------------------

@app.delete("/trash/{prediction_id}")
def permanent_delete_prediction_api(
    prediction_id: int
):

    deleted_rows = permanent_delete_prediction(
        prediction_id
    )

    if deleted_rows == 0:

        raise HTTPException(
            status_code=404,
            detail="Deleted prediction not found"
        )

    return {
        "message": "Prediction permanently deleted",
        "id": prediction_id
    }


# SEARCH PREDICTION BY ID----------------------------------

@app.get("/predictions/{prediction_id}")
def get_prediction(prediction_id: int):

    record = get_prediction_by_id(prediction_id)

    if record is None:

        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return {
        "id": record["id"],
        "student_name": record["student_name"],
        "study_hours": record["study_hours"],
        "attendance": record["attendance"],
        "previous_marks": record["previous_marks"],
        "assignment_score": record["assignment_score"],
        "predicted_marks": record["predicted_marks"]
    }


# UPDATE PREDICTION---------------------------------

@app.put("/predictions/{prediction_id}")
def update_prediction_api(
    prediction_id: int,
    data: PredictionRequest
):

    existing_record = get_prediction_by_id(
        prediction_id
    )

    if existing_record is None:

        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    from .prediction import predict_marks

    predicted_marks = predict_marks(
        data.study_hours,
        data.attendance,
        data.previous_marks,
        data.assignment_score
    )

    update_prediction(
        prediction_id,
        data.student_name,
        data.study_hours,
        data.attendance,
        data.previous_marks,
        data.assignment_score,
        predicted_marks
    )

    return {
        "message": "Prediction updated successfully",
        "id": prediction_id,
        "student_name": data.student_name,
        "study_hours": data.study_hours,
        "attendance": data.attendance,
        "previous_marks": data.previous_marks,
        "assignment_score": data.assignment_score,
        "predicted_marks": round(
            float(predicted_marks),
            2
        )
    }


# DELETE / SOFT DELETE PREDICTION---------------------------------

@app.delete("/predictions/{prediction_id}")
def delete_prediction_api(
    prediction_id: int
):

    deleted_rows = delete_prediction(
        prediction_id
    )

    if deleted_rows == 0:

        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    return {
        "message": "Prediction moved to Trash",
        "id": prediction_id
    }
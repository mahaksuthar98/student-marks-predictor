import joblib
import pandas as pd
from pathlib import Path

from .database import insert_prediction


# ==========================================
# LOAD TRAINED MODEL
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

model_path = BASE_DIR / "model" / "random_forest_model.pkl"

model = joblib.load(model_path)

print("ML model loaded successfully!")


# ==========================================
# PREDICT MARKS
# ==========================================

def predict_marks(
    study_hours,
    attendance,
    previous_marks,
    assignment_score
):

    input_data = pd.DataFrame({
        "study_hours": [study_hours],
        "attendance": [attendance],
        "previous_marks": [previous_marks],
        "assignment_score": [assignment_score]
    })

    prediction = model.predict(
        input_data
    )

    return prediction[0]


# ==========================================
# PREDICT + SAVE
# ==========================================

def predict_and_save(
    student_name,
    study_hours,
    attendance,
    previous_marks,
    assignment_score
):

    predicted_marks = predict_marks(
        study_hours,
        attendance,
        previous_marks,
        assignment_score
    )

    insert_prediction(
        student_name,
        study_hours,
        attendance,
        previous_marks,
        assignment_score,
        predicted_marks
    )

    return predicted_marks
import pandas as pd
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

import numpy as np


# PROJECT PATH---------------------

BASE_DIR = Path(__file__).resolve().parent.parent


# DATA PATH----------------------------

DATA_PATH = BASE_DIR / "data" / "students_cleaned.csv"


# MODEL PATH----------------------------

MODEL_PATH = BASE_DIR / "model" / "random_forest_model.pkl"


# LOAD DATA----------------------------

print("\n==========================================")
print("LOADING DATA")
print("==========================================")

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)


# FEATURES------------------------------

X = df[
    [
        "study_hours",
        "attendance",
        "previous_marks",
        "assignment_score"
    ]
]


# TARGET-----------------------------

Y = df["final_marks"]


# TRAIN TEST SPLIT-------------------------

X_train, X_test, Y_train, Y_test = train_test_split(
    X,
    Y,
    test_size=0.2,
    random_state=42
)


print("\n==========================================")
print("TRAIN TEST SPLIT")
print("==========================================")

print("Training samples:", len(X_train))
print("Testing samples :", len(X_test))


# CREATE RANDOM FOREST----------------------------------

model = RandomForestRegressor(
    n_estimators=100,
    max_depth=5,
    random_state=42
)


# TRAIN MODEL-------------------------------

print("\n==========================================")
print("TRAINING RANDOM FOREST")
print("==========================================")

model.fit(
    X_train,
    Y_train
)

print("Model training completed!")


# PREDICTION-------------------------------

Y_pred = model.predict(
    X_test
)


# MODEL EVALUATION---------------------------

mae = mean_absolute_error(
    Y_test,
    Y_pred
)

mse = mean_squared_error(
    Y_test,
    Y_pred
)

rmse = np.sqrt(mse)

r2 = r2_score(
    Y_test,
    Y_pred
)


# DISPLAY METRICS----------------------------

print("\n==========================================")
print("FINAL MODEL EVALUATION")
print("==========================================")

print(f"MAE  : {mae:.2f}")
print(f"MSE  : {mse:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R2   : {r2:.2f}")


# SAVE MODEL------------------------------

joblib.dump(
    model,
    MODEL_PATH
)


print("\n==========================================")
print("MODEL SAVED")
print("==========================================")

print("Model path:")
print(MODEL_PATH)

print("\nFinal Random Forest model is ready!")
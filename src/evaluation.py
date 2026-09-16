import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)


# ==========================================
# LOAD DATA
# ==========================================

DATA_PATH = "data/students_cleaned.csv"

df = pd.read_csv(DATA_PATH)

print("\n==========================================")
print("DATA LOADED")
print("==========================================")

print(df.head())


# ==========================================
# FEATURES AND TARGET
# ==========================================

X = df[
    [
        "study_hours",
        "attendance",
        "previous_marks",
        "assignment_score"
    ]
]

Y = df["final_marks"]


# ==========================================
# TRAIN TEST SPLIT
# ==========================================

X_train, X_test, Y_train, Y_test = train_test_split(
    X,
    Y,
    test_size=0.2,
    random_state=42
)


print("\n==========================================")
print("DATA SPLIT")
print("==========================================")

print("Training samples:", len(X_train))
print("Testing samples :", len(X_test))


# ==========================================
# CREATE MODEL
# ==========================================

model = LinearRegression()


# ==========================================
# TRAIN MODEL
# ==========================================

model.fit(
    X_train,
    Y_train
)


print("\n==========================================")
print("MODEL TRAINED")
print("==========================================")


# ==========================================
# PREDICTION
# ==========================================

Y_pred = model.predict(
    X_test
)


# ==========================================
# MAE
# ==========================================

mae = mean_absolute_error(
    Y_test,
    Y_pred
)


# ==========================================
# MSE
# ==========================================

mse = mean_squared_error(
    Y_test,
    Y_pred
)


# ==========================================
# RMSE
# ==========================================

rmse = np.sqrt(mse)


# ==========================================
# R2 SCORE
# ==========================================

r2 = r2_score(
    Y_test,
    Y_pred
)


# ==========================================
# DISPLAY RESULTS
# ==========================================

print("\n==========================================")
print("MODEL EVALUATION")
print("==========================================")

print(f"MAE  : {mae:.2f}")
print(f"MSE  : {mse:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R2   : {r2:.2f}")


# ==========================================
# ACTUAL VS PREDICTED
# ==========================================

results = pd.DataFrame({
    "Actual Marks": Y_test.values,
    "Predicted Marks": Y_pred
})


results["Error"] = (
    results["Actual Marks"]
    - results["Predicted Marks"]
)


print("\n==========================================")
print("ACTUAL VS PREDICTED")
print("==========================================")

print(results)


# ==========================================
# RESIDUAL ANALYSIS
# ==========================================

results["Absolute Error"] = (
    results["Error"].abs()
)


print("\n==========================================")
print("RESIDUAL ANALYSIS")
print("==========================================")

print(
    results[
        [
            "Actual Marks",
            "Predicted Marks",
            "Error",
            "Absolute Error"
        ]
    ]
)
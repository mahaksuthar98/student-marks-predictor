import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)


# LOAD DATA----------------------------

DATA_PATH = "data/students_cleaned.csv"

df = pd.read_csv(DATA_PATH)


print("\n==========================================")
print("DATA LOADED")
print("==========================================")

print("Dataset shape:", df.shape)


# FEATURES--------------------------------

X = df[
    [
        "study_hours",
        "attendance",
        "previous_marks",
        "assignment_score"
    ]
]


# TARGET-------------------------------

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


# CREATE MODELS------------------------------

models = {

    "Linear Regression":
        LinearRegression(),

    "Decision Tree":
        DecisionTreeRegressor(
            random_state=42,
            max_depth=5
        ),

    "Random Forest":
        RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            max_depth=5
        )
}


# STORE RESULTS--------------------------------

results = []


# TRAIN + EVALUATE MODELS--------------------------

for model_name, model in models.items():

    print("\n------------------------------------------")
    print("Training:", model_name)
    print("------------------------------------------")

    model.fit(
        X_train,
        Y_train
    )

    Y_pred = model.predict(
        X_test
    )

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

    results.append({

        "Model": model_name,

        "MAE": round(mae, 2),

        "MSE": round(mse, 2),

        "RMSE": round(rmse, 2),

        "R2": round(r2, 2)

    })

# RESULTS DATAFRAME-------------------------

results_df = pd.DataFrame(
    results
)


# DISPLAY RESULTS----------------------------

print("\n==========================================")
print("MODEL COMPARISON")
print("==========================================")

print(
    results_df.to_string(
        index=False
    )
)


# FIND BEST MODEL------------------------------

best_model_row = results_df.loc[
    results_df["R2"].idxmax()
]


print("\n==========================================")
print("BEST MODEL")
print("==========================================")

print(
    "Best Model:",
    best_model_row["Model"]
)

print(
    "R2 Score:",
    best_model_row["R2"]
)

print(
    "RMSE:",
    best_model_row["RMSE"]
)

print(
    "MAE:",
    best_model_row["MAE"]
)
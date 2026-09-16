# 🎓 Student Marks Predictor

A Machine Learning based web application that predicts a student's final marks using study hours, attendance, previous marks, and assignment score.

The project uses **Python, Pandas, NumPy, Scikit-learn, Random Forest, MySQL, FastAPI, HTML, CSS, and JavaScript**.

---

## 📌 Project Overview

The Student Marks Predictor takes the following student information as input:

- Student Name
- Study Hours
- Attendance Percentage
- Previous Marks
- Assignment Score

The Machine Learning model then predicts the student's final marks.

The prediction is saved into a MySQL database through a FastAPI backend and can be viewed, searched, edited, or deleted from the frontend dashboard.

---

## 🚀 Features

### Machine Learning
- Data cleaning
- Exploratory Data Analysis (EDA)
- Train/Test Split
- Linear Regression
- Decision Tree Regression
- Random Forest Regression
- Model Comparison
- Model Evaluation
- Final Random Forest Model
- Model saved using Joblib

### Backend
- FastAPI REST API
- Prediction API
- Get all predictions
- Search prediction by student name
- Get prediction by ID
- Update prediction
- Delete prediction
- Input validation
- Error handling

### Database
- MySQL database
- Store prediction records
- Read prediction records
- Update records
- Delete records

### Frontend
- Student prediction form
- Dashboard
- Total predictions
- Average marks
- Highest marks
- Lowest marks
- Search by name
- Search by ID
- Edit prediction
- Delete prediction
- Marks distribution chart
- Responsive design

### Testing
- Automated API testing
- Prediction testing
- Validation testing
- Pytest test suite

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Main programming language |
| NumPy | Numerical operations |
| Pandas | Data processing |
| Matplotlib | Data visualization |
| Scikit-learn | Machine Learning |
| Joblib | Model saving/loading |
| MySQL | Database |
| mysql-connector-python | Python-MySQL connection |
| FastAPI | Backend REST API |
| Pydantic | Data validation |
| HTML | Frontend structure |
| CSS | Frontend styling |
| JavaScript | Frontend functionality |
| Pytest | Automated testing |

---

## 🤖 Machine Learning Models

Three regression models were compared:

1. Linear Regression
2. Decision Tree Regressor
3. Random Forest Regressor

### Model Comparison

| Model | MAE | MSE | RMSE | R² |
|---|---:|---:|---:|---:|
| Linear Regression | 0.79 | 0.91 | 0.95 | 0.99 |
| Decision Tree | 0.99 | 1.54 | 1.24 | 0.99 |
| Random Forest | 0.46 | 0.31 | 0.55 | 1.00 |

Based on this train/test split, **Random Forest Regressor** gave the best results and was selected as the final model.

> Note: The dataset is relatively small, so these results should not be interpreted as proof of perfect real-world performance.

---

## 📊 Dataset

The dataset contains the following columns:

| Column | Description |
|---|---|
| student_name | Name of the student |
| study_hours | Number of hours studied |
| attendance | Attendance percentage |
| previous_marks | Previous academic marks |
| assignment_score | Assignment marks |
| final_marks | Final marks / target variable |

### Features

```text
study_hours
attendance
previous_marks
assignment_score

### Target

```text
final_marks
import mysql.connector


# ==============================
# MySQL Database Configuration
# ==============================

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "mahak1234",
    "database": "student_marks_db"
}


# ==============================
# Database Connection
# ==============================

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)


# ==============================
# Insert Prediction
# ==============================

def insert_prediction(
    student_name,
    study_hours,
    attendance,
    previous_marks,
    assignment_score,
    predicted_marks
):
    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO predictions
            (
                student_name,
                study_hours,
                attendance,
                previous_marks,
                assignment_score,
                predicted_marks
            )
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        values = (
            student_name,
            study_hours,
            attendance,
            previous_marks,
            assignment_score,
            predicted_marks
        )

        cursor.execute(query, values)
        connection.commit()

        return cursor.lastrowid

    except Exception as e:
        print("DATABASE ERROR:", e)
        raise

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ==============================
# Get All Predictions
# ==============================

def get_all_predictions():
    connection = None
    cursor = None

    try:
        connection = get_connection()

        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                id,
                student_name,
                study_hours,
                attendance,
                previous_marks,
                assignment_score,
                predicted_marks
            FROM predictions
            ORDER BY id DESC
        """

        cursor.execute(query)

        results = cursor.fetchall()

        return results

    except Exception as e:
        print("DATABASE ERROR:", e)
        raise

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ==============================
# Get Prediction By ID
# ==============================

def get_prediction_by_id(prediction_id):
    connection = None
    cursor = None

    try:
        connection = get_connection()

        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                id,
                student_name,
                study_hours,
                attendance,
                previous_marks,
                assignment_score,
                predicted_marks
            FROM predictions
            WHERE id = %s
        """

        cursor.execute(query, (prediction_id,))

        result = cursor.fetchone()

        return result

    except Exception as e:
        print("DATABASE ERROR:", e)
        raise

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ==============================
# Search Predictions By Name
# ==============================

def search_predictions_by_name(name):
    connection = None
    cursor = None

    try:
        connection = get_connection()

        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                id,
                student_name,
                study_hours,
                attendance,
                previous_marks,
                assignment_score,
                predicted_marks
            FROM predictions
            WHERE student_name LIKE %s
            ORDER BY id DESC
        """

        cursor.execute(query, (f"%{name}%",))

        results = cursor.fetchall()

        return results

    except Exception as e:
        print("DATABASE ERROR:", e)
        raise

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ==============================
# Update Prediction
# ==============================

def update_prediction(
    prediction_id,
    student_name,
    study_hours,
    attendance,
    previous_marks,
    assignment_score,
    predicted_marks
):
    connection = None
    cursor = None

    try:
        connection = get_connection()

        cursor = connection.cursor()

        query = """
            UPDATE predictions
            SET
                student_name = %s,
                study_hours = %s,
                attendance = %s,
                previous_marks = %s,
                assignment_score = %s,
                predicted_marks = %s
            WHERE id = %s
        """

        values = (
            student_name,
            study_hours,
            attendance,
            previous_marks,
            assignment_score,
            predicted_marks,
            prediction_id
        )

        cursor.execute(query, values)

        connection.commit()

        return cursor.rowcount

    except Exception as e:
        print("DATABASE ERROR:", e)
        raise

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ==============================
# Delete Prediction
# ==============================

def delete_prediction(prediction_id):
    connection = None
    cursor = None

    try:
        connection = get_connection()

        cursor = connection.cursor()

        query = """
            DELETE FROM predictions
            WHERE id = %s
        """

        cursor.execute(query, (prediction_id,))

        connection.commit()

        return cursor.rowcount

    except Exception as e:
        print("DATABASE ERROR:", e)
        raise

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()
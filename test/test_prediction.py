from src.prediction import predict_marks


# ==========================================
# TEST BASIC PREDICTION
# ==========================================

def test_prediction_returns_number():

    result = predict_marks(
        study_hours=6,
        attendance=85,
        previous_marks=75,
        assignment_score=80
    )

    assert isinstance(result, (int, float))


# ==========================================
# TEST PREDICTION IS NOT EMPTY
# ==========================================

def test_prediction_not_none():

    result = predict_marks(
        study_hours=6,
        attendance=85,
        previous_marks=75,
        assignment_score=80
    )

    assert result is not None


# ==========================================
# TEST PREDICTION RANGE
# ==========================================

def test_prediction_reasonable_range():

    result = predict_marks(
        study_hours=6,
        attendance=85,
        previous_marks=75,
        assignment_score=80
    )

    assert 0 <= result <= 100


# ==========================================
# TEST DIFFERENT INPUTS
# ==========================================

def test_prediction_with_different_input():

    result = predict_marks(
        study_hours=2,
        attendance=60,
        previous_marks=50,
        assignment_score=55
    )

    assert isinstance(result, (int, float))


# ==========================================
# TEST HIGH PERFORMANCE INPUT
# ==========================================

def test_high_performance_prediction():

    result = predict_marks(
        study_hours=10,
        attendance=95,
        previous_marks=90,
        assignment_score=95
    )

    assert isinstance(result, (int, float))
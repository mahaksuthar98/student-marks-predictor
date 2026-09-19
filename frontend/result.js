const resultMessage =
    document.getElementById("resultMessage");

const resultStudent =
    document.getElementById("resultStudent");

const resultInitial =
    document.getElementById("resultInitial");

const predictedMarks =
    document.getElementById("predictedMarks");

const studyHours =
    document.getElementById("studyHours");

const attendance =
    document.getElementById("attendance");

const previousMarks =
    document.getElementById("previousMarks");

const assignmentScore =
    document.getElementById("assignmentScore");


function formatNumber(value) {

    const number = Number(value);

    return Number.isNaN(number)
        ? "-"
        : number.toFixed(2);
}


function showError(message) {

    resultMessage.textContent = message;

    resultMessage.className =
        "message error-message";

    resultMessage.style.display =
        "block";
}


function loadResult() {

    const stored =
        sessionStorage.getItem(
            "predictionResult"
        );


    if (!stored) {

        showError(
            "Prediction result is not available."
        );

        return;
    }


    try {

        const result =
            JSON.parse(stored);


        const name =
            result.student_name ||
            result.studentName ||
            "-";


        resultStudent.textContent =
            name;


        resultInitial.textContent =
            name
                .trim()
                .charAt(0)
                .toUpperCase() || "?";


        predictedMarks.textContent =
            formatNumber(
                result.predicted_marks ??
                result.predictedMarks
            );


        studyHours.textContent =
            `${formatNumber(
                result.study_hours ??
                result.studyHours
            )} hrs`;


        attendance.textContent =
            `${formatNumber(
                result.attendance
            )}%`;


        previousMarks.textContent =
            formatNumber(
                result.previous_marks ??
                result.previousMarks
            );


        assignmentScore.textContent =
            formatNumber(
                result.assignment_score ??
                result.assignmentScore
            );


    } catch (error) {

        console.error(error);

        showError(
            "Unable to read the prediction result."
        );
    }
}


document.addEventListener(
    "DOMContentLoaded",
    loadResult
);
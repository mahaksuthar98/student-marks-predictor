const API_URL = "http://127.0.0.1:8000";

const editForm =
    document.getElementById("editForm");

const studentName =
    document.getElementById("studentName");

const studyHours =
    document.getElementById("studyHours");

const attendance =
    document.getElementById("attendance");

const previousMarks =
    document.getElementById("previousMarks");

const assignmentScore =
    document.getElementById("assignmentScore");

const updateBtn =
    document.getElementById("updateBtn");

const viewPredictionBtn =
    document.getElementById("viewPredictionBtn");

const messageBox =
    document.getElementById("messageBox");


const recordId =
    sessionStorage.getItem(
        "editPredictionId"
    );


function showMessage(message, type = "error") {

    messageBox.textContent = message;

    messageBox.className =
        `message ${type}-message`;

    messageBox.style.display = "block";
}


function validateForm() {

    const hours =
        Number(studyHours.value);

    const attendanceValue =
        Number(attendance.value);

    const previous =
        Number(previousMarks.value);

    const assignment =
        Number(assignmentScore.value);


    if (!studentName.value.trim()) {
        showMessage(
            "Student name is required.",
            "warning"
        );
        return false;
    }


    if (hours < 0 || hours > 24) {
        showMessage(
            "Study hours must be between 0 and 24.",
            "warning"
        );
        return false;
    }


    if (
        attendanceValue < 0 ||
        attendanceValue > 100
    ) {
        showMessage(
            "Attendance must be between 0 and 100.",
            "warning"
        );
        return false;
    }


    if (
        previous < 0 ||
        previous > 100
    ) {
        showMessage(
            "Previous marks must be between 0 and 100.",
            "warning"
        );
        return false;
    }


    if (
        assignment < 0 ||
        assignment > 100
    ) {
        showMessage(
            "Assignment score must be between 0 and 100.",
            "warning"
        );
        return false;
    }


    return true;
}


async function loadRecord() {

    if (!recordId) {

        window.location.href =
            "records.html";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/predictions/${recordId}`
            );


        if (!response.ok) {
            throw new Error();
        }


        const record =
            await response.json();


        studentName.value =
            record.student_name ?? "";

        studyHours.value =
            record.study_hours ?? "";

        attendance.value =
            record.attendance ?? "";

        previousMarks.value =
            record.previous_marks ?? "";

        assignmentScore.value =
            record.assignment_score ?? "";


        sessionStorage.setItem(
            "viewPrediction",
            JSON.stringify(record)
        );


    } catch {

        showMessage(
            "Unable to load this prediction record."
        );
    }
}


editForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        if (!validateForm()) {
            return;
        }


        updateBtn.disabled = true;

        updateBtn.textContent =
            "Updating...";


        try {

            const payload = {

                student_name:
                    studentName.value.trim(),

                study_hours:
                    Number(studyHours.value),

                attendance:
                    Number(attendance.value),

                previous_marks:
                    Number(previousMarks.value),

                assignment_score:
                    Number(assignmentScore.value)

            };


            const response =
                await fetch(
                    `${API_URL}/predictions/${recordId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(payload)
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Update failed."
                );
            }


            const updatedRecord =
                await response.json();


            sessionStorage.setItem(
                "predictionResult",
                JSON.stringify(updatedRecord)
            );


            sessionStorage.setItem(
                "viewPrediction",
                JSON.stringify(updatedRecord)
            );


            window.location.href =
                "result.html";


        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to update the prediction.",
                "error"
            );


            updateBtn.disabled = false;

            updateBtn.textContent =
                "Update Prediction";
        }

    }
);


viewPredictionBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "view.html";

    }
);


document.addEventListener(
    "DOMContentLoaded",
    loadRecord
);
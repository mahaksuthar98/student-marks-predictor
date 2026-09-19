const API_URL = "http://127.0.0.1:8000";

const studentName =
    document.getElementById("studentName");

const predictionId =
    document.getElementById("predictionId");

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

const studentAvatar =
    document.getElementById("studentAvatar");

const editBtn =
    document.getElementById("editPredictionBtn");

const deleteBtn =
    document.getElementById("deletePredictionBtn");

const messageBox =
    document.getElementById("messageBox");


function formatNumber(value) {

    const number = Number(value);

    return Number.isNaN(number)
        ? "-"
        : number.toFixed(2);
}


function showMessage(message, type = "error") {

    messageBox.textContent = message;

    messageBox.className =
        `message ${type}-message`;

    messageBox.style.display = "block";
}


function displayRecord(record) {

    studentName.textContent =
        record.student_name ?? "-";

    predictionId.textContent =
        `#${record.id ?? "-"}`;

    predictedMarks.textContent =
        formatNumber(record.predicted_marks);

    studyHours.textContent =
        `${formatNumber(record.study_hours)} hrs`;

    attendance.textContent =
        `${formatNumber(record.attendance)}%`;

    previousMarks.textContent =
        formatNumber(record.previous_marks);

    assignmentScore.textContent =
        formatNumber(record.assignment_score);


    const name =
        String(record.student_name || "?").trim();

    studentAvatar.textContent =
        name.charAt(0).toUpperCase();


    sessionStorage.setItem(
        "viewPrediction",
        JSON.stringify(record)
    );
}


async function loadRecord() {

    const stored =
        sessionStorage.getItem("viewPrediction");


    if (!stored) {

        window.location.href =
            "records.html";

        return;
    }


    let value;

    try {

        value =
            JSON.parse(stored);

    } catch {

        value = stored;
    }


    try {

        let record;


        if (typeof value === "object") {

            record = value;

        } else {

            const response =
                await fetch(
                    `${API_URL}/predictions/${value}`
                );

            if (!response.ok) {
                throw new Error("Record not found.");
            }

            record =
                await response.json();
        }


        displayRecord(record);


        editBtn.onclick = () => {

            sessionStorage.setItem(
                "editPredictionId",
                String(record.id)
            );

            window.location.href =
                "edit.html";
        };


        deleteBtn.onclick =
            () => deleteRecord(record.id);


    } catch (error) {

        showMessage(
            "Unable to load this prediction record."
        );
    }
}


async function deleteRecord(id) {

    const confirmed =
        confirm(
            "Move this prediction record to Trash?"
        );

    if (!confirmed) return;


    try {

        const response =
            await fetch(
                `${API_URL}/predictions/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {
            throw new Error();
        }


        sessionStorage.removeItem(
            "viewPrediction"
        );


        window.location.href =
            "records.html";


    } catch {

        showMessage(
            "Unable to delete this record."
        );
    }
}


document.addEventListener(
    "DOMContentLoaded",
    loadRecord
);
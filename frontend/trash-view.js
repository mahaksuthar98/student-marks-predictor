// ============================================================
// TRASH VIEW PAGE
// ============================================================

const API_URL = "http://127.0.0.1:8000";


// ============================================================
// ELEMENTS
// ============================================================

const studentName =
    document.getElementById("studentName");

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

const restoreBtn =
    document.getElementById("restoreBtn");

const deleteBtn =
    document.getElementById("deleteTrashBtn");

const messageBox =
    document.getElementById("messageBox");


// ============================================================
// FORMAT NUMBER
// ============================================================

function formatNumber(value) {

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "--";
    }

    return number
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1");
}


// ============================================================
// INITIAL
// ============================================================

function getInitial(name) {

    const value =
        String(name || "?").trim();

    return value
        .charAt(0)
        .toUpperCase();
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// MESSAGE
// ============================================================

function showMessage(
    message,
    type = "info"
) {

    if (!messageBox) {
        return;
    }

    messageBox.textContent =
        message;

    messageBox.className =
        `message ${type}-message`;

    messageBox.style.display =
        "block";
}


// ============================================================
// LOAD DELETED RECORD
// ============================================================

async function loadDeletedRecord() {

    /*
     * Get the ID saved by trash.js
     */

    const storedId =
        sessionStorage.getItem(
            "deletedPredictionId"
        );


    console.log(
        "Deleted Prediction ID:",
        storedId
    );


    // --------------------------------------------------------
    // ID NOT FOUND
    // --------------------------------------------------------

    if (!storedId) {

        showMessage(
            "Deleted prediction record could not be found.",
            "error"
        );

        return;
    }


    try {

        showMessage(
            "Loading deleted prediction...",
            "loading"
        );


        // ----------------------------------------------------
        // Get ALL trash records
        // ----------------------------------------------------

        const response =
            await fetch(
                `${API_URL}/trash`
            );


        if (!response.ok) {

            throw new Error(
                `Trash API returned ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "TRASH RESPONSE:",
            data
        );


        /*
         * Your FastAPI response is:
         *
         * {
         *     "count": 4,
         *     "predictions": [...]
         * }
         *
         * Therefore we MUST use data.predictions.
         */

        const records =
            Array.isArray(data.predictions)
                ? data.predictions
                : [];


        console.log(
            "TRASH RECORDS:",
            records
        );


        // ----------------------------------------------------
        // Find selected record
        // ----------------------------------------------------

        const record =
            records.find(
                item =>
                    String(item.id) ===
                    String(storedId)
            );


        console.log(
            "SELECTED DELETED RECORD:",
            record
        );


        // ----------------------------------------------------
        // Record not found
        // ----------------------------------------------------

        if (!record) {

            showMessage(
                "Deleted prediction record could not be found.",
                "error"
            );

            return;
        }


        // ----------------------------------------------------
        // Display record
        // ----------------------------------------------------

        displayRecord(record);


        // Hide loading message

        if (messageBox) {
            messageBox.style.display =
                "none";
        }


    } catch (error) {

        console.error(
            "TRASH VIEW ERROR:",
            error
        );


        showMessage(
            "Unable to load deleted prediction.",
            "error"
        );
    }
}


// ============================================================
// DISPLAY RECORD
// ============================================================

function displayRecord(record) {

    const name =
        record.student_name ??
        "Unknown";


    const id =
        record.id ??
        "--";


    const study =
        record.study_hours ??
        0;


    const attendanceValue =
        record.attendance ??
        0;


    const previous =
        record.previous_marks ??
        0;


    const assignment =
        record.assignment_score ??
        0;


    const predicted =
        record.predicted_marks ??
        0;


    // --------------------------------------------------------
    // Student
    // --------------------------------------------------------

    if (studentName) {

        studentName.textContent =
            name;
    }


    // --------------------------------------------------------
    // Predicted marks
    // --------------------------------------------------------

    if (predictedMarks) {

        predictedMarks.textContent =
            formatNumber(predicted);
    }


    // --------------------------------------------------------
    // Study hours
    // --------------------------------------------------------

    if (studyHours) {

        studyHours.textContent =
            formatNumber(study);
    }


    // --------------------------------------------------------
    // Attendance
    // --------------------------------------------------------

    if (attendance) {

        attendance.textContent =
            `${formatNumber(
                attendanceValue
            )}%`;
    }


    // --------------------------------------------------------
    // Previous marks
    // --------------------------------------------------------

    if (previousMarks) {

        previousMarks.textContent =
            formatNumber(previous);
    }


    // --------------------------------------------------------
    // Assignment score
    // --------------------------------------------------------

    if (assignmentScore) {

        assignmentScore.textContent =
            formatNumber(assignment);
    }


    // --------------------------------------------------------
    // Prediction ID
    // --------------------------------------------------------

    const predictionIdElement =
        document.getElementById(
            "predictionId"
        );


    if (predictionIdElement) {

        predictionIdElement.textContent =
            `#${id}`;
    }


    // --------------------------------------------------------
    // Student Avatar
    // --------------------------------------------------------

    const avatar =
        document.querySelector(
            ".deleted-student-avatar"
        );


    if (avatar) {

        avatar.textContent =
            getInitial(name);
    }


    // --------------------------------------------------------
    // Save current record
    // --------------------------------------------------------

    sessionStorage.setItem(
        "deletedPrediction",
        JSON.stringify(record)
    );
}


// ============================================================
// RESTORE
// ============================================================

async function restoreRecord() {

    const id =
        sessionStorage.getItem(
            "deletedPredictionId"
        );


    if (!id) {

        showMessage(
            "Deleted prediction ID is missing.",
            "error"
        );

        return;
    }


    if (
        !confirm(
            "Restore this prediction record?"
        )
    ) {
        return;
    }


    try {

        if (restoreBtn) {

            restoreBtn.disabled =
                true;

            restoreBtn.textContent =
                "Restoring...";
        }


        const response =
            await fetch(
                `${API_URL}/trash/${id}/restore`,
                {
                    method: "PATCH"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Restore failed: ${response.status}`
            );
        }


        sessionStorage.removeItem(
            "deletedPredictionId"
        );


        sessionStorage.removeItem(
            "deletedPrediction"
        );


        alert(
            "Prediction restored successfully."
        );


        window.location.href =
            "records.html";


    } catch (error) {

        console.error(
            "RESTORE ERROR:",
            error
        );


        if (restoreBtn) {

            restoreBtn.disabled =
                false;

            restoreBtn.textContent =
                "Restore Prediction";
        }


        showMessage(
            "Unable to restore this prediction.",
            "error"
        );
    }
}


// ============================================================
// PERMANENT DELETE
// ============================================================

async function permanentlyDeleteRecord() {

    const id =
        sessionStorage.getItem(
            "deletedPredictionId"
        );


    if (!id) {

        showMessage(
            "Deleted prediction ID is missing.",
            "error"
        );

        return;
    }


    if (
        !confirm(
            "Permanently delete this record?\n\n" +
            "This action cannot be undone."
        )
    ) {
        return;
    }


    try {

        if (deleteBtn) {

            deleteBtn.disabled =
                true;

            deleteBtn.textContent =
                "Deleting...";
        }


        const response =
            await fetch(
                `${API_URL}/trash/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Delete failed: ${response.status}`
            );
        }


        sessionStorage.removeItem(
            "deletedPredictionId"
        );


        sessionStorage.removeItem(
            "deletedPrediction"
        );


        alert(
            "Record permanently deleted."
        );


        window.location.href =
            "trash.html";


    } catch (error) {

        console.error(
            "PERMANENT DELETE ERROR:",
            error
        );


        if (deleteBtn) {

            deleteBtn.disabled =
                false;

            deleteBtn.textContent =
                "Delete Permanently";
        }


        showMessage(
            "Unable to permanently delete the record.",
            "error"
        );
    }
}


// ============================================================
// BACK TO TRASH
// ============================================================

function goBackToTrash() {

    window.location.href =
        "trash.html";
}


// ============================================================
// BUTTON EVENTS
// ============================================================

if (restoreBtn) {

    restoreBtn.addEventListener(
        "click",
        restoreRecord
    );
}


if (deleteBtn) {

    deleteBtn.addEventListener(
        "click",
        permanentlyDeleteRecord
    );
}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    loadDeletedRecord
);
// ============================================================
// TRASH PAGE
// ============================================================

const API_URL = "http://127.0.0.1:8000";

const trashTable =
    document.getElementById("trashTable");

const trashRecordCount =
    document.getElementById("trashRecordCount");

const trashEmptyState =
    document.getElementById("trashEmptyState");

const messageBox =
    document.getElementById("messageBox");


// ============================================================
// FORMAT NUMBER
// ============================================================

function formatNumber(value) {

    const number = Number(value);

    if (Number.isNaN(number)) {
        return "-";
    }

    return number
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1");
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
// SHOW MESSAGE
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
// LOAD TRASH
// ============================================================

async function loadTrash() {

    if (trashTable) {

        trashTable.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="table-loading"
                >
                    Loading deleted records...
                </td>
            </tr>
        `;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/trash`
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "TRASH API RESPONSE:",
            data
        );


        // ====================================================
        // GET RECORDS FROM API RESPONSE
        // ====================================================

        let records = [];


        if (Array.isArray(data)) {

            records = data;

        }

        else if (
            data &&
            Array.isArray(data.predictions)
        ) {

            records = data.predictions;

        }

        else if (
            data &&
            Array.isArray(data.records)
        ) {

            records = data.records;

        }

        else if (
            data &&
            Array.isArray(data.trash)
        ) {

            records = data.trash;

        }

        else if (
            data &&
            Array.isArray(data.data)
        ) {

            records = data.data;
        }


        console.log(
            "TRASH RECORDS:",
            records
        );


        // ====================================================
        // SORT BY PREDICTION ID - ASCENDING
        // ====================================================

        records = [...records].sort(
            (a, b) => {

                const idA = Number(
                    a.id ??
                    a.prediction_id ??
                    a.predictionId ??
                    0
                );


                const idB = Number(
                    b.id ??
                    b.prediction_id ??
                    b.predictionId ??
                    0
                );


                return idA - idB;
            }
        );


        displayTrash(records);


    }

    catch (error) {

        console.error(
            "TRASH ERROR:",
            error
        );


        if (trashTable) {

            trashTable.innerHTML = `
                <tr>
                    <td
                        colspan="9"
                        class="table-error"
                    >
                        Unable to load Trash records.
                    </td>
                </tr>
            `;
        }


        if (trashRecordCount) {

            trashRecordCount.textContent =
                "0";
        }


        if (trashEmptyState) {

            trashEmptyState.style.display =
                "none";
        }


        showMessage(
            "Unable to connect to FastAPI.",
            "error"
        );
    }
}


// ============================================================
// DISPLAY TRASH RECORDS
// ============================================================

function displayTrash(records) {

    if (!Array.isArray(records)) {
        records = [];
    }


    // ========================================================
    // UPDATE COUNT
    // ========================================================

    if (trashRecordCount) {

        trashRecordCount.textContent =
            records.length;
    }


    // ========================================================
    // EMPTY TRASH
    // ========================================================

    if (records.length === 0) {

        if (trashTable) {

            trashTable.innerHTML = "";
        }


        if (trashEmptyState) {

            trashEmptyState.style.display =
                "flex";
        }


        return;
    }


    // ========================================================
    // RECORDS FOUND
    // ========================================================

    if (trashEmptyState) {

        trashEmptyState.style.display =
            "none";
    }


    if (!trashTable) {

        console.error(
            "trashTable not found."
        );

        return;
    }


    // ========================================================
    // CREATE TABLE ROWS
    // ========================================================

    trashTable.innerHTML =
        records.map(
            (record, index) => {


                // ------------------------------------------------
                // PREDICTION ID
                // ------------------------------------------------

                const id =
                    record.id ??
                    record.prediction_id ??
                    record.predictionId ??
                    "";


                // ------------------------------------------------
                // STUDENT NAME
                // ------------------------------------------------

                const name =
                    record.student_name ??
                    record.studentName ??
                    record.name ??
                    "Unknown";


                // ------------------------------------------------
                // STUDY HOURS
                // ------------------------------------------------

                const studyHours =
                    record.study_hours ??
                    record.studyHours ??
                    0;


                // ------------------------------------------------
                // ATTENDANCE
                // ------------------------------------------------

                const attendance =
                    record.attendance ??
                    0;


                // ------------------------------------------------
                // PREVIOUS MARKS
                // ------------------------------------------------

                const previousMarks =
                    record.previous_marks ??
                    record.previousMarks ??
                    0;


                // ------------------------------------------------
                // ASSIGNMENT SCORE
                // ------------------------------------------------

                const assignmentScore =
                    record.assignment_score ??
                    record.assignmentScore ??
                    0;


                // ------------------------------------------------
                // PREDICTED MARKS
                // ------------------------------------------------

                const predictedMarks =
                    record.predicted_marks ??
                    record.predictedMarks ??
                    record.prediction ??
                    0;


                return `

                    <tr>


                        <!-- NUMBER -->

                        <td>

                            <span class="row-number">

                                ${index + 1}

                            </span>

                        </td>



                        <!-- PREDICTION ID -->

                        <td>

                            <span class="id-badge">

                                ${escapeHTML(String(id))}

                            </span>

                        </td>



                        <!-- STUDENT -->

                        <td>

                            <span class="student-name-highlight">

                                ${escapeHTML(String(name))}

                            </span>

                        </td>



                        <!-- STUDY HOURS -->

                        <td>

                            <span class="data-value">

                                ${formatNumber(studyHours)}

                                

                            </span>

                        </td>



                        <!-- ATTENDANCE -->

                        <td>

                            <span class="data-value">

                                ${formatNumber(attendance)}%

                            </span>

                        </td>



                        <!-- PREVIOUS MARKS -->

                        <td>

                            <span class="data-value">

                                ${formatNumber(previousMarks)}

                            </span>

                        </td>



                        <!-- ASSIGNMENT -->

                        <td>

                            <span class="data-value">

                                ${formatNumber(assignmentScore)}

                            </span>

                        </td>



                        <!-- PREDICTED MARKS -->

                        <td>

                            <span class="marks-badge">

                                ${formatNumber(predictedMarks)}

                            </span>

                        </td>



                        <!-- ACTIONS -->

                        <td>

                            <div class="table-actions">


                                <!-- VIEW -->

                                <button
                                    type="button"
                                    class="action-btn view-btn"
                                    onclick="viewDeletedPrediction(${id})"
                                >

                                    View

                                </button>



                                <!-- RESTORE -->

                                <button
                                    type="button"
                                    class="action-btn restore-btn"
                                    onclick="restorePrediction(${id})"
                                >

                                    Restore

                                </button>



                                <!-- PERMANENT DELETE -->

                                <button
                                    type="button"
                                    class="action-btn delete-btn"
                                    onclick="permanentDelete(${id})"
                                >

                                    Delete

                                </button>


                            </div>

                        </td>


                    </tr>

                `;
            }
        )
        .join("");
}


// ============================================================
// VIEW DELETED RECORD
// ============================================================

function viewDeletedPrediction(id) {

    sessionStorage.setItem(
        "deletedPredictionId",
        String(id)
    );


    window.location.href =
        "trash-view.html";
}


// ============================================================
// RESTORE RECORD
// ============================================================

async function restorePrediction(id) {

    if (
        !confirm(
            "Restore this prediction record?"
        )
    ) {

        return;
    }


    try {

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


        showMessage(
            "Prediction record restored successfully.",
            "success"
        );


        await loadTrash();


    }

    catch (error) {

        console.error(
            "RESTORE ERROR:",
            error
        );


        showMessage(
            "Unable to restore this record.",
            "error"
        );
    }
}


// ============================================================
// PERMANENT DELETE
// ============================================================

async function permanentDelete(id) {

    if (
        !confirm(
            "Permanently delete this record?\n\n" +
            "This action cannot be undone."
        )
    ) {

        return;
    }


    try {

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


        showMessage(
            "Record permanently deleted.",
            "success"
        );


        await loadTrash();


    }

    catch (error) {

        console.error(
            "PERMANENT DELETE ERROR:",
            error
        );


        showMessage(
            "Unable to permanently delete the record.",
            "error"
        );
    }
}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    loadTrash
);
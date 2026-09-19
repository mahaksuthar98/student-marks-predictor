// ============================================================
// RECORDS PAGE
// ============================================================

const API_URL = "http://127.0.0.1:8000";


// ============================================================
// ELEMENTS
// ============================================================

const recordsTable = document.getElementById("recordsTable");
const recordCount = document.getElementById("recordCount");
const recordsMessage = document.getElementById("recordsMessage");

const searchId = document.getElementById("searchId");
const searchName = document.getElementById("searchName");

const searchIdBtn = document.getElementById("searchIdBtn");
const searchNameBtn = document.getElementById("searchNameBtn");
const showAllBtn = document.getElementById("showAllBtn");

const pagination = document.getElementById("pagination");


// ============================================================
// PAGINATION SETTINGS
// ============================================================

let allRecords = [];
let currentPage = 1;

const recordsPerPage = 5;


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    loadRecords();


    if (searchIdBtn) {
        searchIdBtn.addEventListener("click", searchById);
    }


    if (searchNameBtn) {
        searchNameBtn.addEventListener("click", searchByName);
    }


    if (showAllBtn) {
        showAllBtn.addEventListener("click", loadRecords);
    }


    if (searchId) {

        searchId.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {
                searchById();
            }

        });

    }


    if (searchName) {

        searchName.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {
                searchByName();
            }

        });

    }

});


// ============================================================
// LOAD ALL RECORDS
// ============================================================

async function loadRecords() {

    showMessage(
        "Loading prediction records...",
        "loading"
    );


    try {

        const response = await fetch(
            `${API_URL}/predictions`
        );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data = await response.json();

        console.log("API RESPONSE:", data);


        const records = normalizeRecords(data);


        allRecords = records;
        currentPage = 1;


        displayRecords(records);


    } catch (error) {

        console.error(
            "LOAD RECORDS ERROR:",
            error
        );


        displayError(
            "Unable to load records. Make sure FastAPI is running."
        );

    }

}


// ============================================================
// NORMALIZE API RESPONSE
// ============================================================

function normalizeRecords(data) {

    // Case 1:
    // API returns directly:
    // [ {...}, {...} ]

    if (Array.isArray(data)) {
        return data;
    }


    // Case 2:
    // API returns:
    // { "predictions": [...] }

    if (
        data &&
        Array.isArray(data.predictions)
    ) {
        return data.predictions;
    }


    // Case 3:
    // API returns:
    // { "records": [...] }

    if (
        data &&
        Array.isArray(data.records)
    ) {
        return data.records;
    }


    // Case 4:
    // API returns:
    // { "data": [...] }

    if (
        data &&
        Array.isArray(data.data)
    ) {
        return data.data;
    }


    return [];

}


// ============================================================
// DISPLAY RECORDS
// ============================================================

function displayRecords(records) {

    hideMessage();
    records = [...records].sort((a, b) => {
    const idA = Number(a.id ?? a.prediction_id ?? a.predictionId ?? 0);
    const idB = Number(b.id ?? b.prediction_id ?? b.predictionId ?? 0);

    return idB- idA;
});


    if (!recordsTable) {

        console.error(
            "ERROR: recordsTable element not found."
        );

        return;

    }


    if (!records || records.length === 0) {

        recordsTable.innerHTML = `

            <tr>

                <td colspan="9" class="table-empty">

                    <div class="empty-state">

                        <div class="empty-state-icon">
                            📋
                        </div>

                        <h3>
                            No Prediction Records
                        </h3>

                        <p>
                            No prediction records are available.
                        </p>

                        <a
                            href="index.html"
                            class="empty-state-btn"
                        >
                            + New Prediction
                        </a>

                    </div>

                </td>

            </tr>

        `;


        updateRecordCount(0);

        clearPagination();

        return;

    }


    updateRecordCount(records.length);


    renderCurrentPage(records);

}


// ============================================================
// RENDER CURRENT PAGE
// ============================================================

function renderCurrentPage(records) {

    const startIndex =
        (currentPage - 1) * recordsPerPage;


    const endIndex =
        startIndex + recordsPerPage;


    const pageRecords =
        records.slice(startIndex, endIndex);


    recordsTable.innerHTML = pageRecords

        .map((record, index) => {

            const id =
                record.id ??
                record.prediction_id ??
                record.predictionId ??
                "";


            const name =
                record.student_name ??
                record.studentName ??
                "Unknown";


            const studyHours =
                record.study_hours ??
                record.studyHours ??
                0;


            const attendance =
                record.attendance ?? 0;


            const previousMarks =
                record.previous_marks ??
                record.previousMarks ??
                0;


            const assignmentScore =
                record.assignment_score ??
                record.assignmentScore ??
                0;


            const predictedMarks =
                record.predicted_marks ??
                record.predictedMarks ??
                record.prediction ??
                0;


            const rowNumber =
                startIndex + index + 1;


            return `

                <tr>

                    <!-- ROW NUMBER -->

                    <td>

                        <span class="row-number">
                            ${rowNumber}
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

                            <button
                                class="action-btn view-btn"
                                onclick="viewRecord(${id})"
                            >
                                View
                            </button>


                            <button
                                class="action-btn edit-btn"
                                onclick="editRecord(${id})"
                            >
                                Edit
                            </button>


                            <button
                                class="action-btn delete-btn"
                                onclick="deleteRecord(${id})"
                            >
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        })

        .join("");


    renderPagination(records);


    attachTableActions();

}


// ============================================================
// PAGINATION
// ============================================================

function renderPagination(records) {

    if (!pagination) {
        return;
    }


    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            records.length / recordsPerPage
        );


    // No pagination required
    if (totalPages <= 1) {
        return;
    }


    // PREVIOUS BUTTON

    const previousButton =
        document.createElement("button");


    previousButton.textContent =
        "‹ Previous";


    previousButton.className =
        "page-btn";


    previousButton.disabled =
        currentPage === 1;


    previousButton.addEventListener(
        "click",
        () => {

            if (currentPage > 1) {

                currentPage--;

                renderCurrentPage(allRecords);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    pagination.appendChild(
        previousButton
    );


    // PAGE NUMBERS

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            document.createElement("button");


        pageButton.textContent =
            page;


        pageButton.className =
            "page-btn";


        if (page === currentPage) {

            pageButton.classList.add(
                "active"
            );

        }


        pageButton.addEventListener(
            "click",
            () => {

                currentPage = page;

                renderCurrentPage(allRecords);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        pagination.appendChild(
            pageButton
        );

    }


    // NEXT BUTTON

    const nextButton =
        document.createElement("button");


    nextButton.textContent =
        "Next ›";


    nextButton.className =
        "page-btn";


    nextButton.disabled =
        currentPage === totalPages;


    nextButton.addEventListener(
        "click",
        () => {

            if (currentPage < totalPages) {

                currentPage++;

                renderCurrentPage(allRecords);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    pagination.appendChild(
        nextButton
    );

}


// ============================================================
// CLEAR PAGINATION
// ============================================================

function clearPagination() {

    if (pagination) {
        pagination.innerHTML = "";
    }

}


// ============================================================
// SEARCH BY ID
// ============================================================

async function searchById() {

    const id =
        searchId.value.trim();


    if (!id) {

        showMessage(
            "Please enter a prediction ID.",
            "error"
        );

        return;

    }


    showMessage(
        "Searching prediction...",
        "loading"
    );


    try {

        const response = await fetch(
            `${API_URL}/predictions/${encodeURIComponent(id)}`
        );


        if (!response.ok) {

            if (response.status === 404) {

                displayError(
                    "No prediction found with this ID."
                );

                return;

            }


            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "SEARCH BY ID:",
            data
        );


        const record =
            data.record ??
            data.prediction ??
            data;


        allRecords = [record];

        currentPage = 1;


        displayRecords(
            allRecords
        );


    } catch (error) {

        console.error(
            "SEARCH ID ERROR:",
            error
        );


        displayError(
            "Unable to search this prediction."
        );

    }

}


// ============================================================
// SEARCH BY NAME
// ============================================================

async function searchByName() {

    const name =
        searchName.value.trim();


    if (!name) {

        showMessage(
            "Please enter a student name.",
            "error"
        );

        return;

    }


    showMessage(
        "Searching student records...",
        "loading"
    );


    try {

        const response = await fetch(
            `${API_URL}/predictions/search/${encodeURIComponent(name)}`
        );


        if (!response.ok) {

            if (response.status === 404) {

                displayError(
                    "No records found for this student."
                );

                return;

            }


            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "SEARCH BY NAME:",
            data
        );


        const records =
            normalizeRecords(data);


        allRecords = records;

        currentPage = 1;


        displayRecords(
            records
        );


    } catch (error) {

        console.error(
            "SEARCH NAME ERROR:",
            error
        );


        displayError(
            "Unable to search student records."
        );

    }

}


// ============================================================
// TABLE ACTIONS
// ============================================================

function attachTableActions() {

    const buttons =
        document.querySelectorAll(
            "[data-action]"
        );


    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                const id =
                    button.dataset.id;


                if (action === "view") {
                    viewRecord(id);
                }


                if (action === "edit") {
                    editRecord(id);
                }


                if (action === "delete") {
                    deleteRecord(id);
                }

            }
        );

    });

}


// ============================================================
// VIEW RECORD
// ============================================================

async function viewRecord(id) {

    try {

        const response = await fetch(
            `${API_URL}/predictions/${id}`
        );


        if (!response.ok) {

            throw new Error(
                "Record not found"
            );

        }


        const data =
            await response.json();


        const record =
            data.record ??
            data.prediction ??
            data;


        sessionStorage.setItem(
            "viewPrediction",
            JSON.stringify(record)
        );


        window.location.href =
            "view.html";


    } catch (error) {

        console.error(
            "VIEW ERROR:",
            error
        );


        showMessage(
            "Unable to open this prediction.",
            "error"
        );

    }

}


// ============================================================
// EDIT RECORD
// ============================================================

function editRecord(id) {

    sessionStorage.setItem(
        "editPredictionId",
        id
    );


    window.location.href =
        "edit.html";

}


// ============================================================
// DELETE RECORD
// ============================================================

async function deleteRecord(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this prediction?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/predictions/${id}`,
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
            "Prediction deleted successfully.",
            "success"
        );


        setTimeout(() => {

            loadRecords();

        }, 500);


    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        showMessage(
            "Unable to delete this prediction.",
            "error"
        );

    }

}


// ============================================================
// RECORD COUNT
// ============================================================

function updateRecordCount(count) {

    if (!recordCount) {
        return;
    }


    recordCount.textContent =
        `${count} Record${count === 1 ? "" : "s"}`;

}


// ============================================================
// MESSAGE
// ============================================================

function showMessage(message, type) {

    if (!recordsMessage) {
        return;
    }


    recordsMessage.textContent =
        message;


    recordsMessage.className =
        `records-message ${type}`;


    recordsMessage.style.display =
        "block";

}


function hideMessage() {

    if (!recordsMessage) {
        return;
    }


    recordsMessage.style.display =
        "none";

}


function displayError(message) {

    if (!recordsTable) {
        return;
    }


    recordsTable.innerHTML = `

        <tr>

            <td colspan="9">

                <div class="empty-state error-state">

                    <div class="empty-state-icon">
                        ⚠
                    </div>

                    <h3>
                        Unable to Load Records
                    </h3>

                    <p>
                        ${escapeHTML(message)}
                    </p>

                    <button
                        class="empty-state-btn"
                        onclick="loadRecords()"
                    >
                        Try Again
                    </button>

                </div>

            </td>

        </tr>

    `;


    updateRecordCount(0);

    clearPagination();


    showMessage(
        message,
        "error"
    );

}


// ============================================================
// NUMBER FORMAT
// ============================================================

function formatNumber(value) {

    const number =
        Number(value);


    if (Number.isNaN(number)) {
        return "0";
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

    if (!name) {
        return "?";
    }


    return String(name)
        .trim()
        .charAt(0)
        .toUpperCase();

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
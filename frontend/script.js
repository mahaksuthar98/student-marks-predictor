// ======================================================
// STUDENT MARKS PREDICTOR - FRONTEND JAVASCRIPT
// ======================================================

const API_URL = "http://127.0.0.1:8000";


// ======================================================
// ELEMENTS
// ======================================================

const form = document.getElementById("predictionForm");

const formCard = document.getElementById("formCard");

const formTitle = document.getElementById("formTitle");

const submitBtn = document.getElementById("submitBtn");

const resultCard = document.getElementById("resultCard");

const resultStudent = document.getElementById("resultStudent");

const predictedMarks = document.getElementById("predictedMarks");

const predictionTable = document.getElementById("predictionTable");

const messageBox = document.getElementById("messageBox");


// ======================================================
// SHOW MESSAGE
// ======================================================

function showMessage(message, type = "info") {

    messageBox.textContent = message;

    messageBox.className = "message";

    if (type === "success") {

        messageBox.classList.add("success-message");

    } else if (type === "error") {

        messageBox.classList.add("error-message");

    } else {

        messageBox.classList.add("info-message");

    }

    messageBox.style.display = "block";
}


// ======================================================
// HIDE MESSAGE
// ======================================================

function hideMessage() {

    messageBox.style.display = "none";

}


// ======================================================
// LOAD ALL PREDICTIONS
// ======================================================

async function loadPredictions() {

    try {

        const response =
            await fetch(`${API_URL}/predictions`);

        if (!response.ok) {

            throw new Error("Unable to load predictions.");

        }

        const data =
            await response.json();

        console.log("FastAPI Response:", data);

        // IMPORTANT:
        // FastAPI returns:
        //
        // {
        //     count: 8,
        //     predictions: [...]
        // }

        const records =
            data.predictions || [];

        console.log("Prediction Records:", records);

        displayRecords(records);

        updateDashboard(records);

    }
    catch (error) {

        console.error("Load error:", error);

        showMessage(
            "Could not load prediction history. Make sure FastAPI is running.",
            "error"
        );

    }

}


// ======================================================
// DISPLAY RECORDS
// ======================================================

function displayRecords(records) {

    predictionTable.innerHTML = "";


    if (!records || records.length === 0) {

        predictionTable.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">
                    No predictions found.
                </td>
            </tr>
        `;

        return;
    }


    records.forEach(record => {

        const row =
            document.createElement("tr");


        // IMPORTANT:
        // API response uses OBJECT properties:
        //
        // id
        // student_name
        // study_hours
        // attendance
        // previous_marks
        // assignment_score
        // predicted_marks


        row.innerHTML = `

            <td>
                ${record.id}
            </td>

            <td>
                ${record.student_name}
            </td>

            <td>
                ${Number(record.study_hours).toFixed(2)}
            </td>

            <td>
                ${Number(record.attendance).toFixed(2)}%
            </td>

            <td>
                ${Number(record.previous_marks).toFixed(2)}
            </td>

            <td>
                ${Number(record.assignment_score).toFixed(2)}
            </td>

            <td>
                <strong>
                    ${Number(record.predicted_marks).toFixed(2)}
                </strong>
            </td>

            <td>

                <div class="actions">

                    <button
                        class="edit-btn"
                        onclick="editPrediction(${record.id})">

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deletePrediction(${record.id})">

                        Delete

                    </button>

                </div>

            </td>

        `;


        predictionTable.appendChild(row);

    });

}


// ======================================================
// UPDATE DASHBOARD
// ======================================================

function updateDashboard(records) {

    const total =
        records.length;


    document.getElementById(
        "totalPredictions"
    ).textContent =
        total;


    if (total === 0) {

        document.getElementById(
            "averageMarks"
        ).textContent = "0";


        document.getElementById(
            "highestMarks"
        ).textContent = "0";


        document.getElementById(
            "lowestMarks"
        ).textContent = "0";


        drawChart([]);

        return;
    }


    // Get predicted marks using correct API field

    const marks =
        records
            .map(record =>
                Number(record.predicted_marks)
            )
            .filter(value =>
                Number.isFinite(value)
            );


    if (marks.length === 0) {

        document.getElementById(
            "averageMarks"
        ).textContent = "0";


        document.getElementById(
            "highestMarks"
        ).textContent = "0";


        document.getElementById(
            "lowestMarks"
        ).textContent = "0";


        return;
    }


    const totalMarks =
        marks.reduce(
            (sum, value) => sum + value,
            0
        );


    const average =
        totalMarks / marks.length;


    const highest =
        Math.max(...marks);


    const lowest =
        Math.min(...marks);


    document.getElementById(
        "averageMarks"
    ).textContent =
        average.toFixed(2);


    document.getElementById(
        "highestMarks"
    ).textContent =
        highest.toFixed(2);


    document.getElementById(
        "lowestMarks"
    ).textContent =
        lowest.toFixed(2);


    drawChart(records);

}


// ======================================================
// DRAW SIMPLE BAR CHART
// ======================================================

function drawChart(records) {

    const chart =
        document.getElementById("chart");


    if (!chart) {

        return;

    }


    chart.innerHTML = "";


    if (!records || records.length === 0) {

        chart.innerHTML =
            "<p>No data available</p>";

        return;

    }


    records.slice(0, 8).forEach(record => {

        const marks =
            Number(record.predicted_marks);


        if (!Number.isFinite(marks)) {

            return;

        }


        const bar =
            document.createElement("div");


        bar.className =
            "bar";


        const height =
            Math.max(marks * 2, 5);


        bar.style.height =
            `${height}px`;


        bar.title =
            `${record.student_name}: ${marks.toFixed(2)} marks`;


        const label =
            document.createElement("span");


        label.textContent =
            record.student_name;


        bar.appendChild(label);


        chart.appendChild(bar);

    });

}


// ======================================================
// VALIDATE INPUT
// ======================================================

function validateRange(
    value,
    fieldName,
    min,
    max
) {

    if (
        value === "" ||
        isNaN(value)
    ) {

        showMessage(
            `${fieldName} is required.`,
            "error"
        );

        return false;

    }


    const number =
        Number(value);


    if (
        number < min ||
        number > max
    ) {

        showMessage(
            `${fieldName} must be between ${min} and ${max}.`,
            "error"
        );

        return false;

    }


    return true;

}


// ======================================================
// PREDICT / UPDATE
// ======================================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        hideMessage();


        const studentName =
            document.getElementById(
                "studentName"
            ).value.trim();


        const studyHours =
            document.getElementById(
                "studyHours"
            ).value;


        const attendance =
            document.getElementById(
                "attendance"
            ).value;


        const previousMarks =
            document.getElementById(
                "previousMarks"
            ).value;


        const assignmentScore =
            document.getElementById(
                "assignmentScore"
            ).value;


        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (studentName === "") {

            showMessage(
                "Please enter student name.",
                "error"
            );

            return;

        }


        if (
            !validateRange(
                studyHours,
                "Study Hours",
                0,
                24
            )
        ) {

            return;

        }


        if (
            !validateRange(
                attendance,
                "Attendance",
                0,
                100
            )
        ) {

            return;

        }


        if (
            !validateRange(
                previousMarks,
                "Previous Marks",
                0,
                100
            )
        ) {

            return;

        }


        if (
            !validateRange(
                assignmentScore,
                "Assignment Score",
                0,
                100
            )
        ) {

            return;

        }


        // -------------------------------
        // REQUEST DATA
        // -------------------------------

        const requestData = {

            student_name:
                studentName,

            study_hours:
                Number(studyHours),

            attendance:
                Number(attendance),

            previous_marks:
                Number(previousMarks),

            assignment_score:
                Number(assignmentScore)

        };


        console.log(
            "Sending to FastAPI:",
            requestData
        );


        const editId =
            form.dataset.editId;


        submitBtn.disabled = true;


        submitBtn.textContent =
            editId
                ? "Updating..."
                : "Predicting...";


        try {

            let response;


            // ==================================================
            // UPDATE EXISTING RECORD
            // ==================================================

            if (editId) {

                response =
                    await fetch(
                        `${API_URL}/predictions/${editId}`,
                        {

                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(requestData)

                        }
                    );

            }

            // ==================================================
            // CREATE NEW PREDICTION
            // ==================================================

            else {

                response =
                    await fetch(
                        `${API_URL}/predict`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(requestData)

                        }
                    );

            }


            // ==================================================
            // ERROR
            // ==================================================

            if (!response.ok) {

                const errorData =
                    await response.json();

                console.error(
                    "FastAPI Error:",
                    errorData
                );

                throw new Error(
                    "FastAPI request failed."
                );

            }


            // ==================================================
            // RESULT
            // ==================================================

            const result =
                await response.json();


            console.log(
                "FastAPI Result:",
                result
            );


            // ==================================================
            // SHOW RESULT
            // ==================================================

            if (result.predicted_marks !== undefined) {

                resultStudent.textContent =
                    `Student: ${result.student_name}`;

                predictedMarks.textContent =
                    Number(
                        result.predicted_marks
                    ).toFixed(2);

                resultCard.style.display =
                    "block";

            }


            // ==================================================
            // SUCCESS MESSAGE
            // ==================================================

            showMessage(

                editId
                    ? "Prediction updated successfully!"
                    : "Prediction created successfully!",

                "success"

            );


            // ==================================================
            // EXIT EDIT MODE
            // ==================================================

            delete form.dataset.editId;


            formTitle.textContent =
                "Predict Student Marks";


            formCard.classList.remove(
                "edit-mode"
            );


            form.reset();


            // ==================================================
            // RELOAD TABLE
            // ==================================================

            await loadPredictions();

        }
        catch (error) {

            console.error(
                "Prediction error:",
                error
            );


            showMessage(
                error.message,
                "error"
            );

        }
        finally {

            submitBtn.disabled =
                false;


            submitBtn.textContent =
                "Predict Marks";

        }

    }
);


// ======================================================
// SEARCH BY NAME
// ======================================================

async function searchByName() {

    const name =
        document.getElementById(
            "searchName"
        ).value.trim();


    if (name === "") {

        showMessage(
            "Please enter a student name.",
            "error"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/predictions/search/${encodeURIComponent(name)}`
            );


        if (!response.ok) {

            throw new Error(
                "Student not found."
            );

        }


        const data =
            await response.json();


        console.log(
            "Search response:",
            data
        );


        const records =
            data.predictions || [];


        displayRecords(records);


        showMessage(
            `${records.length} prediction(s) found.`,
            "info"
        );

    }
    catch (error) {

        console.error(
            "Search error:",
            error
        );


        showMessage(
            error.message,
            "error"
        );

    }

}


// ======================================================
// SEARCH BY ID
// ======================================================

async function searchById() {

    const id =
        document.getElementById(
            "searchId"
        ).value;


    if (
        id === "" ||
        Number(id) <= 0
    ) {

        showMessage(
            "Please enter a valid prediction ID.",
            "error"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/predictions/${id}`
            );


        if (!response.ok) {

            if (response.status === 404) {

                throw new Error(
                    "Prediction not found."
                );

            }


            throw new Error(
                "Search failed."
            );

        }


        const record =
            await response.json();


        console.log(
            "ID search response:",
            record
        );


        displayRecords([record]);


        showMessage(
            "Prediction found successfully.",
            "success"
        );

    }
    catch (error) {

        console.error(
            "ID search error:",
            error
        );


        showMessage(
            error.message,
            "error"
        );

    }

}


// ======================================================
// SHOW ALL
// ======================================================

async function showAllPredictions() {

    document.getElementById(
        "searchName"
    ).value = "";


    document.getElementById(
        "searchId"
    ).value = "";


    await loadPredictions();


    showMessage(
        "Showing all predictions.",
        "info"
    );

}


// ======================================================
// EDIT PREDICTION
// ======================================================

async function editPrediction(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/predictions/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load prediction."
            );

        }


        const record =
            await response.json();


        console.log(
            "Edit record:",
            record
        );


        document.getElementById(
            "studentName"
        ).value =
            record.student_name;


        document.getElementById(
            "studyHours"
        ).value =
            record.study_hours;


        document.getElementById(
            "attendance"
        ).value =
            record.attendance;


        document.getElementById(
            "previousMarks"
        ).value =
            record.previous_marks;


        document.getElementById(
            "assignmentScore"
        ).value =
            record.assignment_score;


        form.dataset.editId =
            id;


        formTitle.textContent =
            `Edit Prediction #${id}`;


        submitBtn.textContent =
            "Update Prediction";


        formCard.classList.add(
            "edit-mode"
        );


        formCard.scrollIntoView({
            behavior: "smooth"
        });


        showMessage(
            `Editing prediction #${id}.`,
            "info"
        );

    }
    catch (error) {

        console.error(
            "Edit error:",
            error
        );


        showMessage(
            error.message,
            "error"
        );

    }

}


// ======================================================
// DELETE PREDICTION
// ======================================================

async function deletePrediction(id) {

    const confirmed =
        confirm(
            `Are you sure you want to delete prediction #${id}?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/predictions/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete prediction."
            );

        }


        showMessage(
            "Prediction deleted successfully!",
            "success"
        );


        await loadPredictions();

    }
    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showMessage(
            error.message,
            "error"
        );

    }

}


// ======================================================
// RESET FORM
// ======================================================

function resetForm() {

    form.reset();


    delete form.dataset.editId;


    formTitle.textContent =
        "Predict Student Marks";


    submitBtn.textContent =
        "Predict Marks";


    formCard.classList.remove(
        "edit-mode"
    );


    resultCard.style.display =
        "none";


    hideMessage();

}


// ======================================================
// INITIAL LOAD
// ======================================================

loadPredictions();
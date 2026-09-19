// ============================================================
// COMMON FRONTEND FUNCTIONS
// ============================================================

function goToPage(page) {
    window.location.href = page;
}


function formatNumber(value) {

    const number = Number(value);

    return Number.isNaN(number)
        ? "-"
        : number.toFixed(2);
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
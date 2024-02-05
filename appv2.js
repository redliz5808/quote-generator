const fmdValue = "fmd-desc";
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

// ----------------------------------------------------- //
// ------------------- DEFAULT VALUES ------------------ //
// ----------------------------------------------------- //

let totalItems = 0;
let pricePerThousand = 1;
let costOfColors = 0;
let digitizingFee = 0;
let editCost = 0;
let discount = 0;
let lineCost = 0;
// if charCount > 15, lineCost = 4 + (charCount * 0.3);
let bagItRate = 0.5;
let bagItTotal = bagItRate * totalItems;
let projectUpcharge = 0;
let totalCost = 0;
// if rush, projectUpcharge = 1.2; if priority, projectUpcharge = 1.3; if expedited, projectUpcharge = 1.5; if immediate, projectUpcharge = 2;

// ----------------------------------------------------- //
// -------------------- FORM VALUES -------------------- //
// ----------------------------------------------------- //

const projectInfoForm = document.forms["projectInfo"];
const allData = {};

const formFields = document.querySelectorAll(".formfield");

function saveFormData() {
    formFields.forEach(element => {
        let elementId = element.getAttribute("id");
        if (element.value !== "" && element.value !== "on") {
            if (element.classList.includes("qty")) {
                allData["Qty"] = element.value;
            }
            allData[elementId] = element.value;
        }
    });
}
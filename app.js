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

let checkboxes = document.querySelectorAll(".form-check-input");
// let formAnswers = {};
let formFields = document.querySelectorAll(".formfield");

const calculateBtn = document.getElementById("calculate");

// ----- Design Info ----- //
// const customerProvidedYes = document.getElementById("customerProvidedYes");
const customerProvided = document.getElementById("customerProvidedYes");

const convertDesignSizeBtn = document.getElementById("convertDesignSize");
const stitchCount = document.getElementById("stitchCount");
const designSize = document.getElementById("designSize");
const stitchCountMessage = document.getElementById("stitchCountMessage");

const numOfColors = document.getElementById("numOfColors");
const numOfColorsMessage = document.getElementById("numOfColorsMessage");

const digitizingRequired = document.getElementById("digitizingYes");
const editingRequired = document.getElementById("editingNeeded");
const numOfHours = document.getElementById("editingHours");

// ----- Fabrics ----- //
let cottonTotal, fleeceTotal, towelsTotal, bagsTotal, sherpaTotal, jacketTotal, leatherTotal, capsTotal, performanceTotal, otherTotal;
const cotton = document.getElementById("cotton");
const cottonQty = document.getElementById("cottonQty");
const fleece = document.getElementById("fleece");
const fleeceQty = document.getElementById("fleeceQty");
const towels = document.getElementById("towels");
const towelsQty = document.getElementById("towelsQty");
const bags = document.getElementById("bags");
const bagsQty = document.getElementById("bagsQty");
const sherpa = document.getElementById("sherpa");
const sherpaQty = document.getElementById("sherpaQty");
const jackets = document.getElementById("jackets");
const jacketsQty = document.getElementById("jacketsQty");
const leather = document.getElementById("leather");
const leatherQty = document.getElementById("leatherQty");
const caps = document.getElementById("caps");
const capsQty = document.getElementById("capsQty");
const performance = document.getElementById("performance");
const performanceQty = document.getElementById("performanceQty");
const other = document.getElementById("other");
const otherQty = document.getElementById("otherQty");
let allFabricQtys = {};

// ----- Personalization & Shipping ----- //
const personalizationOne = document.getElementById("personalizationOne");
const personalizationTwo = document.getElementById("personalizationTwo");
const shippingSpeed = document.getElementById("projectSpeed");

// ----- Estiamte Display ----- //
const tableBody = document.getElementById("tableBody");
// let allData = [];
let allData = {};
let forExport = {};
let grandTotalArray = [];

// ----------------------------------------------------- //
// -------------- FUNCTIONS TO GATHER DATA ------------- //
// ----------------------------------------------------- //

function convertToInches() {
    let stitchCountVal = Number(stitchCount.value);
    let withinLimits = stitchCountVal >= 10000 && stitchCountVal <= 32000;
    if (stitchCountVal !== "" && withinLimits) {
        let convertedVal = stitchCountVal / 2222.23;
        designSize.value = (Math.round(convertedVal * 100) / 100).toFixed(2);
    } else {
        designSize.value = "";
        stitchCount.value = "";
        stitchCountMessage.classList.add("error");
        stitchCountMessage.innerHTML = "The minimum stitch count is 10000 with a maximum of 32000 for standard designs. Please enter a number between 10000 and 32000.";
        setTimeout(() => {
            stitchCountMessage.innerHTML = "";
            stitchCountMessage.classList.remove("error");
        }, 6500);
    }
}

function convertToStitches() {
    let designSizeVal = Number(designSize.value);
    let withinLimits = designSizeVal >= 4.5 && designSizeVal <= 14;
    if (designSizeVal === 4.5) {
        stitchCount.value = 10000;
    } else if (designSizeVal !== "" && withinLimits) {
        let convertedVal = designSizeVal * 2222.23;
        stitchCount.value = (Math.ceil(convertedVal / 1000) * 1000).toFixed(0);
    } else {
        stitchCount.value = "";
        designSize.value = "";
        stitchCountMessage.classList.add("error");
        stitchCountMessage.innerHTML = 'The minimum design size is 4.5" and the maximum is 14". Please enter a number between 4.5 and 14.';
        setTimeout(() => {
            stitchCountMessage.innerHTML = "";
            stitchCountMessage.classList.remove("error");
        }, 6500);
    }
}

function verifyNumOfColors() {
    let numOfColorsVal = numOfColors.value;
    if (numOfColorsVal < 1) {
        numOfColorsMessage.innerHTML = "Please enter a number larger than 0";
        numOfColorsMessage.classList.add("error");
        setTimeout(() => {
            numOfColorsMessage.innerHTML = "";
            numOfColorsMessage.classList.remove("error");
        }, 6500);
    } else if (numOfColorsVal > 10 && numOfColorsVal <= 15) {
        costOfColors = (numOfColorsVal - 10) * 3;
        numOfColorsMessage.innerHTML = "The first 10 colors are included at no additional charge. Each additional color (up to a max of 15) is $3.00 per color.";
        numOfColorsMessage.classList.add("warning");
        setTimeout(() => {
            numOfColorsMessage.innerHTML = "";
            numOfColorsMessage.classList.remove("warning");
        }, 6500);
    } else if (numOfColorsVal > 15) {
        numOfColorsMessage.innerHTML = "Please enter a number under 15.";
        numOfColorsMessage.classList.add("error");
        setTimeout(() => {
            numOfColorsMessage.innerHTML = "";
            numOfColorsMessage.classList.remove("error");
        }, 6500);
    }
}

function verifyNumOfChars(lineNumber) {
    let personlizationVar = document.getElementById(`personalization${lineNumber}`);
    let charCountVar = document.getElementById(`charCount${lineNumber}`);
    let numOfChars = personlizationVar.value.length;
    if (numOfChars > 0) {
        charCountVar.innerHTML = `(character count: ${numOfChars})`;
    }

    if (numOfChars > 15) {
        lineCost = 4 + (numOfChars - 15) * 0.3;
        numOfCharsMessage.innerHTML = "The first 15 characters of each line are included at no additional charge. Each additional character is $0.30 per character.";
        numOfCharsMessage.classList.add("warning");
        setTimeout(() => {
            numOfCharsMessage.innerHTML = "";
            numOfCharsMessage.classList.remove("warning");
        }, 6500);
    }
}

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
        let fieldToDisplay = document.getElementById(`${this.id}QtyContainer`);
        if (fieldToDisplay !== null) {
            fieldToDisplay.classList.toggle("display");
        }
    });
});

stitchCount.addEventListener("change", convertToInches);
designSize.addEventListener("change", convertToStitches);
numOfColors.addEventListener("change", verifyNumOfColors);
numOfColors.addEventListener("input", verifyNumOfColors);
personalizationOne.addEventListener("change", function () {
    verifyNumOfChars("One");
});
personalizationOne.addEventListener("input", function () {
    verifyNumOfChars("One");
});
personalizationTwo.addEventListener("change", function () {
    verifyNumOfChars("Two");
});
personalizationTwo.addEventListener("input", function () {
    verifyNumOfChars("Two");
});

// ----------------------------------------------------- //
// -------------- FUNCTIONS TO DISPLAY DATA ------------- //
// ----------------------------------------------------- //

const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function createServiceTable(element) {
    let tableRow = document.createElement("tr");
    tableRow.id = `serviceItem-${element.index}`;

    let serviceName = document.createElement("td");
    serviceName.innerHTML = element[0];

    let serviceCost = document.createElement("td");
    serviceCost.innerHTML = element[1];

    tableRow.appendChild(serviceName);
    tableRow.appendChild(serviceCost);
    tableBody.appendChild(tableRow);

    // PULL IN CUSTOM ATTRIBUTES
    // FROM HTML AND OPTIMIZE
    // FUNCTIONS BASED ON THEM
}

function createPrintPreview(estimateTotal) {
    let todaysDate = new Date();
    document.getElementById("todaysDate").innerHTML = todaysDate.toLocaleDateString();
    let expirationDate = new Date(todaysDate.setDate(todaysDate.getDate() + 30)).toLocaleDateString();
    document.getElementById("expirationDate").innerHTML = expirationDate;
    let refNumber = Math.random().toString(26).toUpperCase().slice(2);
    document.getElementById("estimateRefNumber").innerHTML = refNumber;
    forExport["refNumber"] = refNumber;
    document.getElementById("estimateGrandTotal").innerHTML = formatter.format(estimateTotal);

    let dataToDisplay = Object.entries(allData);

    tableBody.innerHTML = "";
    dataToDisplay.forEach((element) => {
        createServiceTable(element);
    });
}

// ----------------------------------------------------- //
// ------------ FUNCTIONS TO CALCULATE COST ------------ //
// ----------------------------------------------------- //

function sum(array) {
    return array.reduce((subtotal, item) => subtotal + item, 0);
}

function calculateDigitizingFee() {
    let designSizeVal = Number(designSize.value);
    if (designSizeVal <= 10) {
        digitizingFee = 25;
    } else if (designSizeVal > 10) {
        digitizingFee = 100;
        // Please contact us for an accurate estimate
    }
    return digitizingFee;
}

function calculateSingleFabricTotal(fabricQty, fabricUpcharge) {
    discount = fabricQty >= 10 ? -0.15 : 0;
    console.log({discount}, {fabricUpcharge})
    let fabricPricePerThousand = fabricUpcharge === 0 ? discount : fabricUpcharge - (fabricUpcharge * discount);
    console.log({fabricPricePerThousand})
    let fabricTotal = fabricQty * fabricPricePerThousand;
    return fabricTotal;
}

function calculateFabricTotals(fabric, fabricQty) {
    let fabricTotal = 0;
    allFabricQtys[fabric.getAttribute("fmd-desc")] = fabricQty;
    let fabricUpcharge = fabric.getAttribute("fmd-prem");
    if (fabric.checked) {
        fabricTotal = calculateSingleFabricTotal(Number(fabricQty), Number(fabricUpcharge));
    }
    console.log({fabricTotal})
    return fabricTotal;
}

function calculateColorCost(numberOfColors) {
    var numberOfExtraColors = numberOfColors - 10;
    if (numberOfExtraColors >= 1 && numberOfExtraColors <= 5) {
        return 3 * numberOfExtraColors;
    }
    return 0;
}

function calculateTotals() {
    pricePerThousand = customerProvided.checked ? 2 : 1.5;
    let stitchCost = 0;
    if (allData["Total stitches"] !== undefined) {
        stitchCost = pricePerThousand * (Number(allData["Total stitches"]) / 1000);
    } else {
        stitchCost = pricePerThousand * (Number(allData["Design size (in inches)"]) / 1000);
    }
    if (editingRequired.checked) {
        editCost = Number(numOfHours.value) * 25;
        grandTotalArray.push(editCost);
        allData["Design editing"] = formatter.format(editCost);
        forExport["designEditing"] = editCost;
    } else {
        delete allData["Design editing"];
        delete forExport["digitizing"];
    }
    if (digitizingRequired.checked) {
        let digitizingFee = calculateDigitizingFee();
        allData["Design digitizing"] = formatter.format(digitizingFee);
        forExport["digitizing"] = digitizingFee;
    }
    let fabrics = document.querySelectorAll(".fabric");
    let fabricTotals = [];
    let allFabricTotal = 0;
    for (const fabric of fabrics) {
        if (fabric.checked) {
            let fabricId = fabric.getAttribute("id");
            let fabricQty = document.getElementById(`${fabricId}Qty`).value;
            totalItems = totalItems + Number(fabricQty);
            let fabricName = fabric.getAttribute("fmd-desc");
            let lineTotal = calculateFabricTotals(fabric, fabricQty);
            if (lineTotal !== 0) {
                fabricTotals.push(lineTotal);
                allData[fabricName] = formatter.format(lineTotal);
                forExport[fabricId] = lineTotal;
            }
        }
        allFabricTotal = sum(fabricTotals);
    }
    let costOfColors = 0;
    costOfColors = calculateColorCost(Number(numOfColors.value));

    if (digitizingFee !== 0) {
        grandTotalArray.push(digitizingFee);
    }
    if (stitchCost !== 0) {
        grandTotalArray.push(stitchCost);
        allData["Stitch cost"] = formatter.format(stitchCost);
        forExport["stitchCost"] = stitchCost;
    }
    if (costOfColors !== 0) {
        grandTotalArray.push(costOfColors);
        if (costOfColors > 0) {
            allData["Cost for additional colors"] = formatter.format(costOfColors);
            forExport["additionalColors"] = costOfColors;
        } else {
            allData["Number of colors"] = numOfColors.value;
            forExport["numberOfColors"] = numOfColors.value;
        }
    }
    if (allFabricTotal !== 0) {
        grandTotalArray.push(allFabricTotal);
        // allData["Total of all fabrics"] = formatter.format(allFabricTotal);
    }

    let personalizationTotal = 0;

    if (personalizationOne.value.length > 0 || personalizationTwo.value.length > 0) {
        let lineOneCount = personalizationOne.value.length;
        let lineTwoCount = personalizationTwo.value.length;
        let lineOneOverage = 0;
        let lineTwoOverage = 0;
        if (lineOneCount > 15) {
            lineOneOverage = lineOneCount - 15;
        }
        if (lineTwoCount > 15) {
            lineTwoOverage = lineTwoCount - 15;
        }
        personalizationTotal = (4 + (lineOneOverage + lineTwoOverage) * 0.3) * totalItems;
        if (personalizationTotal > 0) {
            allData["Personalization Total"] = formatter.format(personalizationTotal);
            forExport["personalization"] = personalizationTotal;
            grandTotalArray.push(personalizationTotal);
        }
    }

    let estimateTotal = sum(grandTotalArray);
    return estimateTotal;
}

function calculateShipping(subtotal) {
    let shippingSpeedVal = shippingSpeed.options[shippingSpeed.selectedIndex].getAttribute("fmd-rate");
    let grandTotal = 0;
    if (shippingSpeedVal === 0) {
        createPrintPreview(subtotal);
    } else {
        grandTotal = subtotal + subtotal * shippingSpeedVal;
        createPrintPreview(grandTotal);
    }
}

function calculateBagging(subtotal) {
    let tempQtyArray = [];
    for (const [key, value] of Object.entries(allFabricQtys)) {
        tempQtyArray.push(Number(value));
    }
    let baggingTotal = sum(tempQtyArray) * 0.5;
    allData["Folding & Polybagging"] = formatter.format(baggingTotal);
    forExport["bagging"] = baggingTotal;
    grandTotalArray.push(baggingTotal);
    subtotal = subtotal + baggingTotal;
    calculateShipping(subtotal);
}

function saveFormData() {
    formFields.forEach((element) => {
        let elementName = element.getAttribute("fmd-desc");
        if (element.value !== "" && element.value !== "on") {
            if (elementName !== null) {
                allData[elementName] = element.value;
                forExport[element.getAttribute("id")] = element.value;
            }
        }
    });
    let subtotal = calculateTotals();
    let polybagging = document.getElementById("polybag");
    if (polybagging.checked) {
        calculateBagging(subtotal);
    } else {
        calculateShipping(subtotal);
    }
    sessionStorage.setItem("Project Information", JSON.stringify(allData));
    sessionStorage.setItem("ForExport", JSON.stringify(forExport));
}

function clearTotals() {
    totalItems = 0;
    allData = {};
    grandTotalArray = [];
    forExport = {};
    sessionStorage.setItem("Project Information", JSON.stringify(allData));
}

calculateBtn.addEventListener("click", (e) => {
    clearTotals();
    e.preventDefault();
    saveFormData();
});

// ----------------------------------------------------- //
// ------------- FUNCTIONS TO CONTROL FORM ------------- //
// ----------------------------------------------------- //

const resetBtn = document.getElementById("resetBtn");

function resetForm() {
    location.reload();
}

resetBtn.addEventListener("click", () => {
    resetForm();
});

// On Submit: https://wordpress.stackexchange.com/questions/283965/how-do-i-send-mail-with-custom-form-data-using-wordpress
// Send without converting: https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
// wp_mail docs: https://developer.wordpress.org/reference/functions/wp_mail/
// wp_mail directory: https://cpanel-box5777.bluehost.com/cpsess0264275815/frontend/bluehost/filemanager/editit.html?file=pluggable.php&fileop=&dir=%2Fhome3%2Fjqohpdmy%2Fpublic_html%2Fwp-includes&dirop=&charset=&file_charset=utf-8&baseurl=&basedir=&edit=1
// Add function to add new embroidery item

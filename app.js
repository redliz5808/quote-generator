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

// ----- Personalization & Shipping ----- //
const personalizationOne = document.getElementById("personalizationOne");
const personalizationTwo = document.getElementById("personalizationTwo");

// ----- Estiamte Display ----- //
const tableBody = document.getElementById("tableBody");
// let allData = [];
let allData = {};
// let grandTotalArray = [];

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

    // console.log(element);

    let serviceName = document.createElement("td");
    serviceName.innerHTML = element[0];

    let serviceCost = document.createElement("td");
    serviceCost.innerHTML = element[1];

    // let serviceQty = document.createElement("td");
    // serviceQty.innerHTML = element[2];

    // let serviceTotal = document.createElement("td");
    // serviceTotal.innerHTML = element[3];

    tableRow.appendChild(serviceName);
    tableRow.appendChild(serviceCost);
    // tableRow.appendChild(serviceQty);
    // tableRow.appendChild(serviceTotal);
    tableBody.appendChild(tableRow);
    // <tr>
    //     <th scope="row">2</th>
    //     <td>Jacob</td>
    //     <td>Thornton</td>
    //     <td>@fat</td>
    // </tr>

    // PULL IN CUSTOM ATTRIBUTES
    // FROM HTML AND OPTIMIZE
    // FUNCTIONS BASED ON THEM
}

function createPrintPreview(estimateTotal) {
    let todaysDate = new Date();
    document.getElementById("todaysDate").innerHTML = todaysDate.toLocaleDateString();
    let expirationDate = new Date(todaysDate.setDate(todaysDate.getDate() + 30)).toLocaleDateString();
    document.getElementById("expirationDate").innerHTML = expirationDate;
    document.getElementById("estimateRefNumber").innerHTML = Math.random().toString(26).toUpperCase().slice(2);
    document.getElementById("estimateGrandTotal").innerHTML = formatter.format(estimateTotal);
    // for (let i = 0; i < grandTotalArray.length; i++) {
    //     createServiceTable(i);
    // }

    let dataToDisplay = Object.entries(allData);

    // for (const element of allData) {
    //     if (allData.hasOwnProperty(element)) {
    //         console.log({element})
    //     }
    //     createServiceTable(element);
    // }

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
        digitizingFee = 30;
    } else if (designSizeVal > 10) {
        digitizingFee = 100;
        // Please contact us for an accurate estimate
    }
}

function calculateSingleFabricTotal(fabricQty, fabricUpcharge) {
    discount = fabricQty > 10 ? 0.15 : 0;
    let fabricPricePerThousand = fabricUpcharge - (fabricUpcharge * discount);
    let fabricTotal = formatter.format(fabricQty * fabricPricePerThousand);
    return fabricTotal;
}

function calculateFabricTotals(fabric) {
    let fabricTotal = 0;
    let fabricId = fabric.getAttribute("id");
    let fabricQty = document.getElementById(`${fabricId}Qty`).value;
    let fabricUpcharge = fabric.getAttribute("fmd-prem");
    if (fabric.checked) {
        fabricTotal = calculateSingleFabricTotal(Number(fabricQty), Number(fabricUpcharge));
    }
    return fabricTotal;
}

function calculateColorCost(numberOfColors) {
    if (numberOfColors >= 11 && numberOfColors <= 15) {
        return (3 * numberOfColors);
    }
    return 0;
}

function calculateTotals() {
    pricePerThousand = customerProvided.checked ? 1.25 : 1;
    let stitchCost = 0;
    if (allData["Total stitches"] !== undefined) {
        stitchCost = pricePerThousand * (Number(allData["Total stitches"]) / 1000);
    } else {
        stitchCost = pricePerThousand * (Number(allData["Design size (in inches)"]) / 1000);
    }
    if (editingRequired.checked) {
        editCost = Number(numOfHours.value) * 25;
    }
    if (digitizingRequired.checked) {
        let digitizingFee = calculateDigitizingFee();
        allData["Design digitizing"] = formatter.format(digitizingFee);
    }
    let fabrics = document.querySelectorAll(".fabric");
    let fabricTotals = [];
    let allFabricTotal = 0;
    for (const fabric of fabrics) {
        if(fabric.checked) {
            let fabricName = fabric.getAttribute("fmd-desc");
            let lineTotal = calculateFabricTotals(fabric);
            if (lineTotal > 0) {
                allData[fabricName] = lineTotal;
            }
            fabricTotals.push[lineTotal];
        }
        allFabricTotal = sum(fabricTotals);
    }
    allData["Stitch cost"] = formatter.format(stitchCost);
    let costOfColors = 0;
    costOfColors = calculateColorCost(Number(numOfColors.value));
    if (costOfColors !== 0) {
        allData["Number of colors"] = formatter.format(costOfColors);
    }
    if (allFabricTotal !== 0) {
        allData["Total of all fabrics"] = formatter.format(allFabricTotal);
    }
    grandTotalArray = [stitchCost, editCost, costOfColors, digitizingFee, allFabricTotal];
    let estimateTotal = sum(grandTotalArray);
    return estimateTotal;
}

function saveFormData() {
    formFields.forEach((element) => {
        let elementName = element.getAttribute("fmd-desc");
        if (element.value !== "" && element.value !== "on") {
            if (elementName !== null) {
                allData[elementName] = element.value;
            }
        }
    });
    sessionStorage.setItem("Project Information", JSON.stringify(allData));
    let grandTotal = calculateTotals();
    createPrintPreview(grandTotal);
}

calculateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    saveFormData();
});

// On Submit: https://wordpress.stackexchange.com/questions/283965/how-do-i-send-mail-with-custom-form-data-using-wordpress
// Send without converting: https://stackoverflow.com/questions/41431322/how-to-convert-formdata-html5-object-to-json
// wp_mail docs: https://developer.wordpress.org/reference/functions/wp_mail/
// wp_mail directory: https://cpanel-box5777.bluehost.com/cpsess0264275815/frontend/bluehost/filemanager/editit.html?file=pluggable.php&fileop=&dir=%2Fhome3%2Fjqohpdmy%2Fpublic_html%2Fwp-includes&dirop=&charset=&file_charset=utf-8&baseurl=&basedir=&edit=1
// Add function to add new embroidery item

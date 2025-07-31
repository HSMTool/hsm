// que. 2a: Load sample data into localStorage
if (!localStorage.getItem("loanApplications")) {
    localStorage.setItem("loanApplications", JSON.stringify([]));
}

// Utility functions
function calculateAge(dob) {
    let birthDate = new Date(dob);
    let ageDiff = Date.now() - birthDate.getTime();
    let age = new Date(ageDiff).getUTCFullYear() - 1970;
    return age;
}

// que. 2b-h: Validation and Eligibility
function checkEligibility() {
    try {
        let fullName = document.getElementById("fullName").value;
        let dob = document.getElementById("dob").value;
        let gender = document.getElementById("gender").value;
        let salary = parseFloat(document.getElementById("salary").value);
        let loanAmount = parseFloat(document.getElementById("loanAmount").value);
        let duration = parseInt(document.getElementById("duration").value);
        let interest = parseFloat(document.getElementById("interest").value);
        let currency = document.getElementById("currency").value;

        let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
        let sources = Array.from(checkboxes).map(cb => cb.value);
        if (document.getElementById("otherCheck").checked) {
            sources.push(document.getElementById("otherText").value || "Other");
        }

        // Validate all required fields
        if (!fullName || !dob || !gender || !salary || !loanAmount || !duration || !interest || sources.length === 0) {
            document.getElementById("result").innerHTML = 
                "<p class='not-eligible'>All fields are required.</p>";
            return;
        }

        let age = calculateAge(dob);
        if (age < 18 || age > 60) {
            document.getElementById("result").innerHTML = 
                "<p class='not-eligible'>Not eligible: Age must be between 18 and 60.</p>";
            return;
        }

        if (salary < 20000) {
            document.getElementById("result").innerHTML = 
                "<p class='not-eligible'>Not eligible: Salary must be ≥ JMD 20,000.</p>";
            return;
        }

        if (loanAmount > salary * 20) {
            document.getElementById("result").innerHTML = 
                "<p class='not-eligible'>Not eligible: Loan exceeds 20x monthly salary.</p>";
            return;
        }

        // que. 2i: EMI Calculation
        let R = interest / 12 / 100;
        let N = duration * 12;
        let EMI = (loanAmount * R * Math.pow(1+R, N)) / (Math.pow(1+R, N)-1);

        // Display result dynamically
        let resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `<p class='eligible'>
            ✅ Khouri Hart (ID: 2202451, CIT2011)<br>
            Congratulations ${fullName}, you are eligible for the loan!<br>
            Monthly EMI: ${currency} ${EMI.toFixed(2)}<br>
            Duration: ${duration} years
        </p>`;

    } catch (error) {
        alert("Error: " + error.message);
    }
}

// que. 3b-ii: Save Data
function saveData() {
    let applications = JSON.parse(localStorage.getItem("loanApplications"));
    let data = {
        name: document.getElementById("fullName").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        salary: document.getElementById("salary").value,
        loanAmount: document.getElementById("loanAmount").value,
        duration: document.getElementById("duration").value,
        interest: document.getElementById("interest").value,
        timestamp: new Date().toLocaleString()
    };
    applications.push(data);
    localStorage.setItem("loanApplications", JSON.stringify(applications));
    alert("Data saved!");
}

// que. 3b-iii: View Data
function viewData() {
    let applications = JSON.parse(localStorage.getItem("loanApplications"));
    let display = "<h3>Saved Applications:</h3><ul>";
    applications.forEach(app => {
        display += `<li>${app.name} - Loan: ${app.loanAmount}</li>`;
    });
    display += "</ul>";
    document.getElementById("storageDisplay").innerHTML = display;
}

// que. 3b-iii: Clear Storage
function clearData() {
    if (confirm("Delete all stored applications?")) {
        localStorage.setItem("loanApplications", JSON.stringify([]));
        document.getElementById("storageDisplay").innerHTML = "";
    }
}

// que. 2d: Exit Application
function exitApp() {
    if (confirm("Are you sure you want to exit the application?")) {
        window.close();
    }
}
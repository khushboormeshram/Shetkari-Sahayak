document.addEventListener("DOMContentLoaded", function () {
    let imageBase64 = ""; // Variable to store the Base64 image

    const dropZone = document.getElementById("plant-disease-drop-zone");
    const fileInput = document.getElementById("plant-disease-fileInput");
    const fileSelect = document.getElementById("plant-disease-fileSelect");
    const fileNameDisplay = document.getElementById("plant-disease-fileName");
    const preview = document.getElementById("plant-disease-preview");
    const uploadForm = document.getElementById("plant-disease-upload-form");
    const resultDisplay = document.getElementById("plant-disease-result");
    const treatmentInfo = document.getElementById("plant-disease-treatment-info");
    const feedbackButton = document.getElementById("plant-disease-submitFeedback");
    const correctedDiseaseSelect = document.getElementById("plant-disease-correctedDisease");

    fileSelect.addEventListener("click", () => fileInput.click());
    dropZone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", handleFileSelection);

    function handleFileSelection(event) {
        const file = event.target.files[0];
        if (file) {
            fileNameDisplay.textContent = `Selected file: ${file.name}`;
            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    }

    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropZone.classList.remove("dragover");
        
        if (event.dataTransfer.files.length > 0) {
            fileInput.files = event.dataTransfer.files;
            handleFileSelection({ target: fileInput });
        }
    });

    uploadForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(uploadForm);

        fetch("/predict", {  // Ensure this endpoint matches your backend
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                resultDisplay.innerHTML = `<strong>Predicted Disease:</strong> ${data.disease_name}<br>
                     <strong>Confidence:</strong> ${(data.confidence * 100).toFixed(2)}%`;

                const diseaseInfo = data.disease_info;
                let treatmentHtml = `
                    <h5>Symptoms:</h5>
                    <ul>
                        ${diseaseInfo.symptoms ? diseaseInfo.symptoms.map(symptom => `<li>${symptom}</li>`).join('') : "No symptoms data available"}
                    </ul>
                    <h5>Conventional Treatment:</h5>
                    <ul>
                        ${diseaseInfo.conventional_treatment ? diseaseInfo.conventional_treatment.map(treatment => `<li>${treatment}</li>`).join('') : "No conventional treatment data available"}
                    </ul>
                    <h5>Biological Treatment:</h5>
                    <ul>
                        ${diseaseInfo.biological_treatment ? diseaseInfo.biological_treatment.map(treatment => `<li>${treatment}</li>`).join('') : "No biological treatment data available"}
                    </ul>
                    <h5>Cultural Treatment:</h5>
                    <ul>
                        ${diseaseInfo.cultural_treatment ? diseaseInfo.cultural_treatment.map(treatment => `<li>${treatment}</li>`).join('') : "No cultural treatment data available"}
                    </ul>
                    <h5>Cause of Spread:</h5>
                    <ul>
                        ${diseaseInfo.cause_of_spread ? diseaseInfo.cause_of_spread.map(cause => `<li>${cause}</li>`).join('') : "No cause of spread data available"}
                    </ul>
                    <h5>Prevention:</h5>
                    <ul>
                        ${diseaseInfo.prevention ? diseaseInfo.prevention.map(prevention => `<li>${prevention}</li>`).join('') : "No prevention data available"}
                    </ul>
                `;
                treatmentInfo.innerHTML = treatmentHtml;
                imageBase64 = data.image;
            })
            .catch((error) => {
                console.error("Error:", error);
                resultDisplay.innerHTML = `Error: ${error.message}`;
            });
    });

    feedbackButton.addEventListener("click", function () {
        const predictedDisease = resultDisplay.textContent.split(":")[1]?.trim();
        const correctedDisease = correctedDiseaseSelect.value;

        fetch("/submit_feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                predicted_disease: predictedDisease,
                corrected_disease: correctedDisease,
                image: imageBase64,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                alert(data.message);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(`Failed to submit feedback: ${error.message}`);
            });
    });
});

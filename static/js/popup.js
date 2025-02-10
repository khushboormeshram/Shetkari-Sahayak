document.addEventListener("DOMContentLoaded", function () {
    const languagePopup = document.getElementById("languagePopup");
    const closePopup = document.querySelector(".close-popup");
    const saveLanguageBtn = document.getElementById("saveLanguage");
    const languageSelect = document.getElementById("languageSelect");

    // Check if language preference is already saved
    const savedLanguage = localStorage.getItem("languagePreference");
    if (!savedLanguage) {
    // Show the popup if no preference is saved
    languagePopup.style.display = "block";
    } else {
    // Load the saved language
    loadLanguage(savedLanguage);
    }

    // Close the popup when the close button is clicked
    closePopup.addEventListener("click", function () {
    languagePopup.style.display = "none";
    });

    // Save the language preference and close the popup
    saveLanguageBtn.addEventListener("click", function () {
    const selectedLanguage = languageSelect.value;
    localStorage.setItem("languagePreference", selectedLanguage);
    languagePopup.style.display = "none";
    loadLanguage(selectedLanguage);
    // alert("Language preference saved!");
    });

    // Close the popup if the user clicks outside of it
    window.addEventListener("click", function (event) {
    if (event.target === languagePopup) {
        languagePopup.style.display = "none";
    }
    });

    // Function to load and apply translations
    function loadLanguage(lang) {
    fetch(`translations/${lang}.json`)
        .then((response) => response.json())
        .then((translations) => {
            // Get all elements with data-translate attribute
            const elements = document.querySelectorAll("[data-translate]");
            elements.forEach((element) => {
                const key = element.getAttribute("data-translate");
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });
        })
        .catch((error) => console.error("Error loading the language file:", error));
    }
    });

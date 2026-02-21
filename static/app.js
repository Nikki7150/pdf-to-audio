const filePicker = document.getElementById("file-picker");
const fileDetails = document.getElementById("file-details");
const imagePreview = document.getElementById("image-preview");
const convertForm = document.getElementById("convert-form");
const audioPlayer = document.getElementById("audio-player");
let currentPreviewUrl = null;

filePicker.addEventListener("change", (event) => {
    const files = event.target.files; // Get the FileList object
    fileDetails.textContent = ""; // Clear previous content

    if (files.length === 0) {
        fileDetails.textContent = "No file selected.";
        imagePreview.style.display = 'none';
        imagePreview.src = '';
    } else {
        if (currentPreviewUrl) {
            URL.revokeObjectURL(currentPreviewUrl);
            currentPreviewUrl = null;
        }

        // Display details for each selected file (if multiple attribute is used)
        for (const file of files) {
            const fileInfo = document.createElement("p");
            fileInfo.textContent = `File Name: ${file.name}, Size: ${file.size} bytes`;
            fileDetails.appendChild(fileInfo);
        }

        // Show a preview for the first selected file (works for PDFs and images)
        const firstFile = files[0];
        currentPreviewUrl = URL.createObjectURL(firstFile);
        imagePreview.src = currentPreviewUrl;
        imagePreview.style.display = 'block';
    }
});

convertForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    audioPlayer.style.display = "none";
    audioPlayer.removeAttribute("src");

    const formData = new FormData(convertForm);

    try {
        const response = await fetch(convertForm.action, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Conversion failed");
        }

        const data = await response.json();
        if (data && data.audio_url) {
            audioPlayer.src = data.audio_url;
            audioPlayer.style.display = "block";
        }
    } catch (error) {
        fileDetails.textContent = "There was a problem converting the PDF.";
    }
});


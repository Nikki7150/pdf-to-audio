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

    // show loading message
    fileDetails.textContent = "Converting PDF to audio, please wait...";

    // hide audio till ready
    audioPlayer.style.display = "none";
    audioPlayer.removeAttribute("src");

    const formData = new FormData(convertForm);

    try {
        const response = await fetch("/pdf-to-audio", {
            method: "POST",
            body: formData,
        });
        // get mp3 as blob
        const audioBlob = await response.blob();

        // set audio player source to the temporary url
        audioPlayer.src = URL.createObjectURL(audioBlob);
        audioPlayer.style.display = "block";
        audioPlayer.load();

        // update file details with success message
        fileDetails.textContent = "Conversion successful! You can play the audio now.";
    } catch (error) {
        fileDetails.textContent = "There was a problem converting the PDF.";
        console.error("Error:", error);
    }
});


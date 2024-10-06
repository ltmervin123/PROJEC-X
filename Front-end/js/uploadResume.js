// DOM elements
const uploadResumeBtn = document.getElementById("uploadResumeBtn");
const fileInput = document.getElementById("resumeInput");

// Event listener for the upload button
uploadResumeBtn.addEventListener("click", handleUploadClick);

// Handle upload button click
function handleUploadClick() {
  fileInput.click(); // Trigger file selection
}

// Event listener for file selection
fileInput.addEventListener("change", handleFileSelection);

// Handle file selection
async function handleFileSelection(event) {
  const file = event.target.files[0];

  try {
    if (!file) throw new Error("No file selected.");

    // Validate file type and size
    if (validateFile(file)) {
      await uploadFileToBackend(file);
      showAlert("File uploaded successfully!"); // Success message
    }
  } catch (error) {
    handleError(error);
  }
}

// Validate file type and size
function validateFile(file) {
  const allowedExtensions = /(\.doc|\.docx|\.pdf)$/i;
  const maxSize = 10 * 1024 * 1024; // 10MB limit

  if (!allowedExtensions.test(file.name)) {
    throw new Error(
      "Invalid file type. Please select a .doc, .docx, or .pdf file."
    );
  }

  if (file.size > maxSize) {
    throw new Error("File size exceeds 10MB. Please choose a smaller file.");
  }

  console.log("File validation passed:", file.name);
  return true; // Validation successful
}

// Upload file to the backend
async function uploadFileToBackend(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log("Uploading file to the backend...");

    const response = await axios.post(
      "http://localhost:5000/api/uploadResume",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        maxRedirects: 0,
      }
    );

    console.log("File uploaded successfully:", response.data);
  } catch (error) {
    throw new Error("Error occurred while uploading file: " + error);
  }
}

// Show alert message
function showAlert(message) {
  alert(message); // You could replace this with a more customized alert system
}

// Handle errors
function handleError(error) {
  console.error("An error occurred:", error.message);
  showAlert(error.message); // Show the error message in an alert pop-up
}

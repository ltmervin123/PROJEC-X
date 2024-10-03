let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");

closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange();
});

function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
}

// Show Mock Interview Options by default
document.getElementById("mockInterviewOptions").style.display = "block";

// Start Mock Interview
document.getElementById("startMockInterview").addEventListener("click", function() {
    document.getElementById("popupContainer").style.display = "flex";
    startCamera();
});
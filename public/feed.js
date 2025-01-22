document.addEventListener("DOMContentLoaded", function () {
    const likeIcons = document.querySelectorAll(".like-icon");

    likeIcons.forEach(icon => {
        icon.addEventListener("click", function () {
            if (icon.src.includes("heart-empty.png")) {
                icon.src = "/public/assets/images/icons/heart-full.png";
            } else {
                icon.src = "/public/assets/images/icons/heart-empty.png";
            }
        });
    });
});
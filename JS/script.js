const mainImage = document.querySelector(".main-image");
const thumbnails = document.querySelectorAll(".thumbnail-row img");

thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
        mainImage.src = thumb.src;
    });
});
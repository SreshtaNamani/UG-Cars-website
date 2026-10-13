const searchInput = document.getElementById("searchInput");
const brandFilters = document.querySelectorAll(".brand-filter");
const fuelFilters = document.querySelectorAll(".fuel-filter");
const cards = document.querySelectorAll(".car-card");

if (searchInput) {
    searchInput.addEventListener("input", filterCars);
}

brandFilters.forEach(filter => {
    filter.addEventListener("change", filterCars);
});

fuelFilters.forEach(filter => {
    filter.addEventListener("change", filterCars);
});

function filterCars() {

    const searchText = searchInput ? searchInput.value.toLowerCase() : "";

    const selectedBrands = [...brandFilters]
        .filter(filter => filter.checked)
        .map(filter => filter.value);

    const selectedFuels = [...fuelFilters]
        .filter(filter => filter.checked)
        .map(filter => filter.value);

    cards.forEach(card => {

        const title = card.querySelector("h3").textContent.toLowerCase();

        const brand = card.dataset.brand.toLowerCase();

        const fuel = card.dataset.fuel.toLowerCase();

        const matchesSearch = title.includes(searchText);

        const matchesBrand =
            selectedBrands.length === 0 ||
            selectedBrands.includes(brand);

        const matchesFuel =
            selectedFuels.length === 0 ||
            selectedFuels.includes(fuel);

        if (matchesSearch && matchesBrand && matchesFuel) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}
const mainImage = document.querySelector(".main-image");
const thumbnails = document.querySelectorAll(".thumbnail-row img");

if (mainImage && thumbnails.length > 0) {

    thumbnails.forEach(function (thumb) {

        thumb.addEventListener("click", function () {

            mainImage.src = thumb.src;

        });

    });

}
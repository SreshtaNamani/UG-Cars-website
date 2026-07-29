const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", searchCars);

}

const brandFilter = document.getElementById("brandFilter");

if (brandFilter) {

    brandFilter.addEventListener("change", searchCars);

}

const fuelFilter = document.getElementById("fuelFilter");

if (fuelFilter) {

    fuelFilter.addEventListener("change", searchCars);

}

function searchCars() {

    const searchText = searchInput.value.toLowerCase();

    const brand = brandFilter ? brandFilter.value.toLowerCase() : "";

    const fuel = fuelFilter ? fuelFilter.value.toLowerCase() : "";

    const cards = document.querySelectorAll(".car-card");

    cards.forEach(function(card){

        const title = card.querySelector("h3").textContent.toLowerCase();

        const cardBrand = card.dataset.brand.toLowerCase();

        const cardFuel = card.dataset.fuel.toLowerCase();

        const matchesSearch = title.includes(searchText);

        const matchesBrand = brand === "" || cardBrand === brand;

        const matchesFuel = fuel === "" || cardFuel === fuel;

        if(matchesSearch && matchesBrand && matchesFuel){

            card.style.display = "block";

        }else{

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
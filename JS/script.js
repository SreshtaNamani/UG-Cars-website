const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {

    searchBtn.addEventListener("click", function () {

        const searchText = document
            .getElementById("searchInput")
            .value
            .toLowerCase();

        const brand = document
            .getElementById("brandFilter")
            .value
            .toLowerCase();

        const fuel = document
            .getElementById("fuelFilter")
            .value
            .toLowerCase();

        const cards = document.querySelectorAll(".car-card");

        cards.forEach(function(card){

            const title = card.querySelector("h3").textContent.toLowerCase();

            const cardBrand = card.dataset.brand;

            const cardFuel = card.dataset.fuel;

            const matchesSearch =
                title.includes(searchText);

            const matchesBrand =
                brand === "" || cardBrand === brand;

            const matchesFuel =
                fuel === "" || cardFuel === fuel;

            if(matchesSearch && matchesBrand && matchesFuel){

                card.style.display = "block";

            }else{

                card.style.display = "none";

            }

        });

    });

}
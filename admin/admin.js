console.log("UG Cars Admin loaded successfully");

const carForm = document.getElementById("admin-car-form");

if (carForm) {
    carForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const car = {
            id: Date.now(),

            name: document.getElementById("car-name").value,

            brand: document.getElementById("car-brand").value,

            year: document.getElementById("car-year").value,

            price: document.getElementById("car-price").value,

            fuel: document.getElementById("car-fuel").value,

            transmission:
                document.getElementById("car-transmission").value,

            kilometers:
                document.getElementById("car-kilometers").value,

            status:
                document.getElementById("car-status").value,

            description:
                document.getElementById("car-description").value
        };

        const inventory =
            JSON.parse(localStorage.getItem("ugCarsInventory")) || [];

        inventory.push(car);

        localStorage.setItem(
            "ugCarsInventory",
            JSON.stringify(inventory)
        );

        alert("Car added successfully!");

        window.location.href = "inventory.html";
    });
}
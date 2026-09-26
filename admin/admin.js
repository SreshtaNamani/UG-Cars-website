console.log("UG Cars Admin loaded successfully");


/* ==========================================
   GET INVENTORY
========================================== */

function getInventory() {
    return JSON.parse(
        localStorage.getItem("ugCarsInventory")
    ) || [];
}


/* ==========================================
   ADD NEW CAR
========================================== */

const carForm = document.getElementById("admin-car-form");

if (carForm) {

    carForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const car = {
            id: Date.now(),

            name: document.getElementById("car-name").value.trim(),

            brand: document.getElementById("car-brand").value,

            year: document.getElementById("car-year").value,

            price: document.getElementById("car-price").value.trim(),

            fuel: document.getElementById("car-fuel").value,

            transmission:
                document.getElementById("car-transmission").value,

            kilometers:
                document.getElementById("car-kilometers").value,

            status:
                document.getElementById("car-status").value,

            description:
                document.getElementById("car-description").value.trim()
        };


        const inventory = getInventory();

        inventory.push(car);

        localStorage.setItem(
            "ugCarsInventory",
            JSON.stringify(inventory)
        );


        alert("Car added successfully!");

        window.location.href = "inventory.html";

    });

}


/* ==========================================
   INVENTORY PAGE
========================================== */

const inventoryTable =
    document.getElementById("inventory-table-body");


if (inventoryTable) {

    const inventory = getInventory();

    inventoryTable.innerHTML = "";


    if (inventory.length === 0) {

        inventoryTable.innerHTML = `
            <tr>
                <td colspan="5">
                    No cars in inventory yet.
                </td>
            </tr>
        `;

    } else {

        inventory.forEach(function (car) {

            const row = document.createElement("tr");

            const brand =
                car.brand.charAt(0).toUpperCase() +
                car.brand.slice(1);

            const fuel =
                car.fuel.charAt(0).toUpperCase() +
                car.fuel.slice(1);

            const status =
                car.status.charAt(0).toUpperCase() +
                car.status.slice(1);


            row.innerHTML = `
                <td>

                    <div class="inventory-vehicle">

                        <div class="inventory-vehicle-image">
                            <i class="fa-solid fa-car"></i>
                        </div>

                        <div>

                            <strong>
                                ${car.name}
                            </strong>

                            <span>
                                ${car.year} • ${brand}
                            </span>

                        </div>

                    </div>

                </td>


                <td>
                    ${car.price}
                </td>


                <td>
                    ${fuel}
                </td>


                <td>

                    <span class="inventory-status ${car.status}">
                        ${status}
                    </span>

                </td>


                <td>

                    <div class="inventory-actions">

                        <button
                            type="button"
                            class="inventory-edit"
                            onclick="editCar(${car.id})"
                        >
                            <i class="fa-solid fa-pen"></i>
                        </button>


                        <button
                            type="button"
                            class="inventory-delete"
                            onclick="deleteCar(${car.id})"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                </td>
            `;

            inventoryTable.appendChild(row);

        });

    }

}


/* ==========================================
   DELETE CAR
========================================== */

function deleteCar(id) {

    const inventory = getInventory();

    const car = inventory.find(function (item) {
        return item.id === id;
    });


    if (!car) {
        return;
    }


    const confirmed = confirm(
        "Delete " + car.name + " from inventory?"
    );


    if (!confirmed) {
        return;
    }


    const updatedInventory =
        inventory.filter(function (item) {
            return item.id !== id;
        });


    localStorage.setItem(
        "ugCarsInventory",
        JSON.stringify(updatedInventory)
    );


    location.reload();

}


/* ==========================================
   EDIT CAR
========================================== */

function editCar(id) {

    alert(
        "Edit functionality will be added next."
    );

}


/* ==========================================
   DASHBOARD STATISTICS
========================================== */

const totalCarsElement =
    document.getElementById("total-cars");

const availableCarsElement =
    document.getElementById("available-cars");

const soldCarsElement =
    document.getElementById("sold-cars");


if (
    totalCarsElement ||
    availableCarsElement ||
    soldCarsElement
) {

    const inventory = getInventory();


    const totalCars =
        inventory.length;


    const availableCars =
        inventory.filter(function (car) {
            return car.status === "available";
        }).length;


    const soldCars =
        inventory.filter(function (car) {
            return car.status === "sold";
        }).length;


    if (totalCarsElement) {
        totalCarsElement.textContent = totalCars;
    }


    if (availableCarsElement) {
        availableCarsElement.textContent = availableCars;
    }


    if (soldCarsElement) {
        soldCarsElement.textContent = soldCars;
    }

}
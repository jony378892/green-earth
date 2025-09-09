const categoryContainer = document.getElementById("categoryContainer");
const cardContainer = document.getElementById("categoryCardContainer");
const cartContainer = document.getElementById("cartContainer");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

const cartItems = [];
let allPlants = [];

const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

const loadPlants = () => {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      displayPlants(data.plants);
    })
    .catch((err) => console.log(err));
};

const filterPlants = (categoryName) => {
  if (!categoryName || categoryName === "All Trees") {
    displayPlants(allPlants);
  } else {
    displayPlants(allPlants.filter((plant) => plant.category === categoryName));
  }
};

const displayCategories = (categories) => {
  categoryContainer.innerHTML = `<button id="all" class="cat_btn bg-green-800 text-white hover:bg-green-600 py-1 px-4 rounded-md hover:text-white w-full text-left cursor-pointer">All Trees</button>`;

  const allCategories = categories.map((category) => {
    return `<button id="${category.id}" class="cat_btn hover:bg-green-600 focus:bg-green-700 text-sm md:text-base py-1 px-4 rounded-md hover:text-white w-full text-left cursor-pointer">${category.category_name}</button>`;
  });

  categoryContainer.innerHTML += allCategories.join("");
};

categoryContainer.addEventListener("click", (e) => {
  removeButtonClass();

  changeCategory(e);
});

const removeButtonClass = () => {
  const categoryButtons = document.querySelectorAll(".cat_btn");

  categoryButtons.forEach((btn) => {
    btn.classList.remove("bg-green-800", "text-white");
  });
};

const changeCategory = (e) => {
  const targetButton = e.target;

  if (targetButton.localName === "button") {
    targetButton.classList.add("bg-green-800", "text-white");
  }

  const categoryName = targetButton.innerText;
  filterPlants(categoryName);
};

const displayPlants = (plants) => {
  cardContainer.innerHTML = "";
  allPlants = plants;

  const plantCards = plants.map((plant) => {
    return `<div id="plant" class="card bg-base-100 shadow-sm p-3">
      <figure>
        <img
          src="${plant.image}"
          alt="${plant.name}"
          class="h-40 sm:44 w-full object-cover object-center"
        />
      </figure>
      <div class="card-body py-2 px-0">
        <h2 onclick="showModal(${plant.id})" class="card-title">${plant.name}</h2>
        <p class="line-clamp-3 text-sm">${plant.description}</p>
        <div class="flex items-center justify-between my-2">
          <div class="badge badge-soft badge-success rounded-full badge-sm text-green-800 ">${plant.category}</div>
          <div class="font-semibold">$${plant.price}</div>
        </div>
        <button onclick="handleCart(${plant.id})" class="btn btn-sm rounded-full bg-green-800 hover:bg-green-900 text-white font-semibold">Add to cart</button>
      </div>
    </div>`;
  });

  cardContainer.innerHTML = plantCards.join("");
};

const handleCart = (id) => {
  const plant = allPlants.find((p) => p.id === id);
  if (plant) manageItem(plant);
};

const manageItem = (plant) => {
  const index = cartItems.findIndex((item) => item.id === plant.id);

  if (index === -1) {
    cartItems.push({
      id: plant.id,
      name: plant.name,
      price: plant.price,
      qty: 1,
      finalPrice: plant.price,
    });
  } else {
    cartItems[index].qty++;
    cartItems[index].finalPrice = cartItems[index].price * cartItems[index].qty;
  }

  displayCartItems();
};

const displayCartItems = () => {
  cartContainer.innerHTML = "";

  const newCartItems = cartItems.map((item) => {
    return `
    <div class="flex items-start justify-between bg-sky-100 rounded-md p-2 mt-2">
      <div class="flex flex-col">
        <p class="text-sm font-semibold">${item.name}</p>
        <span class="text-xs">Qty: <span class="font-semibold">${item.qty}</span></span>
      </div>
      <p class="text-sm font-semibold">$${item.finalPrice}</p>
    </div>
    `;
  });

  // add total
  const total = cartItems.reduce((sum, item) => sum + item.finalPrice, 0);

  cartContainer.innerHTML = `
    ${newCartItems.join("")}
    <div class="border-t border-gray-300 mt-2 flex justify-between items-center">
      <p class="font-semibold">Total</p>
      <p class="font-semibold text-green-800 mt-2 mx-2">$${total}</p>
    </div>
    
  `;
};

const showModal = (id) => {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => displayModalDetails(data.plants));
};

const displayModalDetails = (plant) => {
  modalContent.innerHTML = `
    <figure>
    <img
    src="${plant.image}"
    alt="${plant.name}"
      class="h-64 w-full object-cover object-center"
      />
    </figure>
  <div class="card-body py-2 px-0">
  <h2 onclick="showModal(${plant.id})" class="card-title">
  ${plant.name}
  </h2>
  <p class="line-clamp-3 text-sm">${plant.description}</p>
  <div>Category: ${plant.category}</div>
  <div>Price: ${plant.price}</div>
  </div>
</div>
<div class="modal-action">
      <form method="dialog">
        <button class="btn ">Close</button>
      </form>
    </div>
  `;

  modal.showModal();
};

loadCategories();
loadPlants();

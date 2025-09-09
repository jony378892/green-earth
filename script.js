const categoryContainer = document.getElementById("categoryContainer");
const cardContainer = document.getElementById("categoryCardContainer");
const cartContainer = document.getElementById("cartContainer");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
let allPlants = [];

let cartItems = [];

// Fetch and display categories
const loadCategories = () => {
  console.log("Running loadCategories function");
  categoryContainer.innerHTML = `
    <div class="flex justify-center items-center py-10">
      <span class="loading loading-spinner loading-lg "></span>
    </div>
  `;

  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((err) => console.error("Category fetch error:", err));
};

// Fetch plants (once) and store globally
const loadPlants = () => {
  console.log("Running loadPlants function");

  cardContainer.innerHTML = `
    <div class="flex justify-center items-center py-10 w-full">
      <span class="loading loading-spinner loading-lg "></span>
    </div>
  `;

  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => {
      allPlants = data.plants;
      displayPlants(data.plants);
    })
    .catch((err) => console.error("Plant fetch error:", err));
};

// Display Categories
const displayCategories = (categories) => {
  console.log("Running displayCategories function");

  categoryContainer.innerHTML = `<button id="0" class="cat_btn bg-green-800 text-white hover:bg-green-600 py-1 px-4 rounded-md hover:text-white w-full text-left cursor-pointer">All Trees</button>`;

  const allCategories = categories.map((category) => {
    return `<button id="${category.id}"
      class="cat_btn hover:bg-green-600 focus:bg-green-700 text-sm md:text-base py-1 px-4 rounded-md hover:text-white w-full text-left cursor-pointer">
      ${category.category_name}
    </button>`;
  });

  categoryContainer.innerHTML += allCategories.join("");
};

// Handle category clicks
categoryContainer.addEventListener("click", (e) => {
  console.log("Running addEventListener for categories");

  if (e.target.localName === "button") {
    removeButtonClass();
    e.target.classList.add("bg-green-800", "text-white");
    const categoryId = e.target.id;
    filterPlants(categoryId);
  }
});

//  Filter Category
const filterPlants = (id) => {
  console.log("Running filterPlants function");

  if (!id || id == 0) {
    displayPlants(allPlants);
  } else {
    fetch(`https://openapi.programming-hero.com/api/category/${id}`)
      .then((res) => res.json())
      .then((data) => {
        cardContainer.innerHTML = `
    <div class="flex justify-center items-center py-10 w-full">
      <span class="loading loading-spinner loading-lg "></span>
    </div>
  `;
        displayPlants(data.plants);
      });
  }
};

// Remove class for highlighting
const removeButtonClass = () => {
  console.log("Running removeButtonClass function");

  document.querySelectorAll(".cat_btn").forEach((btn) => {
    btn.classList.remove("bg-green-800", "text-white");
  });
};

// Render plant cards
const displayPlants = (plants) => {
  console.log("Running displayPlants function");

  const plantCards = plants.map((plant) => {
    return `<div id="plant" class="card bg-base-100 shadow-sm p-2">
      <figure>
      <img
      src="${plant.image}"
      alt="${plant.name}"
      class="h-40 sm:h-44 w-full object-cover object-center"
      />
      </figure>
      <div class="card-body py-2 px-0">
      <h2 onclick="showModal(${plant.id})" class="card-title">${plant.name}</h2>
      <p class="line-clamp-3 text-sm">${plant.description}</p>
      <div class="flex items-center justify-between my-2">
      <div class="badge badge-soft badge-success rounded-full badge-sm text-green-800">
      ${plant.category}
      </div>
      <div class="font-semibold">$${plant.price}</div>
      </div>
      <button onclick="handleCart(${plant.id})"
      class="btn btn-sm rounded-full bg-green-800 hover:bg-green-900 text-white font-semibold">
          Add to cart
        </button>
      </div>
      </div>`;
  });

  cardContainer.innerHTML = plantCards.join("");
};

// Handle cart
const handleCart = (id) => {
  console.log("Running handleCart function");

  const plant = allPlants.find((p) => p.id === id);
  if (plant) manageItem(plant);
};

const manageItem = (plant) => {
  console.log("Running manageItem function");

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

// Remove item from cart
const removeCartItem = (id) => {
  console.log("Running removeItem function");

  const index = cartItems.findIndex((item) => item.id === id);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
  displayCartItems();
};

// Display cart items
const displayCartItems = () => {
  console.log("Running displayCartItems function");

  cartContainer.innerHTML = "";

  const newCartItems = cartItems.map((item) => {
    return `
    <div class="flex items-start justify-between bg-sky-100 rounded-md p-2 mt-2">
      <div class="flex flex-col">
      <p class="text-sm font-semibold">${item.name}</p>
      <span class="text-xs">Qty: <span class="font-semibold">${item.qty}</span></span>
      </div>
      <div class="flex items-center gap-2">
      <p class="text-sm font-semibold">$${item.finalPrice}</p>
      <button onclick="removeCartItem(${item.id})"
          class="text-red-500 hover:text-red-700 font-bold text-sm cursor-pointer">❌</button>
      </div>
    </div>`;
  });

  // add total
  const total = cartItems.reduce((sum, item) => sum + item.finalPrice, 0);

  cartContainer.innerHTML = `
    ${newCartItems.join("")}
    <div class="border-t border-gray-300 mt-2 flex justify-between items-center">
      <p class="font-semibold">Total</p>
      <p class="font-semibold text-green-800 mt-2 mx-2">$${total}</p>
    </div>`;
};

// Show modal with details
const showModal = (id) => {
  console.log("Running showModel function");

  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => displayModalDetails(data.plants));
};

const displayModalDetails = (plant) => {
  console.log("Running displayModalDetails function");

  modalContent.innerHTML = `
    <figure>
      <img
        src="${plant.image}"
        alt="${plant.name}"
        class="h-64 w-full object-cover object-center"
      />
    </figure>
    <div class="card-body py-2 px-0">
      <h2 class="card-title">${plant.name}</h2>
      <p class="line-clamp-3 text-sm"><span class="font-semibold">Description: </span>${plant.description}</p>
      <div><span class="font-semibold">Category: </span>${plant.category}</div>
      <div><span class="font-semibold">Price: </span> $${plant.price}</div>
    </div>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Close</button>
      </form>
    </div>`;

  modal.showModal();
};

loadCategories();
loadPlants();

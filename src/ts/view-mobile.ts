import { Product } from "./Product";
import { displayProducts } from "./view-products";

export function OptionsMobile(products: Product[]): void {
    const filterButton = document.getElementById("filter-button");
    const filtersContainer = document.getElementById("filters-container");
    const orderButton = document.getElementById("order-button");
    const orderContainer = document.getElementById("order-container");
    const closeFilter = document.getElementById("close-filter");
    const closeOrder = document.getElementById("close-order");
    const selectColors = document.getElementById("select-colors");
    const listColor = document.getElementById("list-color");
    const selectSizes = document.getElementById("select-sizes");
    const listSize = document.getElementById("list-size");
    const selectPrices = document.getElementById("select-prices");
    const listPrice = document.getElementById("list-price");
    const applyFilter = document.getElementById("apply-filter");
    const clearFilter = document.getElementById("clear-filter");

    filterButton.addEventListener("click", () => {
        filtersContainer.style.display = "block";
    });

    orderButton.addEventListener("click", () => {
        orderContainer.style.display = "block";
    });

    closeFilter.addEventListener("click", () => {
        filtersContainer.style.display = "none";
    });

    closeOrder.addEventListener("click", () => {
        orderContainer.style.display = "none";
    });

    selectColors.addEventListener("click", () => {
        if (listColor.style.display === "block") {
            listColor.style.display = "none";
        } else {
            listColor.style.display = "block";
        }
    });

    selectSizes.addEventListener("click", () => {
        if (listSize.style.display === "grid") {
            listSize.style.display = "none";
        } else {
            listSize.style.display = "grid";
        }
    });

    selectPrices.addEventListener("click", () => {
        if (listPrice.style.display === "block") {
            listPrice.style.display = "none";
        } else {
            listPrice.style.display = "block";
        }
    });

    applyFilter.addEventListener("click", () => {
        displayProducts(products);
        filtersContainer.style.display = "none";
    });

    clearFilter.addEventListener("click", () => {
        clearFilters();
        displayProducts(products);
        filtersContainer.style.display = "none";
    });
}


function clearFilters(): void {
    document.querySelectorAll('.color input[type="checkbox"]').forEach((checkboxElement: HTMLInputElement) => {
        checkboxElement.checked = false;
    });

    document.querySelectorAll('.size button').forEach((buttonElement: HTMLButtonElement) => {
        buttonElement.classList.remove("active");
    });

    document.querySelectorAll('.price input[type="checkbox"]').forEach((checkboxElement: HTMLInputElement) => {
        checkboxElement.checked = false;
    });
    document.getElementById("list-color").style.display = "none";
    document.getElementById("list-size").style.display = "none";
    document.getElementById("list-price").style.display = "none";
}
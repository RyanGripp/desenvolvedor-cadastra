import { Product } from "./Product";
import { displayProducts } from "./view-products";

export function createOrder(products: Product[]): void {
    const dropdown = document.getElementById("order-container") as HTMLDivElement;
    const selectedOption = dropdown.querySelector(".selected-option") as HTMLDivElement;
    const options = dropdown.querySelector("#option-order") as HTMLDivElement;

    selectedOption.addEventListener("click", () => {
        options.style.display = options.style.display === "block" ? "none" : "block";
    });

    const optionItems = options.querySelectorAll("#order-container .option");
    optionItems.forEach(option => {
        option.addEventListener("click", () => {
            const selectedValue = option.getAttribute("data-value");
            if (selectedValue) {
                selectedOption.textContent = option.textContent || "";
                selectedOption.setAttribute("data-value", selectedValue);
                if (window.innerWidth > 768) {
                    options.style.display = "none";
                } else {
                    dropdown.style.display = "none";
                }
                displayProducts(products);
            }
        });
    });
}
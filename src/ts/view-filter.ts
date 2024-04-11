import { Product } from "./Product";
import { Filter } from "./Filter";
import { displayProducts } from "./view-products";

export function createFilters(products: Product[]): void {

    function collectFilters(products: Product[]): Filter {
        const filter: Filter = new Filter();
        const colors: string[] = [];
        const sizes: string[] = [];

        products.forEach(produto => {
            if (!colors.includes(produto.color)) {
                colors.push(produto.color);
            }
            produto.size.forEach(size => {
                if (!sizes.includes(size)) {
                    sizes.push(size);
                }
            });
        });

        filter.color = colors;
        filter.size = sizes;

        return filter;
    }

    function createColor(listColor: string[]): void {
        listColor.forEach(color => {
            const colorDiv = document.createElement("div");
            colorDiv.classList.add("color");
            colorDiv.classList.add(color);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = color;
            checkbox.addEventListener("change", () => {
                document.querySelectorAll('.color input[type="checkbox"]').forEach((checkboxElement: HTMLInputElement) => {
                    if (checkboxElement.id !== color) {
                        checkboxElement.checked = false;
                    }
                });
                if (window.innerWidth > 768) {
                    displayProducts(products);
                }
            });

            const label = document.createElement("label");
            label.htmlFor = color;
            label.textContent = color;

            colorDiv.appendChild(checkbox);
            colorDiv.appendChild(label);

            document.getElementById("list-color").appendChild(colorDiv);
        });
    }

    function createSize(listSizes: string[]): void {
        listSizes.forEach(size => {
            const sizeDiv = document.createElement("div");
            sizeDiv.classList.add("size");
            sizeDiv.classList.add(size);

            const button = document.createElement("button");
            button.id = size;
            button.textContent = size;
            button.addEventListener("click", () => {
                const isActive = button.classList.contains("active");

                document.querySelectorAll('.size button').forEach((buttonElement: HTMLButtonElement) => {
                    buttonElement.classList.remove("active");
                });

                if (!isActive) {
                    button.classList.add("active");
                }
                if (window.innerWidth > 768) {
                    displayProducts(products);
                }
            });

            sizeDiv.appendChild(button);

            document.getElementById("list-size").appendChild(sizeDiv);
        });
    }

    function createPrice(listPrices: string[]): void {

        function formatPriceLabel(price: string): string {
            const range = price.split('-');

            if (range.length === 2) {
                return `de R$${parseInt(range[0])} até R$${parseInt(range[1])}`;
            } else {
                return `a partir de R$${parseInt(price)}`;
            }
        }

        listPrices.forEach(price => {
            const priceDiv = document.createElement("div");
            priceDiv.classList.add("price");
            priceDiv.classList.add(price);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = price;
            checkbox.addEventListener("change", () => {
                document.querySelectorAll('.price input[type="checkbox"]').forEach((checkboxElement: HTMLInputElement) => {
                    if (checkboxElement.id !== price) {
                        checkboxElement.checked = false;
                    }
                });
                if (window.innerWidth > 768) {
                    displayProducts(products);
                }
            });

            const label = document.createElement("label");
            label.htmlFor = price;
            label.textContent = formatPriceLabel(price);

            priceDiv.appendChild(checkbox);
            priceDiv.appendChild(label);

            document.getElementById("list-price").appendChild(priceDiv);
        })
    }

    const filter = collectFilters(products);//pegando os filtros dos produtos da api

    const visibleColors = filter.color.slice(0, 5);
    const moreColors = filter.color.slice(5);

    //Exibe as primeiras 5 cores
    createColor(visibleColors);
    createSize(filter.size);

    //Criando os checkboxs de preço com esses intervalos de valores
    createPrice(["0-50", "51-150", "151-300", "301-500", "500"]);

    const viewMore = document.getElementById("view-more");
    viewMore.textContent = "Ver todas as cores";
    viewMore.addEventListener("click", () => {
        createColor(moreColors);
        viewMore.remove();
    });

    document.getElementById("select-colors").addEventListener("click", () => {
        const listColorElement = document.getElementById("list-color");
        while (listColorElement.firstChild) {
            listColorElement.removeChild(listColorElement.firstChild);
        }
        createColor(filter.color);
    });
}
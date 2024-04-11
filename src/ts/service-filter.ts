import { Filter } from "./Filter";
import { Product } from "./Product";

export function filterProducts(products: Product[]): Product[] {
    const filter = new Filter();

    //filtrando pela cor
    const colorCheck = document.querySelectorAll(".color input[type='checkbox']");
    filter.color = [];

    colorCheck.forEach((checkbox: HTMLInputElement) => {
        if (checkbox.checked) {
            filter.color.push(checkbox.id);
        }
    });

    //filtrando pelo tamanho
    const sizeButtons = document.querySelectorAll(".size .active");
    filter.size = [];

    sizeButtons.forEach((button: HTMLButtonElement) => {
        filter.size.push(button.id);
    });

    //filtrando pelo preço
    const priceCheck = document.querySelectorAll(".price input[type='checkbox']");
    filter.price = [];

    priceCheck.forEach((checkbox: HTMLInputElement) => {
        if (checkbox.checked) {
            const [minPrice, maxPrice] = checkbox.id.split("-").map(Number);
            filter.price.push({ min: minPrice, max: maxPrice });
        }
    });

    //Aplicando os filtros
    const filteredProducts = products.filter(product => {
        const noColorFilter = !filter.color || filter.color.length === 0;
        const noSizeFilter = !filter.size || filter.size.length === 0;
        const noPriceFilter = !filter.price || filter.price.length === 0;

        if (noColorFilter && noSizeFilter && noPriceFilter) {
            return true;
        }

        const colorMatch = noColorFilter || filter.color.includes(product.color);
        const sizeMatch = noSizeFilter || product.size.some(size => filter.size.includes(size));
        const priceMatch = noPriceFilter || filter.price.some(priceRange => {
            return product.price >= priceRange.min && product.price <= priceRange.max;
        });

        return colorMatch && sizeMatch && priceMatch;
    });

    return filteredProducts;
}
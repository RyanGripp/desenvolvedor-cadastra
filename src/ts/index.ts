// import { Filter } from "./Filter";
export class Filter {
  color: Array<string>;
  size: Array<string>;
  price: Array<{ min: number; max: number }>;
}

//filters.ts

function createFilters(products: Product[]): void {

  function collectFilters(products: Product[]) {
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

  function createColor(listColor: string[]) {
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
          filterProducts(products);
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

  function createSize(listSizes: string[]) {
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
          filterProducts(products);
        }
      });

      sizeDiv.appendChild(button);

      document.getElementById("list-size").appendChild(sizeDiv);
    });
  }

  function createPrice(listPrices: string[]) {

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
          filterProducts(products);
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

//index.ts

import { Product } from "./Product";
import { Quantity } from "./Quantity";

const serverUrl = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", async () => {
  const products = await loadProducts(); //Carregar os produtos
  createFilters(products); //Criar os filtros com as cores e tamanhos dos produtos
  displayProducts(products); //Mostrar todos os produtos
  createOrder(products); //Criar a ordenação dos produtos
  createCart(); //Criar o carrinho
  showCart(); //Mostrar o carrinho
  OptionsMobile(products);
  console.log(serverUrl);
});

async function loadProducts() {
  const response = await fetch(serverUrl + "/products");
  if (!response.ok) {
    throw new Error("Erro ao carregar");
  }
  return response.json();
}

function displayProducts(products: Product[], loadMore = false) {
  const productsContainer = document.getElementById("products-container");
  const loadMoreButton = document.getElementById("load-more");
  let loadAll = 0;
  if (window.innerWidth > 768) {
    loadAll = loadMore ? products.length : 9;
  } else {
    loadAll = loadMore ? products.length : 4;
  }
  productsContainer.innerHTML = "";

  for (let i = 0; i < loadAll && i < products.length; i++) {
    const product = products[i];
    const productDiv = createProductDiv(product);
    productsContainer.appendChild(productDiv);
  }

  if (loadAll >= products.length) {
    loadMoreButton.style.display = "none";
  } else {
    loadMoreButton.style.display = "block";
  }

  loadMoreButton.addEventListener("click", () => {
    displayProducts(products, true);
  });

  //Função para criar a div do produto
  function createProductDiv(product: Product) {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.dataset.productId = product.id;

    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name.toUpperCase()}</h2>
      <p class="price">R$ ${product.price.toFixed(2)}</p>
      <p>até ${product.parcelamento.join("x de R$")}</p>
    `;

    const buttonBuy = document.createElement("button");
    buttonBuy.textContent = "Comprar";
    buttonBuy.addEventListener("click", () => {
      addToCart(product);
    });
    productDiv.appendChild(buttonBuy);

    return productDiv;
  }
}

function createCart() {

  function openModal() {
    const modal = document.getElementById("modal-cart");
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    const modal = document.getElementById("modal-cart");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  document.getElementById("shopping-cart").addEventListener("click", openModal);
  document.getElementById("close-modal").addEventListener("click", closeModal);

  //Fechar o modal quando o usuário clica fora da área do modal
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("modal-cart");
    if (event.target == modal) {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    }
  });
}

function showCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    const emptyCart = document.createElement("p");
    emptyCart.textContent = "Carrinho vazio";
    cartContainer.appendChild(emptyCart);
    return;
  }

  cart.forEach((product: Product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product-cart");
    productDiv.dataset.productId = product.id;

    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="info-products">
        <h2>${product.name.toUpperCase()}</h2>
        <p class="price">R$ ${product.price.toFixed(2)}</p>
        <p>até ${product.parcelamento.join("x de R$")}</p>
        <p>Quantidade: 1</p>
        <p class="total">Total: R$ ${product.price.toFixed(2)}</p>
      </div>
    `;

    const buttonRemove = document.createElement("button");
    buttonRemove.textContent = "Remover";
    buttonRemove.addEventListener("click", () => {
      removeFromCart(product);
    });
    productDiv.appendChild(buttonRemove);
    cartContainer.appendChild(productDiv);
  });

  const buttonBuy = document.createElement("button");
  buttonBuy.textContent = "Finalizar compra";
  buttonBuy.addEventListener("click", () => {
    alert("Compra finalizada com sucesso!");
    localStorage.removeItem("cart");
    showCart();
  });

  const total = cart.reduce((acc: number, product: Product) => acc + product.price, 0);
  const buttonBuyDiv = document.createElement("div");
  buttonBuyDiv.classList.add("finalize-buy");
  buttonBuyDiv.innerHTML = `<p class="price-total">Valor Total: R$ ${total.toFixed(2)}</p>`;

  buttonBuyDiv.appendChild(buttonBuy);
  cartContainer.appendChild(buttonBuyDiv);

}

function addToCart(product: Product) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  // const quantity = JSON.parse(localStorage.getItem("quantity") || "[]");
  // quantity.forEach((p: Quantity) => {
  //   if (p.id === product.id) {
  //     p.quantity += 1;
  //     quantity.push(p);
  //     localStorage.setItem("quantity", JSON.stringify(quantity));
  //     return;
  //   }
  // });

  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  // quantity.push(p);
  // localStorage.setItem("quantity", JSON.stringify(quantity));
  showCart();
}

function removeFromCart(product: Product) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const newCart = cart.filter((cartProduct: Product) => cartProduct.id !== product.id);
  localStorage.setItem("cart", JSON.stringify(newCart));
  showCart();
}

function createOrder(products: Product[]) {
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
        filterProducts(products);
      }
    });
  });
}

function orderProducts(products: Product[], order: string) {
  const sortedProducts = [...products];

  if (order === "lowest-price") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (order === "biggest-price") {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (order === "recent") {
    sortedProducts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }

  displayProducts(sortedProducts);
}

function filterProducts(products: Product[]) {
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

  //Verificando se há ordem selecionada
  const selectedOption = document.querySelector(".selected-option").getAttribute("data-value");

  orderProducts(filteredProducts, selectedOption);
}

function OptionsMobile(products: Product[]) {
  document.getElementById("filter-button").addEventListener("click", () => {
    document.getElementById("filters-container").style.display = "block";
  });

  document.getElementById("order-button").addEventListener("click", () => {
    document.getElementById("order-container").style.display = "block";
  });

  document.getElementById("close-filter").addEventListener("click", () => {
    document.getElementById("filters-container").style.display = "none";
  });

  document.getElementById("close-order").addEventListener("click", () => {
    document.getElementById("order-container").style.display = "none";
  });

  document.getElementById("select-colors").addEventListener("click", () => {
    if (document.getElementById("list-color").style.display === "block") {
      document.getElementById("list-color").style.display = "none";
    } else {
      document.getElementById("list-color").style.display = "block";
    }
  });

  document.getElementById("select-sizes").addEventListener("click", () => {
    if (document.getElementById("list-size").style.display === "grid") {
      document.getElementById("list-size").style.display = "none";
    } else {
      document.getElementById("list-size").style.display = "grid";
    }
  });

  document.getElementById("select-prices").addEventListener("click", () => {
    if (document.getElementById("list-price").style.display === "block") {
      document.getElementById("list-price").style.display = "none";
    } else {
      document.getElementById("list-price").style.display = "block";
    }
  });

  document.getElementById("apply-filter").addEventListener("click", () => {
    filterProducts(products);
    document.getElementById("filters-container").style.display = "none";
  });

  document.getElementById("clear-filter").addEventListener("click", () => {
    clearFilters();
    filterProducts(products);
    document.getElementById("filters-container").style.display = "none";
  });
}

function clearFilters() {
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
import { Product } from "./Product";
import { createFilters } from "./view-filter";
import { createCart } from "./view-cart";
import { displayProducts } from "./view-products";
import { createOrder } from "./view-order";
import { OptionsMobile } from "./view-mobile";

const serverUrl = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", async () => {
  const products: Product[] = await loadProducts(); //Carregar os produtos
  createFilters(products); //Criar os filtros com as cores e tamanhos dos produtos
  displayProducts(products); //Mostrar todos os produtos
  createOrder(products); //Criar a ordenação dos produtos
  createCart(); //Criar o carrinho
  OptionsMobile(products); //Criar as opções para mobile
  console.log(serverUrl);
});

async function loadProducts(): Promise<Product[]> {
  const response = await fetch(serverUrl + "/products");
  if (!response.ok) {
    throw new Error("Erro ao carregar");
  }
  return response.json();
}
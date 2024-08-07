import firebase from "firebase/compat/app";
import "firebase/compat/database";

import { Product } from "./Product";
import { createFilters } from "./view-filter";
import { createCart } from "./view-cart";
import { displayProducts } from "./view-products";
import { createOrder } from "./view-order";
import { OptionsMobile } from "./view-mobile";

const firebaseConfig = {
  apiKey: "AIzaSyBlfG6w8r-shyQV7htBLwtb_LPVCAE9vqQ",
  authDomain: "produtos-cadastra.firebaseapp.com",
  databaseURL: "https://produtos-cadastra-default-rtdb.firebaseio.com",
  projectId: "produtos-cadastra",
  storageBucket: "produtos-cadastra.appspot.com",
  messagingSenderId: "220465147283",
  appId: "1:220465147283:web:9633e244c79c2d71dc0c66"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", async () => {
  const products: Product[] = await loadProducts(); //Carregar os produtos
  createFilters(products); //Criar os filtros com as cores e tamanhos dos produtos
  displayProducts(products); //Mostrar todos os produtos
  createOrder(products); //Criar a ordenação dos produtos
  createCart(); //Criar o carrinho
  OptionsMobile(products); //Criar as opções para mobile
});

async function loadProducts(): Promise<Product[]> {
  const snapshot = await database.ref('/products').once('value');
  const products = snapshot.val();
  if (!products) {
    throw new Error("Nenhum produto encontrado");
  }
  return products;
}
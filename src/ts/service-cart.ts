import { CartItem } from "./CarItem";
import { Product } from "./Product";

export function addToCart(product: Product) {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    // Verifica se o produto já está no carrinho
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        // Se o produto já estiver no carrinho, aumenta a quantidade
        cart[existingProductIndex].quantity += 1;
    } else {
        // Se o produto não estiver no carrinho, adiciona-o
        const cartItem: CartItem = { ...product, quantity: 1 };
        cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}


export function removeFromCart(product: Product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newCart = cart.filter((cartProduct: Product) => cartProduct.id !== product.id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    // showCart();
}
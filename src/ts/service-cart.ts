import { CartItem } from "./CartItem";
import { Product } from "./Product";

export function addToCart(product: Product): void {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        const cartItem: CartItem = { ...product, quantity: 1 };
        cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

export function removeFromCart(product: Product): void {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const newCart = cart.filter((cartProduct: Product) => cartProduct.id !== product.id);
    localStorage.setItem("cart", JSON.stringify(newCart));
}
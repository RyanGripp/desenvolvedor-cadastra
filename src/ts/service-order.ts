import { Product } from "./Product";

export function orderProducts(products: Product[], order: string): Product[] {
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

    return sortedProducts;
  }
import { Page, Locator } from '@playwright/test';
 
  export class ProductDetailsPage {
  readonly page: Page;
  readonly name: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;

    constructor(page: Page) {
    this.page = page;
    this.name = page.getByTestId('inventory-item-name');
    this.price = page.getByTestId('inventory-item-price');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.removeButton = page.getByRole('button', { name: 'Remove' });
    this.backButton = page.getByTestId('back-to-products');
    }

    async addToCart() {
    await this.addToCartButton.click();
    }
 
    async goBack() {
    await this.backButton.click();
  }
}


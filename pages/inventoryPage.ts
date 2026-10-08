import { Page, Locator } from '@playwright/test';

  export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly items: Locator;
  readonly names: Locator;
  readonly prices: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

    constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.names = page.getByTestId('inventory-item-name');
    this.prices = page.getByTestId('inventory-item-price');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    }

    async addToCart(productName: string) {
    await this.items
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

    async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

    async getNames() {
    return await this.names.allTextContents();
  }

    async getPrices() {
    const texts = await this.prices.allTextContents();
    return texts.map((text) => parseFloat(text.replace('$', '')));
  }

    async openCart() {
    await this.cartLink.click();
  }

    async openProduct(productName: string) {
    await this.names.filter({ hasText: productName }).click();
  }
}
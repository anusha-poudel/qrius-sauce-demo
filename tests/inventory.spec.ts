import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { users } from '../test-data/users';
import { products } from '../test-data/products';

let inventoryPage: InventoryPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
});

test('verify product count', async () => {
  await expect(inventoryPage.items).toHaveCount(products.length);
});

test('verify product names and prices', async () => {
  await expect(inventoryPage.names).toHaveText(products.map((p) => p.name));
  await expect(inventoryPage.prices).toHaveText(products.map((p) => `$${p.price}`));
});

test('add product to cart', async () => {
  await inventoryPage.addToCart(products[0].name);
  await expect(inventoryPage.cartBadge).toHaveText('1');

  await inventoryPage.openCart();
  await expect(inventoryPage.names).toHaveText(products[0].name);
});

test('sort by name A to Z', async () => {
  await inventoryPage.sortBy('az');
  await expect(inventoryPage.names).toHaveText(products.map((p) => p.name).sort());
});

test('sort by name Z to A', async () => {
  await inventoryPage.sortBy('za');
  await expect(inventoryPage.names).toHaveText(products.map((p) => p.name).sort().reverse());
});

test('sort by price low to high', async () => {
  await inventoryPage.sortBy('lohi');
  await expect(inventoryPage.prices).toHaveText(
    products.map((p) => p.price).sort((a, b) => a - b).map((price) => `$${price}`)
  );
});

test('sort by price high to low', async () => {
  await inventoryPage.sortBy('hilo');
  await expect(inventoryPage.prices).toHaveText(
    products.map((p) => `$${p.price}`).sort((a, b) => parseFloat(b.replace('$', '')) - parseFloat(a.replace('$', '')))
  );
});
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { ProductDetailsPage } from '../pages/productsDetailsPage';
import { users } from '../test-data/users';
import { products } from '../test-data/products';

let inventoryPage: InventoryPage;
let detailsPage: ProductDetailsPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  detailsPage = new ProductDetailsPage(page);

  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
});

for (const product of products) {
  test(`details page shows correct name and price for ${product.name}`, async () => {
    await inventoryPage.openProduct(product.name);

    await expect(detailsPage.name).toHaveText(product.name);
    await expect(detailsPage.price).toHaveText(`$${product.price}`);
  });
}

test('add product to cart from details page', async () => {
  await inventoryPage.openProduct(products[0].name);
  await detailsPage.addToCart();

  await expect(inventoryPage.cartBadge).toHaveText('1');
  await expect(detailsPage.removeButton).toBeVisible();
});


test('back button returns to the products page', async ({ page }) => {
  await inventoryPage.openProduct(products[0].name);
  await detailsPage.goBack();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(inventoryPage.items).toHaveCount(products.length);
});
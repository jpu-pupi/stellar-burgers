import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });

  await page.goto('/');
});

test('отображаются моковые ингредиенты', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByText('Моя тестовая булка')
  ).toBeVisible();
});

test('добавление булки', async ({ page }) => {
  await page.goto('http://localhost:4000/');
  await page.getByRole('listitem').filter({ hasText: 'Моя тестовая булкаДобавить' }).getByRole('button').click();
  await expect(page.getByRole('main')).toContainText('Моя тестовая булка');
});

test('добавление ингридиента', async ({ page }) => {
  await page.goto('http://localhost:4000/');
  await page.getByRole('listitem').filter({ hasText: 'Моя тестовая котлетаДобавить' }).getByRole('button').click();
  await expect(page.getByRole('main')).toContainText('Моя тестовая котлета');
});

test('добавление соуса', async ({ page }) => {
  await page.goto('http://localhost:4000/');
  await page.getByRole('listitem').filter({ hasText: 'Мой тестовый соусДобавить' }).getByRole('button').click();
  await expect(page.getByRole('main')).toContainText('Мой тестовый соус');
});

test('открытие модального окна ингредиента', async ({ page }) => {
  await page.goto('/');

  await page.locator('li').first().click();

  await expect(
    page.getByText('Калории, ккал')
  ).toBeVisible();
});

test('закрытие модального окна по клику на крестик', async ({ page }) => {
  await page.goto('http://localhost:4000/');
  await page.getByRole('link', { name: 'Моя тестовая булка' }).click();
  await expect(page.locator('#modals')).toContainText('Калории, ккал');
  const modal = page.locator('#modals');
  await modal.getByRole('button').click();
  await expect(page.locator('#modals')).not.toBeVisible();
});

test('закрытие модального окна по оверлею', async ({ page }) => {
  await page.goto('http://localhost:4000/');
  await page.getByRole('link', { name: 'Моя тестовая булка' }).click();
  await expect(page.locator('#modals')).toContainText('Калории, ккал');
  
  await page.mouse.click(10, 10);
  await expect(page.locator('#modals')).not.toBeVisible();
});
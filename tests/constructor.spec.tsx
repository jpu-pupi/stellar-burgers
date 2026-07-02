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

test.describe('Добавление ингредиентов в конструктор', () => {
test('добавление булки', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByText('Моя тестовая булка (верх)')
  ).toHaveCount(0);

  await expect(
    page.getByText('Моя тестовая булка (низ)')
  ).toHaveCount(0);

  await page
    .getByRole('listitem')
    .filter({ hasText: 'Моя тестовая булкаДобавить' })
    .getByRole('button')
    .click();

  await expect(
    page.getByText('Моя тестовая булка (верх)')
  ).toBeVisible();

  await expect(
    page.getByText('Моя тестовая булка (низ)')
  ).toBeVisible();
});

test('добавление ингридиента', async ({ page }) => {
  await page.goto('/');

  const constructor = page.locator('section').last();

  await expect(
    constructor.getByText('Моя тестовая котлета')
  ).toHaveCount(0);

  await page
    .getByRole('listitem')
    .filter({ hasText: 'Моя тестовая котлетаДобавить' })
    .getByRole('button')
    .click();

  await expect(
    constructor.getByText('Моя тестовая котлета')
  ).toBeVisible();
});

test('добавление соуса', async ({ page }) => {
  await page.goto('/');
    const constructor = page.locator('section').last();

  await expect(
    constructor.getByText('Мой тестовый соус')
  ).toHaveCount(0);

  await page
    .getByRole('listitem')
    .filter({ hasText: 'Мой тестовый соусДобавить' })
    .getByRole('button')
    .click();

  await expect(
    constructor.getByText('Мой тестовый соус')
  ).toBeVisible();
});
});

test.describe('Модальное окно ингредиента', () => {
test('открытие модального окна ингредиента', async ({ page }) => {
  await expect(
    page.locator('#modals').getByText('Моя тестовая булка')
  ).toHaveCount(0);

  await page.getByText('Моя тестовая булка').click();

  await expect(
    page.locator('#modals').getByText('Моя тестовая булка')
  ).toBeVisible();

  await expect(
    page.locator('#modals').getByText('Калории, ккал')
  ).toBeVisible();
});

test('закрытие модального окна по клику на крестик', async ({ page }) => {
  await expect(
    page.locator('#modals').getByText('Моя тестовая булка')
  ).toHaveCount(0);

  await page.getByRole('link', { name: 'Моя тестовая булка' }).click();

  await expect(
    page.locator('#modals').getByText('Моя тестовая булка')
  ).toBeVisible();

  const modal = page.locator('#modals');

  await modal.getByRole('button').click();

  await expect(
    page.locator('#modals').getByText('Моя тестовая булка')
  ).toHaveCount(0);
});

test('закрытие модального окна по оверлею', async ({ page }) => {
  await page.getByRole('link', { name: 'Моя тестовая булка' }).click();

  await expect(
    page.locator('#modals').getByText('Моя тестовая булка')
  ).toBeVisible();

  await page.mouse.click(10, 10);

  await expect(
    page.locator('#modals').getByText('Моя тестовая булка')
  ).toHaveCount(0);
});
});
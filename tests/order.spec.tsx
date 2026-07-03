import { test, expect } from '@playwright/test';

test('создание заказа', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'mock-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });

  await page.route('**/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          name: 'Test User',
          email: 'test@test.ru'
        }
      })
    });
  });

  await page.route('**/orders', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        name: 'Тестовый бургер',
        order: {
          number: 12345
        }
      })
    });
  });

  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          {
            _id: '1',
            name: 'Моя тестовая булка',
            type: 'bun',
            price: 100,
            image: 'img'
          },
          {
            _id: '2',
            name: 'Моя тестовая котлета',
            type: 'main',
            price: 200,
            image: 'img'
          }
        ]
      })
    });
  });

  await page.goto('http://localhost:4000/');

  await page
    .getByRole('listitem')
    .filter({ hasText: 'Моя тестовая булка' })
    .getByRole('button')
    .click();

  await page
    .getByRole('listitem')
    .filter({ hasText: 'Моя тестовая котлета' })
    .getByRole('button')
    .click();

  await expect(page.locator('#modals').getByText('12345')).not.toBeVisible();

  await page.getByRole('button', { name: 'Оформить заказ' }).click();
 
  const orderModal = page.locator('#modals');

  await expect(orderModal.getByText('12345')).toBeVisible();
  await expect(orderModal.getByRole('button')).toBeVisible();

  await expect(page.getByText('Выберите начинку')).toBeVisible();
  await expect(page.getByText('Выберите булки').first()).toBeVisible();

  await page.locator('#modals').getByRole('button').click();

  await expect(page.locator('#modals')).not.toBeVisible();
});
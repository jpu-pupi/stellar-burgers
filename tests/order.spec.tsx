import { test, expect } from '@playwright/test';

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page, context }) => {
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

    await page.routeFromHAR('./hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.routeFromHAR('./hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.routeFromHAR('./hars/order.har', {
      url: '**/api/orders',
      update: false
    });

    await page.goto('/');
  });

  test('создание заказа', async ({ page }) => {
    await page
      .getByRole('listitem')
      .filter({ hasText: 'Моя тестовая булкаДобавить' })
      .getByRole('button')
      .click();

    await page
      .getByRole('listitem')
      .filter({ hasText: 'Моя тестовая котлетаДобавить' })
      .getByRole('button')
      .click();

    await expect(page.locator('#modals').getByText('12345')).toHaveCount(0);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const orderModal = page.locator('#modals');

    await expect(orderModal.getByText('12345')).toBeVisible();
    await expect(orderModal.getByRole('button')).toBeVisible();

    await expect(page.getByText('Выберите начинку')).toBeVisible();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();

    await orderModal.getByRole('button').click();

    await expect(page.locator('#modals')).not.toBeVisible();
  });
});

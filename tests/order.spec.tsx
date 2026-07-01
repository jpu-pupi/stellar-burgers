import { test, expect } from '@playwright/test';

test('record user har', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'refreshToken',
      'c08b9d61026f958b2054fabc0159159e619a0eb2af9637ed2231eab5e386ae531b6766b8b9b52ba7'
    );

    document.cookie =
      'accessToken=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjZkMTc1NmExNzJkMDAxYjk4YzJiZiIsImlhdCI6MTc4Mjg4NDkwNCwiZXhwIjoxNzgyODg2MTA0fQ.XkQJb808O_9xwrHcvetg_EedwfRTZ_9JlWfR6wUBpVs';
  });

  await page.routeFromHAR('./hars/user.har', {
    url: '**/auth/user',
    update: true
  });

  await page.goto('/');
  await page.waitForTimeout(5000);
});

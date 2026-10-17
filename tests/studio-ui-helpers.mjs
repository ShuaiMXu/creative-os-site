export async function openStudioActions(page) {
  if (!(await page.locator(".studio-more").evaluate((el) => el.open)))
    await page.locator(".studio-more > summary").click();
}

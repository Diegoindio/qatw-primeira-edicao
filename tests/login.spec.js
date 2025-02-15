import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';

import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';

import { LoginActions } from '../actions/LoginActions';

test('Não deve logar quando o codigo de autenticacao e invalido', async ({ page }) => {
  
  const loginPage = new LoginPage(page)

  
  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)
  await loginPage.informa2FA('123456')

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuario', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await loginPage.acessaPagina()
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)


  await page.waitForTimeout(3000)
  const code = await obterCodigo2FA()

  await loginPage.informa2FA(code)

  await page.waitForTimeout(2000)

  expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
});

test('Deve acessar a conta do usuario 2', async ({ page }) => {

  const loginActions = new LoginActions(page)

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await loginActions.acessaPagina()
  await loginActions.informaCpf(usuario.cpf)
  await loginActions.informaSenha(usuario.senha)


  await page.waitForTimeout(3000)
  const code = await obterCodigo2FA()

  await loginActions.informa2FA(code)

  await page.waitForTimeout(2000)

  expect(await loginActions.obterSaldo()).toHaveText('R$ 5.000,00')
});
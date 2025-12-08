import { expect, beforeEach, vi, test } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import App from '../src/App.jsx'
import { ChatbotPage } from './pages/ChatbotPage.js'
import { RegistrationFormPage } from './pages/RegistrationFormPage.js'
import { createUser, defaultFormData } from './utils/testHelpers.js'

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
  cleanup()
  render(<App />)
})

test('Запуск чат бота', async () => {
  const user = createUser()
  const chatbot = new ChatbotPage(screen, user)

  expect(screen.getByText('Открыть Чат')).toBeInTheDocument()
  await chatbot.openChat()
  expect(chatbot.isStartConversationButtonVisible()).toBe(true)
})

test('Работа формы регистрации', async () => {
  const user = createUser()
  const form = new RegistrationFormPage(screen, user)

  expect(form.hasFormField('Email')).toBe(true)
  expect(form.hasFormField('Пароль')).toBe(true)
  expect(form.hasFormField('Адрес')).toBe(true)
  expect(form.hasFormField('Город')).toBe(true)
  expect(form.hasFormField('Страна')).toBe(true)
  expect(form.hasFormField('Принять правила')).toBe(true)
  expect(form.getSubmitButton()).toBeInTheDocument()

  await form.fillAndSubmitForm(defaultFormData)

  expect(form.hasResultField('Email')).toBe(true)
  expect(form.hasResultValue('test@example.com')).toBe(true)
  expect(form.hasResultField('Пароль')).toBe(true)
  expect(form.hasResultValue('password123')).toBe(true)
  expect(form.hasResultField('Адрес')).toBe(true)
  expect(form.hasResultValue('Невский проспект, 12')).toBe(true)
  expect(form.hasResultField('Город')).toBe(true)
  expect(form.hasResultValue('Санкт-Петербург')).toBe(true)
  expect(form.hasResultField('Страна')).toBe(true)
  expect(form.hasResultValue('Россия')).toBe(true)
  expect(form.hasResultField('Принять правила')).toBe(true)
  expect(form.hasResultValue('true')).toBe(true)

  expect(form.getBackButton()).toBeInTheDocument()
  await form.goBack()
  expect(form.isFormVisible()).toBe(true)
})

test('Виджет и форма работают вместе', async () => {
  const user = createUser()
  const chatbot = new ChatbotPage(screen, user)
  const form = new RegistrationFormPage(screen, user)

  const emailInput = form.getEmailInput()
  expect(emailInput).toBeInTheDocument()

  await user.type(emailInput, 'test@test.com')
  expect(emailInput).toHaveValue('test@test.com')

  expect(screen.getByText('Открыть Чат')).toBeInTheDocument()
  await chatbot.openChat()
  expect(chatbot.isStartConversationButtonVisible()).toBe(true)

  await chatbot.closeChat()

  const emailInputAfter = form.getEmailInput()
  expect(emailInputAfter).toHaveValue('test@test.com')
})

test('Виджет корректно работает: полный цикл навигации', async () => {
  const user = createUser()
  const chatbot = new ChatbotPage(screen, user)

  expect(screen.getByText('Открыть Чат')).toBeInTheDocument()

  await chatbot.openChat()
  expect(chatbot.isStartConversationButtonVisible()).toBe(true)
  expect(chatbot.hasWelcomeMessage()).toBe(true)

  await chatbot.clickStartConversation()
  expect(chatbot.hasStartMessage()).toBe(true)
  expect(chatbot.isTryITButtonVisible()).toBe(true)

  await chatbot.clickTryIT()
  expect(chatbot.hasTryMessage()).toBe(true)
  expect(chatbot.isGoBackButtonVisible()).toBe(true)

  await chatbot.clickGoBack()
  expect(chatbot.hasStartMessage()).toBe(true)
  expect(chatbot.isTryITButtonVisible()).toBe(true)
})

test('Крайний случай: повторные клики на кнопку открытия чата', async () => {
  const user = createUser()
  const chatbot = new ChatbotPage(screen, user)

  const openButton = screen.getByRole('button', { name: 'Открыть Чат' })
  expect(openButton).toBeInTheDocument()

  await chatbot.openChat()
  expect(chatbot.isStartConversationButtonVisible()).toBe(true)

  await chatbot.openChat()
  expect(chatbot.isStartConversationButtonVisible()).toBe(true)

  await chatbot.closeChat()
  await chatbot.openChat()
  expect(chatbot.isStartConversationButtonVisible()).toBe(true)
})

test('Крайний случай: повторные клики на кнопки навигации', async () => {
  const user = createUser()
  const chatbot = new ChatbotPage(screen, user)

  await chatbot.openChat()
  await chatbot.clickStartConversation()

  expect(chatbot.isTryITButtonVisible()).toBe(true)
  await chatbot.clickTryIT()

  expect(chatbot.isGoBackButtonVisible()).toBe(true)
  expect(chatbot.hasTryMessage()).toBe(true)

  await chatbot.clickGoBack()
  expect(chatbot.isTryITButtonVisible()).toBe(true)
  expect(chatbot.hasStartMessage()).toBe(true)

  expect(chatbot.isGoBackButtonVisible()).toBe(false)

  await chatbot.clickTryIT()
  expect(chatbot.isGoBackButtonVisible()).toBe(true)
  expect(chatbot.hasTryMessage()).toBe(true)
})

test('Крайний случай: быстрые последовательные переходы между шагами', async () => {
  const user = createUser()
  const chatbot = new ChatbotPage(screen, user)

  await chatbot.openChat()
  await chatbot.clickStartConversation()
  await chatbot.clickTryIT()
  await chatbot.clickGoBack()
  await chatbot.clickTryIT()

  expect(chatbot.isGoBackButtonVisible()).toBe(true)
  expect(chatbot.hasTryMessage()).toBe(true)
})

test('Крайний случай: множественное открытие и закрытие чата', async () => {
  const user = createUser()
  const chatbot = new ChatbotPage(screen, user)

  for (let i = 0; i < 3; i++) {
    await chatbot.openChat()
    expect(chatbot.isStartConversationButtonVisible()).toBe(true)

    await chatbot.closeChat()
    expect(chatbot.isStartConversationButtonVisible()).toBe(false)
  }

  await chatbot.openChat()
  expect(chatbot.isStartConversationButtonVisible()).toBe(true)
})

test('Крайний случай: состояние чата после закрытия и открытия', async () => {
  const user = createUser()
  const chatbot = new ChatbotPage(screen, user)

  await chatbot.navigateToTry()
  expect(chatbot.hasTryMessage()).toBe(true)

  await chatbot.closeChat()
  await chatbot.openChat()

  expect(chatbot.isStartConversationButtonVisible()).toBe(true)
  expect(chatbot.hasWelcomeMessage()).toBe(true)
})

test('Крайний случай: закрытие чата во время навигации', async () => {
  const user = createUser()
  const chatbot = new ChatbotPage(screen, user)

  await chatbot.navigateToStart()
  expect(chatbot.isTryITButtonVisible()).toBe(true)

  await chatbot.closeChat()
  expect(chatbot.isTryITButtonVisible()).toBe(false)

  await chatbot.openChat()
  expect(chatbot.isStartConversationButtonVisible()).toBe(true)
})

test('Крайний случай: циклическая навигация (вперед-назад)', async () => {
  const user = createUser()
  const chatbot = new ChatbotPage(screen, user)

  await chatbot.navigateToStart()

  for (let i = 0; i < 3; i++) {
    await chatbot.clickTryIT()
    expect(chatbot.isGoBackButtonVisible()).toBe(true)

    await chatbot.clickGoBack()
    expect(chatbot.isTryITButtonVisible()).toBe(true)
  }

  expect(chatbot.hasStartMessage()).toBe(true)
  expect(chatbot.isTryITButtonVisible()).toBe(true)
})

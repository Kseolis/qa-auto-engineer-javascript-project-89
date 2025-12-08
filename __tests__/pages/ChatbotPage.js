export class ChatbotPage {
  constructor(screen, user) {
    this.screen = screen
    this.user = user
  }

  async openChat() {
    const openButton = this.screen.getByRole('button', { name: 'Открыть Чат' })
    await this.user.click(openButton)
  }

  async closeChat() {
    const closeButton = this.screen.getByRole('button', { name: 'Close' })
    await this.user.click(closeButton)
  }

  async clickStartConversation() {
    const button = this.screen.getByRole('button', { name: 'Начать разговор' })
    await this.user.click(button)
  }

  async clickTryIT() {
    const button = this.screen.getByRole('button', { name: 'Попробовать себя в IT' })
    await this.user.click(button)
  }

  async clickGoBack() {
    const button = this.screen.getByRole('button', { name: 'Вернуться назад' })
    await this.user.click(button)
  }

  isChatOpen() {
    return this.screen.queryByRole('button', { name: 'Начать разговор' }) !== null
  }

  isStartConversationButtonVisible() {
    return this.screen.queryByRole('button', { name: 'Начать разговор' }) !== null
  }

  isTryITButtonVisible() {
    return this.screen.queryByRole('button', { name: 'Попробовать себя в IT' }) !== null
  }

  isGoBackButtonVisible() {
    return this.screen.queryByRole('button', { name: 'Вернуться назад' }) !== null
  }

  hasWelcomeMessage() {
    const messages = this.screen.getAllByText(/Привет! Я ваш виртуальный помощник/)
    return messages.length > 0
  }

  hasStartMessage() {
    const messages = this.screen.getAllByText(/Помогу вам выбрать подходящий курс/)
    return messages.length > 0
  }

  hasTryMessage() {
    const messages = this.screen.getAllByText(/У нас есть подготовительные курсы/)
    return messages.length > 0
  }

  async navigateToStart() {
    await this.openChat()
    await this.clickStartConversation()
  }

  async navigateToTry() {
    await this.navigateToStart()
    await this.clickTryIT()
  }
}

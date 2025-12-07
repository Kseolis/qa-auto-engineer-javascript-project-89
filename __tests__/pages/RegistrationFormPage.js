export class RegistrationFormPage {
  constructor(screen, user) {
    this.screen = screen
    this.user = user
  }

  getEmailInput() {
    return this.screen.getByLabelText('Email')
  }

  getPasswordInput() {
    return this.screen.getByLabelText('Пароль')
  }

  getAddressInput() {
    return this.screen.getByLabelText('Адрес')
  }

  getCityInput() {
    return this.screen.getByLabelText('Город')
  }

  getCountrySelect() {
    return this.screen.getByLabelText('Страна')
  }

  getRulesCheckbox() {
    return this.screen.getByLabelText('Принять правила')
  }

  getSubmitButton() {
    return this.screen.getByRole('button', { name: 'Зарегистрироваться' })
  }

  getBackButton() {
    return this.screen.getByRole('button', { name: 'Назад' })
  }

  async fillForm(formData) {
    const {
      email = '',
      password = '',
      address = '',
      city = '',
      country = '',
      acceptRules = false,
    } = formData

    if (email) {
      await this.user.type(this.getEmailInput(), email)
    }
    if (password) {
      await this.user.type(this.getPasswordInput(), password)
    }
    if (address) {
      await this.user.type(this.getAddressInput(), address)
    }
    if (city) {
      await this.user.type(this.getCityInput(), city)
    }
    if (country) {
      await this.user.selectOptions(this.getCountrySelect(), country)
    }
    if (acceptRules) {
      await this.user.click(this.getRulesCheckbox())
    }
  }

  async submitForm() {
    await this.user.click(this.getSubmitButton())
  }

  async goBack() {
    await this.user.click(this.getBackButton())
  }

  async fillAndSubmitForm(formData) {
    await this.fillForm(formData)
    await this.submitForm()
  }

  isFormVisible() {
    return this.screen.queryByRole('button', { name: 'Зарегистрироваться' }) !== null
  }

  isResultVisible() {
    return this.screen.queryByRole('button', { name: 'Назад' }) !== null
  }

  hasFormField(label) {
    return this.screen.queryByLabelText(label) !== null
  }

  hasResultField(label) {
    return this.screen.queryByText(label) !== null
  }

  hasResultValue(value) {
    return this.screen.queryByText(value) !== null
  }
}
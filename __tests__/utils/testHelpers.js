import { userEvent } from '@testing-library/user-event'

export const createUser = () => userEvent.setup()

export const defaultFormData = {
  email: 'test@example.com',
  password: 'password123',
  address: 'Невский проспект, 12',
  city: 'Санкт-Петербург',
  country: 'Россия',
  acceptRules: true
}

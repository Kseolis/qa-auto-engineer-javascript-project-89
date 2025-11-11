import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Widget from '@hexlet/chatbot-v2'
import steps from '../__fixtures__/steps'

test('screen debug test', () => {
  render(Widget(steps))
  screen.debug
  expect(screen.getByText('Открыть Чат')).toBeInTheDocument()
});

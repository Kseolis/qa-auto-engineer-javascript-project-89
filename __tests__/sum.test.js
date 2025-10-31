import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import Widget from '@hexlet/chatbot-v2'
import steps from '@hexlet/chatbot-v2/example-steps'

test('screen debug test', () => {
  expect(render(Widget(steps))).toBeDefined()
  screen.debug
})

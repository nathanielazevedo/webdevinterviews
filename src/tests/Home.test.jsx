import { render, screen } from '@testing-library/react'
import Home from '../pages/Home'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'

describe('Home component', () => {
  test('renders Home component and checks if logo is present', () => {
    render(<Home />, {
      wrapper: BrowserRouter,
    })

    // Check if the logo image is rendered
    const logo = screen.getByText('Welcome to WDI.')
    expect(logo).toBeInTheDocument()
  })
})

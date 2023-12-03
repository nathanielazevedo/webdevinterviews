import { render, screen } from '@testing-library/react'
import Home from '../Home'

describe('Home component', () => {
  test('renders Home component and checks if logo is present', () => {
    render(<Home />)

    // Check if the logo image is rendered
    const logo = screen.getByAltText('logo')
    expect(logo).toBeInTheDocument()
  })
})

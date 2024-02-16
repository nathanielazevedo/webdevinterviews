import { render, screen } from '@testing-library/react'
import Home from '../pages/Home'

describe('Home component', () => {
  test('renders Home component and checks if logo is present', () => {
    render(<Home />)

    // Check if the logo image is rendered
    const logo = screen.getByText('Learn')
    expect(logo).toBeInTheDocument()
  })
})

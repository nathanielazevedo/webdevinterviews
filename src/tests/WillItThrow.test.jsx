import { fireEvent, render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider } from '../contexts/AuthContext'
import Router from '../Router'
import { beforeEach } from 'vitest'
import { jwtDecode } from 'jwt-decode'

vi.mock('jwt-decode', () => ({
  jwtDecode: () => {
    return { sub: 'nate' }
  },
}))

describe('Will It Throw Component', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', 'mock')
    vi.useFakeTimers()
  })

  it('renders every item in every deck and moves until the end', async () => {
    render(
      <AuthProvider>
        <Router />
      </AuthProvider>
    )

    let gamesButton = screen.queryByText('Play Will It Throw')
    fireEvent.click(gamesButton)
    let gameButton = screen.queryByText('Syntax Error')
    fireEvent.click(gameButton)

    let allDoneText = screen.queryByText('All done')
    while (!allDoneText) {
      await act(async () => {
        let trueButton = screen.queryByText('Yes')
        let nextGameButton = screen.queryByText('Next Deck')
        if (!(trueButton || nextGameButton)) {
          screen.debug()
        }
        expect(trueButton || nextGameButton).toBeTruthy(
          'Neither True nor Next Game button found'
        )
        if (trueButton) {
          fireEvent.click(trueButton)
          vi.runAllTimers()
        } else if (nextGameButton) {
          fireEvent.click(nextGameButton)
        }
      })
      allDoneText = screen.queryByText('All done')
    }

    expect(allDoneText).toBeInTheDocument()
  })

  it('renders random items in every deck and moves until the end', async () => {
    render(
      <AuthProvider>
        <Router />
      </AuthProvider>
    )

    let gamesButton = screen.queryByText('Back to decks')
    fireEvent.click(gamesButton)
    let randomTab = screen.queryByText('Random')
    fireEvent.click(randomTab)
    let firstGame = screen.queryByText('Deck 1')
    fireEvent.click(firstGame)

    let allDoneText = screen.queryByText('All done')
    while (!allDoneText) {
      await act(async () => {
        let trueButton = screen.queryByText('Yes')
        let nextGameButton = screen.queryByText('Next Deck')
        if (!(trueButton || nextGameButton)) {
          screen.debug()
        }
        expect(trueButton || nextGameButton).toBeTruthy(
          'Neither True nor Next Game button found'
        )
        if (trueButton) {
          fireEvent.click(trueButton)
          vi.runAllTimers()
        } else if (nextGameButton) {
          fireEvent.click(nextGameButton)
        }
      })
      allDoneText = screen.queryByText('All done')
    }

    expect(allDoneText).toBeInTheDocument()
  })
})

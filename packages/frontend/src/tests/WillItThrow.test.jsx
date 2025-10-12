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

    const gamesButton = screen.queryByText('Play Will It Throw')
    fireEvent.click(gamesButton)
    const gameButton = screen.queryByText('Syntax Error')
    fireEvent.click(gameButton)

    let allDoneText = screen.queryByText('All done')
    while (!allDoneText) {
      await act(async () => {
        const trueButton = screen.queryByText('Yes')
        const nextGameButton = screen.queryByText('Next Deck')
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
  }, 10000)

  it('renders random items in every deck and moves until the end', async () => {
    render(
      <AuthProvider>
        <Router />
      </AuthProvider>
    )

    const gamesButton = screen.queryByText('Back to decks')
    fireEvent.click(gamesButton)
    const randomTab = screen.queryByText('Random')
    fireEvent.click(randomTab)
    const firstGame = screen.queryByText('Deck 1')
    fireEvent.click(firstGame)

    let allDoneText = screen.queryByText('All done')
    while (!allDoneText) {
      await act(async () => {
        const trueButton = screen.queryByText('Yes')
        const nextGameButton = screen.queryByText('Next Deck')
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
  }, 10000)

  it('ensure the play again button is working', async () => {
    render(
      <AuthProvider>
        <Router />
      </AuthProvider>
    )

    const gamesButton = screen.queryByText('Back to decks')
    fireEvent.click(gamesButton)
    const randomTab = screen.queryByText('Random')
    fireEvent.click(randomTab)
    const firstGame = screen.queryByText('Deck 1')
    fireEvent.click(firstGame)

    let playAgainButton = screen.queryByText('Play Again')
    while (!playAgainButton) {
      await act(async () => {
        const trueButton = screen.queryByText('Yes')
        expect(trueButton).toBeTruthy('Yes button not found')

        fireEvent.click(trueButton)
        vi.runAllTimers()
      })
      playAgainButton = screen.queryByText('Play Again')
    }
    await act(async () => {
      fireEvent.click(playAgainButton)
      vi.runAllTimers()
    })
    const trueButton = screen.queryByText('Yes')
    expect(trueButton).toBeInTheDocument()
  }, 10000)
})

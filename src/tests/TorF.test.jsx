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

describe('True Or False Component', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', 'mock')
    vi.useFakeTimers()
  })

  it('renders structured items in every deck and moves until the end', async () => {
    render(
      <AuthProvider>
        <Router />
      </AuthProvider>
    )

    let gamesButton = screen.queryByText('Play True or False')
    fireEvent.click(gamesButton)
    let gameButton = screen.queryByText('JavaScript is weird.')
    fireEvent.click(gameButton)

    let allDoneText = screen.queryByText('All done')
    while (!allDoneText) {
      await act(async () => {
        let trueButton = screen.queryByText('True')
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
        let trueButton = screen.queryByText('True')
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

  it('ensure the play again button is working', async () => {
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

    let playAgainButton = screen.queryByText('Play Again')
    while (!playAgainButton) {
      await act(async () => {
        let trueButton = screen.queryByText('True')
        expect(trueButton).toBeTruthy('True button not found')

        fireEvent.click(trueButton)
        vi.runAllTimers()
      })
      playAgainButton = screen.queryByText('Play Again')
    }
    await act(async () => {
      fireEvent.click(playAgainButton)
      vi.runAllTimers()
    })
    let trueButton = screen.queryByText('True')
    expect(trueButton).toBeInTheDocument()
  })

  it('ensure the go back button is working', async () => {
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
    await act(async () => {
      let trueButton = screen.queryByText('True')
      fireEvent.click(trueButton)
      vi.runAllTimers()
      let goBackButton = screen.queryByText('Go Back')
      fireEvent.click(goBackButton)
    })
    let secondTrueButton = screen.queryByText('True')
    expect(secondTrueButton).toBeTruthy('True button not found')
  })
})

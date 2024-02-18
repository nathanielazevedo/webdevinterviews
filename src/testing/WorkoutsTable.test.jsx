import { render, screen } from '@testing-library/react'
import WorkoutsTable from '../pages/workouts/WorkoutsTable'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
const mockWorkouts = [
  {
    access_level: 'public',
    author: {
      cognito_id: '428219e6-7bb8-44e3-abdf-9bb1b5bbc40f',
      created_at: '2023-12-30T19:43:53.694550+00:00',
      email: 'nathanielpaulazevedo@gmail.com',
      last_login_at: null,
      username: 'nate',
    },
    created_at: '2023-12-30',
    difficulty: 'junior',
    id: 39,
    image_link: '/src/workouts/react/pure/tic-tac-toe/tic-tac-toe.png',
    public: true,
    sp_template: {
      id: 16,
      name: 'react',
    },
    sp_template_id: 16,
    title: 'Tic Tac Toe',
    updated_at: null,
    youtube_link: 'https://youtu.be/vweARwTPmg4',
  },
]

describe('WorkoutsTable component', () => {
  test('renders WorkoutsTable component and ensures rendering', () => {
    render(<WorkoutsTable workoutsData={mockWorkouts} />, {
      wrapper: BrowserRouter,
    })

    const title = screen.getByText('Tic Tac Toe')
    expect(title).toBeInTheDocument()
  })
})

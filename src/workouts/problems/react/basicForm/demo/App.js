import { useState } from 'react'

const defaultFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const App = () => {
  const [formData, setFormData] = useState(defaultFormData)
  return (
    <div>
      <h1>Basic Form</h1>
      <form>
        <div>
          <label htmlFor='firstName'>First Name</label>
          <input
            id='firstName'
            name='firstName'
            type='text'
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor='lastName'>Last Name</label>
          <input
            id='lastName'
            name='lastName'
            type='text'
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            name='email'
            type='text'
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            name='password'
            type='password'
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
        </div>
      </form>
    </div>
  )
}

export default App

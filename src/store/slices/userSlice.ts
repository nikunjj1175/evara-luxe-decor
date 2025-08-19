import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: true,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.avatar = action.payload
      }
    },
  },
})

export const { setUser, setLoading, logout, updateAvatar } = userSlice.actions
export default userSlice.reducer

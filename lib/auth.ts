export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const AUTH_KEY = "movie-explorer-auth"
const USERS_KEY = "movie-explorer-users"

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return { isValid: errors.length === 0, errors }
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 50
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(AUTH_KEY)
    if (!stored) return null

    const authData = JSON.parse(stored)
    if (authData.expiresAt && new Date(authData.expiresAt) < new Date()) {
      localStorage.removeItem(AUTH_KEY)
      return null
    }

    return authData.user
  } catch (error) {
    console.error("Error reading auth data:", error)
    return null
  }
}

// Get all users (for demo purposes)
function getUsers(): User[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading users:", error)
    return []
  }
}

// Save users
function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch (error) {
    console.error("Error saving users:", error)
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  // Validate input
  if (!validateEmail(email)) {
    return { success: false, error: "Please enter a valid email address" }
  }

  if (!password.trim()) {
    return { success: false, error: "Password is required" }
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const users = getUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Set auth data with 7 days expiration
  const authData = {
    user,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(authData))

  return { success: true, user }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  // Validate input
  if (!validateName(name)) {
    return { success: false, error: "Name must be between 2 and 50 characters" }
  }

  if (!validateEmail(email)) {
    return { success: false, error: "Please enter a valid email address" }
  }

  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    return { success: false, error: passwordValidation.errors[0] }
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const users = getUsers()

  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "An account with this email already exists" }
  }

  const newUser: User = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  // Auto login after registration
  const authData = {
    user: newUser,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(authData))

  return { success: true, user: newUser }
}

// Logout user
export function logoutUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_KEY)
}

// Update user profile
export async function updateUserProfile(
  updates: Partial<Pick<User, "name" | "avatar">>,
): Promise<{ success: boolean; error?: string; user?: User }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const currentUser = getCurrentUser()
  if (!currentUser) {
    return { success: false, error: "Not authenticated" }
  }

  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === currentUser.id)

  if (userIndex === -1) {
    return { success: false, error: "User not found" }
  }

  const updatedUser = { ...users[userIndex], ...updates }
  users[userIndex] = updatedUser

  saveUsers(users)

  // Update auth data
  const authData = {
    user: updatedUser,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(authData))

  return { success: true, user: updatedUser }
}

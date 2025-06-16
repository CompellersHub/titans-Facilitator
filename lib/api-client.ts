import { QueryClient } from "@tanstack/react-query"

const API_BASE_URL = "https://api.titanscareers.com"

export interface ApiError {
  message: string
  status: number
  code?: string
}

export interface AuthResponse {
  access: string
  refresh: string
}

export class ApiClientError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.code = code
  }
}

// Update the API client to handle both access and refresh tokens
class ApiClient {
  private baseUrl: string
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setTokens(accessToken: string | null, refreshToken: string | null) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  getRefreshToken(): string | null {
    return this.refreshToken
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) return null

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: this.refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        this.accessToken = data.access
        localStorage.setItem("titans_access_token", data.access)
        return data.access
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }

    return null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`
    }

    try {
      let response = await fetch(url, {
        ...options,
        headers,
      })

      // If unauthorized and we have a refresh token, try to refresh
      if (response.status === 401 && this.refreshToken) {
        const newAccessToken = await this.refreshAccessToken()
        if (newAccessToken) {
          headers.Authorization = `Bearer ${newAccessToken}`
          response = await fetch(url, {
            ...options,
            headers,
          })
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiClientError(
          errorData.message || errorData.detail || `Request failed with status ${response.status}`,
          response.status,
          errorData.code,
        )
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return response.json()
      }

      return {} as T
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error
      }
      throw new ApiClientError("Network error occurred", 0)
    }
  }

  // Add specific login method for form-data
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const formData = new FormData()
    formData.append("email", credentials.email)
    formData.append("password", credentials.password)

    const response = await fetch(`${this.baseUrl}/customuser/teacher-login/`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiClientError(errorData.message || errorData.detail || "Login failed", response.status, errorData.code)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

// Query client for server-side rendering
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

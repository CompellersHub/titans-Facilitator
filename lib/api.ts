const API_BASE_URL = "https://api.titanscareers.com"

/**
 * Custom fetch wrapper for API calls
 */
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    // Handle different error status codes
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API request failed with status ${response.status}`)
  }

  return response.json()
}

/**
 * Authentication API functions
 */
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    fetchApi<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getCurrentUser: (token: string) =>
    fetchApi<{ user: any }>("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}

/**
 * Courses API functions
 */
export const coursesApi = {
  getCourses: (token: string) =>
    fetchApi<{ courses: any[] }>("/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  getCourseById: (courseId: string, token: string) =>
    fetchApi<{ course: any }>(`/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}

/**
 * Students API functions
 */
export const studentsApi = {
  getStudents: (token: string) =>
    fetchApi<{ students: any[] }>("/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}

/**
 * Assignments API functions
 */
export const assignmentsApi = {
  getAssignments: (token: string) =>
    fetchApi<{ assignments: any[] }>("/assignments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  createAssignment: (assignmentData: any, token: string) =>
    fetchApi<{ assignment: any }>("/assignments", {
      method: "POST",
      body: JSON.stringify(assignmentData),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}

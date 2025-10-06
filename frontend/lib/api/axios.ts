import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        const userRole = localStorage.getItem("userRole")

        if (refreshToken && userRole) {
          const endpoint = userRole === "admin" ? "/auth/admirefresh-tokenn/" : "/auth/customer/refresh-token"

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"}${endpoint}`,
            { refreshToken },
          )

          const { accessToken, refreshToken: newRefreshToken } = response.data
          localStorage.setItem("accessToken", accessToken)
          localStorage.setItem("refreshToken", newRefreshToken)

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userRole")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api

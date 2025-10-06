"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import api from "@/lib/api/axios"
import type { Customer, Admin } from "@/lib/types"

interface AuthContextType {
  user: Customer | Admin | null
  userRole: "customer" | "admin" | null
  isLoading: boolean
  login: (email: string, password: string, role: "customer" | "admin") => Promise<void>
  loginWithGoogle: (profile: any) => Promise<void>
  register: (data: any, role: "customer" | "admin") => Promise<void>
  logout: () => void
  updateProfile: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | Admin | null>(null)
  const [userRole, setUserRole] = useState<"customer" | "admin" | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken")
      const role = localStorage.getItem("userRole") as "customer" | "admin" | null

      if (token && role) {
        try {
          const endpoint = role === "admin" ? "/admin/profile" : "/customer/profile"
          const response = await api.get(endpoint)
          setUser(response.data)
          setUserRole(role)
        } catch (error) {
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("userRole")
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string, role: "customer" | "admin") => {
    const endpoint = role === "admin" ? "/auth/admin/login" : "/auth/customer/login"
    const response = await api.post(endpoint, { email, password })

    const { accessToken, refreshToken, [role]: userData } = response.data

    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    localStorage.setItem("userRole", role)

    setUser(userData)
    setUserRole(role)
  }

  const loginWithGoogle = async (profile: any) => {
    const response = await api.post("/auth/customer/google", { profile })

    const { accessToken, refreshToken, customer } = response.data

    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    localStorage.setItem("userRole", "customer")

    setUser(customer)
    setUserRole("customer")
  }

  const register = async (data: any, role: "customer" | "admin") => {
    const endpoint = role === "admin" ? "/auth/admin/register" : "/auth/customer/register"
    const response = await api.post(endpoint, data)

    const { accessToken, refreshToken, [role]: userData } = response.data

    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    localStorage.setItem("userRole", role)

    setUser(userData)
    setUserRole(role)
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userRole")
    setUser(null)
    setUserRole(null)
  }

  const updateProfile = async (data: any) => {
    const endpoint = userRole === "admin" ? "/admin/profile" : "/customer/profile"
    const response = await api.put(endpoint, data)
    setUser(response.data.profile || response.data)
  }

  return (
    <AuthContext.Provider
      value={{ user, userRole, isLoading, login, loginWithGoogle, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

import axios from 'axios'
import React from 'react'

export const useAuth = () => {
  type Data = { email: string; password: string }
  const register = async (data: Data) => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      email: data.email,
      password: data.password,
    })
  }
  const login = async (data: Data) => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      email: data.email,
      password: data.password,
    })
  }

  return { register, login }
}

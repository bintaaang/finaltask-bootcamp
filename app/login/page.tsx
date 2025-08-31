"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginSchema } from "@/lib/validations/login"
import { apiLogin } from "@/lib/validations/api"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    setLoading(true)
    setError(null)
    try {
      // login ke API
      const { token, role } = await apiLogin(values)

      // simpan token
      localStorage.setItem("token", token)

      // redirect sesuai role
      if (role === "admin") {
        router.push("/dashboard")
      } else if (role === "courier") {
        router.push("/courier")
      } else {
        setError("Role tidak dikenali")
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Masukkan password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

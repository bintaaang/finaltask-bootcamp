import * as z from "zod"

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password minimal 6 karakter"),
})

export type LoginSchema = z.infer<typeof loginSchema>

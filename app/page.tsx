"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { pickupSchema, type PickupSchema } from "@/lib/validations/pickup"
import { apiPickup } from "@/lib/validations/api"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PickupSchema>({
    resolver: zodResolver(pickupSchema),
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(false)

  const onSubmit = async (data: PickupSchema) => {
    try {
      setLoading(true)
      setMessage("")
      const res = await apiPickup(data)
      setMessage("✅ Pickup berhasil dibuat")
      reset()
      setOpen(false) // tutup popup setelah sukses
    } catch (err: any) {
      setMessage("❌ Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Tombol untuk buka form */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Request Pickup</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Form Request Pickup</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-4"
          >
            <div>
              <Label>Nama</Label>
              <Input type="text" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label>No. HP</Label>
              <Input type="text" {...register("phone")} />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label>Alamat Asal</Label>
              <Textarea {...register("address_from")} />
              {errors.address_from && (
                <p className="text-red-500 text-sm">
                  {errors.address_from.message}
                </p>
              )}
            </div>

            <div>
              <Label>Alamat Tujuan</Label>
              <Textarea {...register("address_to")} />
              {errors.address_to && (
                <p className="text-red-500 text-sm">
                  {errors.address_to.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {message && (
        <p className="mt-6 text-center text-sm whitespace-pre-wrap">{message}</p>
      )}
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import { apiGetMyPickupsCourier } from "@/lib/validations/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Pickup = {
  id: number
  tracking_no: string
  name: string
  phone: string
  address_from: string
  address_to: string
  status: string
}

export default function MyPickupsPage() {
  const [data, setData] = useState<Pickup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") // ambil token dari storage
        if (!token) {
          console.error("Token tidak ada")
          return
        }

        const pickups = await apiGetMyPickupsCourier(token) // kirim token ke API
        setData(pickups)
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">📦 Pickup Saya</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tracking No</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Dari</TableHead>
            <TableHead>Ke</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((pickup) => (
            <TableRow key={pickup.id}>
              <TableCell>{pickup.id}</TableCell>
              <TableCell>{pickup.tracking_no}</TableCell>
              <TableCell>{pickup.name}</TableCell>
              <TableCell>{pickup.phone}</TableCell>
              <TableCell>{pickup.address_from}</TableCell>
              <TableCell>{pickup.address_to}</TableCell>
              <TableCell>{pickup.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

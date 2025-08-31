import { jwtDecode } from "jwt-decode"

type JwtPayload = {
  user_id: number
  role: "admin" | "courier"
  exp: number
  iat: number
}

export async function apiLogin(data: { email: string; password: string }) {
  const res = await fetch("http://localhost:8821/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Login gagal")

  const result = await res.json()

  if (result.token) {
    localStorage.setItem("token", result.token)

    // Decode token untuk ambil role
    const decoded = jwtDecode<JwtPayload>(result.token)

    if (decoded.role === "admin") {
      window.location.href = "/dashboard"
    } else if (decoded.role === "courier") {
      window.location.href = "/courier"
    }
  }

  return result
}


function getToken() {
  return localStorage.getItem("token")
}

export function getCourierIdFromToken(token: string) {
  const decoded = jwtDecode<JwtPayload>(token)
  return decoded.role
}


export async function apiPickup(data: {
  name: string
  phone: string
  address_from: string
  address_to: string
}) {
  const token = getToken()
  const res = await fetch("http://localhost:8821/api/pickup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Pickup gagal")
  }

  return res.json()
}

export async function apiGetAllPickup() {
  const token = getToken()
  const res = await fetch("http://localhost:8821/api/getallpickup", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // kirim JWT
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Gagal mengambil data pickup")
  }

  return res.json()
}


export async function apiGetMyPickupsCourier(token: string) {
  const courierId = getCourierIdFromToken(token)

  const res = await fetch(`http://localhost:8821/api/my-pickups/${courierId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!res.ok) throw new Error("Gagal ambil pickup")
  return res.json()
}

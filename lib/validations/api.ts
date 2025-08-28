export async function apiLogin(data: { email: string; password: string }) {
  const res = await fetch("http://103.226.138.241:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Login gagal")
  }

  return res.json()
}

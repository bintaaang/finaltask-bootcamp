import { z } from "zod";

export const pickupSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone: z.string().min(8, "Nomor HP tidak valid"),
  address_from: z.string().min(5, "Alamat asal wajib diisi"),
  address_to: z.string().min(5, "Alamat tujuan wajib diisi"),
});

export type PickupSchema = z.infer<typeof pickupSchema>;

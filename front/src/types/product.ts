import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Nome deve ter ao menos 3 caracteres" })
    .max(30, { message: "Nome deve ter no máximo 30 caracteres" }),
  description: z
    .string()
    .trim()
    .min(10, { message: "Descrição deve ter ao menos 10 caracteres" })
    .max(255, { message: "Descrição deve ter no máximo 255 caracteres" }),
  price: z
    .number({ invalid_type_error: "Preço inválido" })
    .min(0, { message: "Preço deve ser maior ou igual a zero" })
    .max(1_000_000, { message: "Preço muito alto" }),
  quantity: z
    .number({ invalid_type_error: "Quantidade inválida" })
    .int({ message: "Quantidade deve ser inteiro" })
    .min(0, { message: "Quantidade não pode ser negativa" })
    .max(1_000_000, { message: "Quantidade muito alta" }),
});

export type ProductInput = z.infer<typeof productSchema>;

export interface Product extends ProductInput {
  id: number;
  createdAt: string;
}

export interface ProductFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

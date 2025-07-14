import { z } from "zod";

// Esquema com nomes em minúsculas para corresponder à API do Django
export const productSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  descricao: z.string().optional(),
  preco: z.coerce.number().positive({ message: "O preço deve ser um número positivo." }),
  estoque: z.coerce.number().int().nonnegative({ message: "O estoque não pode ser negativo." }),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Tipo completo com o ID em minúsculas
export interface Product extends ProductFormData {
  id: number;
}
import axios from 'axios';
import type { Product, ProductFormData } from './validators';

// Crie uma instância do Axios com a URL base da sua API
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/produtos', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// READ (GET all)
export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get('/');
  return response.data;
};

// CREATE (POST)
export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  const response = await apiClient.post('/', productData);
  return response.data;
};

// UPDATE (PUT)
export const updateProduct = async (
  id: number,
  productData: Partial<ProductFormData>
): Promise<Product> => {
  const response = await apiClient.patch(`/${id}/`, productData);
  return response.data;
};

// DELETE (DELETE)
export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/${id}/`);
};
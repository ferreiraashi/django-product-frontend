// src/components/ProductDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProductForm } from './ProductForm';
import type { Product, ProductFormData } from '../lib/validators';

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  isSubmitting: boolean;
  onSubmit: (data: ProductFormData) => void;
  onDelete?: (id: number) => void; // ✅ Novo: callback opcional para deletar
}

const FORM_ID = 'product-form';

export function ProductDialog({
  isOpen,
  onOpenChange,
  editingProduct,
  isSubmitting,
  onSubmit,
  onDelete,
}: ProductDialogProps) {
  const initialData = editingProduct
    ? {
        nome: editingProduct.nome,
        descricao: editingProduct.descricao,
        preco: parseFloat(editingProduct.preco as any),
        estoque: editingProduct.estoque,
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white border border-slate-200 rounded-xl shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {editingProduct
              ? `Faça alterações no produto e clique em salvar quando terminar.`
              : 'Preencha os dados para criar um novo produto no catálogo.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ProductForm
            id={FORM_ID}
            onSubmit={onSubmit}
            initialData={initialData}
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <div className="flex-1 flex items-start">
            {editingProduct && onDelete && (
              <Button
                type="button"
                onClick={() => onDelete(editingProduct.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm transition-colors"
              >
                Deletar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form={FORM_ID}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition-colors"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

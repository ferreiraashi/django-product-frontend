// src/App.tsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "./lib/api";
import type { Product, ProductFormData } from "./lib/validators";
import { useState } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./components/ui/button";
import { Toaster, toast } from "sonner";
import { ProductDialog } from "./components/ProductDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

function App() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto criado com sucesso.");
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Não foi possível criar o produto."),
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto atualizado com sucesso.");
      setIsDialogOpen(false);
      setEditingProduct(null);
    },
    onError: () => toast.error("Não foi possível atualizar o produto."),
  });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto deletado com sucesso.");
    },
    onError: () => toast.error("Não foi possível deletar o produto."),
  });

  const handleFormSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateMutate({ id: editingProduct.id, data });
    } else {
      createMutate(data);
    }
  };

  const handleDeleteClick = (id: number) => {
    toast.error("Tem certeza que deseja deletar este produto?", {
      action: {
        label: "Deletar",
        onClick: () => deleteMutate(id),
      },
      duration: 5000,
    });
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-4 text-lg font-medium text-slate-600">
          Carregando produtos...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        Ocorreu um erro ao buscar os produtos.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-5xl mx-auto">
        <Card className="shadow-2xl rounded-2xl border border-slate-200">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between p-6 gap-4">
            <CardTitle className="text-3xl font-extrabold text-slate-800">
              📦 Catálogo de Produtos
            </CardTitle>
            <Button
              onClick={handleAddClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition-transform hover:scale-105"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Produto
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Nome
                    </TableHead>
                    <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Preço
                    </TableHead>
                    <TableHead className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Estoque
                    </TableHead>
                    <TableHead className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-slate-200">
                  {products?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-16 text-slate-500 text-base"
                      >
                        Nenhum produto cadastrado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products?.map((product, index) => (
                      <TableRow
                        key={product.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50"
                        } hover:bg-indigo-50 transition-colors duration-150`}
                      >
                        <TableCell className="px-6 py-5 whitespace-nowrap font-medium text-slate-900">
                          {product.nome}
                        </TableCell>
                        <TableCell className="px-6 py-5 whitespace-nowrap text-slate-700 text-center">
                          {`R$ ${Number(product.preco).toFixed(2)}`}
                        </TableCell>
                        <TableCell className="px-6 py-5 whitespace-nowrap text-slate-700 text-center">
                          {product.estoque}
                        </TableCell>
                        <TableCell className="px-6 py-5 whitespace-nowrap text-right space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditClick(product)}
                            className="hover:bg-indigo-100"
                          >
                            <Edit className="h-4 w-4 text-indigo-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(product.id)}
                            disabled={isDeleting}
                            className="hover:bg-red-600/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProductDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingProduct={editingProduct}
        isSubmitting={isCreating || isUpdating}
        onSubmit={handleFormSubmit}
        onDelete={handleDeleteClick}
      />
    </main>
  );
}

export default App;

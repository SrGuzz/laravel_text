import { useState } from "react";
import { Plus, Package2, Boxes, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import { ProductForm } from "@/components/ProductForm";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductCard } from "@/components/ProductCard";
import type { Product, ProductInput } from "@/types/product";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const Index = () => {
  const {
    products,
    filtered,
    filters,
    setFilters,
    create,
    update,
    remove,
    loading,
    error,
    currentPage,
    lastPage,
    total,
    canGoPrev,
    canGoNext,
    goPrev,
    goNext,
  } = useProducts();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();
  const [deleting, setDeleting] = useState<Product | undefined>();

  const totalValueInCents = products.reduce((sum, p) => {
    const unitPriceInCents = Math.round(p.price * 100);
    return sum + unitPriceInCents;
  }, 0);
  const totalValue = totalValueInCents / 100;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  const handleNew = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleSubmit = async (data: ProductInput) => {
    try {
      if (editing) {
        await update(editing.id, data);
        toast.success("Produto atualizado com sucesso");
      } else {
        await create(data);
        toast.success("Produto cadastrado com sucesso");
      }
      setFormOpen(false);
      setEditing(undefined);
    } catch {
      toast.error("Não foi possível salvar o produto");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;

    try {
      await remove(deleting.id);
      toast.success(`"${deleting.name}" removido`);
      setDeleting(undefined);
    } catch {
      toast.error("Não foi possível remover o produto");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex max-w-6xl items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <Package2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-foreground">Gestão de Produtos</h1>
              <p className="text-xs text-muted-foreground">Integrado com API Laravel</p>
            </div>
          </div>
          <Button onClick={handleNew} size="sm">
            <Plus className="mr-2 h-4 w-4" /> Novo produto
          </Button>
        </div>
      </header>

      <main className="container max-w-6xl space-y-6 py-8">
        <section className="grid gap-4 md:grid-cols-2">
          <StatCard icon={<Boxes className="h-5 w-5" />} label="Total de unidades na página" value={String(totalQuantity)} />
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Valor total na página" value={brl.format(totalValue)} />
        </section>

        <ProductFilters filters={filters} onChange={setFilters} />

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground">{loading ? "Carregando..." : "Resultados"}</h2>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goPrev} disabled={!canGoPrev || loading}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
              </Button>
              <span className="text-xs text-muted-foreground">
                Página {currentPage} de {lastPage}
              </span>
              <Button variant="outline" size="sm" onClick={goNext} disabled={!canGoNext || loading}>
                Próxima <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {!loading && filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-card p-12 text-center">
              <Package2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="mb-1 font-medium text-foreground">Nenhum produto encontrado</p>
              <p className="text-sm text-muted-foreground">Tente ajustar os filtros ou cadastrar um novo produto.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onEdit={handleEdit} onDelete={setDeleting} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Dialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(undefined);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar produto" : "Novo produto"}</DialogTitle>
            <DialogDescription>
              {editing ? "Atualize as informações do produto." : "Preencha os dados para cadastrar."}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setFormOpen(false);
              setEditing(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é permanente. O produto <strong>{deleting?.name}</strong> será excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background text-foreground">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tracking-tight text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default Index;

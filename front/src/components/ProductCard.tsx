import { Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

interface Props {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const quantityStatus =
    product.quantity === 0
      ? { label: "Sem estoque", variant: "destructive" as const }
      : product.quantity < 10
      ? { label: `${product.quantity} un.`, variant: "outline" as const }
      : { label: `${product.quantity} un.`, variant: "secondary" as const };

  return (
    <div className="group animate-fade-in rounded-lg border bg-card p-5 transition-colors hover:bg-accent/30">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background text-foreground">
            <Package className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-medium text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(product.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
        <Badge variant={quantityStatus.variant} className="font-normal">{quantityStatus.label}</Badge>
      </div>

      <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
        {product.description}
      </p>

      <div className="flex items-center justify-between border-t pt-3">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          {brl.format(product.price)}
        </span>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="icon" onClick={() => onEdit(product)} aria-label="Editar" className="h-8 w-8">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(product)}
            aria-label="Excluir"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

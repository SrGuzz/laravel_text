import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ProductFilters as Filters } from "@/types/product";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function ProductFilters({ filters, onChange }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const num = (v: string) => (v === "" ? undefined : Number(v));
  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== "");

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Filtros</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={() => onChange({})} className="h-7 text-muted-foreground">
            <X className="mr-1 h-3.5 w-3.5" /> Limpar
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1.5 lg:col-span-2">
          <Label htmlFor="f-name" className="text-xs">Buscar por nome</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="f-name"
              className="pl-9"
              placeholder="Nome do produto..."
              value={filters.name ?? ""}
              onChange={(e) => set({ name: e.target.value || undefined })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="f-min-price" className="text-xs">Preço mín.</Label>
          <Input
            id="f-min-price"
            type="number"
            min="0"
            placeholder="0"
            value={filters.minPrice ?? ""}
            onChange={(e) => set({ minPrice: num(e.target.value) })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="f-max-price" className="text-xs">Preço máx.</Label>
          <Input
            id="f-max-price"
            type="number"
            min="0"
            placeholder="9999"
            value={filters.maxPrice ?? ""}
            onChange={(e) => set({ maxPrice: num(e.target.value) })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="f-min-quantity" className="text-xs">Qtd. min.</Label>
          <Input
            id="f-min-quantity"
            type="number"
            min="0"
            placeholder="0"
            value={filters.minQuantity ?? ""}
            onChange={(e) => set({ minQuantity: num(e.target.value) })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="f-max-quantity" className="text-xs">Qtd. max.</Label>
          <Input
            id="f-max-quantity"
            type="number"
            min="0"
            placeholder="9999"
            value={filters.maxQuantity ?? ""}
            onChange={(e) => set({ maxQuantity: num(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}

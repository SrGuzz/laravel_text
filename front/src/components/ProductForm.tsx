import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productSchema, type Product, type ProductInput } from "@/types/product";
import { toast } from "sonner";

interface Props {
  initial?: Product;
  onSubmit: (data: ProductInput) => void;
  onCancel: () => void;
}

type Errors = Partial<Record<keyof ProductInput, string>>;

export function ProductForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState<string>(initial ? String(initial.price) : "");
  const [quantity, setQuantity] = useState<string>(initial ? String(initial.quantity) : "");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description);
      setPrice(String(initial.price));
      setQuantity(String(initial.quantity));
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = productSchema.safeParse({
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
    });

    if (!parsed.success) {
      const fieldErrors: Errors = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0] as keyof ProductInput;
        if (!fieldErrors[key]) fieldErrors[key] = i.message;
      });
      setErrors(fieldErrors);
      toast.error("Verifique os campos do formulário");
      return;
    }

    setErrors({});
    onSubmit(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Mouse Gamer"
          maxLength={30}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva o produto"
          rows={3}
          maxLength={255}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0,00"
          />
          {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantidade</Label>
          <Input
            id="quantity"
            type="number"
            step="1"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
          />
          {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-gradient-primary shadow-elegant">
          {initial ? "Salvar alterações" : "Cadastrar produto"}
        </Button>
      </div>
    </form>
  );
}

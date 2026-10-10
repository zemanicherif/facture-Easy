import Link from "next/link";
import { ArrowRight, Package2, PlusCircle, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const products = [
  { name: "Consulting SEO", price: "180 000 FCFA", stock: "12" },
  { name: "Design branding", price: "260 000 FCFA", stock: "8" },
  { name: "Maintenance SaaS", price: "95 000 FCFA", stock: "20" },
  { name: "Formation digitale", price: "140 000 FCFA", stock: "15" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Catalogue</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Articles &amp; Tarifs
          </h1>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Retour
            </Button>
          </Link>
          <Button size="sm" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Nouveau produit
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Produits</span>
            <Package2 className="h-5 w-5 text-brand-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">128</div>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="h-3 w-3" /> +11%
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Prix moyen</span>
            <Tag className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">185k</div>
          <div className="mt-2 text-[11px] font-medium text-slate-500">FCFA / article</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Stock actif</span>
            <Package2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">87%</div>
          <div className="mt-2 text-[11px] font-medium text-slate-500">niveau de disponibilité</div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Produits récents</h2>
          <span className="text-xs font-semibold text-slate-500">4 éléments</span>
        </div>

        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/60">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{product.name}</p>
                <p className="text-xs text-slate-500">Stock : {product.stock} unités</p>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900 dark:text-white">{product.price}</p>
                <p className="text-[11px] text-emerald-600">Disponible</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

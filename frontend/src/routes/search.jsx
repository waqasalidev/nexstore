import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useProducts } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/search")({
  validateSearch: (search) => ({
    q: search.q || "",
    brand: search.brand || "",
  }),
  component: SearchPage,
});

function SearchPage() {
  const navigate = useNavigate();
  const { q: initialQ, brand: initialBrand } = Route.useSearch();
  const [q, setQ] = useState(initialQ || "");
  const [selectedBrand, setSelectedBrand] = useState(initialBrand || "");

  // Sync state with URL search parameters
  useEffect(() => {
    setQ(initialQ || "");
  }, [initialQ]);

  useEffect(() => {
    setSelectedBrand(initialBrand || "");
  }, [initialBrand]);

  const { data = [], isFetching } = useProducts({ 
    search: q || undefined, 
    brand: selectedBrand || undefined 
  });

  const handleSearchChange = (val) => {
    setQ(val);
    navigate({
      to: "/search",
      search: { q: val, brand: selectedBrand || undefined },
      replace: true,
    });
  };

  const handleClearBrand = () => {
    setSelectedBrand("");
    navigate({
      to: "/search",
      search: { q, brand: undefined },
      replace: true,
    });
  };

  return (
    <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="relative max-w-2xl mx-auto flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            autoFocus 
            value={q} 
            onChange={(e) => handleSearchChange(e.target.value)} 
            placeholder="Search products, brands, categories…" 
            className="w-full glass rounded-full pl-12 pr-4 py-4 text-lg outline-none focus:ring-2 ring-gold" 
          />
        </div>

        {/* Brand Filter Active Badge */}
        {selectedBrand && (
          <div className="flex justify-center mt-2">
            <div className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-4 py-1.5 rounded-full text-xs font-semibold shadow-glow animate-fade-in">
              <span>Brand: {selectedBrand.toUpperCase()}</span>
              <button 
                onClick={handleClearBrand} 
                className="hover:bg-white/20 p-0.5 rounded-full transition cursor-pointer"
                title="Clear brand filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        {isFetching ? "Searching…" : `${data.length} results`}
      </p>

      {data.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No products found. Try adjusting your search keywords or clearing the brand filter.
        </div>
      ) : (
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
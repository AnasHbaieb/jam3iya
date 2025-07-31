'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

type Category = 'مشاريع ظرفية' | 'مشاريع موسمية' | 'مشاريع شهرية'  | 'جميع';

interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  imageUrl: string;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

// Page des produits
export default function ProductsPage() {
  // État local pour gérer les filtres et la recherche
  // useState est un hook React qui permet de gérer l'état local du composant
  const [selectedCategory, setSelectedCategory] = useState<Category>('جميع');
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [loading, setLoading]= useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('فشل في جلب المشاريع');
        }
        const data = await response.json();
        setFetchedProducts(data);
        setError(null);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل المشاريع. يرجى المحاولة مرة أخرى لاحقًا.');
        console.error('خطأ في جلب المشاريع:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = fetchedProducts.filter((product) => {
    const matchSearch = searchQuery.toLowerCase() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'جميع' || product.category === selectedCategory;

    return matchSearch && matchesCategory;
  });


 
  // Liste des catégories disponibles pour le filtre
  const categories: Category[] = ['جميع', 'مشاريع شهرية', 'مشاريع موسمية', 'مشاريع ظرفية'];

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête de la page avec titre et description */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-400">مشاريعنا</h1>
            <p className="mt-2 text-white font-bold">
              اطلع على مختلف المشاريع الخيرية للجمعية
            </p>
          </div>

          {/* Section des filtres et de la recherche */}
          <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
            {/* Boutons de filtrage par catégorie */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchQuery(''); // Réinitialise la recherche lors du changement de catégorie
                  }}
                  className={
                    "px-4 py-2 rounded-md font-bold " +
                    (/* Classe conditionnelle pour le style actif/inactif */
                      selectedCategory === category
                        ? "bg-green-700 text-white" // Style du bouton actif
                        : "bg-white text-gray-700 hover:bg-gray-50" // Style du bouton inactif
                    )
                  }
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن المشروع..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) {
                    setSelectedCategory('جميع'); // Réinitialise la catégorie lors de la recherche
                  }
                }}
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right font-bold placeholder-amber-500"
              />
            </div>
          </div>

          {/* Grille responsive des produits
              - 1 colonne sur mobile
              - 2 colonnes sur tablette (md)
              - 3 colonnes sur desktop (lg)
          */}
                    {/* حالة التحميل */}
                    {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
             { /* <p className="mt-4 text-gray-500">تحميل المنتجات...</p> */}
            </div>
          )}

          {/* حالة الخطأ */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* شبكة المنتجات */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {
              
              filteredProducts.map((product) => {
                // Debug log for development
                console.log('Rendering product:', product);
                return (
                <ProductCard
                  key={product.id}
                  id={Number(product.id)}
                  name={product.name}
                  description={product.description}
                  category={product.category}
                  imageUrl={product.imageUrl}
                  //moshkla ll marajaya createdAt: string...
                />
              )})}
            </div>
          )}



          {/* Message affiché si aucun produit ne correspond aux critères */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 font-bold">
                لم يتم العثور على منتجات مطابقة لبحثك.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* No Footer component found in original file, so no change needed here */}
    </div>
  );
}

export type Category = 'جميع' | 'مشاريع شهرية' | 'مشاريع موسمية' | 'مشاريع ظرفية' ;

export interface Product {
  id: number;          // Identifiant unique du produit
  name: string;        // Nom du produit
  imageUrl: string;    // Chemin vers l'image (dans le dossier public)
  category: Category;  // Catégorie (doit correspondre au type Category)
  isNew?: boolean;     // Indique si le produit est nouveau (optionnel)
}

export const products: Product[] = [
  {
    id: 1,
    name: "عيد الاضحى",
    imageUrl: "/3id lkbir.jpg",
    category: "مشاريع موسمية", 
    isNew: true
  },
  {
    id: 2,
    name: "كفالة يتيم",
    imageUrl: "/kafalt yatim.jpg",
    category: "مشاريع شهرية",

  },
  {
    id: 3,
    name: "حفر الأبار",
    imageUrl: "/7afr abar.jpg",
    category: "مشاريع ظرفية",
    isNew: true
  },
  {
    id: 4,
    name: "العودة المدرسية",
    imageUrl: "/al3awda lmadrasya.jpg",
    category: "مشاريع موسمية", 
  },
  {
    id: 5,
    name: "كسوة العيد", 
    imageUrl: "/kiswat il 3aid.jpg",
    category: "مشاريع موسمية",
  },
  {
    id: 6,
    name: "منحة التلميذ و الطالب",
    imageUrl: "/mi7t itlmi4.jpg",
    category: "مشاريع شهرية",
  },
  {
    id: 7,
    name: "تحسين مسكن",
    imageUrl: "/ta7sin maskan.jpg",
    category: "مشاريع ظرفية", 
  },
  {
    id: 8,
    name: " افطار صائم",
    imageUrl: "/iftar saim.jpg",
    category: "مشاريع موسمية",
  },
  {
    id: 9,
    name: " قفة رمضان",
    imageUrl: "/koft ram4an.jpg",
    category: "مشاريع موسمية",
    isNew: true
  },
];


export const featuredProducts = products.filter(product =>
  product.isNew
).slice(0.3);
export const getProductsByCategory = (category: Category) => {
  if (category === 'جميع') {
    return products;
  }
  return products.filter(product => product.category === category);
};

export const searchProducts = (query: string) => {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm)
  )}

export const permanentProjects = [
  // مشاريع أخرى...
];

export const temporaryProjects = [
  { id: 1, name: "تحسن مسكن" },
  // ...
];
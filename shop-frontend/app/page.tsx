"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  documentId: string;
  title: string;
  price: number;
  description?: string;
  image?: {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    url: string;
    width: number;
    height: number;
  };
}

interface StrapiResponse {
  data: Product[];
  meta: {
    pagination: {
      start: number;
      limit: number;
      total: number;
    };
  };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
        const response = await fetch(`${apiUrl}/api/products?populate=*`);
    
        
        const result: StrapiResponse = await response.json();
        console.log("Products data:", result.data);
        if (result.data.length > 0) {
          console.log("First product image:", result.data[0].image);
        }
        setProducts(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch products!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          Our Products
        </h1>
        
        {products.length === 0 ? (
          <div className="text-center text-xl text-gray-600">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              const imageUrl = product.image?.url;
              const fullImageUrl = imageUrl 
                ? imageUrl.startsWith("http") 
                  ? imageUrl 
                  : `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${imageUrl}`
                : null;

              return (
                <div
                  key={product.documentId || product.id}
                  className="group relative flex aspect-square flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  {/* Product Image */}
                  <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                    {fullImageUrl ? (
                      <img
                        src={fullImageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <svg
                          className="h-16 w-16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {product.title}
                    </h2>
                    <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {product.description}
                    </h4>
                    <p className="mt-2 text-xl font-bold text-blue-600">
                      ${product.price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

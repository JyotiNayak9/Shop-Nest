import React, { useState, useEffect } from 'react';


interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [products]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">Category: {product.category}</p>
                        <p className="mt-2 text-green-600">Rs.${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;

import React, { ChangeEvent, useState, useEffect } from 'react';
import ProductService from '../path/to/ProductService';
import authSvc from '../pages/auth/auth.service';

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
}

const ProductList = () => {
    
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response: any = await authSvc.getRequest("/product/getallproducts" )
                console.log(response)             
            setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };        
        fetchProducts();
    }, [searchTerm, selectedCategory, sortOrder]);

    // Define event parameter types
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const handleSortOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(event.target.value);
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={handleSearchChange} />
                    <select value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">All Categories</option>
                        {/* Add category options here */}
                    </select>
                    <select value={sortOrder} onChange={handleSortOrderChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default ProductList;

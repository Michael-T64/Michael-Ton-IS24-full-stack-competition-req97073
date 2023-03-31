import { useContext } from 'react';
import { ProductsContext } from '../context/ProductContext';

export const useProductsContext = () => {
    const context = useContext(ProductsContext);

    if (!context) {
        throw Error(
            'useProductsContext can only be used inside a ProductsContextProvider. In this case, this should have been top-level so check the component tree in index.js.'
        );
    }

    return context;
};

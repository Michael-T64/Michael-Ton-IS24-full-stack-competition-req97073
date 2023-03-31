import { createContext, useReducer } from 'react';

export const ProductsContext = createContext();

export const productsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PRODUCTS':
            return { products: action.payload };
        case 'CREATE_PRODUCT':
            return {
                products: [...state.products, action.payload],
            };
        case 'UPDATE_PRODUCT':
            return {
                products: state.products,
            };
        default:
            return state;
    }
};

export const ProductsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(productsReducer, {
        products: [],
    });

    return (
        <ProductsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </ProductsContext.Provider>
    );
};

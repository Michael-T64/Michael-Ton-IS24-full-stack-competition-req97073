import { useEffect, useState } from 'react';
import { useProductsContext } from '../hooks/useProductsContext';

//Import components
import TableRow from '../components/TableRow';
import CreateProductForm from '../components/CreateProductForm';
import EditProductForm from '../components/EditProductForm';

const Home = () => {
    const { products, dispatch } = useProductsContext();
    const [productId, setProductId] = useState(null);
    const [product, setProduct] = useState(null);
    const [searchParameter, setSearchParameter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [productCount, setProductCount] = useState(0);
    const [tableRows, setTableRows] = useState([]);

    //Load the initial table
    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        console.log(productCount);
        setProductCount(productCount);
    }, [productCount]);

    const getProducts = async () => {
        const response = await fetch('/api/product');
        const data = await response.json();

        if (response.ok) {
            dispatch({ type: 'SET_PRODUCTS', payload: data });
            setProductCount(data.length);
            setTableRows(data);
        }
    };

    //Helper function to get filtered results for search
    let getFilteredRows = () => {
        return products.filter((prod) => {
            if (prod) {
                if (
                    searchParameter === 'scrumMaster' &&
                    searchTerm.length > 0
                ) {
                    if (
                        prod.scrumMasterName.toLocaleLowerCase() ===
                        searchTerm.trim().toLocaleLowerCase()
                    ) {
                        return true;
                    }
                    return false;
                }

                if (searchParameter === 'developer' && searchTerm.length > 0) {
                    const devs = prod.developers.map((dev) => {
                        return dev.trim().toLocaleLowerCase();
                    });

                    if (devs.includes(searchTerm.trim().toLocaleLowerCase())) {
                        return true;
                    }
                    return false;
                } else {
                    return true;
                }
            } else {
                return [];
            }
        });
    };

    //Handler functions for the modals
    const handleEditModal = (data) => {
        setProductId(data.productId);
        setProduct(data);
        editModal.style.display = 'block';
    };

    const closeEditModal = () => {
        editModal.style.display = 'none';
    };

    const closeCreateModal = () => {
        createModal.style.display = 'none';
    };

    // Document elements that require direct access/manipulation
    let editModal = document.getElementById('edit-product-modal');
    let createModal = document.getElementById('create-product-modal');
    let searchSelect = document.getElementById('search-parameter');

    return (
        <div className="home">
            <div className="top">
                {/* Create New Product button and table count */}
                <div className="create-prod-container">
                    <button
                        id="create-product-btn"
                        className="create-prod-btn"
                        onClick={() => {
                            createModal.style.display = 'block';
                        }}
                    >
                        Add a Product
                    </button>
                    <p className="count">{productCount} products found</p>
                </div>

                {/* Search bar */}
                <div className="search">
                    <select
                        id="search-parameter"
                        name="search-parameter"
                        onChange={(e) => {
                            setSearchParameter(e.target.value);
                        }}
                    >
                        <option value="search">Select</option>
                        <option value="scrumMaster">Scrum Master</option>
                        <option value="developer">Developer</option>
                    </select>

                    <input
                        className="search-bar"
                        type="text"
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                        value={searchTerm}
                    />

                    <button
                        className="search-btn"
                        onClick={() => {
                            setTableRows(getFilteredRows());
                            setProductCount(getFilteredRows().length);
                            console.log(productCount);
                        }}
                    >
                        search
                    </button>
                    <button
                        className="clear"
                        onClick={() => {
                            setSearchTerm('');
                            setSearchParameter('');
                            searchSelect.value = 'search';
                            getProducts();
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Create Product modal*/}
            <div id="create-product-modal" className="create-product-modal">
                <div className="modal-content">
                    <div className="modal-body">
                        <CreateProductForm
                            closeModal={closeCreateModal}
                            update={getProducts}
                        />
                    </div>
                </div>
            </div>
            {/* END Create Product modal and button */}

            {/* Edit Product modal*/}
            <div id="edit-product-modal" className="edit-product-modal">
                <div className="modal-content">
                    <div className="modal-body">
                        {product ? (
                            <EditProductForm
                                product={product}
                                closeModal={closeEditModal}
                                update={getProducts}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            {/* END Edit Product modal */}

            {/* Main Data Table */}
            <div>
                <table id="product-table" className="product-table">
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Product Owner</th>
                            <th>Developers</th>
                            <th>Scrum Master</th>
                            <th>Start Date</th>
                            <th>Methodology</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products &&
                        searchParameter != 'developer' &&
                        searchParameter != 'scrumMaster'
                            ? products.map((prod) => {
                                  if (prod) {
                                  }
                                  return (
                                      <TableRow
                                          key={prod.productId}
                                          prod={prod}
                                          btn={handleEditModal}
                                      />
                                  );
                              })
                            : tableRows.map((prod) => {
                                  return (
                                      <TableRow
                                          key={prod.productId}
                                          prod={prod}
                                          btn={handleEditModal}
                                      />
                                  );
                              })}
                    </tbody>
                </table>
            </div>
            {/* END main data table */}
        </div>
    );
};

export default Home;

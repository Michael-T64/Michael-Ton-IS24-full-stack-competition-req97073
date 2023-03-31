import { useEffect, useState } from 'react';
import { useProductsContext } from '../hooks/useProductsContext';

const EditProductForm = ({ product, closeModal, update }) => {
    const { dispatch } = useProductsContext();
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productOwnerName, setProductOwnerName] = useState('');
    const [developer1, setDeveloper1] = useState('');
    const [developer2, setDeveloper2] = useState('');
    const [developer3, setDeveloper3] = useState('');
    const [developer4, setDeveloper4] = useState('');
    const [developer5, setDeveloper5] = useState('');
    const [scrumMasterName, setScrumMasterName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [methodology, setMethodology] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        setProductId(product.productId);
        setProductName(product.productName);
        setProductOwnerName(product.productOwnerName);
        setDeveloper1(
            product.developers.length > 0 ? product.developers[0] : ''
        );
        setDeveloper2(
            product.developers.length > 1 ? product.developers[1] : ''
        );
        setDeveloper3(
            product.developers.length > 2 ? product.developers[2] : ''
        );
        setDeveloper4(
            product.developers.length > 3 ? product.developers[3] : ''
        );
        setDeveloper5(
            product.developers.length > 4 ? product.developers[4] : ''
        );
        setScrumMasterName(product.scrumMasterName);
        setStartDate(product.startDate);
        setMethodology(product.methodology);
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        //Build developers array
        let developers = [developer1];

        if (developer2.length > 0) {
            developers.push(developer2);
        }
        if (developer3.length > 0) {
            developers.push(developer3);
        }
        if (developer4.length > 0) {
            developers.push(developer4);
        }
        if (developer5.length > 0) {
            developers.push(developer5);
        }

        const product = {
            productId,
            productName,
            productOwnerName,
            developers,
            scrumMasterName,
            startDate,
            methodology,
        };

        const response = await fetch('/api/product/' + productId, {
            method: 'PUT',
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();

        if (!response.ok) {
            setError(result.error);
        }
        if (response.ok) {
            //reset form
            setProductId('');
            setProductName('');
            setProductOwnerName('');
            setDeveloper1('');
            setDeveloper2('');
            setDeveloper3('');
            setDeveloper4('');
            setDeveloper5('');
            setScrumMasterName('');
            setStartDate('');
            setMethodology('');
            dispatch({ type: 'SET_PRODUCTS', payload: result.data });
            closeModal();
        }
    };

    return (
        <div>
            <form className="new-product-form" onSubmit={handleSubmit}>
                <h1>Editing {productId}</h1>

                <label>Product Name:</label>
                <input
                    type="text"
                    maxlength="30"
                    onChange={(e) => setProductName(e.target.value)}
                    value={productName}
                    required={true}
                />

                <label>Product Owner:</label>
                <input
                    type="text"
                    maxlength="30"
                    onChange={(e) => setProductOwnerName(e.target.value)}
                    value={productOwnerName}
                    required={true}
                />

                <label>Developers:</label>
                <input
                    type="text"
                    maxlength="30"
                    onChange={(e) =>
                        setDeveloper1(e.target.value.replace(/,/g, ''))
                    }
                    value={developer1}
                    required={true}
                />
                <input
                    type="text"
                    maxlength="30"
                    onChange={(e) =>
                        setDeveloper2(e.target.value.replace(/,/g, ''))
                    }
                    value={developer2}
                />
                <input
                    type="text"
                    maxlength="30"
                    onChange={(e) =>
                        setDeveloper3(e.target.value.replace(/,/g, ''))
                    }
                    value={developer3}
                />
                <input
                    type="text"
                    maxlength="30"
                    onChange={(e) =>
                        setDeveloper4(e.target.value.replace(/,/g, ''))
                    }
                    value={developer4}
                />
                <input
                    type="text"
                    maxlength="30"
                    onChange={(e) =>
                        setDeveloper5(e.target.value.replace(/,/g, ''))
                    }
                    value={developer5}
                />

                <label>Scrum Master:</label>
                <input
                    type="text"
                    maxlength="30"
                    onChange={(e) => setScrumMasterName(e.target.value)}
                    value={scrumMasterName}
                    required={true}
                />

                <div className="radio-btns">
                    <p>Methodology:</p>
                    <div className="radio-col">
                        <input
                            type="radio"
                            id="agile"
                            name="methodology"
                            className="radio"
                            onClick={(e) => setMethodology(e.target.value)}
                            value="Agile"
                            required={true}
                            checked={methodology === 'Agile'}
                            onChange={() => {}}
                        />
                        <label htmlFor="agile" className="radio">
                            Agile
                        </label>
                    </div>
                    <div className="radio-col">
                        <input
                            type="radio"
                            id="waterfall"
                            name="methodology"
                            className="radio"
                            onClick={(e) => setMethodology(e.target.value)}
                            value="Waterfall"
                            checked={methodology === 'Waterfall'}
                            onChange={() => {}}
                        />
                        <label htmlFor="waterfall" className="radio">
                            Waterfall
                        </label>
                    </div>
                </div>

                {/* footer buttons */}
                <div className="modal-btns">
                    <button
                        className="submit"
                        onClick={() => {
                            update();
                        }}
                    >
                        Update Product
                    </button>
                    <button
                        className="cancel"
                        onClick={(e) => {
                            e.preventDefault();
                            console.log('cancel');
                            if (
                                window.confirm(
                                    'Exit without saving your changes?'
                                )
                            ) {
                                closeModal();
                            }
                        }}
                    >
                        Cancel
                    </button>
                </div>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
};

export default EditProductForm;

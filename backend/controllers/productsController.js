const fs = require('fs');

// GET all products
const getAllProducts = (req, res) => {
    const data = readData();

    if (data) {
        res.status(200).json(data);
    } else {
        res.status(400).json('There was an error reading the data file.');
    }
};

//GET a single product
// This requires us to check the "server" (data file) each time it's called in order to handle the case where multiple people are editing the products list at the same time
// Since I can't run a real query for the requested productID, I'll need to pull all of the data and manually check it and extract the requested data
const getSingleProduct = async (req, res) => {
    const { productId } = req.params;
    const data = readData();

    if (!data) {
        return res
            .status(400)
            .json('There was an error reading the data file.');
    }

    for (prod of data) {
        if (
            prod.productId.toLocaleLowerCase() === productId.toLocaleLowerCase()
        ) {
            return res.status(200).json(prod);
        }
    }

    return res.status(404).json({
        error: 'Product code' + productId + ' was not found in our system.',
    });
};

//POST - Create a new product
const createProduct = async (req, res) => {
    const {
        productName,
        productOwnerName,
        developers,
        scrumMasterName,
        startDate,
        methodology,
    } = req.body;
    const productId = generateProductId(productName, startDate, methodology);
    const data = readData();

    if (!data) {
        return res
            .status(400)
            .json('There was an error reading the data file.');
    }

    //convert date to use '/' instead of '-'
    const startDateFormatted = startDate.toString().replace(/-/g, '/');

    const newProduct = {
        productId: productId,
        productName: productName,
        productOwnerName: productOwnerName,
        developers: developers,
        scrumMasterName: scrumMasterName,
        startDate: startDateFormatted,
        methodology: methodology,
    };

    data.push(newProduct);

    try {
        fs.writeFileSync('./data.json', JSON.stringify(data), (error) => {
            if (error) console.log('Error writing file:', error);
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ data: newProduct });
};

//PUT - update a product
const updateProduct = async (req, res) => {
    const {
        productName,
        productOwnerName,
        developers,
        scrumMasterName,
        methodology,
    } = req.body;
    const { productId } = req.params;
    let data = readData();

    if (!data) {
        return res
            .status(400)
            .json('There was an error reading the data file.');
    }

    for (let i = 0; i < data.length; i++) {
        if (
            data[i].productId.toLocaleUpperCase() ===
            productId.toLocaleUpperCase()
        ) {
            const newProduct = {
                productId: productId,
                productName: productName,
                productOwnerName: productOwnerName,
                developers: developers,
                scrumMasterName: scrumMasterName,
                startDate: data[i].startDate,
                methodology: methodology,
            };

            data[i] = newProduct;
        }
    }

    fs.writeFileSync('./data.json', JSON.stringify(data), (err) => {
        if (err) console.log('Error writing file:', err);
    });

    res.status(200).json({ data: data });
};

//DELETE a product
// Not actually used in my frontend imlementation but is available as an endpoint for completeness sake
const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    let data = readData();

    if (!data) {
        return res
            .status(400)
            .json('There was an error reading the data file.');
    }

    for (let i = 0; i < data.length; i++) {
        if (
            data[i].productId.toLocaleLowerCase() ===
            productId.toLocaleLowerCase()
        ) {
            data.splice(i, 1);
        }
    }

    fs.writeFileSync('./data.json', JSON.stringify(data), (err) => {
        if (err) console.log('Error writing file:', err);
    });

    res.status(200).json({
        msg: productId + ' was deleted (or never existed)',
    });
};

//Helper functions

function readData() {
    let data;
    try {
        const rawData = fs.readFileSync(
            './data.json',
            'utf8',
            (err, jsonString) => {
                if (err) {
                    console.log('error reading file');
                    return;
                }
            }
        );
        data = JSON.parse(rawData);
    } catch {
        return null;
    }

    return data;
}

//Generate a (reasonably) unique productID for new products
function generateProductId(productName, startDate, methodology) {
    let rand = (Math.random() * 10000000).toString().slice(0, 5);
    const date = startDate.replace(/\//g, '').slice(2);
    const name = productName.replace(/[^a-z0-9]/gi, '');
    if (name.length < 1) {
        name = 'z';
    }
    const prodName =
        name.length > 2
            ? productName.slice(0, 3)
            : productName.slice(0, 1) + 'zz';

    let newId = prodName + methodology.slice(0, 2) + rand + rand;

    //quick check for collisions
    const data = readData();
    let allIds = [];

    if (!data) {
        return newId;
    }

    for (prod of data) {
        allIds.push(prod.productId);
    }

    while (allIds.includes(newId) && allIds.length < 10000) {
        let rand2 = (Math.random() * 10000000).toString().slice(0, 6);
        newId = prodName + methodology.slice(0, 2) + rand + rand2;
    }

    return newId.toLocaleUpperCase();
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    deleteProduct,
    updateProduct,
};

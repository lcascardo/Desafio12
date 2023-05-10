import Products from "../dao/dbManagers/products.js";
import CustomError from "../errors/customError.js";
import { enumErrors } from "../errors/enumErrors.js";


const productsManager = new Products();

//Traer todos los productos
const getAll = async (req, res) => {
    let products = await productsManager.getAll();
    console.log(products);
    res.send({ status: "success", payload: products })
}

//Agregar producto
const saveProduct = async (req, res) => {
    const { title, description, price, code, quantity, category, thumbnail } = req.body;

    let newProduct = {
        title,
        description,
        price,
        code,
        quantity,
        category,
        thumbnail
    };

    if (!title ||!description ||!code ||!price ||!quantity ||!category ||!thumbnail)
        CustomError.create({
            name: "Error al hacer post de producto",
            message: "Completar todos los campos",
            cause: "Falta de campos de productos",
            code: enumErrors.VALORES_FALTANTES,
            statusCode: 400,
        });

    const result = await productsManager.saveProduct(newProduct);
    res.send({ status: "success", payload: result });
}

//Actualizar producto
const updateProduct = async (req, res) => {
    let id = req.params.pid;
    const { title, description, price, code, quantity, category, thumbnail } = req.body;
    let updateProduct = {
        title,
        description,
        price,
        code,
        quantity,
        category,
        thumbnail
    };
    let result = await productsManager.updateProduct(id, updateProduct)
    res.send({ status: "success", payload: result })
}

//Borrar producto
const deleteProduct = async (req, res) => {
    let id = req.params.pid;
    let result = await productsManager.deleteProduct(id);
    res.send({ status: "success", payload: result })
}

export default {
    getAll,
    saveProduct,
    updateProduct,
    deleteProduct
}
import cartsModel from "../models/carts.js";
import productsModel from "../models/products.js";
import Products from "../dbManagers/products.js";
import Tickets from "./tickets.js";


const productsManager = new Products();
const ticketsManager = new Tickets();

export default class Carts {
    constructor() {
        console.log("Working in mongoDB with carts");
    }

    getAll = async () => {
        let carts = await cartsModel.find().lean().populate('user').populate('products.product');
        return carts;
    }

    getOne = async (id) => {
        let cart = await cartsModel.findOne({ _id: id }).lean().populate('user').populate('products.product');
        return cart;
    }

    saveCart = async (cart) => {
        let result = await cartsModel.create(cart);
        return result;
    }

    deleteCart = async (id) => {
        let result = await cartsModel.findByIdAndDelete(id);
        return result;
    }

    addProductToCart = async (cid, pid) => {
        try {
            const cartFound = await cartsModel.findById(cid);
            if (!cartFound)
                return {
                    status: 404,
                    error: `Cart with id ${cid} not found`,
                };

            const productFound = await productsModel.findById(pid);
            if (!productFound)
                return {
                    status: 404,
                    error: `Product with id ${pid} not found`,
                };

            let productIndex = cartFound.products.findIndex(p => p.product._id == pid)
            if (productIndex != -1) {
                let updateProducts = cartFound;
                updateProducts.products[productIndex].quantity++
                return await cartsModel.findByIdAndUpdate(cid, { products: updateProducts.products })
            }
            else {
                return await cartsModel.findByIdAndUpdate(cid, { $push: { products: { product: pid, quantity: 1 } } })
            }

        } catch (err) {
            console.log(err);
        }


    }

    updateCart = async (cid, cart) => {
        let result = await cartsModel.updateOne({ _id: cid }, cart);
        return result;
    }

    purchase = async (cid, purcharser) => {
        try {

            const cartExist = await this.getOne(cid);
            if (cartExist.error) {
                return {
                    status: 404,
                    error: `Cart with id ${cid} not found`,
                };
            }


            const existProductOutStock = Boolean(
                cartExist.products.find((p) => p.product.quantity < p.quantity)
            );

            if (existProductOutStock) {
                return {
                    status: 400, message: "Exist product out stock"
                };
            }

            let totalAmount = 0;


            cartExist.products.forEach(async(p) => {
                const newStock = p.product.quantity - p.quantity;
                totalAmount += p.product.price * p.quantity;
                await productsManager.updateProduct(p.product._id,{quantity: newStock})
            });

            
            
            let ticket = {
                code: await ticketsManager.createCode(),
                purchase_datetime: new Date().toLocaleString(),
                amount: totalAmount,
                purcharser: purcharser
            }

            await ticketsManager.createTicket(ticket);

            console.log("Ticket creado");
        }
        catch (err) {
            console.log(err);
        }
    }

}
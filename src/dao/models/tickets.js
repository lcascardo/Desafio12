import mongoose from "mongoose";

const collection = 'tickets';

const schema = new mongoose.Schema({
    code: {
        type: String,
        require: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    purcharser: {
        type: String,
        require: true
    }
})

const ticketModel = mongoose.model(collection, schema);

export default ticketModel
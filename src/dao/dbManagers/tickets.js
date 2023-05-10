import ticketModel from "../models/tickets.js";

export default class Tickets {
    constructor() {
        console.log("Working in mongoDB with tickets");
    }

    //Traer todos los tickets
    getAll = async () => {
        try {
            let tickets = await ticketModel.find().lean();
            return tickets;
        }
        catch (error) {
            console.log(error);
            return null;
        }

    }

    //Traer un solo ticket por id
    getOne = async (id) => {
        try {
            let ticket = await ticketModel.findOne({ _id: id });
            return ticket;
        }
        catch (error) {
            console.log(error);
            return null;
        }

    }

    //Crear ticket
    createTicket = async (ticket) => {
        try {
            let result = await ticketModel.create(ticket);
            return result;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    //Actualizar ticket
    resolveTicket = async (id, ticket) => {
        try {
            let updateTicket = await ticketModel.updateOne({ _id: id }, { $set: ticket });
            return updateTicket;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    createCode = async () => {
        try {
            let isCodeUnique = false;
            let ticketCode;
            // Generar código autogenerado único para el ticket
            while (!isCodeUnique) {
                ticketCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                const existingTicket = await ticketModel.findOne({ code:ticketCode });
                if (!existingTicket) {
                    isCodeUnique = true;
                }
            }
            return ticketCode;
        }
        catch (error) {
            console.log(error);
            return null
        }
    }

}
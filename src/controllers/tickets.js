import Ticket from "../dao/dbManagers/tickets.js";
import User from "../dao/dbManagers/users.js";

const ticketService = new Ticket();
const userService = new User();


//Traer todos los tickets
const getTickets = async (req,res) => {
    let result = await ticketService.getAll();
    res.send({status:"success",result:result})
}




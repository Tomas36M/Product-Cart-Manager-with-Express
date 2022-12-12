import { Router } from "express";
import CartManager from "../managers/cart-manager.js";

const route = Router();
const manager = new CartManager('./src/data/carts.json')

route.post('/', async (req, res) => {
    try {
        const id = req.body.id
        if (!id) return res.send({ status: 400, message: 'El id es obligatorio para la busqueda.' });
        await manager.addCart(id)
        res.send({ status: 200, message: 'Se ha agregado el carrito con id : ' + id })
    } catch (err) {
        res.send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
})

route.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await manager.getCartProducts(id)
        if(result.status == 400){
            res.status(400).send({status: 400, message: result.message})
        }
        res.send(result)
    } catch (err) {
        res.send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
})

route.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        await manager.addProductToCart(cid, pid);        
        res.status(200).send({status: 'sucsess', message: 'El producto se ha agregado a la lista.'})
    } catch (err) {
        res.send({ status: 500, message: 'Hay un error en el servidor: ' + err });
    }
})

export default route
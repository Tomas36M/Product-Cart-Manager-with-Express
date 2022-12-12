import fs from 'fs';
import ProductManager from './product-manager.js';

const manager = new ProductManager('./src/data/products.json');

class CartManager {

    constructor(path) {
        this.path = path
    }

    writeFile = async (id) => {
        const newCart = { id, products: [] }
        await fs.promises.writeFile(this.path, JSON.stringify([newCart], null, 2))
    }

    addCart = async (id) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return this.writeFile(id);

            const carts = JSON.parse(content);

            const idCheck = carts.find(el => el.id == id);

            if (idCheck) return {status: 400, message: `El id: ${id} ya existe, cmabairlo por uno no existente`};

            carts.push({ id, products: [] })

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

        } else {
            this.writeFile(id);
        }

    }

    getCartProducts = async (id) => {

        if (fs.existsSync(this.path)) {

            const content = await fs.promises.readFile(this.path, 'utf-8');

            if (!content) return {status: 400, message: 'No hay nada dentro del arhivo'}

            const carts = JSON.parse(content);

            if (carts.length == 0) return {status: 400, message: 'No hay carritos disponibles'}

            const cart = carts.find(el => el.id == id);

            if(cart){
                return cart["products"]
            } else {
                return {status: 400, message: `El id: ${id} no existe`}
            }

        } else {
            return {status: 400, message: `El archivo no existe`}
        }
    }

    addProductToCart = async (cid, pid) => {

        const content = await fs.promises.readFile(this.path, 'utf-8');

        if (!content) return {status: 400, message: 'No hay nada dentro del arhivo'}

        const carts = JSON.parse(content);

        if (carts.length == 0) return {status: 400, message: 'No hay carritos disponibles'};

        const cart = carts.find(el => el.id == cid);

        if (cart) {
            const result = await manager.getProductById(pid);
            if (result.status == 400) {
                return result;
            } else {
                cart.products.push(pid);
                carts.splice(cid - 1, 1, cart);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            }
        } else {
            return {status: 400, message: 'El carrito con id: ' + cid + ' no existe'}
        }
    }
}

export default CartManager
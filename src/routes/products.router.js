/**
 * @Author: Your name
 * @Date:   2023-12-12 17:55:27
 * @Last Modified by:   Your name
 * @Last Modified time: 2023-12-12 21:46:24
 */
import { Router } from "express";
import { ProductManager } from "../classes/ProductManager.js";

const router = Router();
const productManager = new ProductManager("productos.json");

router.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    let response = await productManager.getProducts();
    if (limit) {
      let tempArray = response.filter((dat, index) => index < limit);
      /* let tempArray = response.map((dat, index) => {
          return index < limit && dat;
        });
        */
      res.json({ data: tempArray, limit: limit, quantity: tempArray.length });
    } else {
      res.json({ data: response, limit: false, quantity: response.length });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    let product = await productManager.getProductById(pid);

    if (product) {
      res.json({ message: "success", data: product });
    } else {
      res.json({
        message: "el producto solicitado no existe",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  const { title, description, price, thumbnail, status, category, code, stock } = req.body;

  try {
    const result = await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      status,
      category,
      code,
      stock
    );
    res.json({ message: "success", data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { title, description, price, thumbnail, status, category, code, stock } = req.body;

  try {
    let product = await productManager.getProductById(pid);
    if (product) {
      let newProduct = {
        title: title || product.title,
        description: description || product.description,
        price: price || product.price,
        thumbnail: thumbnail || product.thumbnail,
        status: status || product.status,
        category: category || product.category, 
        code: code || product.code,
        stock: stock || product.stock,
      };
      const respuesta = await productManager.updateProductById(pid, newProduct);
      res.json({ message: "success", data: respuesta });
    } else {
      res.json({
        message: "el producto solicitado no existe",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    let product = await productManager.getProductById(pid);

    if (product) {
      const respuesta = await productManager.deleteProductById(pid);
      res.json({ message: "success", data: respuesta });
    } else {
      res.json({
        message: "el producto solicitado no existe",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error", data: err });
  }
});
export default router;

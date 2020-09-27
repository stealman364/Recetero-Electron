const { BrowserWindow, Notification } = require("electron");
const { getConexion } = require("./database");

let window;
function createWindow() {
  window = new BrowserWindow({
    width: 1600,
    height: 900,
    title: "Recetero",
    icon: __dirname + "/receta_flaticon.ico",
    webPreferences: {
      nodeIntegration: true,
    },
  });
  window.loadFile("src/ui/index.html");
  window.webContents.openDevTools();
}
async function createReceta(receta) {
  const conn = await getConexion();
  const result = await conn.query("INSERT INTO Recetas set ?", receta);
  new Notification({
    title: "Recetero",
    body: "Receta Guardada correctamente",
  }).show();
  receta.id = result.insertId;
  return receta;
}

async function customNotification(body) {
  new Notification({
    title: "Recetero",
    body: body,
  }).show();
}

async function deleteReceta(idReceta) {
  const conn = await getConexion();
  const result = await conn.query(
    "DELETE FROM Recetas WHERE idReceta =?",
    idReceta
  );
  return result;
}

async function updateReceta(idReceta, receta) {
  const conn = await getConexion();
  const result = await conn.query("Update Recetas set ? where idReceta=?", [
    receta,
    idReceta,
  ]);
}

async function getRecetas() {
  const conn = await getConexion();
  const result = await conn.query(
    "select idReceta, nombreReceta, descripcionReceta from Recetas"
  );
  return result;
}
async function getReceta(idReceta) {
  const conn = await getConexion();
  const result = await conn.query(
    "select * from Recetas where idReceta=?",
    idReceta
  );
  return result[0];
}

async function getProductos() {
  const conn = await getConexion();
  //ejecutamos un replace para que intercambie puntos por comas
  const result = await conn.query(
    "SELECT idProducto,producto,CAST(REPLACE(precioCompra, '.', ',') AS CHAR(15)) AS precioCompra FROM Productos"
  );
  return result;
}

async function updateProducto(idProducto, producto) {
  const conn = await getConexion();
  const result = await conn.query("Update Productos set ? where idProducto=?", [
    producto,
    idProducto,
  ]);
}
async function deleteProducto(idProducto) {
  const conn = await getConexion();
  const result = await conn.query(
    "DELETE FROM Productos where idProducto=?",
    idProducto
  );
}
async function getProducto(idProducto) {
  const conn = await getConexion();
  const result = await conn.query(
    "select * from Productos where idProducto=?",
    idProducto
  );
  return result[0];
}

async function nuevoProducto(producto) {
  const conn = await getConexion();
  const result = await conn.query("INSERT INTO Productos set ?", producto);
  new Notification({
    title: "Recetero",
    body: "Producto Guardado correctamente",
  }).show();
}

async function getComposicionByIdProduct(idProducto) {
  const conn = await getConexion();
  const result = await conn.query(
    "select nombreReceta, cantidad,unidad from Composicion c inner join Recetas r ON c.idReceta = r.idReceta where idProducto=?",
    idProducto
  );
  return result;
}

module.exports = {
  createWindow,
  createReceta,
  getRecetas,
  deleteReceta,
  getReceta,
  updateReceta,
  getProductos,
  updateProducto,
  getProducto,
  deleteProducto,
  nuevoProducto,
  getComposicionByIdProduct,
  customNotification,
};

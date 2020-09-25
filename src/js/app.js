const formularioRecetas = document.getElementById("formularioRecetas");

const { remote, dialog } = require("electron");
const main = remote.require("./main.js");

/*let nombreReceta = document.getElementById("nombreReceta");
let descripcionReceta = document.getElementById("descripcionReceta");
let listaRecetas = document.getElementById("listaRecetas");
let uRLReceta = document.getElementById("URLReceta");
let URLRecetaLoad = document.getElementById("URLRecetaLoad");
let cuerpoTablaProductos = document.getElementById("cuerpoTablaProductos");
let idReceta = document.getElementById("idReceta");
let nombreProducto = document.getElementById("nombreProducto");
let precioCompra = document.getElementById("precioProducto");
let recetaConProducto = document.getElementById("recetaConProducto");
let formularioProductos = document.getElementById("formularioProductos");
let idProducto = document.getElementById("idProducto");*/

let recetas = [];

//rECETAS

//funcion con confirmacion de eliminar recetas
async function deleteReceta(id) {
  if (confirm("¿Desea eliminar el producto?")) {
    await main.deleteReceta(id);
    await getRecetas();
  }
}
//edicion de la receta se encarga de rellenar los datos del formulario
async function editReceta(id) {
  const receta = await getReceta(id);

  nombreReceta.value = receta.nombreReceta;
  descripcionReceta.value =
    receta.descripcionReceta !== null ? receta.descripcionReceta : "";
  idReceta.value = receta.idReceta;
  URLRecetaLoad.src =
    receta.imagenReceta !== null
      ? receta.imagenReceta
      : "../img/receta_flaticon.png";
  URLReceta.value = receta.imagenReceta;
  cambiarPanelGeneral("receta");
  nombreReceta.focus();
}
//obtiene una receta
async function getReceta(id) {
  const result = await main.getReceta(id);
  console.log(result);
  return result;
}
//imprime las recetas
function renderRecetas(recetas) {
  let contador = 0;
  listaRecetas.innerHTML = "";
  recetas.forEach((receta) => {
    contador++;
    listaRecetas.innerHTML += `
      <div class="list-group">
              <a
                href="#"
                class="list-group-item list-group-item-action flex-column align-items-start" 
              >
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">${
                    receta.nombreReceta == null ? "" : receta.nombreReceta
                  }</h5>
                  <small>${contador}</small>
                </div>
                <div class="d-flex w-100 justify-content-between">
                <p class="mb-1">
                  ${
                    receta.descripcionReceta == null
                      ? ""
                      : receta.descripcionReceta
                  }
                </p>
                <div>
                    <button type="button" class="btn btn-outline-primary btn-rounded btn-sm my-0" onclick="editReceta(${
                      receta.idReceta
                    })">Editar</button>
                    <button type="button" class="btn btn-outline-danger btn-rounded btn-sm my-0" onclick="deleteReceta(${
                      receta.idReceta
                    })">Eliminar</button>
                </div>
                </div>
              </a>
              
            </div>`;
  });
}
//obtiene todas las recteas
const getRecetas = async () => {
  recetas = await main.getRecetas();
  renderRecetas(recetas);
};

//PRODUCTOS

async function updateProducto(id) {
  const producto = {
    producto: cuerpoTablaProductos.rows[id].cells[1].innerHTML,
    precioCompra: cuerpoTablaProductos.rows[id].cells[2].innerHTML.replace(
      ",",
      "."
    ),
  };
  const productos = await main.updateProducto(
    cuerpoTablaProductos.rows[id].cells[0].innerHTML,
    producto
  );
  await getProductos();
}
//obtiene todas los productos
const getProductos = async () => {
  productosL = await main.getProductos();
  renderProductos(productosL);
};

async function getProducto(id) {
  const result = await main.getProducto(
    cuerpoTablaProductos.rows[id].cells[0].innerHTML
  );
  const resultComposicion = await main.getComposicionByIdProduct(
    result.idProducto
  );
  idProducto.value = result.idProducto;
  nombreProducto.value = result.producto;
  precioCompra.value = result.precioCompra;

  renderProductoComposicion(resultComposicion);
  cambiarPanelGeneral("productosInfo");
  nombreProducto.focus();
}
async function getComposicionByIdProduct(idProducto) {
  const result = await main.getComposicionByIdProduct(idProducto);
  return result;
}

async function deleteProducto(id) {
  if (confirm("¿Desea eliminar el producto?")) {
    const result = await main.deleteProducto(
      cuerpoTablaProductos.rows[id].cells[0].innerHTML
    );
  }
  await getProductos();
}
async function nuevoProducto() {
  const producto = {
    producto: $("#NuevoProducto input")[0].value,
    precioCompra: $("#NuevoProducto input")[1].value.replace(",", "."),
  };
  await main.nuevoProducto(producto);
  await getProductos();
  document.getElementById("NuevoProducto").reset();
}

function renderProductos(productosL) {
  let contador = 0;
  cuerpoTablaProductos.innerHTML = "";
  productosL.forEach((producto) => {
    cuerpoTablaProductos.innerHTML += `          <tr>
            <td class="pt-3-half" contenteditable="false">${producto.idProducto}</td>
            <td class="pt-3-half" contenteditable="true">${producto.producto}</td>
            <td class="pt-3-half" contenteditable="true">${producto.precioCompra}</td>
            <td class="pt-3-half">
              <button type="button"
                  class="btn btn-outline-success btn-rounded btn-sm my-0" onclick="getProducto(${contador})">Info</button>            
              <button type="button"
                  class="btn btn-outline-primary btn-rounded btn-sm my-0" onclick="updateProducto(${contador})">Guardar</button>
              <button type="button"
                  class="btn btn-outline-danger btn-rounded btn-sm my-0" onclick="deleteProducto(${contador})">Eliminar</button>
            </td>
          </tr>`;
    contador++;
  });
}
function renderProductoComposicion(composicion) {
  recetaConProducto.innerHTML = "";
  composicion.forEach((listaReceta) => {
    recetaConProducto.innerHTML += `<li
                        class="list-group-item d-flex justify-content-between align-items-center"
                      >
                        ${listaReceta.nombreReceta}
                        <span class="badge badge-primary badge-pill">${
                          listaReceta.cantidad + listaReceta.unidad
                        }</span>
                      </li>`;
  });
}

//inicializacion de funciones
async function init() {
  await getRecetas();
  await getProductos();
}

init();

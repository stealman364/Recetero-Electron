function cambiarPanelGeneral(idPanel) {
  $(".paneles").each(function (index, value) {
    $(this).hide();
  });
  $("#" + idPanel).show();
  if (idPanel !== "receta") {
    formularioRecetas.reset();
    if (URLRecetaLoad) URLRecetaLoad.src = "../img/receta_flaticon.png";
    if (idReceta) idReceta.value = "";
  }
  if (idPanel !== "productosInfo") {
    formularioProductos.reset();
    recetaConProducto.innerHTML = "";
    idProducto.value = "";
  }
}
$(document).ready(function () {
  getVariablesCompositor();
  addListeners();
  cambiarPanelGeneral("recetas");
  reportWindowSize();
  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
    $(this).toggleClass("active");
  });
});

const heightOutput = document.querySelector("#listaRecetas");
var valuefiltroProductos = "";
function reportWindowSize() {
  let altura = window.innerHeight * 0.78 + "px";
  document.getElementById("listaRecetas").style.height =
    window.innerHeight * 0.8 + "px";
  document.getElementById("formularioRecetas").style.height =
    window.innerHeight * 0.7 + "px";
  document.getElementById("listaProductos").style.height =
    window.innerHeight * 0.7 + "px";
}

window.onresize = reportWindowSize;
$(document).ready(function () {
  $("#filtroProductos").on("keyup", function () {
    valuefiltroProductos = $(this).val().toLowerCase();
    $("#cuerpoTablaProductos tr").filter(function () {
      $(this).toggle(
        $(this).text().toLowerCase().indexOf(valuefiltroProductos) > -1
      );
    });
  });
  $("#filtroRecetaConProducto").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#recetaConProducto option").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
  $(".close-btn").click(function () {
    $(".alert").removeClass("show");
    $(".alert").addClass("hide");
  });
});

function reloadFilters() {
  $("#filtroProductos").on("keyup", function () {
    valuefiltroProductos = $(this).val().toLowerCase();
    $("#cuerpoTablaProductos tr").filter(function () {
      $(this).toggle(
        $(this).text().toLowerCase().indexOf(valuefiltroProductos) > -1
      );
    });
  });
  $("#filtroRecetaConProducto").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#recetaConProducto option").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
}
function customAlert() {
  $(".alert").addClass("show");
  $(".alert").removeClass("hide");
  $(".alert").addClass("showAlert");
  setTimeout(function () {
    $(".alert").removeClass("show");
    $(".alert").addClass("hide");
  }, 5000);
}

function compositorHTML(uihtml, elementID) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      document.getElementById(elementID).innerHTML += xhttp.responseText;
    }
  };
  xhttp.open("GET", "../ui/" + uihtml, true);
  xhttp.send();
}
function getVariablesCompositor() {
  const nombreReceta = document.getElementById("nombreReceta");
  const descripcionReceta = document.getElementById("descripcionReceta");
  const listaRecetas = document.getElementById("listaRecetas");
  const URLReceta = document.getElementById("URLReceta");
  const URLRecetaLoad = document.getElementById("URLRecetaLoad");
  const cuerpoTablaProductos = document.getElementById("cuerpoTablaProductos");
  const idReceta = document.getElementById("idReceta");
  const nombreProducto = document.getElementById("nombreProducto");
  const precioCompra = document.getElementById("precioProducto");
  const recetaConProducto = document.getElementById("recetaConProducto");
  const formularioProductos = document.getElementById("formularioProductos");
  const idProducto = document.getElementById("idProducto");
}
function addListeners() {
  //Bonton para añadir evento de envio de formulario
  formularioRecetas.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (nombreReceta.value) {
      const receta = {
        nombreReceta: nombreReceta.value,
        descripcionReceta:
          descripcionReceta.value != "" || descripcionReceta.value != null
            ? descripcionReceta.value
            : null,
        imagenReceta:
          URLReceta.value == "../img/receta_flaticon.png" ||
          URLReceta.value == ""
            ? null
            : URLReceta.value,
      };

      if (idReceta.value == "" || idReceta.value === undefined) {
        await main.createReceta(receta);
      } else {
        await main.updateReceta(idReceta.value, receta);
        idReceta.value = "";
      }
      await getRecetas();
      cambiarPanelGeneral("recetas");
      formularioRecetas.reset();
    } else {
      await main.customNotification("No es posible guardar recetas sin nombre");
    }
  });
  formularioProductos.addEventListener("submit", async (event) => {
    event.preventDefault();

    const producto = {
      producto: nombreProducto.value,
      precioCompra: precioCompra.value.replace(",", "."),
    };

    if (idProducto.value == "" || idProducto.value === undefined) {
      await main.nuevoProducto(producto);
    } else {
      await main.updateProducto(idProducto.value, producto);
      idProducto.value = "";
    }
    await getProductos();
    cambiarPanelGeneral("productos");
    formularioProductos.reset();
  });

  document.getElementById("switch").addEventListener("change", (event) => {
    console.log(document.getElementById("switch").checked);
  });
}

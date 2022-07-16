
let categoriasLibros = [];
let carrito = [];
let totalLibros = [];
let cantidadLibros = [];
const total = document.querySelector("#total");
let totalCarrito = [];



iniciarApp();


//funcion inicializadora

function iniciarApp() {

    loadCategorias();
    showLibros();
    crearCateg();
    sucursales();



}




//fetch
function sucursales() {

    fetch('./js/sucursales.data.json ')
        .then((res) => res.json(res))
        .then((data) => crearSucursales(data));
}


//crear sucursales

function crearSucursales(data) {
    const sucursales = document.getElementById("sucursales");


    data.forEach((sucursal) => {
        const sucursalesDiv = document.createElement("div")
        sucursalesDiv.classList.add("sucursales");
        sucursalesDiv.innerHTML = `
        
            <p class="ciudad"> Sucursal ${sucursal.ciudad}</p>
            <p class="direccion">Direccion : ${sucursal.direccion}</p>
            <p class="horario">Horarios de atencion : ${sucursal.horario}</p>
             <p class="horario">Telefono : ${sucursal.telefono}</p>
       
        `
        sucursales.appendChild(sucursalesDiv);
    })

}


//crear categorias

function loadCategorias() {


    const categorias = libros.map(element => element.categoria);
    const categoriasSet = new Set(categorias);
    const categoriasUnicas = [...categoriasSet];

    categoriasLibros = categoriasUnicas.map(element => {
        return {
            nombre: element,
        }
    })
}

//añadir categorias al dom

function crearCateg() {
    const navCategorias = document.querySelector(".categorias")
    categoriasLibros.forEach(element => {
        const btnCat = document.createElement("button");
        btnCat.classList.add("btnCat");
        btnCat.innerHTML = element.nombre;

        btnCat.addEventListener("click", () => {
            showLibros(element.nombre);
        })
        navCategorias.appendChild(btnCat)
    })
}

//filtrar libros por categoria y crear cards

function showLibros(nameCategori = "") {

    librosTo = libros;

    nameCategori !== "" ? librosTo = libros.filter(libro => libro.categoria === nameCategori) : console.log("cards");


    /* if (nameCategori !== "") {
         librosTo = libros.filter(element => element.categoria === nameCategori);
 
     }*/

    const nodoH2 = document.getElementById("categoriaNombre");
    nodoH2.innerText = nameCategori;


    const cards = document.querySelector("#cards");
    cards.innerHTML = "";


    cards.classList.add("cards");
    librosTo.forEach(libro => {
        cardLibros(libro, cards);

    });


}




//crear productos

function cardLibros(libro, cards) {

    const div = document.createElement("div");
    div.classList.add("cards");
    div.innerHTML = `
                     <div class = "card-libros">
                                <h2>${libro.title}</h2>
                                <div class="img-libro">
                                    <img src="${libro.image}" alt="">
                                </div>
                                <div class="info-libro">

                                    <p class = "precio">$ ${libro.price}</p>
                                    
                                    <p>Hasta 12 cuotas con tarjeta de credito</p>
                                     <p class="stock">${libro.stock} disponibles</p>
                                    <div class="cant-lib">
                                        
                                    </div>
                                    <button id="botonCarrito" class="boton-carrito"
                                    onclick="agregarLibro ('${libro.id}')">Agregar al carrito</button>
                                </div>


                                <a class="mas-info" href="#">Ver mas informacion </a>
                      <div/>      

        `
    cards.appendChild(div);



}

//crear carrito

function crearCarrito() {

    const librosAgregados = document.getElementById("carritoPrincipal");
    librosAgregados.innerHTML = "";
    const carritoSinDuplicados = [...new Set(carrito)];

    carritoSinDuplicados.forEach(libro => {

        //filtrar que no se repitan los libros en el carrito
        libros.filter((libro) => {
            return libro.id == parseInt(libro)
        })

        //Modifique agregando el object values, ahora me suma bien la cantidad y el subtotal de cada libro

        cantidadLibros = Object.values(carrito).reduce((cantidad, id) => {

            return id === libro ? cantidad += 1 : cantidad;
        }, 0);
        console.log(libro.id)
        const divCarrito = document.createElement("div");
        divCarrito.classList.add("carrito-principal");
        divCarrito.setAttribute("id", "carritoCompra")
        divCarrito.innerHTML = `
        
                    <div class="izquierda-carrito">
                        <div class="imagenCarrito"><img src="${libro.image}" alt="" srcset=""></div>
                        <div class="nombrelibro">
                            <h2>Agregaste a tu carrito</h2>
                            <p> - ${libro.title} -</p>
                        </div>
                    </div>
                    <div class="derecha-carrito">
                        <div>
                            <p id="cantidadDeLibros${libro.id}" >${cantidadLibros} producto en tu carrito : $  ${totalLibros = cantidadLibros * libro.price}</p>
                        </div>
                      
                        

                    </div>
        
        `
        librosAgregados.appendChild(divCarrito);





        //sumar total carrito


        calcularTotal();


        //botones vaciar y finalizar

        const botones = document.querySelector(".btnes")
        botones.innerHTML = `
        
                            <button id="btnEliminar" class="btn-eliminar" >Vaciar carrito</button>
                            <button  class="btnFinalizar" >Finalizar compra</button>
                            
                        
        `

        //boton finalizar compra

        const finalizarCompra = document.querySelector(".btnFinalizar");
        finalizarCompra.addEventListener("click", () => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Compra realizada con exito',
                showConfirmButton: true,
                timer: 1500
            })
            vaciarCarrito();
            crearCarrito();
        })

        //Vaciar carrito 

        const btnVaciar = document.getElementById("btnEliminar");
        btnVaciar.addEventListener("click", () => {

            vaciarCarrito();

            crearCarrito();


        })


        //agregar al storage
        localStorage.setItem("Agregado al carrito", JSON.stringify(carrito))




    })




}


// CALCULAR TOTAL

function calcularTotal() {

    totalCarrito = Object.values(carrito).reduce((acc, { price }) => acc += price, 0)


    total.textContent = totalCarrito;

}







//vaciar carrito

function vaciarCarrito() {
    carrito = [];
    total.textContent = 0;

}

//agregar libros al hacer click en  agregar productos al carrito

function agregarLibro(idLibro) {
    const libro = libros.find(element => element.id == idLibro);
    carrito.push(libro);
    crearCarrito();
    calcularTotal();




    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Has agregado ${libro.title} tu carrito`,
        imageUrl: `${libro.image}`,
        imageWidth: 200,
        imageHeight: 200,
        showConfirmButton: false,
        timer: 1500
    })

}














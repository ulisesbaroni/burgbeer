
// MESAS/UBICACIÓN
class Mesa {
    constructor (mesa, code) {
      this.mesa = mesa;
      this.code = code;
    }
}

const mesas = [new Mesa(10,'teclado'), new Mesa(15,'mouse'), new Mesa(20,'monitor')];


const mesaLogin = document.getElementById('numeroMesa'),
    codigoLogin = document.getElementById('codigoMesa'),
    recordar = document.getElementById('recordar'),
    btnLogin = document.getElementById('login'),
    modalEl = document.getElementById('modalLogin'),
    modal = new bootstrap.Modal(modalEl),
    view = document.querySelectorAll('.view');



//Guardar datos
function guardarDatos(mesaRegistrada, storage) {

    const ubicacion = {
        'number': mesaRegistrada.mesa,
        'code': mesaRegistrada.code
    }

    storage.setItem('ubicacion', JSON.stringify(ubicacion));
}

//Recuperar datos guardados para poder ingresar
function recuperarRegistro(storage) {
    return JSON.parse(storage.getItem('ubicacion'));
}


function saludar(ubicacion) {
    saludo.innerHTML = `Mesa <span>#</span>  ${ubicacion.number}`
}

//Intercambiar clases para la visualizacion de algunos elementos.
function intercambiarClases(elemento, clase) {
    elemento.forEach(element => {
        element.classList.toggle(clase)
    })
}

//Validar mesa con la informacion que ingresa el usuario
function validarMesa(BDmesas, number, code) {
    let encontrada = BDmesas.find((BDmesa) => BDmesa.mesa == number);

    if (typeof encontrada === 'undefined') {
        return false;

    } else {

        if (encontrada.code != code) {
            return false;
        } else {
            return encontrada;
        }
    }
}

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    //Validar que ambos campos estén completos
    if (!mesaLogin.value || !codigoLogin.value) {

        Swal.fire({
            icon: 'error',
            title: 'Lo lamento...',
            text: 'Todos los campos son obligatorios para poder iniciar tu pedido!',
            html: 'Todos los campos son obligatorios para poder iniciar tu pedido!'
        });

    } else {
        let data = validarMesa(mesas, mesaLogin.value, codigoLogin.value);

        //Revisar si el return de la funcion validar es objeto o booleano.Si es objeto, se valido correctamente! Si no, informar por alert!

        if (!data) {

            Swal.fire({
                icon: 'error',
                title: 'Número de mesa y/o código incorrecto',
                text: 'Intenta nuevamente por favor!'
            });

            //Checkear si el cliente elige o no recordar los datos, si elige recordarlos, guardarlos en el localStorage, si no, en el sessionStorage
        } else {

            if (recordar.checked) {
                guardarDatos(data, localStorage);
                saludar(recuperarRegistro(localStorage));


            } else {
                guardarDatos(data, sessionStorage);
                saludar(recuperarRegistro(sessionStorage));

            }

            modal.hide();

            intercambiarClases(view, 'd-none');

        }
    }
})


//Revisar y evitar validar mesa si esta guardada en el storage
function checkRegistro(ubicacion) {

    if (ubicacion) {
        saludar(ubicacion);
        intercambiarClases(view, 'd-none');
    }
}

checkRegistro(recuperarRegistro(localStorage));


// Traer productos del .json
const fetchData = async () => {
    const res = await fetch('./js/api.json');
    return await res.json()
}

let productos
fetchData().then(resp => {
    productos = resp
    mostrarProductos(productos)
})


// Contenedor de prodcutos
const mostrarProductos = (productos) => {
    const contenedorProductos = document.getElementById('contenedor')
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `<div class="card" style="width: 18rem;">
                            <img src="${producto.img}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${producto.nombre}</h5>
                                <p class="card-text">Info:  ${producto.ingredientes}</p>
                                <p class="card-precio">Precio: $${producto.precio}</p>
                                <div class='btn-añadir'><button class="btn btn-success" id=boton${producto.id}>Sumar al carrito</button></div>
                                </div>
                            </div>`

        contenedorProductos.appendChild(div)

        const boton = document.getElementById(`boton${producto.id}`);
        boton.addEventListener('click', () => {
            carritoIndex(producto.id)
        })

    })

}
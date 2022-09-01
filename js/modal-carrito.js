
// CARRITO DE COMPRA
const carritoDeCompras = []
const contenedorCarrito = document.getElementById('carrito-contenedor');


// Modal carrito de compra
const carritoIndex = (productoId) => {

    //Mostrar pequeño alert al añadir producto en el carrito
    Toastify({
        text: "Producto añadido con éxito!",
        position: "center",
        style: {
          background: "linear-gradient(0deg, rgba(84,140,47,1) 0%, rgba(14,96,15,1) 100%)",
        }
      }).showToast();

    const renderProdcutoCarrito = () => {
        let producto = productos.find(producto => producto.id == productoId);


        //Si existe producto en carrito, sumarle una unidad
        const existe = carritoDeCompras.find(x => x.id === producto.id);

        if (existe) { 
            carritoDeCompras.forEach(x => x.id === existe.id ? x.cantidad++ : x.cantidad);
        } else {
            carritoDeCompras.push(producto);
        }

        contenedorCarrito.innerHTML = '';
        carritoDeCompras.forEach(element => {

            let div = document.createElement('div')
            div.classList.add('productoEnCarrito')
            div.innerHTML = `<p class= 'title'>${element.nombre}</p>
                        <p>Precio: $${element.precio}</p> 
                        <p id="cantidad${element.id}">Cantidad: ${element.cantidad}</p>
                        <button id="eliminar${element.id}" class="delete btn btn-danger btn-small boton-eliminar" ><i class=" fa fa-trash"></i></button>
                        `;

            contenedorCarrito.appendChild(div)

            div.querySelector('.delete').addEventListener('click', removeItemCarrito)

            carritoTotal()
        });
    }

    renderProdcutoCarrito()


}

//Calcular Total consumo
function carritoTotal() {
    let total = 0;
    const itemCarTotal = document.getElementsByClassName('itemCarTotal');
    carritoDeCompras.forEach(element => {
        total = total + element.precio * element.cantidad
    });

    const elementoHTML = [...itemCarTotal];
    elementoHTML.forEach(elemento => {
        elemento.innerHTML = `Total: $ ${total}`
    })

}


//Quitar productos del carrito
function removeItemCarrito(e) {
    const buttonDelete = e.target
    const div = buttonDelete.closest('.productoEnCarrito')


    //Hacer que al remover producto del carrito, se descuente del monto total
    const title = div.querySelector('.title').textContent;
    for (let i = 0; i < carritoDeCompras.length; i++) {
        if (carritoDeCompras[i].nombre.trim() === title.trim()) {
            carritoDeCompras[i].cantidad = 1;
            carritoDeCompras.splice(i, 1)
        }
    }

    div.remove()
    carritoTotal()
    
}


//Enviar pedido
const enviarPedido = document.querySelector('.send')
enviarPedido.addEventListener('click', () => {

        if (carritoDeCompras.length !== 0) {

            Swal.fire({
                
                title: '¡Envío exitoso!',
                imageUrl: './img/ok.jpg',
                html: '<b>Tu pedido está siendo preparado!</b> <br><br>' +
                    '<b>Tu opinión nos hace crecer!</b> ' +
                    'Por eso nos gustaría saber.. ¿Que te parece nuestro sistema de pedido digital? ',
                showCloseButton: false,
                allowOutsideClick: false,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Genial!',
                confirmButtonAriaLabel: 'Thumbs up, great!',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i> Aún lo pueden mejorar!',


            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        position: 'center',
                        imageUrl: './img/si.jpg',
                        title: '¡Buenísimol! Nos alegra muchísimo saber eso. Muchas gracias por tu opinión!',
                        showConfirmButton: false,
                        timer: 3500
                    })

                } else {
                    Swal.fire({
                        position: 'center',
                        imageUrl: './img/no.jpg',
                        title: 'Excelente, pensaremos nuevas ideas para mejorar nuestro servicio! Muchas gracias por tu opinión!',
                        showConfirmButton: false,
                        timer: 4000,

                    })

                }

            })


        } else {
            Swal.fire({
                position: 'center',
                imageUrl: './img/error.jpg',
                title: '¡Ay carammmba!',
                text: 'Parece que no hay productos en tu carrito, por favor selecciona un producto para poder enviar el pedido!',

            })

        }

        //Vaciar carrito una vez finalizada la compra
        while (carritoDeCompras.length !== 0) {
            carritoDeCompras[carritoDeCompras.length -1 ].cantidad = 1;
            carritoDeCompras.pop()
            contenedorCarrito.innerHTML = '';
            carritoTotal()
            
        }
       

    }

)

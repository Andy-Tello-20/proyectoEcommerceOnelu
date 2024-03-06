
const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})

const btnCart = document.querySelector('.container-cart-icon')
const containerCartProducts = document.querySelector('.container-cart-products')

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart')
})

// Lista de todos los contenedores de productos

let allProducts = [];
const productsList = document.querySelector('.main-container');
const spanText = document.getElementsByClassName("num")[0]
const btnMas = document.getElementsByClassName("mas")[0]
const totalCarrito = document.getElementsByClassName('total-carrito')[0]

//! Evento para cuando se haga click dentro de un contenedor '.container-items'
productsList.addEventListener('click', e => {



    //? Si hago click en un dentro de productsLists (que es igual al contenedor 'container-items') sobre algo con una clase btn-add-cart...
    if (e.target.classList.contains('btn-add-cart')) {



        //?...product será igual al contenedor que esta conteniendo al boton 'btn-add-cart', es decir al contenedor "info-products" 
        const product = e.target.parentElement;




        //? valorSpan es el campo que contiene el contador de unidades de productos a comprar (<span class="num">)

        let valorSpan = parseInt(product.querySelector('span.num').textContent)

        if (valorSpan > 0) {

            const infoProduct = {
                title: product.querySelector('h2').textContent,
                quantity: parseInt(product.querySelector('span.num').textContent),
                code: product.querySelector('h4').textContent,
            };

            console.log('el valor de infoProduct es: ', infoProduct)


            allProducts = [...allProducts, infoProduct];


            //! envio al servidor 
            function enviarDatos() {
                const url = '/api/tuCarrito';

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ allProducts }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Respuesta del servidor:', data);
                    })
                    .catch(error => {
                        console.error('Error al realizar la solicitud:', error);
                    });
            }

            enviarDatos()
        }




        let modificarSpan = product.querySelector('span.num')
        let botonAñadir = product.parentElement.querySelector('button')
        modificarSpan.innerText = 0
        botonAñadir.disabled = true
        botonAñadir.classList.remove('buttonEnable')
        allProducts = []


    }
    console.log(allProducts)

    if (e.target.classList.contains('mas')) {
        //? Con esto obtengo el contenedor "increment-decrement"
        const parenElementos = e.target.parentElement


        let valorSpan = parseInt(parenElementos.querySelector('span.num').textContent)
        let botonAñadir = parenElementos.parentElement.querySelector('button')

        if (valorSpan > 0) {

            botonAñadir.classList.add('buttonEnable')
            console.log("botonAñadir:", botonAñadir)
        }

        //? Con esto obtengo el contenedor abuelo de "increment-decrement", es decir "info-products"
        let contAbuelo = parenElementos.parentElement.querySelector('span.stock').textContent;

        let soloNumeros = contAbuelo.replace(/\D/g, '');




        if (soloNumeros > 0) {
            soloNumeros -= 1

            let modificarStock = parenElementos.parentElement.querySelector('span.stock')
            modificarStock.innerText = 'Stock:' + soloNumeros

            console.log('solo numero es', soloNumeros)
            valorSpan = valorSpan + 1

            let modificarSpan = parenElementos.querySelector('span.num')
            modificarSpan.innerText = valorSpan


        }

        //? Cambiar el color del boton añadir
        if (valorSpan > 0) {

            botonAñadir.disabled = false
            botonAñadir.classList.add('buttonEnable')
            console.log("botonAñadir:", botonAñadir)
        }


    } else if (e.target.classList.contains('menos')) {
        const parenElement = e.target.parentElement

        let botonAñadir = parenElement.parentElement.querySelector('button')
        let contAbuelo = parenElement.parentElement.querySelector('span.stock').textContent;
        let soloNumeros = contAbuelo.replace(/\D/g, '');

        console.log("solonumero es:", soloNumeros)



        console.log("parentElement es", parenElement)

        let valorSpan = parseInt(parenElement.querySelector('span.num').textContent)

        console.log("valorSpan es :", valorSpan)

        if (valorSpan > 0) {

            soloNumeros++
            let modificarStock = parenElement.parentElement.querySelector('span.stock')
            modificarStock.innerText = 'Stock:' + soloNumeros


            valorSpan = valorSpan - 1


            let modificarSpan = parenElement.querySelector('span.num')
            modificarSpan.innerText = valorSpan
        }

        if (valorSpan == 0) {
            botonAñadir.disabled = true
            botonAñadir.classList.remove('buttonEnable')
            console.log("botonAñadir:", botonAñadir)
        }

    }





})


productsList.addEventListener('click', e => {


    console.log('este es el elemtento: ', e.target)


    if (e.target.classList.contains('menos2')) {



        const product = e.target.parentElement;
        console.log('produdct es :', product)

        let ContPrincipal = product.parentElement.parentElement

        let valorSpan2 = parseInt(product.querySelector('span.num2').textContent)
        console.log(valorSpan2)

        if (valorSpan2 > 1) {


            Toastify({
                text: "Se restó una unidad",
                duration: 2000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function () { } // Callback after click
            }).showToast();




            valorSpan2--


            let modificarSpan2 = product.querySelector('span.num2')
            modificarSpan2.innerText = valorSpan2


            const infoProduct = {
                title: ContPrincipal.querySelector('small').textContent,
                quantity: parseInt(product.querySelector('span.num2').textContent),
                code: product.querySelector('h4').textContent,
            };

            console.log('el valor de infoProduct es: ', infoProduct.quantity)


            allProducts = [infoProduct];


            function enviarDatos() {
                const url = '/api/tuCarrito';

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ allProducts }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Respuesta del servidor:', data);
                    })
                    .catch(error => {
                        console.error('Error al realizar la solicitud:', error);
                    });
            }

            enviarDatos()


            let subTotal = ContPrincipal.querySelector('p.precio2').textContent
            subTotal = parseInt(subTotal.replace(/\D/g, ''))

            let valorUnitario = (subTotal / (valorSpan2 + 1))
            console.log('el valor unitario es', valorUnitario)

            subTotal = subTotal - valorUnitario

            let modificarSubTotal = ContPrincipal.querySelector('p.precio2')
            modificarSubTotal.innerText = '$' + subTotal

            console.log('este es el subtotal: ', subTotal)

            let totalARemplazar = totalCarrito.textContent
            totalARemplazar = parseInt(totalARemplazar.replace(/\D/g, ''))
            totalARemplazar = totalARemplazar - valorUnitario

            totalCarrito.innerText = 'TOTAL = $' + totalARemplazar
            console.log('total a remplazar es', totalARemplazar)





        }

    }

    if (e.target.classList.contains('mas2')) {

        const product = e.target.parentElement;
        console.log('produdct es :', product)

        let ContPrincipal2 = product.parentElement.parentElement

        let valorSpan2 = parseInt(product.querySelector('span.num2').textContent)
        let status = product.querySelector('span.num2').textContent
        console.log(valorSpan2)

        let disponibles = parseInt(ContPrincipal2.querySelector('span.disponibles').textContent)

        console.log(' que es disponibles: ', disponibles)

        if (valorSpan2 < disponibles) {


            valorSpan2++
            let modificarSpan2 = product.querySelector('span.num2')
            modificarSpan2.innerText = valorSpan2


            const infoProduct = {
                title: ContPrincipal2.querySelector('small').textContent,
                quantity: parseInt(product.querySelector('span.num2').textContent),
                code: product.querySelector('h4').textContent,
            };

            console.log('el valor de infoProduct es: ', infoProduct.quantity)


            allProducts = [infoProduct];


            function enviarDatos() {
                const url = '/api/tuCarrito';

                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ allProducts }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Respuesta del servidor:', data);
                    })
                    .catch(error => {
                        console.error('Error al realizar la solicitud:', error);
                    });
            }

            enviarDatos()

            Toastify({
                text: "Se añadio una unidad",
                duration: 2000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function () { } // Callback after click
            }).showToast();


            let ContPrincipal = product.parentElement.parentElement

            let subTotal = ContPrincipal.querySelector('p.precio2').textContent
            subTotal = parseInt(subTotal.replace(/\D/g, ''))

            let valorUnitario = subTotal / (valorSpan2 - 1)
            console.log('el valor unitario es', valorUnitario)

            subTotal = subTotal + valorUnitario

            let modificarSubTotal = ContPrincipal.querySelector('p.precio2')
            modificarSubTotal.innerText = '$' + subTotal

            console.log('este es el subtotal: ', subTotal)

            let totalARemplazar = totalCarrito.textContent
            totalARemplazar = parseInt(totalARemplazar.replace(/\D/g, ''))
            totalARemplazar = totalARemplazar + valorUnitario

            totalCarrito.innerText = 'TOTAL = $' + totalARemplazar
            console.log('total a remplazar es', totalARemplazar)

        }




    }
})











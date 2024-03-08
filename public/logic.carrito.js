let ProdDelete = []

const productsListCarrito = document.querySelector('.main-container');
const totalCarrito = document.getElementsByClassName('total-carrito')[0]

productsListCarrito.addEventListener('click', e => {


    // console.log('este es el elemtento: ', e.target)


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

    if (e.target.classList.contains('carritoTrash')){
        const product = e.target.parentElement;
        console.log('produdct es :', product)


        let ContPrincipal = product.parentElement.parentElement
        console.log('ContPrincipal es: ',ContPrincipal)

        let tituloProd = ContPrincipal.querySelector('h3.h3-carrito').textContent
        console.log(tituloProd)

        let codeDelete= ContPrincipal.querySelector('h4').textContent
        console.log('el codigo es: ',codeDelete)


        const infoDelete = {
            code: ContPrincipal.querySelector('h4').textContent,
        };

      
        ProdDelete =[infoDelete]

        function enviarDatos() {
            const url = '/api/deleteProduct';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ProdDelete }),
            }).then(response => {
                // Verificar si la respuesta indica una redirección
                if (response.redirected) {

                    
                    // Realizar la redirección manualmente
                    window.location.href = response.url;
                }
            })
            .catch(error => {
                console.error('Error al enviar datos:', error);
            });
                
        }

        enviarDatos()
    }
   
})

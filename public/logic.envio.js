document.addEventListener("DOMContentLoaded", function() {
    let radioButtons = document.querySelectorAll('input.input-radio[name="shipping_method[0]"]');
    
    // Agregar event listener a cada radio button
    radioButtons.forEach(function(radioButton) {
        radioButton.addEventListener('change', function() {
            // Obtener el valor del radio button seleccionado

            let valorSeleccionado = this.value;
            


            const enviarDatos= async () => {
                const url = '/api/resumen';
    
               await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ metodoEnvio: valorSeleccionado }),
                }).then(response => {
                    // Verificar si la respuesta indica una redirección
                    if (response.redirected) {
                      // Crear el Toast
                      const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        
                      });
                      // Mostrar el Toast
                      Toast.fire({
                        icon: "success",
                        title: "Guardando Cambios!"
                      }).then(() => {
                        // Después de que el toast se cierre, realizar la redirección manualmente
                        window.location.href = response.url;
                      });
                    }
                  })
                .catch(error => {
                    console.error('Error al enviar datos:', error);
                });
                    
            }
    
            enviarDatos()
        });
    });
});
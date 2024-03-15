



export const calcularDistancia = async (calle, numero) => {
    let calleNombre = capitalizeStreetName(calle);
    let origen = "Florida 1149, La Falda, Cordoba, Argentina";
    let destino = calleNombre + " " + numero + ", La Falda, Cordoba, Argentina";

    try {
        const distancia = await new Promise((resolve, reject) => {
            calcularKm(origen, destino)
                .then(distancia => resolve(distancia))
                .catch(error => reject(error));
        });
  
        console.log('La distancia entre las direcciones es de:', distancia.toFixed(2), 'kilómetros');
        return distancia;
    } catch (error) {
        console.error('Error al calcular la distancia:', error);
        return null;
    }
};





function capitalizeStreetName(streetName) {
    let words = streetName.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(" ");
}




function geocodificarDireccion(direccion, callback) {
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}&format=json&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                var coordenadas = {
                    latitud: parseFloat(data[0].lat),
                    longitud: parseFloat(data[0].lon)
                };
                callback(coordenadas);
            } else {
                callback(null);
            }
        })
        .catch(error => {
            console.error('Error al geocodificar la dirección:', error);
            callback(null);
        });
}

function calcularKm(direccionOrigen, direccionDestino) {
    return new Promise((resolve, reject) => {
        geocodificarDireccion(direccionOrigen, function (coordenadasOrigen) {
            geocodificarDireccion(direccionDestino, function (coordenadasDestino) {
                if (coordenadasOrigen && coordenadasDestino) {
                    const distancia = calcularDistanciaEntreCoordenadas(coordenadasOrigen, coordenadasDestino);
                    resolve(distancia + (distancia * 0.25));
                } else {
                    reject(new Error('No se pudieron geocodificar ambas direcciones'));
                }
            });
        });
    });
}

function calcularDistanciaEntreCoordenadas(coordenadasOrigen, coordenadasDestino) {
    var radioTierra = 6371; // Radio de la Tierra en kilómetros
    var latitudOrigenRad = toRadians(coordenadasOrigen.latitud);
    var latitudDestinoRad = toRadians(coordenadasDestino.latitud);
    var deltaLatitud = toRadians(coordenadasDestino.latitud - coordenadasOrigen.latitud);
    var deltaLongitud = toRadians(coordenadasDestino.longitud - coordenadasOrigen.longitud);

    var a = Math.sin(deltaLatitud / 2) * Math.sin(deltaLatitud / 2) +
        Math.cos(latitudOrigenRad) * Math.cos(latitudDestinoRad) *
        Math.sin(deltaLongitud / 2) * Math.sin(deltaLongitud / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distancia = radioTierra * c;

    return distancia;
}

function toRadians(grados) {
    return grados * Math.PI / 180;
}
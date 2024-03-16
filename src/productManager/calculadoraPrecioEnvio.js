

export const calcularCostoEnvio = (distancia) => {
        const intervalosCostoEnvio = [
            { limiteSuperior: 0.4, costo: 200 },
            { limiteSuperior: 1, costo: 300 },
            { limiteSuperior: 1.3, costo: 400 },
            { limiteSuperior: 1.5, costo: 500 },
            { limiteSuperior: Infinity, costo: 600 }
        ];

        for (const intervalo of intervalosCostoEnvio) {
            if (distancia < intervalo.limiteSuperior) {
                return intervalo.costo;
            }
        }

        return null; // o algún valor por defecto si la distancia no cae en ningún intervalo conocido
    }
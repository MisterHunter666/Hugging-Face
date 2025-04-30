import * as dotenv from 'dotenv'; // Importa dotenv para manejar variables de entorno
dotenv.config(); // Carga las variables definidas en .env

// Función principal para generar una imagen usando la API de Stable Horde
export async function generate(prompt) {
    try {
        console.log("Prompt recibido:", prompt); // Muestra el prompt recibido

        // Paso 1: Enviar el prompt a la API para iniciar la generación de la imagen
        const response = await fetch('https://stablehorde.net/api/v2/generate/async', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Client-Agent': 'unknown:0:unknown', // Identificación del cliente
                'apikey': `${process.env.AIHORDE_API_KEY}` // Clave de API desde .env
            },
            body: JSON.stringify({ prompt: `${prompt}` }) // Cuerpo con el prompt a generar
        });

        const data = await response.json(); // Respuesta con ID de la solicitud de una generación de imagen y otros datos
        console.log(data); // Muestra el ID de generación y "kudos"

        // Paso 2: Polling para verificar si la imagen ya fue generada
        let finished = false; // Bandera para saber si la generación terminó
        let imageUrl = ''; // Donde se guardará la URL de la imagen generada

        // Bucle de espera hasta que la imagen esté lista
        while (!finished) {
            await new Promise(res => setTimeout(res, 3000)); // Espera 3 segundos antes de cada chequeo

            // Consultar el estado de la generación con el ID obtenido antes
            const check = await fetch(`https://stablehorde.net/api/v2/generate/check/${data.id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Client-Agent': 'unknown:0:unknown'
                }
            });

            const resultcheck = await check.json(); // Parsear la respuesta del estado
            //  accedo al valor de finished utilizaando result.finished   .

            // si result.finished es igual a 1 significa que la generación terminó.
            if (resultcheck.finished == 1) {// Si la generación terminó...
        
                
                finished = true;

                const status = await fetch(`https://stablehorde.net/api/v2/generate/status/${data.id}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Client-Agent': 'unknown:0:unknown'
                    }
                });

                const resultstatus = await status.json(); // se parsea la solicitud http en formato json y se obrine el arreglo generations 
                                                          // del cual está el valor de la url de la imagen

                // Verificamos que haya al menos una imagen generada
                if (resultstatus.generations && resultstatus.generations.length > 0) {
                    imageUrl = resultstatus.generations[0].img; // Guardamos la URL de la imagen
                    console.log("Imagen generada:", imageUrl); // Mostramos la URL en consola
                    return imageUrl; // Devolvemos la URL como resultado de la función
                } else {
                    throw new Error("No se generó ninguna imagen"); // Error si no hay imagen
                }
            } else {
                if (resultcheck.processing == 1) {
                    console.log("Estamos trabajando en su pedido...");
                }
                else if (resultcheck.restarted == 1) {
                    console.log("Tuvimos un problema, estamos trabando de nuevo en ello...");
                }
                else if (resultcheck.waiting == 1) {
                    console.log("No hay ningún trabajador disponible, espere unos segundos más...");
                }
            }
            
        }
    } catch (error) {
        // Captura y muestra cualquier error ocurrido en el proceso
        console.error("Error generating or uploading image:", error);
        throw error;
    }
}

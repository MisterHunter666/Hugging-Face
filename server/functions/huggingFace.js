import * as dotenv from 'dotenv';
dotenv.config();


export async function generate(prompt) {
    try {
        console.log("Prompt recibido:", prompt);

        const response = await fetch('https://stablehorde.net/api/v2/generate/async', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
                'Client-Agent': 'unknown:0:unknown', 
                'apikey': `${process.env.AIHORDE_API_KEY}` 
            },
            body: JSON.stringify({ prompt: `${prompt}` }) 
        });

        const data = await response.json(); 

        let finished = false; 
        let imageUrl = ''; 

        while (!finished) {
            await new Promise(res => setTimeout(res, 3000)); 

            const check = await fetch(`https://stablehorde.net/api/v2/generate/check/${data.id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Client-Agent': 'unknown:0:unknown'
                }
            });

            const resultcheck = await check.json(); 

            if (resultcheck.finished == 1) {
        
                
                finished = true;

                const status = await fetch(`https://stablehorde.net/api/v2/generate/status/${data.id}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Client-Agent': 'unknown:0:unknown'
                    }
                });

                const resultstatus = await status.json(); 

                if (resultstatus.generations && resultstatus.generations.length > 0) {
                    imageUrl = resultstatus.generations[0].img; 
                    console.log("Imagen generada:", imageUrl); 
                    return imageUrl; 
                } else {
                    throw new Error("No se generó ninguna imagen"); 
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
        console.error("Error generating or uploading image:", error);
        throw error;
    }
}

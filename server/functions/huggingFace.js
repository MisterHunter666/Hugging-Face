import * as dotenv from 'dotenv';
import { InferenceClient } from "@huggingface/inference";

const inference = new InferenceClient(process.env.HUGGING_FACE_TOKEN);
dotenv.config();

// Función para generar imágenes usando Hugging Face y cargar en imgBB
export async function generate(prompt) {
    try { 
        console.log("Prompt received:", prompt);

        // Generar imagen desde Hugging Face
        
        const response =  await inference.textToImage({
             provider: "replicate",
             model:"black-forest-labs/Flux.1-dev",
             inputs: prompt
         })

         console.log("Resultado de   await inference.textToImage  : ", response); // Aquí ves lo que devuelve

        if (!response) {
            throw new Error("Error connecting to the Hugging Face API");
        }

        //const imageBlob = await response.blob();

        // Subir imagen a imgBB
        const formData = new FormData();
        formData.append("image", response, "generatedImage.png");
        const imgbbResponse = await fetch(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            {
                method: "POST",
                body: formData,
            }
        );

        const imgbbResult = await imgbbResponse.json();

        if (!imgbbResult.success || !imgbbResult.data.url) {
            console.error("ImgBB response:", imgbbResult);
            throw new Error("Error uploading image to imgBB");
        }

        console.log("Image URL:", imgbbResult.data.url);
        return imgbbResult.data.url; // Retornar la URL de la imagen alojada
    } catch (error) {
        console.error("Error generating or uploading image:", error);
        throw error;
    }
}

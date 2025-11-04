import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(url, key);

export default function uploadFile(file){
    return new Promise((resolve, reject) => {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;

        supabase.storage
            .from("restaurant-images")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false,
            })
            .then(() => {
                const publicKey = supabase.storage.from("restaurant-images").getPublicUrl(fileName);
                resolve(publicKey);
            })
            .catch((error) => {
                reject(error);
            });
    })
}



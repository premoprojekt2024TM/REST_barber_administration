import {z} from "zod"

// Felhasználói adatokat validáló séma, nem engedi null vagy üres értékeket
export const userSchema = z.object({
  email: z.string().email().min(1, { message: "Email nem lehet üres" }),  
  password: z.string().min(6, { message: "Minimum 6 karakter hosszúság" }).min(1, { message: "Jelszó nem lehet üres" }), 
});



// Bolt adatokat validáló séma
export const storeSchema = z.object({
    storename: z.string().min(1, { message: "A bolt neve nem lehet üres" }),
    zip: z.number().int().gte(1000, { message: "A postai irányítószámnak 4 számjegyűnek kell lennie" }).lt(10000, { message: "A postai irányítószámnak 4 számjegyűnek kell lennie" }),
    region: z.string().min(1, { message: "A régió nem lehet üres" }),
  });
  


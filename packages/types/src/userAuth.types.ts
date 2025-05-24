import { z } from "zod";

export const userAuthSchema = z.object({
    email: z.string().email(),
    imgUrl: z.string(),
    name: z.string(),
    userId: z.string(),
})

export type userAuth = z.infer<typeof userAuthSchema>
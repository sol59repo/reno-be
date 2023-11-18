import { z } from "zod";


exports.logInScehma = z.object({
    ID: z.string({
        required_error: "ID is required",
        invalid_type_error: "Must be string",
    }),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Must be string",
    }).min(8),
});

exports.deleteAccountSchema = z.object({
    id: z.string().refine(async (id) => {
        return true;
    })
})

exports.updateAccountSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    // email: z.string().email(),
    // password: z.string(),
    // confirm_password: z.string(),
});
import { z } from "zod";


exports.consumableSchema = z.object({
    qty: z.string({
        required_error: "qty is required",
    }),
    itemName: z.string({
        required_error: "itemName is required",
    }),
    addedBy: z.string({
        required_error: "addedBy is required",
    }),
    itemCode: z.string({
        required_error: "itemCode is required",
    }),
});

exports.consumableUpdateSchema = z.object({
    itemName: z.string({
        required_error: "itemName is required",
    }),
    qty: z.string({
        required_error: "qty is required",
    }),
    count: z.string({
        required_error: "count is required",
    }),
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
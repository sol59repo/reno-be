import { z } from "zod";


exports.employeeScema = z.object({
    gender: z.string({
        required_error: "gender is required",
        invalid_type_error: "Must be string",
    }),
    birthdate: z.string({
        required_error: "birthdate is required",
        invalid_type_error: "Must be string",
    }),
    firstname: z.string({
        required_error: "firstname is required",
        invalid_type_error: "Must be string",
    }),
    lastname: z.string({
        required_error: "lastname is required",
        invalid_type_error: "Must be string",
    }),
    address: z.string({
        required_error: "address is required",
        invalid_type_error: "Must be string",
    }),
    ID: z.string({
        required_error: "ID is required",
        invalid_type_error: "Must be string",
    }),
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Must be string",
    }).min(8),
    
    email: z.string({
        required_error: "email is required",
        invalid_type_error: "Must be string",
    }).email(),
    usertype: z.string({
        required_error: "usertype is required",
        invalid_type_error: "Must be string",
    }),
});

exports.employeeUpdateInfoScema = z.object({
    zoomLink: z.string({
        required_error: "zoomLink is required",
        invalid_type_error: "Must be string",
    }),
    Birthdate: z.string({
        required_error: "Birthdate is required",
        invalid_type_error: "Must be string",
    }),
    Firstname: z.string({
        required_error: "Firstname is required",
        invalid_type_error: "Must be string",
    }),
    Lastname: z.string({
        required_error: "Lastname is required",
        invalid_type_error: "Must be string",
    }),
    Address: z.string({
        required_error: "Address is required",
        invalid_type_error: "Must be string",
    }),
    Email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Must be string",
    }).email(),
    fkUsercount: z.string({
        required_error: "fkUsercount is required",
        invalid_type_error: "Must be string",
    })
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
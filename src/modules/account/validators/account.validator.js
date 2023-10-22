import { z } from "zod";


exports.createAccountSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    password: z.string(),
    // confirm_password: z.string(),
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

    // .refine((data) => data.password === data.confirm_password, {
    //     message: "confirm_password field must have the same value as the password field",
    //     path: ["confirm_password"], // path of error
    // });


// exports.updateAccountSchema = [
//     check('username')
//         .option  al()
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
//     check('first_name')
//         .optional()
//         .isAlpha()
//         .withMessage('Must be only alphabetical chars')
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
//     check('last_name')
//         .optional()
//         .isAlpha()
//         .withMessage('Must be only alphabetical chars')
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
//     check('email')
//         .optional()
//         .isEmail()
//         .withMessage('Must be a valid email')
//         .normalizeEmail(),
//     check('role')
//         .optional()
//         .isIn([Role.Admin, Role.SuperUser])
//         .withMessage('Invalid Role type'),
//     check('password')
//         .optional()
//         .notEmpty()
//         .isLength({ min: 6 })
//         .withMessage('Password must contain at least 6 characters')
//         .isLength({ max: 10 })
//         .withMessage('Password can contain max 10 characters')
//         .custom((value, { req }) => !!req.body.confirm_password)
//         .withMessage('Please confirm your password'),
//     check('confirm_password')
//         .optional()
//         .custom((value, { req }) => value === req.body.password)
//         .withMessage('confirm_password field must have the same value as the password field'),
//     check('age')
//         .optional()
//         .isNumeric()
//         .withMessage('Must be a number'),
//     body()
//         .custom(value => {
//             return !!Object.keys(value).length;
//         })
//         .withMessage('Please provide required field to update')
//         .custom(value => {
//             const updates = Object.keys(value);
//             const allowUpdates = ['username', 'password', 'confirm_password', 'email', 'role', 'first_name', 'last_name', 'age'];
//             return updates.every(update => allowUpdates.includes(update));
//         })
//         .withMessage('Invalid updates!')
// ];



// exports.updateAccountSchema = [
//     check('first_name')
//         .optional()
//         .isAlpha()
//         .withMessage('Must be only alphabetical chars')
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
//     check('last_name')
//         .optional()
//         .isAlpha()
//         .withMessage('Must be only alphabetical chars')
//         .isLength({ min: 3 })
//         .withMessage('Must be at least 3 chars long'),
// ];
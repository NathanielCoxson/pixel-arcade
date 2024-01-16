'use server';
import prisma from "./prisma";
import { z } from 'zod';
const bcrypt = require('bcrypt');

const NewUserFormSchema = z.object({
    username: z.string(),
    password: z.string(),
    retypedPassword: z.string(),
    message: z.string(),
});

const CreateNewUser = NewUserFormSchema.omit({ message: true });

export async function createUser(prevState: any, formData: FormData) {
    const saltRounds = 12;

    // Extract form data
    const { username, password, retypedPassword } = CreateNewUser.parse({
        username: formData.get('username'),
        password: formData.get('password'),
        retypedPassword: formData.get('retypedPassword'),
    });

    if (password !== retypedPassword) {
        return {
            ...prevState,
            message: 'Passwords do not match'
        }
    }

    // Insert into DB
    const hashedPassword = await bcrypt.hash(password, saltRounds);  
    const user = await prisma.users.create({
        data: {
            username: username,
            password: hashedPassword,
        },
    });

    console.log(user);
    return {
        ...prevState,
        message: 'Success!'
    };
}
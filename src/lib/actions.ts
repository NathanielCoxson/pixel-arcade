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
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    // Extract form data
    const { username, password, retypedPassword } = CreateNewUser.parse({
        username: formData.get('username'),
        password: formData.get('password'),
        retypedPassword: formData.get('retypedPassword'),
    });

    const userByUsername = await prisma.users.findFirst({
        where: { username },
    });
    if (userByUsername) {
        return {
            ...prevState,
            message: 'That username is taken'
        }
    }
    if (password !== retypedPassword) {
        return {
            ...prevState,
            message: 'Passwords do not match',
        }
    }
    if (!passwordRegex.test(password)) {
        return {
            ...prevState,
            message: 'Password too weak',
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

    console.log('Created user:\n', user);
    return {
        ...prevState,
        message: 'Success!'
    };
}
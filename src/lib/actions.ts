'use server';
import prisma from "./prisma";
const bcrypt = require('bcrypt');

export async function createUser(prevState: any, formData: FormData) {
    const saltRounds = 12;
    const rawData = {
        username: String(formData.get('username')),
        password: String(formData.get('password')),
    }

    const hashedPassword = await bcrypt.hash(rawData.password, saltRounds);  

    const user = await prisma.users.create({
        data: {
            username: rawData.username,
            password: hashedPassword,
        },
    });

    console.log(user);
    return {
        ...prevState,
        message: 'Success!'
    };
}
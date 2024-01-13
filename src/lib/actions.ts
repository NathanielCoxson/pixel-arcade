'use server';
import prisma from "./prisma";

export async function createUser(prevState: any, formData: FormData) {
    const rawData = {
        username: String(formData.get('username')),
        password: String(formData.get('password')),
    }
    const user = await prisma.users.create({
        data: {
            username: rawData.username,
            password: rawData.password,
        },
    });

    console.log(user);
    return {
        ...prevState,
        message: 'Success!'
    };
}
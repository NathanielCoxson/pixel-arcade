'use server';
import prisma from "./prisma";
import { z } from 'zod';
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { MinesweeperScore } from "@/app/types";

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

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', { username: formData.get('username'), password: formData.get('password') });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function getMinesweeperScores(uid: string | undefined) {
    if (!uid) return [];
    try {
        const scores = await prisma.minesweeperScores.findMany({ where: { uid } });
        return scores;
    } catch (error) {
        throw error;
    }
}

export async function createMinesweeperScore(score: any) {
    try {
        const newScore = await prisma.minesweeperScores.create({ data: score });
        console.log("Created new minesweeper score: ", newScore);
    } catch(error) {
        console.log(error);
        throw error;
    }
}

export async function createSnakeScore(score: any) {
    try {
        const newScore = await prisma.snakeScores.create({ data: score });
        console.log("Created new snake score: ", newScore);
    } catch(error) {
        console.log(error);
        throw error;
    }
}
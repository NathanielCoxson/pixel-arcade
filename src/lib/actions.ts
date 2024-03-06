'use server';
import prisma from "./prisma";
import { z } from 'zod';
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const NewUserFormSchema = z.object({
    username: z.string(),
    password: z.string().regex(passwordRegex, { message: 'Password is too weak' }),
    retypedPassword: z.string(),
})
    .refine(
        (schema) => schema.password === schema.retypedPassword,
        { message: 'Passwords do not match' }
    );

/**
 * Server action that creates a new user in the database given a new user object. 
 * @param prevState 
 * @param formData 
 * @returns 
 */
export async function createUser(prevState: any, formData: FormData) {
    const saltRounds = 12;

    // Extract form data
    const validatedFields = NewUserFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
        retypedPassword: formData.get('retypedPassword'),
    });
    if (!validatedFields.success) {
        return {
            ...prevState,
            message: validatedFields.error.errors[0].message,
        }
    }

    // Check if user already exists
    const { username, password } = validatedFields.data;
    const userByUsername = await prisma.users.findFirst({ where: { username }, });
    if (userByUsername) {
        return {
            ...prevState,
            message: 'That username is taken'
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

/**
 * Login server action that authenticates a user given their password and username
 * as credentials. 
 * @param prevState 
 * @param formData 
 * @returns 
 */
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

/**
 * Returns an array of minesweeper score objects for the user with the given username. 
 * @param {string} username 
 * @returns an array of minesweeper scores 
 */
export async function getMinesweeperScores(username: string | undefined) {
    if (!username) return [];
    try {
        const user = await prisma.users.findFirst({ where: { username } });
        if (!user) return [];

        const scores = await prisma.minesweeperScores.findMany({ where: { uid: user.id } });
        return scores;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Creates a new minesweeper score in the database.
 * @param {MinesweeperScore} score 
 */
export async function createMinesweeperScore(score: any) {
    try {
        const newScore = await prisma.minesweeperScores.create({ data: score });
        console.log("Created new minesweeper score: ", newScore);
    } catch(error) {
        console.log(error);
        throw error;
    }
}

/**
 * Creates a new snake score in the database. 
 * @param {SnakeScore} score 
 */
export async function createSnakeScore(score: any) {
    try {
        const newScore = await prisma.snakeScores.create({ data: score });
        console.log("Created new snake score: ", newScore);
    } catch(error) {
        console.log(error);
        throw error;
    }
}

/**
 * Returns a list of the snake score objects for the user with the given uid. 
 * @param {string} username 
 * @returns a list of scores 
 */
export async function getSnakeScores(username: string | undefined) {
    if (!username) return [];
    try {
        const user = await prisma.users.findFirst({ where: { username } });
        if (!user) return [];

        const scores = await prisma.snakeScores.findMany({ where: { uid: user.id } });
        return scores;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * Returns an object containing the top 10 minesweeper scores
 * for each difficulty, sorted by time from least to greatest.
 * Type will be: {
 *  easy: [
 *      {
 *          id: '498a09a7-ff29-4638-bebc-ffd67453074f',
 *          uid: 'e9e96001-75ec-4b53-82d1-861700a29159',
 *          time: 82,
 *          numMines: 25,
 *          timestamp: 2024-02-09T11:24:38.050Z,
 *          win: true,
 *          numCleared: 75,
 *          numRows: 10,
 *          numCols: 10,
 *          users: {
 *          id: 'e9e96001-75ec-4b53-82d1-861700a29159',
 *          username: 'ncoxson',
 *          password: '$2b$12$0e3Qb2RwGf13LVn4/L.xj.m7btIj2Dpx6./qi2kkPT5nViLdlNegG'
 *      }
 *  ],
 *  medium: [],
 *  hard: [],
 * }
 */
export async function getMinesweeperLeaderboard() {
    try {
        // TODO Change numMines to new difficulty identifier when database schema is changed.
        const easy = await prisma.minesweeperScores.findMany({
            where: {
                difficulty: "Easy",
                win: true,
            },
            orderBy: [{ time: 'asc' }],
            include: {
                users: true
            },
            take: 5 
        });
        const medium = await prisma.minesweeperScores.findMany({
            where: {
                difficulty: "Medium",
                win: true,
            },
            orderBy: [{ time: 'asc' }],
            include: {
                users: true
            },
            take: 5 
        });
        const hard = await prisma.minesweeperScores.findMany({
            where: {
                difficulty: "Hard",
                win: true,
            },
            orderBy: [{ time: 'asc' }],
            include: {
                users: true
            },
            take: 5 
        });
        return { easy, medium, hard };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUsersWhereUsernameStartsWith(username: string) {
    try {
        const users = await prisma.users.findMany({ 
            select: {
                id: true,
                username: true,
            },
            where: { 
                username: { startsWith: username } 
            },
            take: 10,
        });
        return users;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createFriendRequest(senderId: string | undefined, receiverId: string): Promise<{ success: boolean, message: string }> {
    if (!senderId) return { success: false, message: "User is not logged in." };
    try {
        const pending_sender_requests = await prisma.friendRequests.findMany({ where: { senderId, receiverId } });
        if (pending_sender_requests.length > 0) return { success: false, message: "You have already sent a friend request to that user." };
        console.log(pending_sender_requests);

        const pending_receiver_requests = await prisma.friendRequests.findMany({ where: { senderId: receiverId, receiverId: senderId } });
        if (pending_receiver_requests.length > 0) return { success: false, message: "You already have a pending friend request from that user." };

        await prisma.friendRequests.create({ data: { senderId, receiverId } });
        return { success: true, message: "Success" };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function navigate(url: string) {
    redirect(url);
}

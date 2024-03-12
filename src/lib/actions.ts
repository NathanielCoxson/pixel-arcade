'use server';
import prisma from "./prisma";
import { z } from 'zod';
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { FriendRequest, Response } from "@/app/types";
import { auth } from "@/auth";

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

export async function validateUserByID(id: string): Promise<boolean> {
    const session = await auth();
    const correctUser = session?.user?.id === id;
    if (!session || !correctUser) return false;
    return true;
}

export async function validateUserByUsername(username: string): Promise<boolean> {
    const session = await auth();
    const correctUser = session?.user?.name === username;
    if (!session || !correctUser) return false;
    return true;
}

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
export async function createMinesweeperScore(score: any): Promise<Response> {
    if (!await validateUserByID(score.uid)) { 
        return { success: false, message: "No user logged in", data: null };
    }

    try {
        const newScore = await prisma.minesweeperScores.create({ data: score });
        console.log("Created new minesweeper score: ", newScore);
        return { success: true, message: undefined, data: newScore };
    } catch(error) {
        console.log(error);
        return { success: false, message: "Failed to create new minesweeper score.", data: null };
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

        const pending_receiver_requests = await prisma.friendRequests.findMany({ where: { senderId: receiverId, receiverId: senderId } });
        if (pending_receiver_requests.length > 0) return { success: false, message: "You already have a pending friend request from that user." };

        const friend = await prisma.friends.findFirst({
            where: {
                uid: senderId,
                friendId:  receiverId,
            }
        });
        if (friend) return { success: false, message: "Already friends with that user" };

        await prisma.friendRequests.create({ data: { senderId, receiverId } });
        return { success: true, message: "Success" };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getFriendRequests(username: string | null | undefined): Promise<Response> {
    if (!username) return { success: false, message: "User is not logged in", data: undefined };
    try {
        const friend_requests: FriendRequest[] = (await prisma.friendRequests.findMany({
            include: {
                users_friendRequests_senderIdTousers: { select: { username: true } },
                users_friendRequests_receiverIdTousers: { select: { username: true } },
            },
            where: {
                users_friendRequests_receiverIdTousers: { username }
            }
        })).map((res: any) => {
            return {
                id: res.id,
                senderId: res.senderId,
                receiverId: res.receiverId,
                senderUsername: res.users_friendRequests_senderIdTousers.username,
                receiverUsername: res.users_friendRequests_receiverIdTousers.username,
            }
        });
        return { success: true, message: "", data: friend_requests };
    } catch (error) {
        console.log(error);
        return { success: false, message: "", data: [] };
    }
}

export async function acceptFriendRequest(id: string): Promise<Response> {
    try {
        const friend_request = await prisma.friendRequests.findUnique({ where: { id } });
        if (!friend_request) {
            return { success: false, message: "Couldn't find friend request", data: undefined };
        }

        await prisma.friends.create({
            data: {
                uid: friend_request.receiverId,
                friendId: friend_request.senderId,
            }
        });
        await prisma.friends.create({
            data: {
                uid: friend_request.senderId,
                friendId: friend_request.receiverId,
            }
        });

        await prisma.friendRequests.delete({ where: { id } });
        return { success: true, message: "", data: undefined };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Failed to accept friend request", data: undefined };
    }
}

export async function rejectFriendRequest(id: string): Promise<Response> {
    try {
        await prisma.friendRequests.delete({ where: { id } });
        return { success: true, message: "", data: undefined };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Failed to reject friend request", data: undefined };
    }
}

export async function getFriends(uid: string | undefined): Promise<Response> {
    if (!uid) {
        return { success: false, message: "No user logged in.", data: null};
    }
    if (! await validateUserByID(uid)) {
        return { success: false, message: "User is not logged in.", data: null };
    }

    try {
        const friends = (await prisma.friends.findMany({
            include: {
                users_friends_friendIdTousers: { select: { username: true } }
            },
            where: {
                uid
            }
        }))
        .map((friend: any) => {
            return {
                uid: friend.friendId,
                username: friend.users_friends_friendIdTousers.username
            }
        });
        console.log(friends);
        return { success: true, message: null, data: friends };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Failed to retrieve friends.", data: null };
    }
}

export async function navigate(url: string) {
    redirect(url);
}


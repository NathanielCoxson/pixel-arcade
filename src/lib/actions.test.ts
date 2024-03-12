import * as actions from "./actions";
import { prismaMock } from "./prismaSingleton";

// auth mock
jest.mock("../../auth.ts", () => {
    return {
        __esModule: true,
        auth: jest.fn(() => {
            return { user: { id: '1234' } }
        })
    }
});

describe('createFriendRequest()', () => {
    it('should create a new friend request', async () => {
        prismaMock.friendRequests.findMany.mockResolvedValue([]);
        prismaMock.friends.findFirst.mockResolvedValue(null);

        const result = await actions.createFriendRequest('1234', '4321');
        expect(result.success).toBe(true);
    });
    it('should fail if sender has already sent a request to receiver', async () => {
        prismaMock.friendRequests.findMany.mockResolvedValueOnce([{id: '1234', senderId: '1234', receiverId: '4321'}]);
        prismaMock.friendRequests.findMany.mockResolvedValueOnce([]);

        const result = await actions.createFriendRequest('1234', '4321');
        expect(result.success).toBe(false);
        expect(result.message).toBe("You have already sent a friend request to that user.");
    });
    it('should fail if receiver already has a request from the sender', async () => {
        prismaMock.friendRequests.findMany.mockResolvedValueOnce([]);
        prismaMock.friendRequests.findMany.mockResolvedValueOnce([{id: '1234', senderId: '4321', receiverId: '1234'}]);

        const result = await actions.createFriendRequest('1234', '4321');
        expect(result.success).toBe(false);
        expect(result.message).toBe("You already have a pending friend request from that user.");
    });
    it('should fail if users are already friends', async () => {
        prismaMock.friendRequests.findMany.mockResolvedValue([]);
        prismaMock.friends.findFirst.mockResolvedValueOnce({ id: 'test', uid: '1234', friendId: '4321' });

        const result = await actions.createFriendRequest('1234', '4321');
        expect(result.success).toBe(false);
        expect(result.message).toBe("Already friends with that user");
    });
});

describe('createMinesweeperScore()', () => {
    it('creates a score if the right user is logged in', async () => {
        const result = await actions.createMinesweeperScore({ uid: '1234' });
        expect(result.success).toBe(true);
    });
    it('does not create a score when the wrong user is logged in', async () => {
        const result = await actions.createMinesweeperScore({ uid: '123' });
        expect(result.success).toBe(false);
    });
});

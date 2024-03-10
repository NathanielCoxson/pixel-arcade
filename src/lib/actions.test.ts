import { createFriendRequest } from "./actions";
import { prismaMock } from "./prismaSingleton";

describe('createFriendRequest', () => {
    it('should create a new friend request', async () => {
        prismaMock.friendRequests.findMany.mockResolvedValue([]);
        prismaMock.friends.findFirst.mockResolvedValue(null);

        const result = await createFriendRequest('423d3a97-bdfb-404f-864e-6c213423d10c', '423d3a97-bdfb-404f-864e-6c213423d10c');
        expect(result.success).toBe(true);
    });
});

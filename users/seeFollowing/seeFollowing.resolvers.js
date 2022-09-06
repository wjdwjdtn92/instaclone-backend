import client from "../../client";

const showFollowersCount = 5;

export default {
    Query: {
        seeFollowing: async (_, { username, lastId }) => {
            const ok = await client.user.findUnique({
                where: { username },
                select: { id: true },
            });
            if (!ok) {
                return {
                    ok: false,
                    error: "User not found",
                };
            }
            const following = await client.user
                .findUnique({ where: { username } })
                .following({
                    take: showFollowersCount,
                    skip: lastId ? 1 : 0,
                    ...(lastId && { id: lastId }),
                });
            return {
                ok: true,
                following,
            };
        },
    },
};

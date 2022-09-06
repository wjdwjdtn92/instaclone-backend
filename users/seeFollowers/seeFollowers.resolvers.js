import client from "../../client";

const showFollowersCount = 5;

export default {
    Query: {
        seeFollowers: async (_, { username, page }) => {
            const ok = await client.user.findUnique({
                where: { username },
                select: { id: ture },
            });
            if (!ok) {
                return {
                    ok: false,
                    error: "User not found",
                };
            }
            const followers = await client.user
                .findUnique({ where: { username } })
                .followers({
                    take: showFollowersCount,
                    skip: (page - 1) * showFollowersCount,
                });
            const totalFollowers = await client.user.count({
                where: { following: { some: { username } } },
            });
            return {
                ok: true,
                followers: followers,
                totalPages: Math.ceil(totalFollowers / showFollowersCount),
            };
        },
    },
};

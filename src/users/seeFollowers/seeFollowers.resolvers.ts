import { Resolver, Resolvers } from "../../types";

const showFollowersCount: number = 5;

const resolverFn: Resolver = async (_, { username, page }, { client }) => {
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
}


const resolvers: Resolvers = {
    Query: {
        seeFollowers: resolverFn,
    },
};

export default resolvers;
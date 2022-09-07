
import { Resolver, Resolvers } from "../../types";

const showFollowersCount: number = 5;

const resolverFn: Resolver = async (_, { username, lastId }, { client }) => {
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
}


const resolvers: Resolvers = {
    Query: {
        seeFollowing: resolverFn,
    },
};

export default resolvers;
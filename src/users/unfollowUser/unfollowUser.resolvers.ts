import client from "../../client";
import { Resolver, Resolvers } from "../../types";
import { protectRosolver } from "../users.utils";

const resolverFn: Resolver = async (_, { username }, { loggedInUser }) => {
    const ok = await client.user.findUnique({ where: { username } });
    if (!ok) {
        return {
            ok: false,
            error: "Can`t unfollow user",
        };
    }

    const updatedUser = await client.user.update({
        where: { id: loggedInUser.id },
        data: {
            following: {
                disconnect: {
                    username,
                },
            },
        },
    });
    return {
        ok: true,
    };
};


const resolvers: Resolvers = {
    Mutation: {
        unfollowUser: protectRosolver(resolverFn),
    },
};

export default resolvers;

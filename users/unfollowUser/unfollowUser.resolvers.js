import client from "../../client";
import { protectRosolver } from "../users.utils";

const resolverFn = async (_, { username }, { loggedInUser }) => {
    const followUser = await client.user.findUnique({ where: { username } });
    if (!followUser) {
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

export default {
    Mutation: {
        unfollowUser: protectRosolver(resolverFn),
    },
};

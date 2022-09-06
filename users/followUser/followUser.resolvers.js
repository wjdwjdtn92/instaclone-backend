import client from "../../client";
import { protectRosolver } from "../users.utils";

const resolverFn = async (_, { username }, { loggedInUser }) => {
    const followUser = await client.user.findUnique({ where: { username } });
    if (!followUser) {
        return {
            ok: false,
            error: "That user does not exist.",
        };
    }

    const updatedUser = await client.user.update({
        where: { id: loggedInUser.id },
        data: {
            following: {
                connect: {
                    username,
                },
            },
        },
    });
    console.log(updatedUser);
    return {
        ok: true,
    };
};

export default {
    Mutation: {
        followUser: protectRosolver(resolverFn),
    },
};

import { Resolver, Resolvers } from "../../types";
import { protectRosolver } from "../users.utils";

const resolverFn: Resolver = async (
    _,
    { username }, { loggedInUser, client },
) => {
    console.log("여기")
    const ok = await client.user.findUnique({ where: { username } });
    if (!ok) {
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

const resolvers: Resolvers = {
    Mutation: {
        followUser: protectRosolver(resolverFn),
    },
};

export default resolvers;

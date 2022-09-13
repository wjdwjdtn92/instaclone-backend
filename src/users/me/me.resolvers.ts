import { Resolver, Resolvers } from "../../types";
import { protectRosolver } from "../users.utils";

const resolverFn: Resolver = async (
    _,
    __,
    { loggedInUser, client },
) => {
    return client.user.findUnique({
        where: {
            id: loggedInUser.id,
        },
    })
};

const resolvers: Resolvers = {
    Query: {
        me: protectRosolver(resolverFn),
    },
};

export default resolvers;

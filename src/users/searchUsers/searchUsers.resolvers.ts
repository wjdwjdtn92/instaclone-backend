
import { Resolver, Resolvers } from "../../types";

const resolverFn: Resolver = async (_, { keyword }, { client }) => {
    const users = await client.user.findMany({
        where: {
            username: {
                startsWith: keyword.toLowerCase(),
            },
        },
    });
    return users;
}

const resolvers: Resolvers = {
    Query: {
        searchUsers: resolverFn,
    },
};

export default resolvers;

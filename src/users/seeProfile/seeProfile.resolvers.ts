import { User } from '@prisma/client';
import { Resolver, Resolvers } from './../../types';

const resolverFn: Resolver = (_, { username }, { client }) => {
    return client.user.findUnique({
        where: {
            username,
        },
        include: {
            following: true,
            followers: true,
        },
    })
}
const resolvers = {
    Query: {
        seeProfile: resolverFn,
    },
};

export default resolvers;
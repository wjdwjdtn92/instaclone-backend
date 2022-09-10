import { Resolver, Resolvers } from '../../types';
import { protectRosolver } from '../../users/users.utils';

const resolverFn: Resolver = async (_, __, { loggedInUser, client }) => {
    return client.room.findMany({
        where: {
            users: {
                some: {
                    id: loggedInUser.id
                }
            }
        }
    })
}

const resolvers: Resolvers = {
    Query: {
        seeRooms: protectRosolver(resolverFn),
    },
};

export default resolvers;
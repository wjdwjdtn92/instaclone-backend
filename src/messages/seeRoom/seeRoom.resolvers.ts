import { Resolver, Resolvers } from '../../types';
import { protectRosolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
    _,
    { id },
    { loggedInUser, client }
) => {
    return client.room.findFirst({
        where: {
            id,
            users: {
                some: {
                    id: loggedInUser.id,
                }
            }
        }
    })
}

const resolvers: Resolvers = {
    Query: {
        seeRooms: protectRosolver(resolverFn),
    }
};

export default resolvers;
import { Resolver, Resolvers } from '../../types';
import { protectRosolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
    _,
    { id },
    { loggedInUser, client }
) => {
    const result = await client.room.findFirst({
        where: {
            id,
            users: {
                some: {
                    id: loggedInUser.id,
                }
            }
        }
    })

    console.log(result);

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
        seeRoom: protectRosolver(resolverFn),
    }
};

export default resolvers;
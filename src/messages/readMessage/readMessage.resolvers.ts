import { Resolver, Resolvers } from '../../types';
import { protectRosolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
    _,
    { id },
    { loggedInUser, client }
) => {
    const message = await client.message.findFirst({
        where: {
            id,
            userId: {
                not: loggedInUser.id
            },
            room: {
                users: {
                    some: {
                        id: loggedInUser.id
                    }
                }
            }
        },
        select: {
            id: true,
        }
    })
    if (!message) {
        return {
            ok: false,
            error: "message not found",
        }
    }
    await client.message.update({
        where: {
            id
        },
        data: {
            read: true,
        }
    })
    return {
        ok: true
    }
}

const resolvers: Resolvers = {
    Mutation: {
        readMessage: protectRosolver(resolverFn),
    }
};

export default resolvers;
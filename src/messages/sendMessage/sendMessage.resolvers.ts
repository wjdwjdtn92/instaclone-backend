import { Room } from '@prisma/client';
import { NEW_MESSAGE } from '../../../constant';
import pubsub from '../../../pubsub';
import { Resolver, Resolvers } from '../../types';
import { protectRosolver } from '../../users/users.utils';

const resolverFn: Resolver = async (
    _,
    { payload, roomId, userId },
    { loggedInUser, client }
) => {
    let room: any = null

    if (!userId && !roomId) {
        return {
            ok: false,
            error: "userId or roomId is required.",
        }
    }

    if (userId) {
        const user = client.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
            }
        })
        if (!user) {
            return {
                ok: false,
                error: "This user does not exist.",
            }
        }
        room = await client.room.create({
            data: {
                users: {
                    connect: [
                        {
                            id: userId
                        },
                        {
                            id: loggedInUser.id
                        }
                    ]
                }
            }
        })
    }

    if (roomId) {
        room = await client.room.findUnique({
            where: {
                id: roomId,
            },
            select: {
                id: true,
            }
        })
        if (!room) {
            return {
                ok: false,
                error: "This room does not exist.",
            }
        }
    }

    const message = await client.message.create({
        data: {
            payload,
            room: {
                connect: {
                    id: room.id
                }
            },
            user: {
                connect: {
                    id: loggedInUser.id,
                }
            }
        }
    })
    pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });

    return {
        ok: true,
    }
}

const resolvers: Resolvers = {
    Mutation: {
        sendMessage: protectRosolver(resolverFn),
    },
};

export default resolvers;
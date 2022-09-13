import pubsub from '../../../pubsub';
import { NEW_MESSAGE } from '../../../constant';
import { Resolver, Resolvers } from '../../types';
import { withFilter } from 'graphql-subscriptions';
import client from "../../client";

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
    Subscription: {
        roomUpdates: {
            subscribe: async (root, args, context, info) => {
                const id: number = args.id
                const room = await client.room.findFirst({
                    where: {
                        id: args.id,
                        users: {
                            some: {
                                id: context.loggedInUser.id
                            }
                        }
                    },
                    select: {
                        id: true
                    }
                })
                if (!room) {
                    throw new Error("You Shell not see this room.")
                }
                return withFilter(
                    () => pubsub.asyncIterator(NEW_MESSAGE),
                    async ({ roomUpdates }, { id }, { loggedInUser }) => {
                        if (roomUpdates.roomId === id) {
                            const room = await client.room.findFirst({
                                where: {
                                    id,
                                    users: {
                                        some: {
                                            id: loggedInUser.id,
                                        },
                                    },
                                },
                                select: {
                                    id: true,
                                },
                            });
                            if (!room) {
                                return false;
                            }
                        }
                        return true;
                    },
                )(root, args, context, info);
            }
        },
    }
}

export default resolvers;
import { Resolver, Resolvers } from '../types';
import client from "../client";

const resolvers: Resolvers = {
    Room: {
        user: ({ id }) =>
            client.room.findUnique({
                where: {
                    id
                }
            }).users(),
        message: ({ id }) =>
            client.message.findMany({
                where: {
                    roomId: id
                }
            }),
        unreadTotal: ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return 0
            }

            return client.message.count({
                where: {
                    read: false,
                    roomId: id,
                    user: {
                        id: {
                            not: loggedInUser.id,
                        }
                    }
                }
            })
        }
    }
}

export default resolvers
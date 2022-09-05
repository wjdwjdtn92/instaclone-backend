import dotenv from "dotenv";
require("dotenv").config();

import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT || 4000;
const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
        return {
            loggedInUser: await getUser(req.headers.token),
        };
    },
});

server.listen(PORT).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

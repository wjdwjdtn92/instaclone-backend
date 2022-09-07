import dotenv from "dotenv";
require("dotenv").config();

import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import express from "express";
import logger from "morgan";
import client from "./client";
import { graphqlUploadExpress } from "graphql-upload";


const PORT = process.env.PORT || 4000;

const startServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            console.log("sssssss:", await getUser(req.headers.token))
            return {
                loggedInUser: await getUser(req.headers.token),
                client,
            };
        },
    });

    await server.start();

    const app = express();
    app.use(graphqlUploadExpress(), logger("tiny"));
    server.applyMiddleware({ app });
    app.listen({ port: PORT }, () => {
        console.log(`🚀Server is running on http://localhost:${PORT} ✅`);
    });
};
startServer();

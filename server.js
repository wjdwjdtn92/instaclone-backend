import dotenv from "dotenv";
require("dotenv").config();

import { ApolloServer, gql } from "apollo-server";
import schema from "./schema";

const PORT = process.env.PORT || 4000;
const server = new ApolloServer({
    schema,
});

server.listen(PORT).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

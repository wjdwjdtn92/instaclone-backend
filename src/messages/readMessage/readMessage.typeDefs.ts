import { gql } from "apollo-server";

export default gql`
    type readMessageResult {
        ok: Boolean!
        error: String
    }

    type Mutation {
        readMessage(id: Int!): readMessageResult }
`;

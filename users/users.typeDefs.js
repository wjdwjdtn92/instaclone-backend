import { gql } from "apollo-server";

export default gql`
    scalar Upload

    type User {
        id: Int!
        firstName: String!
        lastName: String
        username: String!
        email: String!
        bio: String
        avatar: Upload
        createdAt: String!
        updatedAt: String!
    }
`;

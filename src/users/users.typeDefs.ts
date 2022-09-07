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
        avatar: String
        following: [User]
        followers: [User]
        createdAt: String!
        updatedAt: String!
        totalFollowing: Int!
        totalFollowers: Int!
        isMe: Boolean!
        isFollowing: Boolean!
    }
`;

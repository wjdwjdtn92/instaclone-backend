import { gql } from "apollo-server";

export default gql`
    type sendRoomsResult {
        ok: Boolean!
        error: String
    }

    type Mutation {
        sendRooms(payload:String!, roomId:Int, userId:Int): sendRoomsResult
    }
`;

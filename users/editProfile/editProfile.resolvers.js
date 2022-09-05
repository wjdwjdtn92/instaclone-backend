import client from "../../client";
import bcrypt from "bcrypt";
import { protectRosolver } from "../users.utils";

const resolverFn = async (
    _,
    { firstName, lastName, username, email, password: newPasswords },
    { loggedInUser }
) => {
    let hashPassword = null;
    if (newPasswords) {
        hashPassword = await bcrypt.hash(newPasswords, 10);
    }

    const updatedUser = await client.user.update({
        where: {
            id: loggedInUser.id,
        },
        data: {
            firstName,
            lastName,
            username,
            email,
            ...(hashPassword && { password: hashPassword }),
        },
    });

    if (updatedUser.id) {
        return {
            ok: true,
        };
    } else {
        return {
            ok: false,
            error: "Could not update profile.",
        };
    }
};

export default {
    Mutation: {
        editProfile: protectRosolver(resolverFn),
    },
};

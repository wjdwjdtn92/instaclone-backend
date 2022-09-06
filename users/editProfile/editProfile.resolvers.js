import { createWriteStream } from "fs";
import client from "../../client";
import bcrypt from "bcrypt";
import { protectRosolver } from "../users.utils";
import { GraphQLUpload } from "graphql-upload";

const resolverFn = async (
    _,
    {
        firstName,
        lastName,
        username,
        email,
        password: newPasswords,
        bio,
        avatar,
    },
    { loggedInUser }
) => {
    // 파일저장
    let avatarUrl = null;
    if (avatar) {
        const { filename, createReadStream } = await avatar;
        const storeFileName = `${loggedInUser.id}-${Date.now()}-${filename}`;
        const readStream = createReadStream();
        const wirteStream = createWriteStream(
            process.cwd() + "/uploads/" + storeFileName
        );
        readStream.pipe(wirteStream);
        avatarUrl = `http://localhost4000/static/${storeFileName}`;
    }

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
            bio,
            ...(hashPassword && { password: hashPassword }),
            ...(avatarUrl && { avatar: avatarUrl }),
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
    Upload: GraphQLUpload,

    Mutation: {
        editProfile: protectRosolver(resolverFn),
    },
};

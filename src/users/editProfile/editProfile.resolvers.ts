import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import { protectRosolver } from "../users.utils";
import { GraphQLUpload } from "graphql-upload";
import { Resolver, Resolvers } from "../../types";

const resolverFn: Resolver = async (
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
    { loggedInUser, client }
) => {
    // 파일저장
    let avatarUrl: string | null = null;
    if (avatar) {
        const { filename, createReadStream } = await avatar;
        const storeFileName = `${loggedInUser.id}-${Date.now()}-${filename}`;
        const readStream = createReadStream();
        const wirteStream = createWriteStream(
            process.cwd() + "/uploads/" + storeFileName
        );
        readStream.pipe(wirteStream);
        avatarUrl = `http://localhost:4000/static/${storeFileName}`;
    }

    let hashPassword: string | null = null;
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

const resolvers: Resolvers = {
    Upload: GraphQLUpload,

    Mutation: {
        editProfile: protectRosolver(resolverFn),
    }
};


export default resolvers



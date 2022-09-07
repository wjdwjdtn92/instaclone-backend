import bcrypt from "bcrypt";
import { Resolver, Resolvers } from "../../types";

const resolverFn: Resolver = async (
    _,
    { firstName, lastName, username, email, password },
    { client }
) => {
    try {
        const existingUser = await client.user.findFirst({
            where: {
                OR: [
                    {
                        username,
                    },
                    {
                        email,
                    },
                ],
            },
        });
        if (existingUser) {
            throw new Error("This username/email is already taken");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await client.user.create({
            data: {
                firstName,
                lastName,
                username,
                email,
                password: hashPassword,
            },
        });
        return {
            ok: true,
        };
    } catch (e) {
        return {
            ok: false,
            error: "can`t create account.",
        };
    }
}

const resolvers: Resolvers = {
    Mutation: {
        createAccount: resolverFn
    }
}

export default resolvers

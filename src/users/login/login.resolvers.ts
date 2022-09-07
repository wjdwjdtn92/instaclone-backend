import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resolver, Resolvers } from "../../types";

const resolverFn: Resolver = async (
    _,
    { username, password },
    { client }
) => {
    const user = await client.user.findFirst({ where: { username } });
    if (!user) {
        return {
            ok: false,
            error: "User not found.",
        };
    }
    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
        return {
            ok: false,
            error: "Incorrect password.",
        };
    }
    const SECRET_KEY: string = process.env.SECRET_KEY ?? ""
    const token = await jwt.sign(
        {
            id: user.id,
            // exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        SECRET_KEY
    );
    return {
        ok: true,
        token: token,
    };
}
const resolvers: Resolvers = {
    Mutation: {
        login: resolverFn,
    },
};

export default resolvers;
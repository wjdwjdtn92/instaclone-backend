import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
    Mutation: {
        login: async (_, { username, password }) => {
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
            const token = await jwt.sign(
                {
                    id: user.id,
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                },
                process.env.SECRET_KEY
            );
            return {
                ok: true,
                token: token,
            };
        },
    },
};

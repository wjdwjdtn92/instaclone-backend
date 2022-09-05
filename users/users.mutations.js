import client from "../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
    Mutation: {
        createAccount: async (
            _,
            { firstName, lastName, username, email, password }
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

                return client.user.create({
                    data: {
                        firstName,
                        lastName,
                        username,
                        email,
                        password: hashPassword,
                    },
                });
            } catch (e) {
                return e;
            }
        },
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

import client from "../../client";
import bcrypt from "bcrypt";

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
        },
    },
};

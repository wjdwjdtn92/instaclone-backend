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

                return client.user.create({
                    ok: true,
                });
            } catch (e) {
                return {
                    ok: false,
                    error: "Can`t create account.",
                };
            }
        },
    },
};

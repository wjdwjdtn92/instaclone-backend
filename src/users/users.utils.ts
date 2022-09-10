import jwt from "jsonwebtoken";
import client from "../client";
import { Context, Resolver } from "../types";

export const getUser = async (token: string | string[] | undefined) => {
    try {
        if (!token) {
            return null;
        }
        const accessToken: string = Array.isArray(token) ? token[0] : token
        const verifyToken: any = await jwt.verify(accessToken, process.env.SECRET_KEY ?? "");

        if ("id" in verifyToken) {
            const user = await client.user.findUnique({ where: { id: verifyToken["id"] } });
            if (user) {
                return user;
            }
        }

        return null;
    } catch (e) {
        console.log(e);
        return null;
    }
};

export const protectRosolver = (resolver: Resolver) => (root: any, args: any, context: Context, info: any) => {
    if (!context.loggedInUser) {
        const query = info.operation.operation === "query";
        if (query) {
            return null;
        } else {
            return {
                ok: false,
                error: "Please log in to perform this action.",
            };
        }
    }
    return resolver(root, args, context, info);
};

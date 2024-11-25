import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJsMoongoose from "@adminjs/mongoose";
import * as Modals from "../models/index.js";
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import { dark, light, noSidebar } from "@adminjs/themes";

AdminJS.registerAdapter(AdminJsMoongoose);

export const admin = new AdminJS({
    resources: [
        {
            resource: Modals.Customer,
            options: {
                listProperties: ["phone", "role", "isActivated"],
                filterProperties: ["phone", "role"],
            },
        },
        {
            resource: Modals.DeliveryPartner,
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        {
            resource: Modals.Admin,
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        { resource: Modals.Branch },
        { resource: Modals.Product },
        { resource: Modals.Category },
        { resource: Modals.Order },
        { resource: Modals.Counter },

    ],
    branding: {
        companyName: "Blinkit",
        withMadeWithLove: false,
        favicon:"https://res.cloudinary.com/dxkzognbc/image/upload/v1724840473/yicyeik0zsqtie68beyk.webp",
        // logo:"https://res.cloudinary.com/dxkzognbc/image/upload/v1724840473/yicyeik0zsqtie68beyk.webp",
        defaultTheme: dark.id,
        availableThemes: [dark, light, noSidebar],
    },
    rootPath: "/admin"
});

export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            coockiePassword: COOKIE_PASSWORD,
            cookieName: "adminjs",
        },
        app,
        {
            Store: sessionStore,
            saveUnitialized: true,
            secret: COOKIE_PASSWORD,
            cookie: {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production",
            }
        }
    );
};
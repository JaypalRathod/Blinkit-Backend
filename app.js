import "dotenv/config";
import Fastify from "fastify";
import { connectDB } from "./src/config/Connect.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { PORT } from "./src/config/config.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

const start = async () => {
    await connectDB(process.env.MONGO_URL);

    const app = Fastify();

    app.register(fastifySocketIO, {
        cors: {
            origin: "*"
        },
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: ["websocket"],
    });

    await registerRoutes(app);

    await buildAdminRouter(app);

    app.listen({ port: PORT, host: "0.0.0.0" }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Blinkit start on http://localhost:${PORT}${admin.options.rootPath}`);
        }
    });

    app.ready().then(() => {
        app.io.on("connection", (socket) => {
            console.log("A User Connected  ✅")

            socket.io("joinRoom", (orderId) => {
                socket.join(orderId);
                console.log(`🛑 User joined room ${orderId}`)
            })

            socket.on("disconnect", () => {
                console.log("User Disconnected ❌");
            });
        })

    })
}

start();
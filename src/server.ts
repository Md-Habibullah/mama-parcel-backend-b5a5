/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose'
import app from './app';
import { envVars } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)
        console.log("connected to mongodb")

        server = app.listen(5000, () => {
            console.log('server is listening to port 5000')
        })
    } catch (error) {
        console.log(error)
    }
}

(async () => {
    await startServer();
    await seedSuperAdmin();
})()

// Unhandled rejection error handle
process.on("unhandledRejection", (err) => {
    console.log("Unhandled rejection detected..server is shutting down..", err)
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})

// uncaught exception error handle
process.on("uncaughtException", (err) => {
    console.log("uncaught Exception detected..server is shutting down..", err)
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})

// signal termination error handle
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received..server is shutting down..")
    if (server) {
        server.close(() => {
            process.exit(1);
        })
    }
    process.exit(1);
})
"use strict";

const path = require("path");
const config = require(path.resolve(process.cwd(), "config"));
const publicPath = path.resolve(process.cwd(), "public");
const shared = require(path.resolve(process.cwd(), "shared"));
const fastify = require("fastify")({
    logger: false
});

fastify.register(require("fastify-cookie"));

fastify.register(require("fastify-jwt"), {
    secret: config.JWT_SECRET,
    cookie: {
        cookieName: shared.COOKIE_NAME
    }
});
fastify.decorate("authenticate", async function(request, reply) {

    try {
        await request.jwtVerify()
    } catch (err) {
        reply.send(err)
    }
})
fastify.decorate("authorize", async function(request, reply) {
    try {
        var user = request.user;
        if (user.role !== "admin") {
            var error = new Error("unauthorize");
            error.unauthorized = true;
            throw error;
        }
        //
        // const scope = user.scope.split(",") || [];
        // var page = request.params.page;
        // if (scope.indexOf(page) === -1) {
        //     var error = new Error(`unauthorize`);
        //     error.unauthorized = true;
        //     throw error;
        // }

    } catch (err) {
        reply.send(err)
    }
})

fastify.register(async function privateContext (childServer) {

    childServer.addHook("preValidation", fastify.authenticate);
    childServer.addHook("preValidation", fastify.authorize);

    childServer.register(require("fastify-static"), {
        root: publicPath
    });

});



fastify.setErrorHandler(function (error, request, reply) {

    if (error.validation) {
        return reply.status(400).send(error);
    }
    if (error.unauthorized || error.name === "UnauthorizedError") {
        // console.log(fs.existsSync(path.resolve(publicPath, "401")))
        // 401
        return reply.redirect(config.UNAUTHORIZED_URL);
        // return reply.status(401).send(error);
    }

    const IS_PROD = false;
    if (IS_PROD) {
        reply.code(418).send({msg: "generic"});
    } else {
        reply.status(500).send(error);
    }
})




fastify.get("/ping", async function (request, reply) {
    reply.send("pong");
});




fastify.ready(() => {
    console.log(fastify.printRoutes())
});


// Run the server!
fastify.listen(config.HTTP_PORT, function (err, address) {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    // fastify.log.info(`server listening on ${address}`)
    console.log(`server listening on ${address}`);
});

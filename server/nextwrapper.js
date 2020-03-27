const { parse } = require("url");
const { join } = require("path");
const withOffline = require("next-offline");
const path = require("path");
const withStylus = require("@zeit/next-stylus");




const nextHandlerWrapper = app => {

    const handler = app.getRequestHandler();

    return async ({ raw: { req, res }, url}, h) => {

        const parsedUrl = parse(url, true);
        const rootStaticFiles = [
            "/manifest.json",
            "/service-worker.js"
        ];


        if (rootStaticFiles.indexOf(parsedUrl.pathname) > -1) {
            const path = join(__dirname, "../build", parsedUrl.pathname);
            try {
                await app.serveStatic(req, res, path);
             } catch (e) {

            }

        } else {
            await handler(req, res, parsedUrl);
        }
        return h.close;
    };

};

const defaultHandlerWrapper = (app, data) => async ({ raw: { req, res }, url }, absPath, body=null) => {
    let { pathname, query } = parse(url, true);
    query.data = data || {};
    if(body !== null) {
        for(let k in body) {
            query[k] = body[k];
        }
    }
    let pathToModule = require('../build/custom-manifest.json');
   query.data.pathToModule = pathToModule;
    if(absPath && typeof absPath == 'string'){
        pathname = absPath;
    }

    return app.renderToHTML(req, res, pathname, query);
};

const pathWrapper = (app, pathName, opts) =>
    async ({ raw, query, params }) => {
        return app.renderToHTML(
            raw.req,
            raw.res,
            pathName,
            { ...query, ...params },
            opts
        );

    };

module.exports = withOffline(
    withStylus({
        stylusLoaderOptions: {
            import: [path.resolve(__dirname, "./assets/stylus/CommonVariables.styl")]
        }
    })
);


module.exports = {
    pathWrapper, defaultHandlerWrapper, nextHandlerWrapper
};

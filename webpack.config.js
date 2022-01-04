"use strict";

var path = require("path");
var fs = require("fs");
var url = require("url");
var config = require(path.resolve(process.cwd(), "config"));
var webpack = require("webpack");

var { CleanWebpackPlugin } = require("clean-webpack-plugin");
var TerserPlugin = require("terser-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HandmadeLiveReload = require("handmade-livereload-webpack-plugin")({
    port: config.LIVE_RELOAD_PORT,
    host: config.BASE_URL
});
var webRootPath = path.resolve(__dirname);
var publicPath = path.resolve(webRootPath, "public");
var compiledPath = path.resolve(publicPath, "compiled");
var templatesPath = path.resolve(webRootPath, "client", "templates");
var pagesPath = path.resolve(webRootPath, "client", "pages");

const HANDMADE_LIVE_RELOAD = "handmade_live_reload";
const WEBSOCKET_HOST = url.parse(config.BASE_URL).host;
const TEMPLATE_FILE = "index.ejs";

const PAGES = fs.readdirSync(pagesPath, {
    withFileTypes: true,
}).filter(function (dirent) {
    return dirent.isDirectory();
}).map(function (dirent) {
    return dirent.name;
});


var entry = {};
PAGES.forEach(function (page) {
    entry[page] = [
        path.resolve(pagesPath, page, "index.js"),
        path.resolve(pagesPath, page, "style", "index.sass"),
    ];
});

module.exports = function (env = {}) {

    const IS_PROD = process.env.NODE_ENV === "production";
    const MODE = IS_PROD ? "production" : "development";
    const OUTPUT_FILENAME = "[name]_[contenthash].js";

    var devPlugins = [];

    var optimization = {};
    if (IS_PROD) {

        // to extract vendor bundle
        // optimization.splitChunks = {
        //     chunks: 'all',
        //     automaticNameDelimiter: "-",
        // };
        optimization.minimize = true;
        optimization.minimizer = [new TerserPlugin({
            terserOptions: {
                output: {
                    comments: false
                },
                compress: {
                    drop_console: true
                }
            },
            extractComments: false
        })];
    } else {
        entry[HANDMADE_LIVE_RELOAD] = path.resolve(HandmadeLiveReload.path_to_client);

        devPlugins.push(new HandmadeLiveReload.plugin());
        devPlugins.push(new CleanWebpackPlugin());
    }


    var htmlWebpackPluginCollection = PAGES.map(function (page) {

        var chunks = [page];
        if (!IS_PROD) {
            chunks.push(HANDMADE_LIVE_RELOAD);
        }

        var outputPath;
        if (page === "index") {
            outputPath = publicPath;
        } else {
            outputPath = path.resolve(publicPath, page);
        }
        var filename = path.resolve(outputPath, "index.html");
        var template;
        if (fs.existsSync(path.resolve(pagesPath, page, TEMPLATE_FILE))) {
            template = path.resolve(pagesPath, page, TEMPLATE_FILE);
        } else {
            template = path.resolve(templatesPath, TEMPLATE_FILE);
        }

        var option = {
            template: template,
            chunks: chunks,
            // templateParameters: {
            //     constants: {
            //         WEBSOCKET_URL: config.WEBSOCKET_URL,
            //         WEBSOCKET_PATH: config.WEBSOCKET_PATH,
            //         LANDING_PAGE: LANDING_PAGE,
            //         LOGIN_PAGE: LOGIN_PAGE,
            //         LOGOUT_PAGE: config.LOGOUT_URL,
            //         SESSION_TOKEN: config.SESSION_TOKEN,
            //         COOKIE_TTL: config.COOKIE_TTL,
            //         APPLICATION_URL: config.APPLICATION_URL,
            //         LIVE_RELOAD_PORT: config.LIVE_RELOAD_PORT
            //     }
            // },
            filename: filename

        };

        return new HtmlWebpackPlugin(option);
    });


    var fileLoaderOptions = {
        name: "[name]_[contenthash].[ext]",
        esModule: false,
        publicPath: "compiled"
    };

    console.log(env);

    return {
        mode: MODE,
        entry: entry,
        //devtool: IS_PROD ? "source-map" : "cheap-eval-source-map", // from epro
        devtool: "source-map", // lighter
        output: {
            path: compiledPath,
            filename: OUTPUT_FILENAME
        },
        optimization: optimization,
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        "style-loader",
                        "css-loader"
                    ]
                },
                {
                  test: /\.sass$/,
                  use: [
                    // "style-loader", // creates style nodes from JS strings
                    // "css-loader", // translates CSS into CommonJS
                    // "sass-loader" // compiles Sass to CSS, using Node Sass by default
                        MiniCssExtractPlugin.loader, "css-loader", "sass-loader"
                  ]
                },
                // {
                //   test: /\.svelte$/,
                //   exclude: /node_modules/,
                //   loader: "svelte-loader",
                //   options: {
                //     preprocess: require("svelte-preprocess")({ /* options */ })
                //   }
                // },
                {
                    test: /\.(png|svg|jpg|gif|pdf)$/,
                    loader: "file-loader",
                    options: fileLoaderOptions
                },
                {
                    test: /\.(woff|woff2|ttf)$/,
                    loader: "file-loader",
                    options: fileLoaderOptions
                },
                {
                    test: /\.(ico)$/,
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        publicPath: "compiled"
                    }
                },
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },

        resolve: {
            modules: ["node_modules", webRootPath]
        },
        
        plugins: [
            // new BundleAnalyzerPlugin({
            //     analyzerMode: "static"
            // }),
            new MiniCssExtractPlugin({
                filename: "[name]_[contenthash].css"
            }),
            new CspHtmlWebpackPlugin(
                {
                "default-src": "'self'",
                    "connect-src": IS_PROD ? "'self'" :
                        ["'self'", "ws://"+ WEBSOCKET_HOST, "https://"+ WEBSOCKET_HOST],
                "base-uri": "'none'", // not default-src fallback
                "form-action": "'none'", // not default-src fallback
                //"frame-ancestors": "'none'", // not default-src fallback but it's not possible to add via the meta tag
                "img-src": "'self' blob: data:;",
                "object-src": "'none'",
                "frame-src": "'none'",
                "script-src": ["'self'"], // ajv need it and with self nonce does not work
                "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                "font-src": ["fonts.gstatic.com"]
            }, {
                enabled: true,
                hashingMethod: "sha256",
                hashEnabled: {
                    "script-src": true,
                    "style-src": true
                },
                nonceEnabled: {
                    "script-src": true,
                    "style-src": false
                }
            }),
            new webpack.DefinePlugin({
                BASE_URL: JSON.stringify(`${config.BASE_URL}`),
                LOGIN_URL: JSON.stringify(`${config.LOGIN_URL}`)
            })
        ].concat(htmlWebpackPluginCollection, devPlugins)
    };

};
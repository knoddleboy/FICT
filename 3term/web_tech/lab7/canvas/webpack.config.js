module.exports = {
    entry: "./src/server.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "sql-httpvfs.js",
        library: {
            type: "module",
        },
        module: true,
    },
    experiments: {
        outputModule: true,
    },
    optimization: {
        minimize: true,
    },
};

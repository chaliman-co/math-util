module.exports = {
    // configureWebpack: {
    //     entry: {
    //         // "workers/mainworker": "./src/scripts/workers/mainWorker.ts",
    //         // "workers/childworker": "./src/scripts/workers/childWorker.ts",
    //     }
    // },
    chainWebpack: (config) => {
        // config.output.store.set("filename", 'js/[name].js');
        // console.log(config);
        // delete config.entryPoints["parent"]
        // config.output.
        // config.entry("workers/mainworker").add("./src/scripts/workers/mainWorker.ts");
        // config.entry("workers/childworker").add("./src/scripts/workers/childWorker.ts")
        // console.log(require("util").inspect(config, {depth: 1}));
            config.module.rule('ts').include.add((item) => !/worker/i.test(item));
        // console.log(config.toString());//ts.rules)
        // require("process").exit(0);
        config
            .plugin('html')
            .tap((args) => {
                // eslint-disable-next-line no-param-reassign
                args[0].excludeChunks = ['workers/mainworker', 'workers/childworker'];
                return args;
            });

            config.module
              .rule('workider')
              .test(/worker/i)
              .use('ts-loader')
              .loader('ts-loader')
    },
}
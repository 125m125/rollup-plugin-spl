import {
    readFile
} from "fs";
import {
    JSONSerializer,
    AutoConfigurator,
    InquirerConfigurator
} from "splconfigurator";
import metascript from "rollup-plugin-metascript";

var jsonSerializer = new JSONSerializer();

export default function rollupPluginSpl(options = {}) {
    var model;
    var config;
    if (options.verify || options.autocomplete || options.interactive) {
        if (typeof options.model === "string") {
            model = new Promise((res, rej) => readFile(options.model, "utf8", (e, d) => e ? rej(e) : res(d))).then(JSON.parse).then(jsonSerializer.deserializeModel);
        } else {
            model = new Promise(res => res(options.model));
        }
    }

    if (typeof options.config === "string") {
        config = new Promise((res, rej) => readFile(options.config, "utf8", (e, d) => e ? rej(e) : res(d))).then(JSON.parse);
    } else {
        config = new Promise(res => res(options.config));
    }

    if (options.verify || options.autocomplete || options.interactive) {
        model = Promise.all([model, config, ]).then(([m, c, ]) => {
            m.deserializeConfiguration(jsonSerializer, c);
            return m;
        });
    }

    if (options.interactive) {
        model = model.then(m => new InquirerConfigurator(m, undefined, false).start().then(() => m));
    }

    if (options.autocomplete) {
        model = model.then(m => {
            new AutoConfigurator(m, options.autocomplete.preference).solve();
            return m;
        });
    }

    if (options.verify || options.autocomplete || options.interactive) {
        config = model.then(m => m.serializeConfiguration(jsonSerializer));
    }

    var metaOptions = {
        include: options.include,
        exclude: options.exclude,
        scope: config,
    };
    var metascriptPlugin = metascript(metaOptions);
    return {
        name: "spl",
        transform: metascriptPlugin.transform,
    };
}
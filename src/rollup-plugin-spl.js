import {
    readFileSync
} from "fs";
import {
    JSONSerializer,
    AutoConfigurator,
    InquirerConfigurator
} from "splconfigurator";
import metascript from "rollup-plugin-metascript";

var jsonSerializer = new JSONSerializer();

export default function rollupPluginSpl(options) {
    var model = options.model;
    if (typeof options.model === "string") {
        model = jsonSerializer.deserializeModel(JSON.parse(readFileSync(options.model, "utf8")));
    }

    var config = options.config;
    if (typeof options.config === "string") {
        config = JSON.parse(readFileSync(options.config, "utf8"));
    }

    if (options.verify || options.autocomplete || options.interactive) {
        model.deserializeConfiguration(jsonSerializer, config);
    }

    if (options.interactive) {
        new InquirerConfigurator(model, undefined, false).start();
    }

    if (options.autocomplete) {
        new AutoConfigurator(model, options.autocomplete.preference).solve();
    }

    if (options.verify || options.autocomplete || options.interactive) {
        config = model.serializeConfiguration(jsonSerializer);
    }

    var metaOptions = {
        include: options.include,
        exclude: options.exclude,
        settings: config,
    };
    var metascriptPlugin = metascript(metaOptions);
    return {
        name: "spl",
        transform: metascriptPlugin.transform,
    };
}
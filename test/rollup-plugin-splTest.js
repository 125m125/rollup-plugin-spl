import ava from "ava";
import rollupPluginSpl from "../src/rollup-plugin-spl";
import {
    JSONSerializer
} from "splconfigurator";
import {
    readFileSync
} from "fs";
var rollup = require("rollup").rollup;

var code_a = 'console.log("a");\n';
var code_ab = 'console.log("a");\nconsole.log("b");\n';
var code_ac = 'console.log("a");\nconsole.log("c");\n';
var code_abc = 'console.log("a");\nconsole.log("b");\nconsole.log("c");\n';

var model = new JSONSerializer().deserializeModel(JSON.parse(readFileSync("test/resources/simpleModel.json", "utf-8")));

function run(uut, file) {
    return rollup({
        input: file,
        plugins: [uut, ],
    }).then(result => result.generate({
        format: "es",
    }));
}

ava("loaded config is applied", test => {
    var uut = rollupPluginSpl({
        config: {
            A: true,
            B: true,
            C: false,
        },
    });

    return run(uut, "test/resources/simpleCode.js").then(generated => {
        var result = generated.code;
        test.is(result, code_ab);
    });
});

ava("config from fs is applied", test => {
    var uut = rollupPluginSpl({
        config: "test/resources/simpleConfigABC.json",
    });

    return run(uut, "test/resources/simpleCode.js").then(generated => {
        var result = generated.code;
        test.is(result, code_abc);
    });
});

ava("missing config is autocompleted", test => {
    var uut = rollupPluginSpl({
        model: "test/resources/simpleModel.json",
        autocomplete: {
            preference: false,
        },
    });

    return run(uut, "test/resources/simpleCode.js").then(generated => {
        var result = generated.code;
        test.is(result, code_a);
    });
});

ava("loaded config is autocompleted", test => {
    var uut = rollupPluginSpl({
        model: "test/resources/simpleModel.json",
        config: {
            A: true,
            B: true,
        },
        autocomplete: true,
    });

    return run(uut, "test/resources/simpleCode.js").then(generated => {
        var result = generated.code;
        test.is(result, code_ab);
    });
});

ava("config from fs is autocompleted", test => {
    var uut = rollupPluginSpl({
        model: model,
        config: "test/resources/simpleConfigAB.json",
        autocomplete: {
            preference: true,
        },
    });

    return run(uut, "test/resources/simpleCode.js").then(generated => {
        var result = generated.code;
        test.is(result, code_abc);
    });
});

ava("quickRollup compiles code", test => {
    var uut = rollupPluginSpl({
        model: model,
        config: {
            PLUS: false,
            MINUS: true,
            OTHER: false,
        },
    });

    return uut.quickRollup("test/resources/miniCalc.js").then(r => {
        test.is(r(6, 3), 3);
    });
});

ava("quickRollup compiles code with dependencies", test => {
    var uut = rollupPluginSpl({
        model: model,
        config: {
            PLUS: false,
            MINUS: false,
            OTHER: true,
            OTHER_MULT: false,
            OTHER_DIV: true,
        },
    });

    return uut.quickRollup("test/resources/miniCalc.js").then(r => {
        test.is(r(6, 3), 2);
    });
});
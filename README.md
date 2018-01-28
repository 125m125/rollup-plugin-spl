# rollup-plugin-spl
A [Rollup](http://rollupjs.org/) plugin to create Software Product Lines with the help of [MetaScript](https://github.com/dcodeIO/MetaScript).

## Installation
### Install rollup-plugin-spl dependency
```
npm install --save-dev rollup-plugin-spl
```
### Add rollup-plugin-spl to your rollup.config.js
```javascript
import rollupPluginSpl from "rollup-plugin-spl";

export default {
    ...
    plugins: [
        rollupPluginSpl({
            // set options here
        }),
        ...
    ],
}
```
### Options
- model: either the path to your model or the preloaded model
- config: either the path to your configuration or the preloaded configuration
- verify: if truthy, the configuration is verified with the model. Only features required for the configuration to be a valid partial configuration are selected.
- autocomplete: if truthy, unselected features will be selected to form a complete configuration. To configure whether the features are selected positive or negative, an object `{preference: <true|false>}` can be passed.
- interactive: asks the user which unselected features should be selected positive and which negative. Compatible with `config` for a predefined partial selection and `autocomplete` to fill in features not selected by the user.

## Create the SPL model
To create the model, run `node node_modules/splconfigurator/target/splconfigurator.cjs.js build <Modelname>`. A detailed explanation of the process can be found in the manual for the [SPL Configurator](https://github.com/125m125/splconfigurator).

## Create an SPL configuration
To create a configuration for your SPL, run `node node_modules/splconfigurator/target/splconfigurator.cjs.js configure path/to/your/model`. A detailed explanation of the process can be found in the manual for the [SPL Configurator](https://github.com/125m125/splconfigurator).

## Write the code
To exclude parts of your source code when a certain feature is selected positive or negative, wrap it inside a MetaScript if else:
```javascript
console.log("always included");
//? if (INCLUDE_A) {
console.log("feature INCLUDE_A is selected");
//? } else {
console.log("feature INVLUDE_A is not selected");
//? }
```
This process is similar to `ifdef` from the cpp. A detailed explanation can be found in the [MetaScript manual](https://github.com/dcodeIO/MetaScript/wiki)
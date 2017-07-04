peakfun - get a peek at your functions
================================================================================


usage
================================================================================

Run your Node.js application with the additional `node` option `-r peakfun`.
Eg, say you normally run your Node.js application as:

    node myApp arg1 arg2

Instead, run it as:

    node -r ./peakfun myApp arg1 arg2

A log file will be created in `~/.peakfun/logs`


install
================================================================================

    npm install pmuellr/peakfun


api
================================================================================

peakFun kinda works like [DTrace][]: a set of **probes** (JavaScript functions)
are instrumented with **actions**.

[DTrace]: https://en.wikipedia.org/wiki/DTrace#Description

peakFun discovers functions exported by modules, but functions may be specified
explicitly through the package API.

The actions supported are:

* get stack trace when a function invoked
* run code when a function invoked

To configure peakFun, use the JavaScript api and/or the environment variable
api.  Both APIs take parameters of `moduleSpec` and `functionSpec`.

`moduleSpec` is the name of the module, which may include `*` as a wildcard.

`functionSpec` is a "path" to the function you wish to target.  The path always
starts with `/`, which indicates the top-level object exported by the module.
Following the `/` is the first path component, if the top-level object has
properties.  Further nested properties are separated by another `/`.

Examples of `functionSpec`:

Here's an example script, followed by the paths of the functions:

      module.exports = fn
      fn.x = function x () {}
      fn.y = function y () {}
      fn.x.z = function z () {}

      function fn () { }

* `fn` : `/`
* `x`` : `/x`
* `y`` : `/y`
* `z`` : `/x/z`

The character `*` can be used as a wildcard, but all path elements must be
specified - the wildcard does not match across nested paths.


JavaScript API
--------------------------------------------------------------------------------

To use the JavaScript API, create a module `peakFun.config.js` in the current
directory that the app is run from.  The module should export a function
`configure(peakFun)` to configure peakFun.  The `peakFun` object argument has
the following methods:

* `printStack(moduleSpec, functionSpec)`
* `run(moduleSpec, functionSpec, fn)`


environment variable API
--------------------------------------------------------------------------------

      PEAKFUN_HOME=~/.peakFun-mine
      PEAKFUN_CONFIGURE=./peakFun-mega.config.js

      PEAKFUN_WHEN="*fs.js:/readFile*:stack"
      PEAKFUN_WHEN="*fs.js:/readFile*:run:./printArgs"

license
================================================================================

This package is licensed under the MIT license.  See the
[LICENSE.md](LICENSE.md) file for more information.


contributing
================================================================================

Awesome!  We're happy that you want to contribute.

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

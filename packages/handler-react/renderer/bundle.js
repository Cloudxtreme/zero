const Bundler = require("./parcelCustom")
const fs = require('fs')
const path = require('path')
const debug = require('debug')('react')
const crypto = require("crypto");
const ISDEV = process.env.NODE_ENV!=="production"
function sha1(data) {
    return crypto.createHash("sha1").update(data, "binary").digest("hex");
}

module.exports = async (filename, bundlePath, basePath, publicBundlePath) => {
  var entryFileName = path.join(path.dirname(filename), "/entry."+ sha1(filename) + ".js")
  const entry = createEntry( path.basename(filename) )
  // save entry code in a file and feed it to parcel
  fs.writeFileSync(entryFileName, entry, 'utf8')
  // Bundler options
  
  const bundler = new Bundler(entryFileName, {
    outDir: bundlePath,
    outFile: "bundle.js",
    publicUrl: publicBundlePath,
    watch: true,
    hmr: ISDEV,
    logLevel: 2,
    cache: false,
    minify: !ISDEV,
    autoinstall: false
  })
  //console.log("rootDir", bundler.options.rootDir)

  const bundle = await bundler.bundle();
  return bundle
}

const createEntry = componentPath => {
return(`
var React = require("react")
var App = require('./${componentPath}')
App = (App && App.default)?App.default : App;
const { hydrate } = require('react-dom')


const props = JSON.parse(
  initial_props.innerHTML
)
const el = React.createElement(App, props)
hydrate(el, document.getElementById("_react_root"))
`)
}
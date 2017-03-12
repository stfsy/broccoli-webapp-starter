'use strict'

const Babel = require('broccoli-babel-plugin')
const Concat = require('broccoli-concat')
const Imagemin = require('broccoli-image-min')
const Htmlmin = require('broccoli-htmlmin')
const Merge = require('broccoli-merge-trees')
const Funnel = require('broccoli-funnel')
const Reload = require('broccoli-livereload')

const app = 'app'

const reloadable = new Reload('app', {
    target: 'index.html',
})

const css = new Funnel(reloadable, { srcDir: 'styles', destDir: 'styles' })
const views = new Funnel(reloadable, { srcDir: 'views', destDir: 'views' })
const scripts = new Funnel(reloadable, { srcDir: 'scripts', destDir: 'scripts' })
const images = new Funnel(reloadable, { srcDir: 'images', destDir: 'images' })
const assets = new Funnel(reloadable, { include: ['*.html', '*.txt', '*.ico', '.htaccess'] })

const dependencies = new Merge([
    new Funnel('node_modules/material-components-web/dist', {
        include: [
            '*.min.*'
        ]
    })], {})

const tasks = {
    build: 'build',
    serve: 'serve'
}

const concatenatedJs = new Concat(new Merge([dependencies, scripts]), {
    outputFile: 'scripts.js',
    inputFiles: ['**/*.js']
})

const concatenatedCss = new Concat(new Merge([dependencies, css]), {
    outputFile: 'styles.css',
    inputFiles: ['**/*.css']
})

const minifiedJs = new Babel(concatenatedJs, {
    plugins: ['babel-plugin-transform-mangle', 'babel-plugin-transform-merge-sibling-variables'],
    babelrc: false,
    minified: true,
    compact: true,
    comments: false,
    sourceMaps: true
})

const minifiedHtml = new Htmlmin(views)
const minifiedImages = new Imagemin(images, {
    include: 'images/**/*.{jpg,png}',
})

module.exports = new Merge([minifiedHtml, minifiedImages, concatenatedCss, minifiedJs, assets], {})
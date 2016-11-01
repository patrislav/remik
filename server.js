/* eslint-env node */
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.config')

const PORT = process.env.PORT || 3000

const app = express()
const compiler = webpack(config)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  lazy: false,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  serverSideRender: true
})

app.use(devMiddleware)
app.use(require('webpack-hot-middleware')(compiler))

app.use((req, res) => {
  const index = devMiddleware.fileSystem.readFileSync(path.join(config.output.path, 'index.html'), 'utf8')
  res.send(index)
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
})

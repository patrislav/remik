module.exports = (ctx) => ({
  from: ctx.from,
  to: ctx.to,
  plugins: {
    'postcss-cssnext': {},
    // Minify the output
    'cssnano': ['production', 'staging'].includes(ctx.env) && { autoprefixer: false }
  }
})

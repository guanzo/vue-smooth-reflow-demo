let { NODE_ENV } = process.env

let externals = {}
if (NODE_ENV === 'production') {
    externals['../../vue-smooth-reflow'] = 'SmoothReflow'
}

module.exports = {
    configureWebpack: {
        externals
    }
}

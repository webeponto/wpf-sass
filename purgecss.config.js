module.exports = {
    content: [
        './site/paginas/**/*',
        './site/includes/**/*',
        './site/class/**/*',
        './site/js/**/*',
    ],
    css: ['site/css/index.css'],
    output: 'site/css/purge.min.css',
    defaultExtractor: (content) => content.match(/[\w-/:()\[\],]+(?<!:)/g) || [],
};

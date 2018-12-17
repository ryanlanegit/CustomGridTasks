({
    baseUrl: "../Scripts",
    paths: {
        // "requireLib": "../../Scripts/require",
        "text": "../Scripts/require/text",
        "CustomSpace": "../"
    },
    include: [
        //"requireLib",
        "CustomSpace/Scripts/grids/gridTaskMain"
    ],
    //namespace: "gridTaskMain",
    out: "../Scripts/grids/gridTaskMain-built.min.js",
    findNestedDependencies: true,
    optimize: "uglify2", // none, uglify, uglify2
    generateSourceMaps: true,
    preserveLicenseComments: false
})
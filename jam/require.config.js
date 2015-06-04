var jam = {
    "packages": [
        {
            "name": "bootstrap-flatly",
            "location": "jam/bootstrap-flatly",
            "main": "js/bootstrap.min.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "dist/jquery.js"
        }
    ],
    "version": "0.2.17",
    "shim": {}
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "packages": [
        {
            "name": "bootstrap-flatly",
            "location": "jam/bootstrap-flatly",
            "main": "js/bootstrap.min.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "dist/jquery.js"
        }
    ],
    "shim": {}
});
}
else {
    var require = {
    "packages": [
        {
            "name": "bootstrap-flatly",
            "location": "jam/bootstrap-flatly",
            "main": "js/bootstrap.min.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "dist/jquery.js"
        }
    ],
    "shim": {}
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}
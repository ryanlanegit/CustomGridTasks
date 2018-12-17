/*jslint nomen: true */
/*global $, app, console, performance, require */
/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

/**
Load Custom Grid Task Builder
**/

require([
    "CustomSpace/Scripts/grids/gridTaskBuilder"
], function (
    gridTaskBuilder
) {
    "use strict";
    if (app.storage.custom.get("debug")) {
        console.log("gridTaskMain:define", performance.now());
    }

    function initGridTasks() {
        if (app.storage.custom.get("debug")) {
            console.log("gridTaskMain:initGridTasks", performance.now());
        }
        
        gridTaskBuilder.build(function (gridTaskViewModel) {
            app.events.subscribe("dynamicPageReady", function () {
                app.events.publish("gridTasksReady");
            });
        });
    }

    initGridTasks();
});
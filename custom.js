app.custom.gridTasks = {
    built: false,
	add: function add (gridData, field, type, name, template, callback) {
        var that = this,
            // Look for provided column in grid by field name
            taskColumn = $.grep(gridData.columns, function (colValue, colIndex) {
                return colValue.field === field;
            })[0];

        if (!_.isUndefined(taskColumn)) {
            if (_.isUndefined(taskColumn["style"])) {
                // Add default blank style template function to column template
                taskColumn["style"] = function defaultStyle (data) { return ""; };
            }

            if (_.isUndefined(taskColumn["tasks"])) {
                // Add empty tasks array to column template
                taskColumn["tasks"] = [];
            }

            switch (type) {
                case "style":
                    // Set style template function to provided template
                    taskColumn["style"] = template
                    break
                case "task":
                    var existingTask = that.get(gridData, field, name);
                    if (existingTask) {
                        // Merge new task with existing one in the column template
                        $.extend(existingTask, {
                            name : name,
                            template: template,
                            callback: callback
                        });
                    } else {
                        // Add new task to the column template
                        taskColumn["tasks"].push({
                            name : name,
                            template: template,
                            callback: callback
                        });
                    }
                    break;
            }
        } else {
            console.log("gridTasks:add", "Warning! Unable to find field '" + field + "'.");
        }
    },
    get: function get (gridData, field, name) {
        // Look for provided column in grid by field name
        var taskColumn = $.grep(gridData.columns, function (colValue, colIndex) {
            return colValue.field === field;
        })[0];

        if (!_.isUndefined(taskColumn)) {
            if (_.isUndefined(name)) {
                // Return all tasks for the provided field
                return taskColumn["tasks"];
            } else {
                // Look for the specific task named in the provided field
                var gridTask = $.grep(taskColumn["tasks"], function (taskValue, taskIndex) {
                    return taskValue.name === name;
                })[0];

                if (!_.isUndefined(gridTask)) {
                    // Return the specific task in the provided field
                    return gridTask;
                } else {
                    console.log("gridTasks:get", "Warning! Unable to find task '" + name + "' in field '" + field + "'.");
                    return null;
                }
            }
        } else {
            console.log("gridTasks:get", "Warning! Unable to find field '" + field + "'.");
            return null;
        }
    },
    callback: function callback (itemEle, bClickPropagation) { // item is the task element clicked, bClickPropagation determines if click event should propagate
        var that = this,
            item = $(itemEle),
            gridData = item.closest("div[data-role='grid']").data("kendoGrid"),
            itemData = item.data(),
            itemRowEle = item.closest("tr").get(0),
            dataItem = gridData.dataItem(itemRowEle),
            data = {
                gridData: gridData,
                itemRowEle: itemRowEle,
                dataItem: dataItem,
                itemData: itemData
            }

        console.log("gridTasks:callback", data);

        var existingTask = that.get(gridData, itemData.field, itemData.task);
        if (existingTask) {
            // Stop click propagation for jQuery click events if requested
            if (!bClickPropagation) {
                event.stopPropagation();
            }
            existingTask.callback(data);
        } else {
            console.log("gridTasks:callback", "Unable to find task for callback.");
        }
    },
    updateGrid: function (gridData) {
        var that = this,
            bUpdateGridTemplate = false;

        $.each(gridData.columns, function (colIndex, column) {
            if (!_.isUndefined(column["style"])) {
                column.template = that.template.cell(column);
                bUpdateGridTemplate = true;
            }
        });

        if (bUpdateGridTemplate) {
            // Update grid row templates if custom tasks/styles are added
            gridData.rowTemplate = gridData._tmpl(gridData.options.rowTemplate, gridData.columns);
            gridData.altRowTemplate = gridData._tmpl(gridData.options.rowTemplate, gridData.columns);

            // Refresh grid to show column template changes
            gridData.refresh();
        }
    },
    template: {
        cell: function cell (column) {
            var template = " \
                <div class=\"ra-grid-task-container\" style=\"" + column.style(column) + "\"> \
                    <ul class=\"ra-grid-task-menu\">";
                        $.each(column["tasks"], function (taskIndex, task) {
                            template += task.template(column, task);
                        });
                        template += " \
                    </ul> \
                    <span class=\"ra-grid-task-content\"> \
                        #: " + column.field + " # \
                    </span> \
                </div>";
            return template;
        },
        listItem : {
            task: function task (field, task, options) {
                var properties = {
                    field: field,
                    task: task,
                    icon: "fa-pencil",
                    bClickPropagation: true
                };

                $.extend(properties, options);

                var template = " \
                    <li class=\"ra-grid-task-item\" data-task=\"" + properties.task + "\" data-field=\"" + properties.field + "\" onclick=\"app.custom.gridTasks.callback(this, " + properties.bClickPropagation + ");\"> \
                        <a class=\"ra-icon ra-grid-task-icon\"> \
                            <i class=\"fa " + properties.icon + "\"></i> \
                        </a> \
                    </li>";
                return template;
            },
            link: function link (field, task, options) {
                var properties = {
                    field: field,
                    task: task,
                    icon: "fa-external-link",
                    bClickPropagation: false,
                    className: "",
                    href: "/",
                    target: "_blank"
                }

                $.extend(properties, options);

                var template = " \
                    <li class=\"ra-grid-task-item " + properties.className + "\" data-task=\"" + properties.task + "\" data-field=\"" + field + "\" onclick=\"app.custom.gridTasks.callback(this, " + properties.bClickPropagation + ");\"> \
                        <a class=\"ra-icon ra-grid-task-icon\" href=\"" + properties.href + "\" target=\"" + properties.target + "\" > \
                            <i class=\"fa " + properties.icon + "\"></i> \
                        </a> \
                    </li>";
                return template;
            }
        }
    }
};

app.events.subscribe('dynamicPageReady', function () {
	console.log('dynamicPageReady Event', 'Triggered at ' + performance.now());
	if (app.custom.gridTasks.built) {
		return;
	}
	// Adding a grid style to Priority with different depending on value:
	var gridData = $("div[data-role='grid']").data("kendoGrid");
	console.log("grid", {
		gridEle: $("div[data-role='grid']"),
		gridData: $("div[data-role='grid']").data("kendoGrid")
	});
	app.custom.gridTasks.add(gridData, "Priority", "style", "", function (column) {
		// Custom Priority Style Template
		var template = " \
			# if (!_.isUndefined(Priority)) { \
				switch (Priority) { \
					case \"4\": \
						# # \
						break; \
					case \"3\": \
						# background-color:rgba(0, 255, 0, 0.25); # \
						break; \
					case \"2\": \
					case \"Medium\": \
						# background-color:rgba(255, 255, 0, 0.25); # \
						break; \
					case \"1\": \
					case \"High\": \
						# background-color:rgba(255, 0, 0, 0.25); # \
						break; \
				} \
			} #";    
		return template;
	});

	if (session.user.Analyst) {
		// Adding custom internal and external links to the Title column
		app.custom.gridTasks.add(gridData, "Title", "task", "TitleLinks", function (column, task) {
			console.log("test column", column);
			// Custom Title Links Task Template
			var template = " \
				# var url = app.gridUtils.getLinkUrl(data, \"***\"); \
				if (!_.isUndefined(WorkItemType) && (WorkItemType==='System.WorkItem.Incident' || WorkItemType==='System.WorkItem.ServiceRequest')) { #" +
					app.custom.gridTasks.template.listItem.link(column.field, task.name, {
						href: "#=url#"
					}) +
				"# } else if ((!_.isUndefined(WorkItemType)&& WorkItemType.indexOf('Activity') != -1)) { \
					var approvalUrl = app.gridUtils.getApprovalLinkUrl(data); # " +
					app.custom.gridTasks.template.listItem.link(column.field, task.name, {
						icon: "fa-check",
						href: "#=approvalUrl#"
					}) + " \
				# } # " +
				app.custom.gridTasks.template.listItem.link(column.field, task.name, {
					icon: "fa-arrow-right",
					bClickPropagation: true,
					className: "ra-highlight-default-icon",
					href: "#=url#",
					target: ""
				});
			return template;
		}, function (data) {
			console.log("TitleLinks Callback", data);
		});

		// Adding grid task to trigger AssignToAnalystByGroup
		app.custom.gridTasks.add(gridData, "AssignedUser", "task", "AssignToAnalystByGroup", function (column, task) {
			// Custom AssignToAnalystByGroup Task Template
			var template = " \
				# if (!_.isUndefined(WorkItemType) && (WorkItemType==='System.WorkItem.Incident' || WorkItemType==='System.WorkItem.ServiceRequest')) { #" +
					app.custom.gridTasks.template.listItem.task(column.field, task.name, {
						icon: "fa-pencil",
						bClickPropagation: false
					}) + " \
				# } #";
			return template;
		}, function (data) {
			console.log("AssignToAnalystByGroup Callback", data);
			data.gridData.clearSelection();
			data.gridData.select(data.itemRowEle);

			var assignToAnalystByGroupButton = $('li[data-bind*="click: analystByGroup"]').first();

			assignToAnalystByGroupButton.click();
		});
	}

	// Updating the grid to show our changes:
	app.custom.gridTasks.updateGrid(gridData);
	app.custom.gridTasks.built = true;
});


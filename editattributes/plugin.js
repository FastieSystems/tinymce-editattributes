/**
 * Edit Attributes
 * Copyright (c) 2020 Will Fastie. All rights reserved.
 * Licensed under the LGPL. For LGPL info see LICENSE in the plugin root.
 * or visit https://www.gnu.org/licenses/lgpl-3.0.html.
 * 
 * Based on tinymce-editattributes for TinyMCE 4 Copyright (c) 2016 Gagaro.
 * See https://github.com/Gagaro/tinymce-editattributes.
 *
 * Version: 5.0.0 (2020-09-01)
 */
tinymce.PluginManager.add('editattributes', function(editor, url) {
    var openDialog = function () {
        var selectedNode = editor.selection.getNode();
        var bodyItems = [];         // array
        if (selectedNode.attributes.length > 0) {
            bodyItems.push({type: 'htmlpanel', html: 'To remove an attribute, erase its value.'});
        }
        var thisInitialData = {};   // object
        for (var i = 0 ; i < selectedNode.attributes.length ; i++) {
			var attribute = selectedNode.attributes[i];
			if (!attribute.name.startsWith("data-mce-")) {
                bodyItems.push({
                    type: 'input', 
                    name: attribute.name, 
                    label: attribute.name
                });
                thisInitialData[attribute.name] = attribute.value;
 			}
        }
        // Now add the section for a new attribute
        bodyItems.push({type: 'htmlpanel', html: 'Add a New Attribute'});
        bodyItems.push({
            type: 'bar',
            items: [
                {type: 'input', name: 'new_attribute_name',  label: 'Name'},
                {type: 'input', name: 'new_attribute_value', label: 'Value'}
            ]
        });
        return editor.windowManager.open({
            title: 'Edit Attributes for ' + selectedNode.tagName + ' tag',
            body: {
                type: 'panel',
                icon: 'settings',
                items: bodyItems
            },
            buttons: [
                {
                    type: 'cancel',
                    text: 'Cancel'
                },
                {
                    type: 'submit',
                    text: 'Save',
                    primary: true
                }
            ],
            initialData: thisInitialData,
            onSubmit: function (api) {
                var data = api.getData();
				editor.undoManager.transact(function() {
					var new_name =  data['new_attribute_name'];
					var new_value = data['new_attribute_value'];

					delete data['new_attribute_name'];
					delete data['new_attribute_value'];

					if (new_name.length > 0) {
						data[new_name] = new_value;
					}
					for (key in data) {
						editor.dom.setAttribs(selectedNode, data);
					}
				});
                api.close();
            }
        });
    };

    // Add a button that opens a window
    editor.ui.registry.addButton('editattributes', {
        text: 'My button',
        onAction: function () {
            openDialog();
        }
    });

    // Adds a menu item, which can then be included in any menu via the menu/menubar configuration
    editor.ui.registry.addMenuItem('editattributes', {
        text: "Edit Attributes",
        icon: "settings",
        onAction: function() {
            // Open window
            openDialog();
        }
    });

    return {
        getMetadata: function () {
            return  {
                name: "Edit Attributes",
                url: "https://github.com/FastieSystems/tinymce-editattributes"
            };
        }
    };
});

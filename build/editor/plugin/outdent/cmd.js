/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:46
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 editor/plugin/outdent/cmd
*/

/**
 * @ignore
 * Add indent and outdent command identifier for KISSY Editor.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/outdent/cmd", function (S, Editor, dentUtils) {
    var addCommand = dentUtils.addCommand;
    var checkOutdentActive = dentUtils.checkOutdentActive;
    return {
        init:function (editor) {
            addCommand(editor, "outdent");
            var queryCmd = Editor.Utils.getQueryCmd("outdent");
            if (!editor.hasCommand(queryCmd)) {
                editor.addCommand(queryCmd, {
                    exec:function (editor) {
                        var selection = editor.getSelection();
                        if (selection && !selection.isInvalid) {
                            var startElement = selection.getStartElement();
                            var elementPath = new Editor.ElementPath(startElement);
                            return checkOutdentActive(elementPath);
                        }
                    }
                });
            }
        }
    };

}, {
    requires:['editor', '../dent-cmd']
});


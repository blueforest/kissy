/** Compiled By kissy-xtemplate */
KISSY.add(function () {
    return function (scopes, S, undefined) {
        var buffer = "",
            config = this.config,
            engine = this,
            utils = config.utils;
        var runBlockCommandUtil = utils["runBlockCommand"],
            getExpressionUtil = utils["getExpression"],
            getPropertyOrRunCommandUtil = utils["getPropertyOrRunCommand"];
        buffer += '';
        var config0 = {};
        var params1 = [];
        var id2 = getPropertyOrRunCommandUtil(engine, scopes, {}, "decades", 0, 1, undefined, true);
        params1.push(id2);
        config0.params = params1;
        config0.fn = function (scopes) {
            var buffer = "";
            buffer += '\n<tr role="row">\n    ';
            var config3 = {};
            var params4 = [];
            var id6 = getPropertyOrRunCommandUtil(engine, scopes, {}, "xindex", 0, 3, undefined, true);
            var id5 = getPropertyOrRunCommandUtil(engine, scopes, {}, "decades." + id6 + "", 0, 3, undefined, true);
            params4.push(id5);
            config3.params = params4;
            config3.fn = function (scopes) {
                var buffer = "";
                buffer += '\n    <td role="gridcell"\n        class="';
                var config8 = {};
                var params9 = [];
                params9.push('cell');
                config8.params = params9;
                var id7 = getPropertyOrRunCommandUtil(engine, scopes, config8, "getBaseCssClasses", 0, 5, true, undefined);
                buffer += id7;
                buffer += '\n        ';
                var config10 = {};
                var params11 = [];
                var id12 = getPropertyOrRunCommandUtil(engine, scopes, {}, "startDecade", 0, 6, undefined, true);
                var id13 = getPropertyOrRunCommandUtil(engine, scopes, {}, "year", 0, 6, undefined, true);
                var id14 = getPropertyOrRunCommandUtil(engine, scopes, {}, "year", 0, 6, undefined, true);
                var id15 = getPropertyOrRunCommandUtil(engine, scopes, {}, "endDecade", 0, 6, undefined, true);
                params11.push((id12 <= id13) && (id14 <= id15));
                config10.params = params11;
                config10.fn = function (scopes) {
                    var buffer = "";
                    buffer += '\n         ';
                    var config17 = {};
                    var params18 = [];
                    params18.push('selected-cell');
                    config17.params = params18;
                    var id16 = getPropertyOrRunCommandUtil(engine, scopes, config17, "getBaseCssClasses", 0, 7, true, undefined);
                    buffer += id16;
                    buffer += '\n        ';
                    return buffer;
                };
                buffer += runBlockCommandUtil(engine, scopes, config10, "if", 6);
                buffer += '\n        ';
                var config19 = {};
                var params20 = [];
                var id21 = getPropertyOrRunCommandUtil(engine, scopes, {}, "startDecade", 0, 9, undefined, true);
                var id22 = getPropertyOrRunCommandUtil(engine, scopes, {}, "startYear", 0, 9, undefined, true);
                params20.push(id21 < id22);
                config19.params = params20;
                config19.fn = function (scopes) {
                    var buffer = "";
                    buffer += '\n         ';
                    var config24 = {};
                    var params25 = [];
                    params25.push('last-century-cell');
                    config24.params = params25;
                    var id23 = getPropertyOrRunCommandUtil(engine, scopes, config24, "getBaseCssClasses", 0, 10, true, undefined);
                    buffer += id23;
                    buffer += '\n        ';
                    return buffer;
                };
                buffer += runBlockCommandUtil(engine, scopes, config19, "if", 9);
                buffer += '\n        ';
                var config26 = {};
                var params27 = [];
                var id28 = getPropertyOrRunCommandUtil(engine, scopes, {}, "endDecade", 0, 12, undefined, true);
                var id29 = getPropertyOrRunCommandUtil(engine, scopes, {}, "endYear", 0, 12, undefined, true);
                params27.push(id28 > id29);
                config26.params = params27;
                config26.fn = function (scopes) {
                    var buffer = "";
                    buffer += '\n         ';
                    var config31 = {};
                    var params32 = [];
                    params32.push('next-century-cell');
                    config31.params = params32;
                    var id30 = getPropertyOrRunCommandUtil(engine, scopes, config31, "getBaseCssClasses", 0, 13, true, undefined);
                    buffer += id30;
                    buffer += '\n        ';
                    return buffer;
                };
                buffer += runBlockCommandUtil(engine, scopes, config26, "if", 12);
                buffer += '\n        ">\n        <a hidefocus="on"\n           href="#"\n           class="';
                var config34 = {};
                var params35 = [];
                params35.push('decade');
                config34.params = params35;
                var id33 = getPropertyOrRunCommandUtil(engine, scopes, config34, "getBaseCssClasses", 0, 18, true, undefined);
                buffer += id33;
                buffer += '">\n            ';
                var id36 = getPropertyOrRunCommandUtil(engine, scopes, {}, "startDecade", 0, 19, undefined, false);
                buffer += getExpressionUtil(id36, true);
                buffer += '-';
                var id37 = getPropertyOrRunCommandUtil(engine, scopes, {}, "endDecade", 0, 19, undefined, false);
                buffer += getExpressionUtil(id37, true);
                buffer += '\n        </a>\n    </td>\n    ';
                return buffer;
            };
            buffer += runBlockCommandUtil(engine, scopes, config3, "each", 3);
            buffer += '\n</tr>\n';
            return buffer;
        };
        buffer += runBlockCommandUtil(engine, scopes, config0, "each", 1);
        return buffer;
    };
});
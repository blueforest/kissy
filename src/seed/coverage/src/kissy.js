function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/kissy.js']) {
  _$jscoverage['/kissy.js'] = {};
  _$jscoverage['/kissy.js'].lineData = [];
  _$jscoverage['/kissy.js'].lineData[24] = 0;
  _$jscoverage['/kissy.js'].lineData[25] = 0;
  _$jscoverage['/kissy.js'].lineData[30] = 0;
  _$jscoverage['/kissy.js'].lineData[37] = 0;
  _$jscoverage['/kissy.js'].lineData[121] = 0;
  _$jscoverage['/kissy.js'].lineData[127] = 0;
  _$jscoverage['/kissy.js'].lineData[128] = 0;
  _$jscoverage['/kissy.js'].lineData[129] = 0;
  _$jscoverage['/kissy.js'].lineData[130] = 0;
  _$jscoverage['/kissy.js'].lineData[131] = 0;
  _$jscoverage['/kissy.js'].lineData[133] = 0;
  _$jscoverage['/kissy.js'].lineData[137] = 0;
  _$jscoverage['/kissy.js'].lineData[138] = 0;
  _$jscoverage['/kissy.js'].lineData[139] = 0;
  _$jscoverage['/kissy.js'].lineData[140] = 0;
  _$jscoverage['/kissy.js'].lineData[142] = 0;
  _$jscoverage['/kissy.js'].lineData[145] = 0;
  _$jscoverage['/kissy.js'].lineData[146] = 0;
  _$jscoverage['/kissy.js'].lineData[148] = 0;
  _$jscoverage['/kissy.js'].lineData[152] = 0;
  _$jscoverage['/kissy.js'].lineData[163] = 0;
  _$jscoverage['/kissy.js'].lineData[164] = 0;
  _$jscoverage['/kissy.js'].lineData[165] = 0;
  _$jscoverage['/kissy.js'].lineData[166] = 0;
  _$jscoverage['/kissy.js'].lineData[168] = 0;
  _$jscoverage['/kissy.js'].lineData[169] = 0;
  _$jscoverage['/kissy.js'].lineData[170] = 0;
  _$jscoverage['/kissy.js'].lineData[171] = 0;
  _$jscoverage['/kissy.js'].lineData[172] = 0;
  _$jscoverage['/kissy.js'].lineData[173] = 0;
  _$jscoverage['/kissy.js'].lineData[174] = 0;
  _$jscoverage['/kissy.js'].lineData[175] = 0;
  _$jscoverage['/kissy.js'].lineData[176] = 0;
  _$jscoverage['/kissy.js'].lineData[177] = 0;
  _$jscoverage['/kissy.js'].lineData[178] = 0;
  _$jscoverage['/kissy.js'].lineData[179] = 0;
  _$jscoverage['/kissy.js'].lineData[182] = 0;
  _$jscoverage['/kissy.js'].lineData[183] = 0;
  _$jscoverage['/kissy.js'].lineData[184] = 0;
  _$jscoverage['/kissy.js'].lineData[185] = 0;
  _$jscoverage['/kissy.js'].lineData[186] = 0;
  _$jscoverage['/kissy.js'].lineData[187] = 0;
  _$jscoverage['/kissy.js'].lineData[188] = 0;
  _$jscoverage['/kissy.js'].lineData[189] = 0;
  _$jscoverage['/kissy.js'].lineData[190] = 0;
  _$jscoverage['/kissy.js'].lineData[191] = 0;
  _$jscoverage['/kissy.js'].lineData[195] = 0;
  _$jscoverage['/kissy.js'].lineData[196] = 0;
  _$jscoverage['/kissy.js'].lineData[199] = 0;
  _$jscoverage['/kissy.js'].lineData[200] = 0;
  _$jscoverage['/kissy.js'].lineData[201] = 0;
  _$jscoverage['/kissy.js'].lineData[204] = 0;
  _$jscoverage['/kissy.js'].lineData[213] = 0;
  _$jscoverage['/kissy.js'].lineData[220] = 0;
  _$jscoverage['/kissy.js'].lineData[222] = 0;
  _$jscoverage['/kissy.js'].lineData[232] = 0;
  _$jscoverage['/kissy.js'].lineData[236] = 0;
  _$jscoverage['/kissy.js'].lineData[237] = 0;
  _$jscoverage['/kissy.js'].lineData[252] = 0;
  _$jscoverage['/kissy.js'].lineData[261] = 0;
  _$jscoverage['/kissy.js'].lineData[268] = 0;
  _$jscoverage['/kissy.js'].lineData[275] = 0;
  _$jscoverage['/kissy.js'].lineData[282] = 0;
  _$jscoverage['/kissy.js'].lineData[286] = 0;
  _$jscoverage['/kissy.js'].lineData[287] = 0;
  _$jscoverage['/kissy.js'].lineData[288] = 0;
  _$jscoverage['/kissy.js'].lineData[289] = 0;
  _$jscoverage['/kissy.js'].lineData[290] = 0;
  _$jscoverage['/kissy.js'].lineData[293] = 0;
  _$jscoverage['/kissy.js'].lineData[301] = 0;
  _$jscoverage['/kissy.js'].lineData[303] = 0;
  _$jscoverage['/kissy.js'].lineData[322] = 0;
}
if (! _$jscoverage['/kissy.js'].functionData) {
  _$jscoverage['/kissy.js'].functionData = [];
  _$jscoverage['/kissy.js'].functionData[0] = 0;
  _$jscoverage['/kissy.js'].functionData[1] = 0;
  _$jscoverage['/kissy.js'].functionData[2] = 0;
  _$jscoverage['/kissy.js'].functionData[3] = 0;
  _$jscoverage['/kissy.js'].functionData[4] = 0;
  _$jscoverage['/kissy.js'].functionData[5] = 0;
  _$jscoverage['/kissy.js'].functionData[6] = 0;
  _$jscoverage['/kissy.js'].functionData[7] = 0;
  _$jscoverage['/kissy.js'].functionData[8] = 0;
  _$jscoverage['/kissy.js'].functionData[9] = 0;
  _$jscoverage['/kissy.js'].functionData[10] = 0;
  _$jscoverage['/kissy.js'].functionData[11] = 0;
  _$jscoverage['/kissy.js'].functionData[12] = 0;
  _$jscoverage['/kissy.js'].functionData[13] = 0;
  _$jscoverage['/kissy.js'].functionData[14] = 0;
}
if (! _$jscoverage['/kissy.js'].branchData) {
  _$jscoverage['/kissy.js'].branchData = {};
  _$jscoverage['/kissy.js'].branchData['127'] = [];
  _$jscoverage['/kissy.js'].branchData['127'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['130'] = [];
  _$jscoverage['/kissy.js'].branchData['130'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['138'] = [];
  _$jscoverage['/kissy.js'].branchData['138'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['139'] = [];
  _$jscoverage['/kissy.js'].branchData['139'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['145'] = [];
  _$jscoverage['/kissy.js'].branchData['145'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['163'] = [];
  _$jscoverage['/kissy.js'].branchData['163'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['165'] = [];
  _$jscoverage['/kissy.js'].branchData['165'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['166'] = [];
  _$jscoverage['/kissy.js'].branchData['166'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['168'] = [];
  _$jscoverage['/kissy.js'].branchData['168'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['169'] = [];
  _$jscoverage['/kissy.js'].branchData['169'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['170'] = [];
  _$jscoverage['/kissy.js'].branchData['170'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['172'] = [];
  _$jscoverage['/kissy.js'].branchData['172'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['175'] = [];
  _$jscoverage['/kissy.js'].branchData['175'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['176'] = [];
  _$jscoverage['/kissy.js'].branchData['176'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['177'] = [];
  _$jscoverage['/kissy.js'].branchData['177'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['177'][2] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['177'][3] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['177'][4] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['182'] = [];
  _$jscoverage['/kissy.js'].branchData['182'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['184'] = [];
  _$jscoverage['/kissy.js'].branchData['184'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['187'] = [];
  _$jscoverage['/kissy.js'].branchData['187'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['188'] = [];
  _$jscoverage['/kissy.js'].branchData['188'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['189'] = [];
  _$jscoverage['/kissy.js'].branchData['189'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['189'][2] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['189'][3] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['189'][4] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['195'] = [];
  _$jscoverage['/kissy.js'].branchData['195'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['199'] = [];
  _$jscoverage['/kissy.js'].branchData['199'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['199'][2] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['199'][3] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['200'] = [];
  _$jscoverage['/kissy.js'].branchData['200'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['220'] = [];
  _$jscoverage['/kissy.js'].branchData['220'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['232'] = [];
  _$jscoverage['/kissy.js'].branchData['232'][1] = new BranchData();
  _$jscoverage['/kissy.js'].branchData['236'] = [];
  _$jscoverage['/kissy.js'].branchData['236'][1] = new BranchData();
}
_$jscoverage['/kissy.js'].branchData['236'][1].init(8118, 9, '\'@DEBUG@\'');
function visit64_236_1(result) {
  _$jscoverage['/kissy.js'].branchData['236'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['232'][1].init(21, 12, 'pre || EMPTY');
function visit63_232_1(result) {
  _$jscoverage['/kissy.js'].branchData['232'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['220'][1].init(17, 9, '\'@DEBUG@\'');
function visit62_220_1(result) {
  _$jscoverage['/kissy.js'].branchData['220'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['200'][1].init(29, 19, 'cat && console[cat]');
function visit61_200_1(result) {
  _$jscoverage['/kissy.js'].branchData['200'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['199'][3].init(1803, 22, 'console.log && matched');
function visit60_199_3(result) {
  _$jscoverage['/kissy.js'].branchData['199'][3].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['199'][2].init(1770, 29, 'host[\'console\'] !== undefined');
function visit59_199_2(result) {
  _$jscoverage['/kissy.js'].branchData['199'][2].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['199'][1].init(1770, 55, 'host[\'console\'] !== undefined && console.log && matched');
function visit58_199_1(result) {
  _$jscoverage['/kissy.js'].branchData['199'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['195'][1].init(1585, 7, 'matched');
function visit57_195_1(result) {
  _$jscoverage['/kissy.js'].branchData['195'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['189'][4].init(315, 17, 'maxLevel >= level');
function visit56_189_4(result) {
  _$jscoverage['/kissy.js'].branchData['189'][4].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['189'][3].init(315, 38, 'maxLevel >= level && logger.match(reg)');
function visit55_189_3(result) {
  _$jscoverage['/kissy.js'].branchData['189'][3].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['189'][2].init(294, 17, 'minLevel <= level');
function visit54_189_2(result) {
  _$jscoverage['/kissy.js'].branchData['189'][2].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['189'][1].init(294, 59, 'minLevel <= level && maxLevel >= level && logger.match(reg)');
function visit53_189_1(result) {
  _$jscoverage['/kissy.js'].branchData['189'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['188'][1].init(213, 47, 'loggerLevel[l.minLevel] || loggerLevel[\'debug\']');
function visit52_188_1(result) {
  _$jscoverage['/kissy.js'].branchData['188'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['187'][1].init(125, 47, 'loggerLevel[l.maxLevel] || loggerLevel[\'error\']');
function visit51_187_1(result) {
  _$jscoverage['/kissy.js'].branchData['187'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['184'][1].init(74, 15, 'i < list.length');
function visit50_184_1(result) {
  _$jscoverage['/kissy.js'].branchData['184'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['182'][1].init(918, 25, 'list = loggerCfg.excludes');
function visit49_182_1(result) {
  _$jscoverage['/kissy.js'].branchData['182'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['177'][4].init(315, 17, 'maxLevel >= level');
function visit48_177_4(result) {
  _$jscoverage['/kissy.js'].branchData['177'][4].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['177'][3].init(315, 38, 'maxLevel >= level && logger.match(reg)');
function visit47_177_3(result) {
  _$jscoverage['/kissy.js'].branchData['177'][3].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['177'][2].init(294, 17, 'minLevel <= level');
function visit46_177_2(result) {
  _$jscoverage['/kissy.js'].branchData['177'][2].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['177'][1].init(294, 59, 'minLevel <= level && maxLevel >= level && logger.match(reg)');
function visit45_177_1(result) {
  _$jscoverage['/kissy.js'].branchData['177'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['176'][1].init(213, 47, 'loggerLevel[l.minLevel] || loggerLevel[\'debug\']');
function visit44_176_1(result) {
  _$jscoverage['/kissy.js'].branchData['176'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['175'][1].init(125, 47, 'loggerLevel[l.maxLevel] || loggerLevel[\'error\']');
function visit43_175_1(result) {
  _$jscoverage['/kissy.js'].branchData['175'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['172'][1].init(74, 15, 'i < list.length');
function visit42_172_1(result) {
  _$jscoverage['/kissy.js'].branchData['172'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['170'][1].init(264, 25, 'list = loggerCfg.includes');
function visit41_170_1(result) {
  _$jscoverage['/kissy.js'].branchData['170'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['169'][1].init(198, 40, 'loggerLevel[cat] || loggerLevel[\'debug\']');
function visit40_169_1(result) {
  _$jscoverage['/kissy.js'].branchData['169'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['168'][1].init(154, 14, 'cat || \'debug\'');
function visit39_168_1(result) {
  _$jscoverage['/kissy.js'].branchData['168'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['166'][1].init(37, 21, 'S.Config.logger || {}');
function visit38_166_1(result) {
  _$jscoverage['/kissy.js'].branchData['166'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['165'][1].init(54, 6, 'logger');
function visit37_165_1(result) {
  _$jscoverage['/kissy.js'].branchData['165'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['163'][1].init(17, 9, '\'@DEBUG@\'');
function visit36_163_1(result) {
  _$jscoverage['/kissy.js'].branchData['163'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['145'][1].init(25, 3, 'cfg');
function visit35_145_1(result) {
  _$jscoverage['/kissy.js'].branchData['145'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['139'][1].init(25, 3, 'cfg');
function visit34_139_1(result) {
  _$jscoverage['/kissy.js'].branchData['139'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['138'][1].init(66, 25, 'configValue === undefined');
function visit33_138_1(result) {
  _$jscoverage['/kissy.js'].branchData['138'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['130'][1].init(64, 2, 'fn');
function visit32_130_1(result) {
  _$jscoverage['/kissy.js'].branchData['130'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].branchData['127'][1].init(181, 22, 'S.isObject(configName)');
function visit31_127_1(result) {
  _$jscoverage['/kissy.js'].branchData['127'][1].ranCondition(result);
  return result;
}_$jscoverage['/kissy.js'].lineData[24]++;
var KISSY = (function(undefined) {
  _$jscoverage['/kissy.js'].functionData[0]++;
  _$jscoverage['/kissy.js'].lineData[25]++;
  var host = this, S, guid = 0, EMPTY = '';
  _$jscoverage['/kissy.js'].lineData[30]++;
  var loggerLevel = {
  'debug': 10, 
  'info': 20, 
  'warn': 30, 
  'error': 40};
  _$jscoverage['/kissy.js'].lineData[37]++;
  S = {
  __BUILD_TIME: '@TIMESTAMP@', 
  Env: {
  host: host}, 
  Config: {
  debug: '@DEBUG@', 
  fns: {}}, 
  version: '@VERSION@', 
  config: function(configName, configValue) {
  _$jscoverage['/kissy.js'].functionData[1]++;
  _$jscoverage['/kissy.js'].lineData[121]++;
  var cfg, r, self = this, fn, Config = S.Config, configFns = Config.fns;
  _$jscoverage['/kissy.js'].lineData[127]++;
  if (visit31_127_1(S.isObject(configName))) {
    _$jscoverage['/kissy.js'].lineData[128]++;
    S.each(configName, function(configValue, p) {
  _$jscoverage['/kissy.js'].functionData[2]++;
  _$jscoverage['/kissy.js'].lineData[129]++;
  fn = configFns[p];
  _$jscoverage['/kissy.js'].lineData[130]++;
  if (visit32_130_1(fn)) {
    _$jscoverage['/kissy.js'].lineData[131]++;
    fn.call(self, configValue);
  } else {
    _$jscoverage['/kissy.js'].lineData[133]++;
    Config[p] = configValue;
  }
});
  } else {
    _$jscoverage['/kissy.js'].lineData[137]++;
    cfg = configFns[configName];
    _$jscoverage['/kissy.js'].lineData[138]++;
    if (visit33_138_1(configValue === undefined)) {
      _$jscoverage['/kissy.js'].lineData[139]++;
      if (visit34_139_1(cfg)) {
        _$jscoverage['/kissy.js'].lineData[140]++;
        r = cfg.call(self);
      } else {
        _$jscoverage['/kissy.js'].lineData[142]++;
        r = Config[configName];
      }
    } else {
      _$jscoverage['/kissy.js'].lineData[145]++;
      if (visit35_145_1(cfg)) {
        _$jscoverage['/kissy.js'].lineData[146]++;
        r = cfg.call(self, configValue);
      } else {
        _$jscoverage['/kissy.js'].lineData[148]++;
        Config[configName] = configValue;
      }
    }
  }
  _$jscoverage['/kissy.js'].lineData[152]++;
  return r;
}, 
  log: function(msg, cat, logger) {
  _$jscoverage['/kissy.js'].functionData[3]++;
  _$jscoverage['/kissy.js'].lineData[163]++;
  if (visit36_163_1('@DEBUG@')) {
    _$jscoverage['/kissy.js'].lineData[164]++;
    var matched = 1;
    _$jscoverage['/kissy.js'].lineData[165]++;
    if (visit37_165_1(logger)) {
      _$jscoverage['/kissy.js'].lineData[166]++;
      var loggerCfg = visit38_166_1(S.Config.logger || {}), list, i, l, level, minLevel, maxLevel, reg;
      _$jscoverage['/kissy.js'].lineData[168]++;
      cat = visit39_168_1(cat || 'debug');
      _$jscoverage['/kissy.js'].lineData[169]++;
      level = visit40_169_1(loggerLevel[cat] || loggerLevel['debug']);
      _$jscoverage['/kissy.js'].lineData[170]++;
      if (visit41_170_1(list = loggerCfg.includes)) {
        _$jscoverage['/kissy.js'].lineData[171]++;
        matched = 0;
        _$jscoverage['/kissy.js'].lineData[172]++;
        for (i = 0; visit42_172_1(i < list.length); i++) {
          _$jscoverage['/kissy.js'].lineData[173]++;
          l = list[i];
          _$jscoverage['/kissy.js'].lineData[174]++;
          reg = l.logger;
          _$jscoverage['/kissy.js'].lineData[175]++;
          maxLevel = visit43_175_1(loggerLevel[l.maxLevel] || loggerLevel['error']);
          _$jscoverage['/kissy.js'].lineData[176]++;
          minLevel = visit44_176_1(loggerLevel[l.minLevel] || loggerLevel['debug']);
          _$jscoverage['/kissy.js'].lineData[177]++;
          if (visit45_177_1(visit46_177_2(minLevel <= level) && visit47_177_3(visit48_177_4(maxLevel >= level) && logger.match(reg)))) {
            _$jscoverage['/kissy.js'].lineData[178]++;
            matched = 1;
            _$jscoverage['/kissy.js'].lineData[179]++;
            break;
          }
        }
      } else {
        _$jscoverage['/kissy.js'].lineData[182]++;
        if (visit49_182_1(list = loggerCfg.excludes)) {
          _$jscoverage['/kissy.js'].lineData[183]++;
          matched = 1;
          _$jscoverage['/kissy.js'].lineData[184]++;
          for (i = 0; visit50_184_1(i < list.length); i++) {
            _$jscoverage['/kissy.js'].lineData[185]++;
            l = list[i];
            _$jscoverage['/kissy.js'].lineData[186]++;
            reg = l.logger;
            _$jscoverage['/kissy.js'].lineData[187]++;
            maxLevel = visit51_187_1(loggerLevel[l.maxLevel] || loggerLevel['error']);
            _$jscoverage['/kissy.js'].lineData[188]++;
            minLevel = visit52_188_1(loggerLevel[l.minLevel] || loggerLevel['debug']);
            _$jscoverage['/kissy.js'].lineData[189]++;
            if (visit53_189_1(visit54_189_2(minLevel <= level) && visit55_189_3(visit56_189_4(maxLevel >= level) && logger.match(reg)))) {
              _$jscoverage['/kissy.js'].lineData[190]++;
              matched = 0;
              _$jscoverage['/kissy.js'].lineData[191]++;
              break;
            }
          }
        }
      }
      _$jscoverage['/kissy.js'].lineData[195]++;
      if (visit57_195_1(matched)) {
        _$jscoverage['/kissy.js'].lineData[196]++;
        msg = logger + ': ' + msg;
      }
    }
    _$jscoverage['/kissy.js'].lineData[199]++;
    if (visit58_199_1(visit59_199_2(host['console'] !== undefined) && visit60_199_3(console.log && matched))) {
      _$jscoverage['/kissy.js'].lineData[200]++;
      console[visit61_200_1(cat && console[cat]) ? cat : 'log'](msg);
      _$jscoverage['/kissy.js'].lineData[201]++;
      return msg;
    }
  }
  _$jscoverage['/kissy.js'].lineData[204]++;
  return undefined;
}, 
  'getLogger': function(logger) {
  _$jscoverage['/kissy.js'].functionData[4]++;
  _$jscoverage['/kissy.js'].lineData[213]++;
  return getLogger(logger);
}, 
  error: function(msg) {
  _$jscoverage['/kissy.js'].functionData[5]++;
  _$jscoverage['/kissy.js'].lineData[220]++;
  if (visit62_220_1('@DEBUG@')) {
    _$jscoverage['/kissy.js'].lineData[222]++;
    throw msg instanceof Error ? msg : new Error(msg);
  }
}, 
  guid: function(pre) {
  _$jscoverage['/kissy.js'].functionData[6]++;
  _$jscoverage['/kissy.js'].lineData[232]++;
  return (visit63_232_1(pre || EMPTY)) + guid++;
}};
  _$jscoverage['/kissy.js'].lineData[236]++;
  if (visit64_236_1('@DEBUG@')) {
    _$jscoverage['/kissy.js'].lineData[237]++;
    S.Config.logger = {
  excludes: [{
  logger: /^s\/.*/, 
  maxLevel: 'info', 
  minLevel: 'debug'}]};
    _$jscoverage['/kissy.js'].lineData[252]++;
    function Logger() {
      _$jscoverage['/kissy.js'].functionData[7]++;
    }    _$jscoverage['/kissy.js'].lineData[261]++;
    Logger.prototype.debug = function(str) {
  _$jscoverage['/kissy.js'].functionData[8]++;
};
    _$jscoverage['/kissy.js'].lineData[268]++;
    Logger.prototype.info = function(str) {
  _$jscoverage['/kissy.js'].functionData[9]++;
};
    _$jscoverage['/kissy.js'].lineData[275]++;
    Logger.prototype.warn = function(str) {
  _$jscoverage['/kissy.js'].functionData[10]++;
};
    _$jscoverage['/kissy.js'].lineData[282]++;
    Logger.prototype.error = function(str) {
  _$jscoverage['/kissy.js'].functionData[11]++;
};
  }
  _$jscoverage['/kissy.js'].lineData[286]++;
  function getLogger(logger) {
    _$jscoverage['/kissy.js'].functionData[12]++;
    _$jscoverage['/kissy.js'].lineData[287]++;
    var obj = {};
    _$jscoverage['/kissy.js'].lineData[288]++;
    S.each(loggerLevel, function(_, cat) {
  _$jscoverage['/kissy.js'].functionData[13]++;
  _$jscoverage['/kissy.js'].lineData[289]++;
  obj[cat] = function(msg) {
  _$jscoverage['/kissy.js'].functionData[14]++;
  _$jscoverage['/kissy.js'].lineData[290]++;
  return S.log(msg, cat, logger);
};
});
    _$jscoverage['/kissy.js'].lineData[293]++;
    return obj;
  }
  _$jscoverage['/kissy.js'].lineData[301]++;
  S.Logger = {};
  _$jscoverage['/kissy.js'].lineData[303]++;
  S.Logger.Level = {
  'DEBUG': 'debug', 
  INFO: 'info', 
  WARN: 'warn', 
  ERROR: 'error'};
  _$jscoverage['/kissy.js'].lineData[322]++;
  return S;
})();

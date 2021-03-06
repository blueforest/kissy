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
if (! _$jscoverage['/io/methods.js']) {
  _$jscoverage['/io/methods.js'] = {};
  _$jscoverage['/io/methods.js'].lineData = [];
  _$jscoverage['/io/methods.js'].lineData[6] = 0;
  _$jscoverage['/io/methods.js'].lineData[7] = 0;
  _$jscoverage['/io/methods.js'].lineData[10] = 0;
  _$jscoverage['/io/methods.js'].lineData[17] = 0;
  _$jscoverage['/io/methods.js'].lineData[20] = 0;
  _$jscoverage['/io/methods.js'].lineData[32] = 0;
  _$jscoverage['/io/methods.js'].lineData[34] = 0;
  _$jscoverage['/io/methods.js'].lineData[37] = 0;
  _$jscoverage['/io/methods.js'].lineData[38] = 0;
  _$jscoverage['/io/methods.js'].lineData[41] = 0;
  _$jscoverage['/io/methods.js'].lineData[43] = 0;
  _$jscoverage['/io/methods.js'].lineData[44] = 0;
  _$jscoverage['/io/methods.js'].lineData[45] = 0;
  _$jscoverage['/io/methods.js'].lineData[46] = 0;
  _$jscoverage['/io/methods.js'].lineData[48] = 0;
  _$jscoverage['/io/methods.js'].lineData[53] = 0;
  _$jscoverage['/io/methods.js'].lineData[56] = 0;
  _$jscoverage['/io/methods.js'].lineData[57] = 0;
  _$jscoverage['/io/methods.js'].lineData[58] = 0;
  _$jscoverage['/io/methods.js'].lineData[59] = 0;
  _$jscoverage['/io/methods.js'].lineData[62] = 0;
  _$jscoverage['/io/methods.js'].lineData[63] = 0;
  _$jscoverage['/io/methods.js'].lineData[64] = 0;
  _$jscoverage['/io/methods.js'].lineData[68] = 0;
  _$jscoverage['/io/methods.js'].lineData[69] = 0;
  _$jscoverage['/io/methods.js'].lineData[71] = 0;
  _$jscoverage['/io/methods.js'].lineData[72] = 0;
  _$jscoverage['/io/methods.js'].lineData[74] = 0;
  _$jscoverage['/io/methods.js'].lineData[75] = 0;
  _$jscoverage['/io/methods.js'].lineData[76] = 0;
  _$jscoverage['/io/methods.js'].lineData[77] = 0;
  _$jscoverage['/io/methods.js'].lineData[79] = 0;
  _$jscoverage['/io/methods.js'].lineData[83] = 0;
  _$jscoverage['/io/methods.js'].lineData[86] = 0;
  _$jscoverage['/io/methods.js'].lineData[87] = 0;
  _$jscoverage['/io/methods.js'].lineData[89] = 0;
  _$jscoverage['/io/methods.js'].lineData[91] = 0;
  _$jscoverage['/io/methods.js'].lineData[92] = 0;
  _$jscoverage['/io/methods.js'].lineData[94] = 0;
  _$jscoverage['/io/methods.js'].lineData[96] = 0;
  _$jscoverage['/io/methods.js'].lineData[99] = 0;
  _$jscoverage['/io/methods.js'].lineData[102] = 0;
  _$jscoverage['/io/methods.js'].lineData[106] = 0;
  _$jscoverage['/io/methods.js'].lineData[107] = 0;
  _$jscoverage['/io/methods.js'].lineData[108] = 0;
  _$jscoverage['/io/methods.js'].lineData[117] = 0;
  _$jscoverage['/io/methods.js'].lineData[118] = 0;
  _$jscoverage['/io/methods.js'].lineData[128] = 0;
  _$jscoverage['/io/methods.js'].lineData[129] = 0;
  _$jscoverage['/io/methods.js'].lineData[130] = 0;
  _$jscoverage['/io/methods.js'].lineData[131] = 0;
  _$jscoverage['/io/methods.js'].lineData[132] = 0;
  _$jscoverage['/io/methods.js'].lineData[133] = 0;
  _$jscoverage['/io/methods.js'].lineData[136] = 0;
  _$jscoverage['/io/methods.js'].lineData[138] = 0;
  _$jscoverage['/io/methods.js'].lineData[143] = 0;
  _$jscoverage['/io/methods.js'].lineData[144] = 0;
  _$jscoverage['/io/methods.js'].lineData[145] = 0;
  _$jscoverage['/io/methods.js'].lineData[147] = 0;
  _$jscoverage['/io/methods.js'].lineData[157] = 0;
  _$jscoverage['/io/methods.js'].lineData[158] = 0;
  _$jscoverage['/io/methods.js'].lineData[159] = 0;
  _$jscoverage['/io/methods.js'].lineData[160] = 0;
  _$jscoverage['/io/methods.js'].lineData[162] = 0;
  _$jscoverage['/io/methods.js'].lineData[163] = 0;
  _$jscoverage['/io/methods.js'].lineData[172] = 0;
  _$jscoverage['/io/methods.js'].lineData[173] = 0;
  _$jscoverage['/io/methods.js'].lineData[174] = 0;
  _$jscoverage['/io/methods.js'].lineData[176] = 0;
  _$jscoverage['/io/methods.js'].lineData[180] = 0;
  _$jscoverage['/io/methods.js'].lineData[187] = 0;
  _$jscoverage['/io/methods.js'].lineData[188] = 0;
  _$jscoverage['/io/methods.js'].lineData[190] = 0;
  _$jscoverage['/io/methods.js'].lineData[191] = 0;
  _$jscoverage['/io/methods.js'].lineData[192] = 0;
  _$jscoverage['/io/methods.js'].lineData[193] = 0;
  _$jscoverage['/io/methods.js'].lineData[196] = 0;
  _$jscoverage['/io/methods.js'].lineData[197] = 0;
  _$jscoverage['/io/methods.js'].lineData[198] = 0;
  _$jscoverage['/io/methods.js'].lineData[200] = 0;
  _$jscoverage['/io/methods.js'].lineData[201] = 0;
  _$jscoverage['/io/methods.js'].lineData[202] = 0;
  _$jscoverage['/io/methods.js'].lineData[203] = 0;
  _$jscoverage['/io/methods.js'].lineData[205] = 0;
  _$jscoverage['/io/methods.js'].lineData[206] = 0;
  _$jscoverage['/io/methods.js'].lineData[207] = 0;
  _$jscoverage['/io/methods.js'].lineData[209] = 0;
  _$jscoverage['/io/methods.js'].lineData[214] = 0;
  _$jscoverage['/io/methods.js'].lineData[215] = 0;
  _$jscoverage['/io/methods.js'].lineData[219] = 0;
  _$jscoverage['/io/methods.js'].lineData[220] = 0;
  _$jscoverage['/io/methods.js'].lineData[222] = 0;
  _$jscoverage['/io/methods.js'].lineData[225] = 0;
  _$jscoverage['/io/methods.js'].lineData[226] = 0;
  _$jscoverage['/io/methods.js'].lineData[227] = 0;
  _$jscoverage['/io/methods.js'].lineData[255] = 0;
  _$jscoverage['/io/methods.js'].lineData[264] = 0;
  _$jscoverage['/io/methods.js'].lineData[265] = 0;
  _$jscoverage['/io/methods.js'].lineData[267] = 0;
  _$jscoverage['/io/methods.js'].lineData[268] = 0;
  _$jscoverage['/io/methods.js'].lineData[270] = 0;
  _$jscoverage['/io/methods.js'].lineData[271] = 0;
  _$jscoverage['/io/methods.js'].lineData[272] = 0;
  _$jscoverage['/io/methods.js'].lineData[283] = 0;
  _$jscoverage['/io/methods.js'].lineData[288] = 0;
}
if (! _$jscoverage['/io/methods.js'].functionData) {
  _$jscoverage['/io/methods.js'].functionData = [];
  _$jscoverage['/io/methods.js'].functionData[0] = 0;
  _$jscoverage['/io/methods.js'].functionData[1] = 0;
  _$jscoverage['/io/methods.js'].functionData[2] = 0;
  _$jscoverage['/io/methods.js'].functionData[3] = 0;
  _$jscoverage['/io/methods.js'].functionData[4] = 0;
  _$jscoverage['/io/methods.js'].functionData[5] = 0;
  _$jscoverage['/io/methods.js'].functionData[6] = 0;
  _$jscoverage['/io/methods.js'].functionData[7] = 0;
  _$jscoverage['/io/methods.js'].functionData[8] = 0;
  _$jscoverage['/io/methods.js'].functionData[9] = 0;
  _$jscoverage['/io/methods.js'].functionData[10] = 0;
  _$jscoverage['/io/methods.js'].functionData[11] = 0;
}
if (! _$jscoverage['/io/methods.js'].branchData) {
  _$jscoverage['/io/methods.js'].branchData = {};
  _$jscoverage['/io/methods.js'].branchData['32'] = [];
  _$jscoverage['/io/methods.js'].branchData['32'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['34'] = [];
  _$jscoverage['/io/methods.js'].branchData['34'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['37'] = [];
  _$jscoverage['/io/methods.js'].branchData['37'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['41'] = [];
  _$jscoverage['/io/methods.js'].branchData['41'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['44'] = [];
  _$jscoverage['/io/methods.js'].branchData['44'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['45'] = [];
  _$jscoverage['/io/methods.js'].branchData['45'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['53'] = [];
  _$jscoverage['/io/methods.js'].branchData['53'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['56'] = [];
  _$jscoverage['/io/methods.js'].branchData['56'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['57'] = [];
  _$jscoverage['/io/methods.js'].branchData['57'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['57'][2] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['57'][3] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['62'] = [];
  _$jscoverage['/io/methods.js'].branchData['62'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['62'][2] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['62'][3] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['68'] = [];
  _$jscoverage['/io/methods.js'].branchData['68'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['73'] = [];
  _$jscoverage['/io/methods.js'].branchData['73'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['74'] = [];
  _$jscoverage['/io/methods.js'].branchData['74'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['76'] = [];
  _$jscoverage['/io/methods.js'].branchData['76'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['86'] = [];
  _$jscoverage['/io/methods.js'].branchData['86'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['89'] = [];
  _$jscoverage['/io/methods.js'].branchData['89'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['91'] = [];
  _$jscoverage['/io/methods.js'].branchData['91'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['118'] = [];
  _$jscoverage['/io/methods.js'].branchData['118'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['129'] = [];
  _$jscoverage['/io/methods.js'].branchData['129'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['130'] = [];
  _$jscoverage['/io/methods.js'].branchData['130'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['138'] = [];
  _$jscoverage['/io/methods.js'].branchData['138'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['144'] = [];
  _$jscoverage['/io/methods.js'].branchData['144'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['158'] = [];
  _$jscoverage['/io/methods.js'].branchData['158'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['159'] = [];
  _$jscoverage['/io/methods.js'].branchData['159'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['173'] = [];
  _$jscoverage['/io/methods.js'].branchData['173'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['187'] = [];
  _$jscoverage['/io/methods.js'].branchData['187'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['193'] = [];
  _$jscoverage['/io/methods.js'].branchData['193'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['193'][2] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['193'][3] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['193'][4] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['193'][5] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['196'] = [];
  _$jscoverage['/io/methods.js'].branchData['196'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['205'] = [];
  _$jscoverage['/io/methods.js'].branchData['205'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['214'] = [];
  _$jscoverage['/io/methods.js'].branchData['214'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['225'] = [];
  _$jscoverage['/io/methods.js'].branchData['225'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['264'] = [];
  _$jscoverage['/io/methods.js'].branchData['264'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['267'] = [];
  _$jscoverage['/io/methods.js'].branchData['267'][1] = new BranchData();
  _$jscoverage['/io/methods.js'].branchData['285'] = [];
  _$jscoverage['/io/methods.js'].branchData['285'][1] = new BranchData();
}
_$jscoverage['/io/methods.js'].branchData['285'][1].init(89, 38, 'S.Uri.getComponents(c.url).query || ""');
function visit112_285_1(result) {
  _$jscoverage['/io/methods.js'].branchData['285'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['267'][1].init(3219, 19, 'h = config.complete');
function visit111_267_1(result) {
  _$jscoverage['/io/methods.js'].branchData['267'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['264'][1].init(3117, 19, 'h = config[handler]');
function visit110_264_1(result) {
  _$jscoverage['/io/methods.js'].branchData['264'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['225'][1].init(1669, 32, 'timeoutTimer = self.timeoutTimer');
function visit109_225_1(result) {
  _$jscoverage['/io/methods.js'].branchData['225'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['214'][1].init(25, 10, 'status < 0');
function visit108_214_1(result) {
  _$jscoverage['/io/methods.js'].branchData['214'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['205'][1].init(35, 12, 'e.stack || e');
function visit107_205_1(result) {
  _$jscoverage['/io/methods.js'].branchData['205'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['196'][1].init(162, 22, 'status == NOT_MODIFIED');
function visit106_196_1(result) {
  _$jscoverage['/io/methods.js'].branchData['196'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['193'][5].init(461, 22, 'status == NOT_MODIFIED');
function visit105_193_5(result) {
  _$jscoverage['/io/methods.js'].branchData['193'][5].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['193'][4].init(432, 25, 'status < MULTIPLE_CHOICES');
function visit104_193_4(result) {
  _$jscoverage['/io/methods.js'].branchData['193'][4].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['193'][3].init(411, 17, 'status >= OK_CODE');
function visit103_193_3(result) {
  _$jscoverage['/io/methods.js'].branchData['193'][3].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['193'][2].init(411, 46, 'status >= OK_CODE && status < MULTIPLE_CHOICES');
function visit102_193_2(result) {
  _$jscoverage['/io/methods.js'].branchData['193'][2].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['193'][1].init(411, 72, 'status >= OK_CODE && status < MULTIPLE_CHOICES || status == NOT_MODIFIED');
function visit101_193_1(result) {
  _$jscoverage['/io/methods.js'].branchData['193'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['187'][1].init(226, 15, 'self.state == 2');
function visit100_187_1(result) {
  _$jscoverage['/io/methods.js'].branchData['187'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['173'][1].init(52, 26, 'transport = this.transport');
function visit99_173_1(result) {
  _$jscoverage['/io/methods.js'].branchData['173'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['159'][1].init(106, 14, 'self.transport');
function visit98_159_1(result) {
  _$jscoverage['/io/methods.js'].branchData['159'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['158'][1].init(63, 21, 'statusText || \'abort\'');
function visit97_158_1(result) {
  _$jscoverage['/io/methods.js'].branchData['158'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['144'][1].init(54, 11, '!self.state');
function visit96_144_1(result) {
  _$jscoverage['/io/methods.js'].branchData['144'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['138'][1].init(536, 19, 'match === undefined');
function visit95_138_1(result) {
  _$jscoverage['/io/methods.js'].branchData['138'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['130'][1].init(25, 41, '!(responseHeaders = self.responseHeaders)');
function visit94_130_1(result) {
  _$jscoverage['/io/methods.js'].branchData['130'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['129'][1].init(78, 16, 'self.state === 2');
function visit93_129_1(result) {
  _$jscoverage['/io/methods.js'].branchData['129'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['118'][1].init(57, 16, 'self.state === 2');
function visit92_118_1(result) {
  _$jscoverage['/io/methods.js'].branchData['118'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['91'][1].init(127, 10, '!converter');
function visit91_91_1(result) {
  _$jscoverage['/io/methods.js'].branchData['91'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['89'][1].init(62, 46, 'converts[prevType] && converts[prevType][type]');
function visit90_89_1(result) {
  _$jscoverage['/io/methods.js'].branchData['89'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['86'][1].init(2376, 19, 'i < dataType.length');
function visit89_86_1(result) {
  _$jscoverage['/io/methods.js'].branchData['86'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['76'][1].init(92, 18, 'prevType == \'text\'');
function visit88_76_1(result) {
  _$jscoverage['/io/methods.js'].branchData['76'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['74'][1].init(153, 30, 'converter && rawData[prevType]');
function visit87_74_1(result) {
  _$jscoverage['/io/methods.js'].branchData['74'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['73'][1].init(59, 46, 'converts[prevType] && converts[prevType][type]');
function visit86_73_1(result) {
  _$jscoverage['/io/methods.js'].branchData['73'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['68'][1].init(1209, 13, '!responseData');
function visit85_68_1(result) {
  _$jscoverage['/io/methods.js'].branchData['68'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['62'][3].init(273, 17, 'xml !== undefined');
function visit84_62_3(result) {
  _$jscoverage['/io/methods.js'].branchData['62'][3].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['62'][2].init(237, 32, 'dataType[dataTypeIndex] == \'xml\'');
function visit83_62_2(result) {
  _$jscoverage['/io/methods.js'].branchData['62'][2].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['62'][1].init(237, 53, 'dataType[dataTypeIndex] == \'xml\' && xml !== undefined');
function visit82_62_1(result) {
  _$jscoverage['/io/methods.js'].branchData['62'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['57'][3].init(58, 18, 'text !== undefined');
function visit81_57_3(result) {
  _$jscoverage['/io/methods.js'].branchData['57'][3].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['57'][2].init(21, 33, 'dataType[dataTypeIndex] == \'text\'');
function visit80_57_2(result) {
  _$jscoverage['/io/methods.js'].branchData['57'][2].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['57'][1].init(21, 55, 'dataType[dataTypeIndex] == \'text\' && text !== undefined');
function visit79_57_1(result) {
  _$jscoverage['/io/methods.js'].branchData['57'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['56'][1].init(749, 31, 'dataTypeIndex < dataType.length');
function visit78_56_1(result) {
  _$jscoverage['/io/methods.js'].branchData['56'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['53'][1].init(660, 21, 'dataType[0] || \'text\'');
function visit77_53_1(result) {
  _$jscoverage['/io/methods.js'].branchData['53'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['45'][1].init(29, 19, 'dataType[0] != type');
function visit76_45_1(result) {
  _$jscoverage['/io/methods.js'].branchData['45'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['44'][1].init(25, 32, 'contents[type].test(contentType)');
function visit75_44_1(result) {
  _$jscoverage['/io/methods.js'].branchData['44'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['41'][1].init(213, 16, '!dataType.length');
function visit74_41_1(result) {
  _$jscoverage['/io/methods.js'].branchData['41'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['37'][1].init(126, 18, 'dataType[0] == \'*\'');
function visit73_37_1(result) {
  _$jscoverage['/io/methods.js'].branchData['37'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['34'][1].init(28, 51, 'io.mimeType || io.getResponseHeader(\'Content-Type\')');
function visit72_34_1(result) {
  _$jscoverage['/io/methods.js'].branchData['34'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].branchData['32'][1].init(414, 11, 'text || xml');
function visit71_32_1(result) {
  _$jscoverage['/io/methods.js'].branchData['32'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/methods.js'].lineData[6]++;
KISSY.add(function(S) {
  _$jscoverage['/io/methods.js'].functionData[0]++;
  _$jscoverage['/io/methods.js'].lineData[7]++;
  var module = this, Promise = module.require('promise'), IO = module.require('./base');
  _$jscoverage['/io/methods.js'].lineData[10]++;
  var OK_CODE = 200, logger = S.getLogger('s/logger'), MULTIPLE_CHOICES = 300, NOT_MODIFIED = 304, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg;
  _$jscoverage['/io/methods.js'].lineData[17]++;
  function handleResponseData(io) {
    _$jscoverage['/io/methods.js'].functionData[1]++;
    _$jscoverage['/io/methods.js'].lineData[20]++;
    var text = io.responseText, xml = io.responseXML, c = io.config, converts = c.converters, type, contentType, responseData, contents = c.contents, dataType = c.dataType;
    _$jscoverage['/io/methods.js'].lineData[32]++;
    if (visit71_32_1(text || xml)) {
      _$jscoverage['/io/methods.js'].lineData[34]++;
      contentType = visit72_34_1(io.mimeType || io.getResponseHeader('Content-Type'));
      _$jscoverage['/io/methods.js'].lineData[37]++;
      while (visit73_37_1(dataType[0] == '*')) {
        _$jscoverage['/io/methods.js'].lineData[38]++;
        dataType.shift();
      }
      _$jscoverage['/io/methods.js'].lineData[41]++;
      if (visit74_41_1(!dataType.length)) {
        _$jscoverage['/io/methods.js'].lineData[43]++;
        for (type in contents) {
          _$jscoverage['/io/methods.js'].lineData[44]++;
          if (visit75_44_1(contents[type].test(contentType))) {
            _$jscoverage['/io/methods.js'].lineData[45]++;
            if (visit76_45_1(dataType[0] != type)) {
              _$jscoverage['/io/methods.js'].lineData[46]++;
              dataType.unshift(type);
            }
            _$jscoverage['/io/methods.js'].lineData[48]++;
            break;
          }
        }
      }
      _$jscoverage['/io/methods.js'].lineData[53]++;
      dataType[0] = visit77_53_1(dataType[0] || 'text');
      _$jscoverage['/io/methods.js'].lineData[56]++;
      for (var dataTypeIndex = 0; visit78_56_1(dataTypeIndex < dataType.length); dataTypeIndex++) {
        _$jscoverage['/io/methods.js'].lineData[57]++;
        if (visit79_57_1(visit80_57_2(dataType[dataTypeIndex] == 'text') && visit81_57_3(text !== undefined))) {
          _$jscoverage['/io/methods.js'].lineData[58]++;
          responseData = text;
          _$jscoverage['/io/methods.js'].lineData[59]++;
          break;
        } else {
          _$jscoverage['/io/methods.js'].lineData[62]++;
          if (visit82_62_1(visit83_62_2(dataType[dataTypeIndex] == 'xml') && visit84_62_3(xml !== undefined))) {
            _$jscoverage['/io/methods.js'].lineData[63]++;
            responseData = xml;
            _$jscoverage['/io/methods.js'].lineData[64]++;
            break;
          }
        }
      }
      _$jscoverage['/io/methods.js'].lineData[68]++;
      if (visit85_68_1(!responseData)) {
        _$jscoverage['/io/methods.js'].lineData[69]++;
        var rawData = {
  text: text, 
  xml: xml};
        _$jscoverage['/io/methods.js'].lineData[71]++;
        S.each(['text', 'xml'], function(prevType) {
  _$jscoverage['/io/methods.js'].functionData[2]++;
  _$jscoverage['/io/methods.js'].lineData[72]++;
  var type = dataType[0], converter = visit86_73_1(converts[prevType] && converts[prevType][type]);
  _$jscoverage['/io/methods.js'].lineData[74]++;
  if (visit87_74_1(converter && rawData[prevType])) {
    _$jscoverage['/io/methods.js'].lineData[75]++;
    dataType.unshift(prevType);
    _$jscoverage['/io/methods.js'].lineData[76]++;
    responseData = visit88_76_1(prevType == 'text') ? text : xml;
    _$jscoverage['/io/methods.js'].lineData[77]++;
    return false;
  }
  _$jscoverage['/io/methods.js'].lineData[79]++;
  return undefined;
});
      }
    }
    _$jscoverage['/io/methods.js'].lineData[83]++;
    var prevType = dataType[0];
    _$jscoverage['/io/methods.js'].lineData[86]++;
    for (var i = 1; visit89_86_1(i < dataType.length); i++) {
      _$jscoverage['/io/methods.js'].lineData[87]++;
      type = dataType[i];
      _$jscoverage['/io/methods.js'].lineData[89]++;
      var converter = visit90_89_1(converts[prevType] && converts[prevType][type]);
      _$jscoverage['/io/methods.js'].lineData[91]++;
      if (visit91_91_1(!converter)) {
        _$jscoverage['/io/methods.js'].lineData[92]++;
        throw 'no covert for ' + prevType + ' => ' + type;
      }
      _$jscoverage['/io/methods.js'].lineData[94]++;
      responseData = converter(responseData);
      _$jscoverage['/io/methods.js'].lineData[96]++;
      prevType = type;
    }
    _$jscoverage['/io/methods.js'].lineData[99]++;
    io.responseData = responseData;
  }
  _$jscoverage['/io/methods.js'].lineData[102]++;
  S.extend(IO, Promise, {
  setRequestHeader: function(name, value) {
  _$jscoverage['/io/methods.js'].functionData[3]++;
  _$jscoverage['/io/methods.js'].lineData[106]++;
  var self = this;
  _$jscoverage['/io/methods.js'].lineData[107]++;
  self.requestHeaders[name] = value;
  _$jscoverage['/io/methods.js'].lineData[108]++;
  return self;
}, 
  getAllResponseHeaders: function() {
  _$jscoverage['/io/methods.js'].functionData[4]++;
  _$jscoverage['/io/methods.js'].lineData[117]++;
  var self = this;
  _$jscoverage['/io/methods.js'].lineData[118]++;
  return visit92_118_1(self.state === 2) ? self.responseHeadersString : null;
}, 
  getResponseHeader: function(name) {
  _$jscoverage['/io/methods.js'].functionData[5]++;
  _$jscoverage['/io/methods.js'].lineData[128]++;
  var match, self = this, responseHeaders;
  _$jscoverage['/io/methods.js'].lineData[129]++;
  if (visit93_129_1(self.state === 2)) {
    _$jscoverage['/io/methods.js'].lineData[130]++;
    if (visit94_130_1(!(responseHeaders = self.responseHeaders))) {
      _$jscoverage['/io/methods.js'].lineData[131]++;
      responseHeaders = self.responseHeaders = {};
      _$jscoverage['/io/methods.js'].lineData[132]++;
      while ((match = rheaders.exec(self.responseHeadersString))) {
        _$jscoverage['/io/methods.js'].lineData[133]++;
        responseHeaders[match[1]] = match[2];
      }
    }
    _$jscoverage['/io/methods.js'].lineData[136]++;
    match = responseHeaders[name];
  }
  _$jscoverage['/io/methods.js'].lineData[138]++;
  return visit95_138_1(match === undefined) ? null : match;
}, 
  overrideMimeType: function(type) {
  _$jscoverage['/io/methods.js'].functionData[6]++;
  _$jscoverage['/io/methods.js'].lineData[143]++;
  var self = this;
  _$jscoverage['/io/methods.js'].lineData[144]++;
  if (visit96_144_1(!self.state)) {
    _$jscoverage['/io/methods.js'].lineData[145]++;
    self.mimeType = type;
  }
  _$jscoverage['/io/methods.js'].lineData[147]++;
  return self;
}, 
  abort: function(statusText) {
  _$jscoverage['/io/methods.js'].functionData[7]++;
  _$jscoverage['/io/methods.js'].lineData[157]++;
  var self = this;
  _$jscoverage['/io/methods.js'].lineData[158]++;
  statusText = visit97_158_1(statusText || 'abort');
  _$jscoverage['/io/methods.js'].lineData[159]++;
  if (visit98_159_1(self.transport)) {
    _$jscoverage['/io/methods.js'].lineData[160]++;
    self.transport.abort(statusText);
  }
  _$jscoverage['/io/methods.js'].lineData[162]++;
  self._ioReady(0, statusText);
  _$jscoverage['/io/methods.js'].lineData[163]++;
  return self;
}, 
  getNativeXhr: function() {
  _$jscoverage['/io/methods.js'].functionData[8]++;
  _$jscoverage['/io/methods.js'].lineData[172]++;
  var transport;
  _$jscoverage['/io/methods.js'].lineData[173]++;
  if (visit99_173_1(transport = this.transport)) {
    _$jscoverage['/io/methods.js'].lineData[174]++;
    return transport.nativeXhr;
  }
  _$jscoverage['/io/methods.js'].lineData[176]++;
  return null;
}, 
  _ioReady: function(status, statusText) {
  _$jscoverage['/io/methods.js'].functionData[9]++;
  _$jscoverage['/io/methods.js'].lineData[180]++;
  var self = this;
  _$jscoverage['/io/methods.js'].lineData[187]++;
  if (visit100_187_1(self.state == 2)) {
    _$jscoverage['/io/methods.js'].lineData[188]++;
    return;
  }
  _$jscoverage['/io/methods.js'].lineData[190]++;
  self.state = 2;
  _$jscoverage['/io/methods.js'].lineData[191]++;
  self.readyState = 4;
  _$jscoverage['/io/methods.js'].lineData[192]++;
  var isSuccess;
  _$jscoverage['/io/methods.js'].lineData[193]++;
  if (visit101_193_1(visit102_193_2(visit103_193_3(status >= OK_CODE) && visit104_193_4(status < MULTIPLE_CHOICES)) || visit105_193_5(status == NOT_MODIFIED))) {
    _$jscoverage['/io/methods.js'].lineData[196]++;
    if (visit106_196_1(status == NOT_MODIFIED)) {
      _$jscoverage['/io/methods.js'].lineData[197]++;
      statusText = 'not modified';
      _$jscoverage['/io/methods.js'].lineData[198]++;
      isSuccess = true;
    } else {
      _$jscoverage['/io/methods.js'].lineData[200]++;
      try {
        _$jscoverage['/io/methods.js'].lineData[201]++;
        handleResponseData(self);
        _$jscoverage['/io/methods.js'].lineData[202]++;
        statusText = 'success';
        _$jscoverage['/io/methods.js'].lineData[203]++;
        isSuccess = true;
      }      catch (e) {
  _$jscoverage['/io/methods.js'].lineData[205]++;
  S.log(visit107_205_1(e.stack || e), 'error');
  _$jscoverage['/io/methods.js'].lineData[206]++;
  setTimeout(function() {
  _$jscoverage['/io/methods.js'].functionData[10]++;
  _$jscoverage['/io/methods.js'].lineData[207]++;
  throw e;
}, 0);
  _$jscoverage['/io/methods.js'].lineData[209]++;
  statusText = 'parser error';
}
    }
  } else {
    _$jscoverage['/io/methods.js'].lineData[214]++;
    if (visit108_214_1(status < 0)) {
      _$jscoverage['/io/methods.js'].lineData[215]++;
      status = 0;
    }
  }
  _$jscoverage['/io/methods.js'].lineData[219]++;
  self.status = status;
  _$jscoverage['/io/methods.js'].lineData[220]++;
  self.statusText = statusText;
  _$jscoverage['/io/methods.js'].lineData[222]++;
  var defer = self.defer, config = self.config, timeoutTimer;
  _$jscoverage['/io/methods.js'].lineData[225]++;
  if (visit109_225_1(timeoutTimer = self.timeoutTimer)) {
    _$jscoverage['/io/methods.js'].lineData[226]++;
    clearTimeout(timeoutTimer);
    _$jscoverage['/io/methods.js'].lineData[227]++;
    self.timeoutTimer = 0;
  }
  _$jscoverage['/io/methods.js'].lineData[255]++;
  var handler = isSuccess ? 'success' : 'error', h, v = [self.responseData, statusText, self], context = config.context, eventObject = {
  ajaxConfig: config, 
  io: self};
  _$jscoverage['/io/methods.js'].lineData[264]++;
  if (visit110_264_1(h = config[handler])) {
    _$jscoverage['/io/methods.js'].lineData[265]++;
    h.apply(context, v);
  }
  _$jscoverage['/io/methods.js'].lineData[267]++;
  if (visit111_267_1(h = config.complete)) {
    _$jscoverage['/io/methods.js'].lineData[268]++;
    h.apply(context, v);
  }
  _$jscoverage['/io/methods.js'].lineData[270]++;
  IO.fire(handler, eventObject);
  _$jscoverage['/io/methods.js'].lineData[271]++;
  IO.fire('complete', eventObject);
  _$jscoverage['/io/methods.js'].lineData[272]++;
  defer[isSuccess ? 'resolve' : 'reject'](v);
}, 
  _getUrlForSend: function() {
  _$jscoverage['/io/methods.js'].functionData[11]++;
  _$jscoverage['/io/methods.js'].lineData[283]++;
  var c = this.config, uri = c.uri, originalQuery = visit112_285_1(S.Uri.getComponents(c.url).query || ""), url = uri.toString.call(uri, c.serializeArray);
  _$jscoverage['/io/methods.js'].lineData[288]++;
  return url + (originalQuery ? ((uri.query.has() ? '&' : '?') + originalQuery) : originalQuery);
}});
});

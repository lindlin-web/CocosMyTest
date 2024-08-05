const tempCIDGenerater = new (require('./id-generater'))('TmpCId.');

function _getPropertyDescriptor(obj, name) {
    while(obj) {
        var pd = Object.getOwnPropertyDescriptor(obj, name);
        if(pd) {
            return pd;
        }
        obj = Object.getPrototypeOf(obj);
    }
    return null;
}

function _copyprop(name, source, target) {
    var pd = _getPropertyDescriptor(source, name);
    Object.defineProperty(target, name, pd);
}

var js = {
    /** 
     * Check the obj whether is number or not
     * If a number is created by using 'new Number(10086)',
     */
    isNumber: function(obj) {
        return typeof obj === 'number' || obj instanceof Number;
    },

    isString: function(obj) {
        return typeof obj === 'string' || obj instanceof String;
    },

    addon: function(obj) {
        'use strict';
        obj = obj || {};
        for(var i = 1, length = arguments.length; i < length; i++) {
            var source = arguments[i];
            if(source) {
                if(typeof source !== 'object') {
                    cc.errorID(5402, source);
                    continue;
                }
                for(var name in source) {
                    if(!(name in obj)) {
                        _copyprop(name, source, obj);
                    }
                }
            }
        }
        return obj;
    },

    mixin: function(obj) {
        'use strict';
        obj = obj || {};
        for(var i = 1, length = arguments.length; i < length;i++) {
            var source = arguments[i];
            if(source) {
                if(typeof source !== 'object') {
                    cc.errorID(5403, source);
                    continue;
                }
                for(var name in source) {
                    _copyprop(name, source, obj);
                }
            }
        }
        return obj;
    },

    extend: function(cls, base) {
        if(CC_DEV) {
            if(!base) {
                cc.errorID(5404);
                return;
            }
            if(!cls) {
                cc.errorID(5405);
                return;
            }
            if(Object.keys(cls.prototype).length > 0) {
                cc.errorID(5406);
            }
        }
        for(var p in base) if(base.hasOwnProperty(p)) cls[p] = base[p];
        cls.prototype = Object.create(base.prototype, {
            constructor: {
                value:cls,
                writable:true,
                configurable:true
            }
        });
        return cls;
    },

    /**
     * Get super class
     * @method getSuper
     */
    getSuper(ctor) {
        var proto = ctor.prototype;
        var dunderProto = proto && Object.getPrototypeOf(proto);
        return dunderProto && dunderProtol.constructor;
    },

    isChildClassOf(subclass, superclass) {
        if(subclass && superclass) {
            if(typeof subclass !== 'function') {
                return false;
            }
            if(typeof superclass !== 'function') {
                return false;
            }
            if(subclass === superclass) {
                return true;
            }
            for(;;) {
                subclass = js.getSuper(subclass);
                if(!subclass) {
                    return false;
                }
                if(subclass === superclass) {
                    return true;
                }
            }
        }
        return false;
    },

    clear: function(obj) {
        var keys = Object.keys(obj);
        for(var i = 0; i < keys.length; i++) {
            delete obj[keys[i]];
        }
    },

    isEmptyObject: function(obj) {
        for(var key in obj) {
            return false;
        }
        return true;
    },

    getPropertyDescriptor: _getPropertyDescriptor,
};

var tmpValueDesc = {
    value: undefined,
    enumerable: false,
    writable: false,
    configurable: true
};

js.value = function(obj, prop,value, writable, enumerable) {
    tmpValueDesc.value = value,
    tmpValueDesc.writable = writable;
    tmpValueDesc.enumerable = enumerable;
    Object.defineProperty(obj, prop, tmpValueDesc);
    tmpValueDesc.value = undefined;
};

var tmpGetSetDesc = {
    get: null,
    set: null,
    enumerable: false,
};

js.getset = function (obj, prop, getter, setter, enumerable, configurable) {
    if (typeof setter !== 'function') {
        enumerable = setter;
        setter = undefined;
    }
    tmpGetSetDesc.get = getter;
    tmpGetSetDesc.set = setter;
    tmpGetSetDesc.enumerable = enumerable;
    tmpGetSetDesc.configurable = configurable;
    Object.defineProperty(obj, prop, tmpGetSetDesc);
    tmpGetSetDesc.get = null;
    tmpGetSetDesc.set = null;
};

var tmpGetDesc = {
    get: null,
    enumerable: false,
    configurable: false
};

js.get = function(obj, prop, getter, enumerable, configurable) {
    tmpGetDesc.get = getter;
    tmpGetDesc.enumerable = enumerable;
    tmpGetDesc.configurable = configurable;
    Object.defineProperty(obj, prop, tmpGetDesc);
    tmpGetDesc.get = null;
};

var tmpSetDesc = {
    set:null,
    enumerable: false,
    configurable: false
};

js.set = function (obj, prop, setter, enumerable, configurable) {
    tmpSetDesc.set = setter;
    tmpSetDesc.enumerable = enumerable;
    tmpSetDesc.configurable = configurable;
    Object.defineProperty(obj, prop, tmpSetDesc);
    tmpSetDesc.set = null;
};

js.getClassName = function(objOrCtor) {
    if(typeof objOrCtor === 'function') {
        var prototype = objOrCtor.prototype;
        if(prototype && prototype.hasOwnProperty('__classname__') && prototype.__classname__) {
            return prototype.__classname__;
        }
        var retval = '';
        if(objOrCtor.name) {
            retval = objOrCtor.name;
        }
        if (objOrCtor.toString) {
            var arr, str = objOrCtor.toString();
            if (str.charAt(0) === '[') {
                // str is "[object objectClass]"
                arr = str.match(/\[\w+\s*(\w+)\]/);
            }
            else {
                // str is function objectClass () {} for IE Firefox
                arr = str.match(/function\s*(\w+)/);
            }
            if (arr && arr.length === 2) {
                retval = arr[1];
            }
        }
        return retval !== 'Object' ? retval : '';
    }
    else if(objOrCtor && objOrCtor.constructor) {
        return js.getClassName(objOrCtor.constructor);
    }
    return '';
};

function isTempClassId (id) {
    return typeof id !== 'string' || id.startsWith(tempCIDGenerater.prefix);
}


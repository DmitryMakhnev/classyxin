var index = 1;

//utils

/**
 *
 * @param {Object} objectForm
 * @param {Object} objectTo
 * @param {Function} [filter]
 * @return {Object} objectTo
 */
function mergeObject (objectForm, objectTo, filter) {
    for (var p in objectForm) {
        if (objectForm.hasOwnProperty(p)
            && (!filter || filter(p))) {
            objectTo[p] = objectForm[p];
        }
    }
    return objectTo
}


/**
 *
 * @param {String} property
 * @return {Boolean}
 */
function mergePrototypesFilter (property) {
    switch (property){
        case 'init':
        case 'destructor':
        case '__Constructor':
        case 'construct':
            return false;
    }
    return true;
}

/**
 *
 * @param {Array} arrayFrom
 * @param {Array} arrayTo
 * @return {Array} arrayTo
 */
function mergeArrays (arrayFrom, arrayTo) {
    for (var i = 0, iMax = arrayFrom.length; i < iMax; i += 1) {
        arrayTo.push(arrayFrom[i]);
    }
    return arrayTo;
}


/**
 *
 * @param {Array} collections
 * @return {Boolean}
 */
function collectionContainsElements (collections) {
    return collections.length !== 0;
}

var isArray;

if (Array.isArray) {
    isArray = Array.isArray;
} else {
    var toString = Object.prototype.toString;

    /**
    *
    * @param {*} verifiable
    * @return {boolean}
    */
    isArray = function (verifiable) {
        return toString.call(verifiable) === '[object Array]';
    }
}

/**
 *
 * @return {ClassConstructor}
 */
function createClassConstructor () {
    function ClassConstructor () {
        var self = this;
        var initCollection = self.__Constructor.__inits;

        if (initCollection) {
            var i = 0;
            var iMax = initCollection.length;

            for (; i < iMax; i += 1) {
                initCollection[i].apply(self, arguments);
            }
        }

        if (self.construct) {
            self.construct.apply(self, arguments);
        }

        return self;
    }

    ClassConstructor.__cmId = index;
    ClassConstructor.prototype.__Constructor = ClassConstructor;
    index += 1;

    return ClassConstructor;
}

function commonDestructor () {
    var self = this;
    var destructorCollection = self.__Constructor.__destructors;

    if (destructorCollection) {
        var i = destructorCollection.length;
        while (i--) {
            destructorCollection[i].apply(self, arguments);
        }
    }
}

/**
 *
 * @param {ClassConstructor} ClassConstructor
 * @param {Object} settings
 * @param {Boolean} [notAutoDestruct]
 * @constructor
 */
function ParentConfigurator (ClassConstructor, settings, notAutoDestruct) {
    var parentConfigurator = this;
    parentConfigurator.parent = ClassConstructor;
    parentConfigurator.settings = settings;
    parentConfigurator.notAutoDestruct = notAutoDestruct || false;
}

ParentConfigurator.prototype.destructor = function () {
    var parentConfigurator = this;
    parentConfigurator.parent = null;
    parentConfigurator.settings = null;
};

/**
 *
 * @param {Object} base
 * @constructor
 */
function Mixin (base) {
    var mixin = this;
    mixin.base = base;
    mixin.__mixinId = index;
    index += 1;
}

Mixin.prototype.destructor = function () {
    var mixin = this;
    mixin.base = null;
    mixin.__mixinId = null;
};


//parts detectors

/**
 *
 * @param {*} verifiable
 * @return {boolean}
 */
function isParent (verifiable) {
    return typeof verifiable === 'function';
}

/**
 *
 * @param {*} verifiable
 * @return {boolean}
 */
function isParentConfiguration (verifiable) {
    return verifiable instanceof ParentConfigurator;
}

/**
 *
 * @param {*} verifiable
 * @return {boolean}
 */
function isMixin (verifiable) {
    return verifiable instanceof Mixin;
}

/**
 *
 * @param {*} verifiable
 * @return {boolean}
 */
function isClassPrototype (verifiable) {
    return !isParent(verifiable)
        && !isParentConfiguration(verifiable)
        && !isMixin(verifiable);
}


///**
// *
// * @param {Object} [prototypePart]
// * @param {ClassConstructor} [ParentConstructor]
// * @param {Boolean} [isNeedInitParent]
// * @return {ClassConstructor}
// */
function createClass () {

    //parse arguments
    var args = arguments;
    var classPrototype;
    var lastArgument;

    if (args.length > 0) {
        lastArgument = args[args.length - 1];

        if (isClassPrototype(lastArgument)) {
            classPrototype = lastArgument;
        }
    }

    var prototypeExtend;
    var prototypeExtendPart = null;

    var classesIds = [];
    var mixinsIds = [];
    var inits = [];
    var destructors = [];

    function processingParent (parent, parentSettings) {
        //add parent parents ids
        if (parent.__classesIds) {
            mergeArrays(parent.__classesIds, classesIds);
        }
        //add parent id
        if (parent.__cmId) {
            classesIds.push(parent.__cmId);
        }

        //add parent inits
        if (parent.__inits) {
            mergeArrays(parent.__inits, inits);
        }

        //check need parent init
        if (parent.prototype.init
            && parentSettings
            && (parentSettings.needInit === false)) {
            inits.pop();
        }

        //add parent mixins ids
        if (parent.__mixinsIds) {
            mergeArrays(parent.__mixinsIds, mixinsIds);
        }
        
        //add parent destructors
        if (parent.__destructors) {
            mergeArrays(parent.__destructors, destructors);
        }

        //check need parent init
        if (parent.prototype.destructor
            && parentSettings
            && (parentSettings.needDestructor === false)) {
            destructors.pop();
        }


        prototypeExtendPart = parent.prototype;
    }

    var i;
    var iMax;
    var argument;

    for (i = 0, iMax = args.length; i < iMax; i += 1) {
        argument = args[i];
        
        if (isParent(argument)) {
            processingParent(argument);

        } else if (isParentConfiguration(argument)) {
            processingParent(argument.parent, argument.settings);
            if (!argument.notAutoDestruct) {
                argument.destructor();
            }

        } else if (isMixin(argument)) {
            mixinsIds.push(argument.__mixinId);
            prototypeExtendPart = argument.base;
        }

        if (prototypeExtendPart) {
            if (!prototypeExtend) {
                prototypeExtend = {};
            }

            mergeObject(
                prototypeExtendPart, 
                prototypeExtend, 
                mergePrototypesFilter
            );

            prototypeExtendPart = null;
        }
    }

    //processing prototype
    if (prototypeExtend) {
        if (classPrototype) {
            mergeObject(classPrototype, prototypeExtend);
        }
        classPrototype = prototypeExtend;
    }

    //create class constructor
    var ClassConstructor = createClassConstructor();

    if (classPrototype) {
        ClassConstructor.prototype = classPrototype;
    }

    var ClassConstructorPrototype = ClassConstructor.prototype;

    ClassConstructorPrototype.__Constructor = ClassConstructor;

    //extend class data from class
    classesIds.push(ClassConstructor.__cmId);
    
    if (ClassConstructorPrototype.destructor) {
        destructors.push(ClassConstructorPrototype.destructor);
    }
    
    if (ClassConstructorPrototype.init) {
        inits.push(ClassConstructorPrototype.init);
    }
    
    //extend class constructors
    ClassConstructor.__classesIds = classesIds;
    
    if (collectionContainsElements(mixinsIds)) {
        ClassConstructor.__mixinsIds = mixinsIds;    
    }
    
    if (collectionContainsElements(inits)) {
        ClassConstructor.__inits = inits;
    }

    if (collectionContainsElements(destructors)) {
        ClassConstructor.__destructors = destructors;
    }
    

    ClassConstructorPrototype.destructor = commonDestructor;

    return ClassConstructor;
}

var classyxin = {
    /**
     *
     * @return {ClassConstructor}
     */
    createClassConstructor: createClassConstructor,

    //export ParentConfigurator constructor
    ParentConfigurator: ParentConfigurator,

    /**
     *
     * @param {ClassConstructor} Parent
     * @param {Object} settings
     * @param {Boolean} [notAutoDestruct]
     * @return {ParentConfigurator}
     */
    configureParent: function (Parent, settings, notAutoDestruct) {
        return new ParentConfigurator(Parent, settings, notAutoDestruct);
    },

    //export Mixin constructor
    Mixin: Mixin,

    /**
     *
     * @param {Object} base
     * @return {Mixin}
     */
    createMixin: function (base) {
        return new Mixin(base);
    },

    /**
     *
     * @param {Object} [prototypePart]
     * @param {ClassConstructor} [ParentConstructor]
     * @param {Boolean} [isNeedInitParent]
     * @return {ClassConstructor}
     */
    createClass: createClass,

    /**
     *
     * @param {Object} instance
     * @param {ClassConstructor} VerifiableConstructor
     * @return {boolean}
     */
    instanceOf: function (instance, VerifiableConstructor) {
        var Constructor = instance.__Constructor;
        if (Constructor) {
            var classesIds = Constructor.__classesIds;
            if (classesIds) {
                return classesIds.indexOf(VerifiableConstructor.__cmId) !== -1;
            }
        }
        return false;
    },

    /**
     *
     * @param {Object} mixInstance
     * @param {Mixin} mixin
     * @return {boolean}
     */
    hasMixin: function (mixInstance, mixin) {
        var Constructor = mixInstance.__Constructor;
        if (Constructor) {
            var mixinsIds = Constructor.__mixinsIds;
            if (mixinsIds) {
                return mixinsIds.indexOf(mixin.__mixinId) !== -1;
            }
        }
        return false;
    },

    /**
     *
     * @param {Object} instance
     * @param {ClassConstructor} ParentClass
     * @param {*|Array} param
     * @return {Object} instance
     */
    callConstruct: function (instance, ParentClass, param) {
        var constructor = ParentClass.prototype.construct;
        if (constructor) {
            if (isArray(param)) {
                constructor.apply(instance, param);
            } else {
                constructor.call(instance, param);
            }
        }
        return instance;
    }
};

module.exports = classyxin;
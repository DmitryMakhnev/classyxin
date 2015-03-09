var SAVE_ITEM_CODE = true;
var IGNORE_ITEM_CODE = false;

function indexParentsAndMixins (CommonConstructor) {
    var initCollections = [];
    var destructorCollections = [];
    var commonConstructorsStack = [CommonConstructor];
    var statesStack = [SAVE_ITEM_CODE];
    var mixinsIds = [];
    var classesIds = [];

    while (commonConstructorsStack.length) {
        var code = statesStack.shift();
        var CommonConstructorFromStack = commonConstructorsStack.shift();

        classesIds.push(CommonConstructorFromStack.__cmId);

        var commonConstructorPrototype = CommonConstructorFromStack.prototype;
        if ((code !== IGNORE_ITEM_CODE)
            && commonConstructorPrototype) {

            if (commonConstructorPrototype.init) {
                initCollections.unshift(commonConstructorPrototype.init);
            }

            if (CommonConstructorFromStack.__destructor) {
                destructorCollections.unshift(CommonConstructorFromStack.__destructor);
            } else if (commonConstructorPrototype.destructor
                && (commonConstructorPrototype.destructor !== commonDestructor)) {
                destructorCollections.unshift(commonConstructorPrototype.destructor);
            }
        }

        var ParentConstructor = CommonConstructorFromStack.__ParentConstructor;
        if (ParentConstructor) {
            commonConstructorsStack.unshift(ParentConstructor);
            statesStack.unshift(CommonConstructorFromStack.__isInitParent ? SAVE_ITEM_CODE : IGNORE_ITEM_CODE);
        }

        var Mixins = CommonConstructorFromStack.__Mixins;
        if (Mixins) {
            var i = 0;
            var iMax = Mixins.length;

            for (; i < iMax; i += 1) {
                commonConstructorsStack.unshift(Mixins[i]);
                statesStack.unshift(SAVE_ITEM_CODE);
                mixinsIds.push(Mixins[i].__cmId);
            }
        }

    }

    CommonConstructor.__classesIds = classesIds;
    CommonConstructor.__mixinsIds = mixinsIds;
    CommonConstructor.__inits = initCollections;
    CommonConstructor.__destructors = destructorCollections;

    return initCollections;
}

/*@DTesting.exports*/

var defaultTestingExports = require('default-testing').exports;
var getObjectSafely = require('default-lib').getObjectSafely;
getObjectSafely(defaultTestingExports, 'classyxin').indexParentsAndMixins = indexParentsAndMixins;

/*@/DTesting.exports*/


var index = 1;


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
 * @param {Function} Constructor
 * @param {Object} prototypePart
 */
function extendConstructorPrototype (Constructor, prototypePart) {
    var constructorPrototype = Constructor.prototype;
    for (var p in prototypePart) {
        if (prototypePart.hasOwnProperty(p)) {
            constructorPrototype[p] = prototypePart[p];
        }
    }
    return constructorPrototype;
}

/**
 *
 * @return {CommonConstructor}
 */
function createCommonConstructor () {
    function CommonConstructor () {
        var self = this;
        var initCollection = self.__Constructor.__inits;

        if (initCollection) {
            var i = 0;
            var iMax = initCollection.length;

            for (; i < iMax; i += 1) {
                initCollection[i].apply(self, arguments);
            }
        }

        return self;
    }

    CommonConstructor.__cmId = index;
    CommonConstructor.prototype.__Constructor = CommonConstructor;
    index += 1;

    return CommonConstructor;
}

/**
 *
 * @param {Object} [prototypePart]
 * @param {CommonConstructor} [ParentConstructor]
 * @param {Boolean} [isNeedInitParent]
 * @return {CommonConstructor}
 */
function createClass (prototypePart, ParentConstructor, isNeedInitParent) {
    var CommonConstructor = createCommonConstructor();
    var hasProto = true;

    if (!prototypePart) {
        hasProto = false;
    }

    var commonConstructorPrototype;

    if (ParentConstructor) {
        extendConstructorPrototype(CommonConstructor, ParentConstructor.prototype);

        //save parent data
        CommonConstructor.__ParentConstructor = ParentConstructor;
        CommonConstructor.__isInitParent = isNeedInitParent !== false;

        if (hasProto) {
            extendConstructorPrototype(CommonConstructor, prototypePart);
        }

        indexParentsAndMixins(CommonConstructor);

        commonConstructorPrototype = CommonConstructor.prototype;
        if (commonConstructorPrototype.destructor) {
            CommonConstructor.__destructor = commonConstructorPrototype.destructor;
        }

        commonConstructorPrototype.destructor = commonDestructor;

    } else {
        //add working props
        CommonConstructor.__classesIds = [CommonConstructor.__cmId];
        CommonConstructor.__inits = [];

        if (hasProto) {
            extendConstructorPrototype(CommonConstructor, prototypePart);
            if (prototypePart.init) {
                CommonConstructor.__inits.push(prototypePart.init);
            }
        }
    }

    CommonConstructor.prototype.__Constructor = CommonConstructor;

    return CommonConstructor;
}

var classyxin = {

    /**
     *
     * @return {CommonConstructor}
     */
    createCommonConstructor: createCommonConstructor,

    /**
     *
     * @param {Function} Constructor
     * @param {Object} prototypePart
     */
    extendConstructorPrototype: extendConstructorPrototype,

    /**
     *
     * @param {Object} [prototypePart]
     * @param {CommonConstructor} [ParentConstructor]
     * @param {Boolean} [isNeedInitParent]
     * @return {CommonConstructor}
     */
    createClass: createClass,

    /**
     *
     * @param {Object} instance
     * @param {CommonConstructor} VerifiableConstructor
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
     * @param {Object} [prototypePart]
     * @param {CommonConstructor} [ParentConstructor]
     * @param {Boolean} [isNeedInitParent]
     * @return {CommonConstructor}
     */
    createMixin: createClass,

    /**
     *
     * @param {Object|Null} prototypePart
     * @param {CommonConstructor|Array} Mixin
     * @return {CommonConstructor}
     */
    createMix: function (prototypePart, Mixin) {
        var mixinsCollection;
        var i = 0;
        var hasPrototypePart = true;

        //prepare createMix prototype
        if (typeof prototypePart === 'function') {
            mixinsCollection = arguments;
            hasPrototypePart = false;
        } else if (isArray(prototypePart)) {
            mixinsCollection = prototypePart;
            hasPrototypePart = false;
        } else if (prototypePart === null){
            hasPrototypePart = false;
        }

        //prepare  mixins
        if (!mixinsCollection) {
            if (typeof Mixin === 'function') {
                mixinsCollection = arguments;
                i = 1;
            } else {
                mixinsCollection = Mixin;
            }
        }

        var CommonConstructor = createCommonConstructor();

        var commonConstructorPrototype;
        if (hasPrototypePart) {
            commonConstructorPrototype = extendConstructorPrototype(CommonConstructor, prototypePart)
        } else {
            commonConstructorPrototype = CommonConstructor.prototype;
        }

        //copy all Mixins constructors prototypes properties in createMix prototype
        var mixinPrototype;
        var Mixins = [];
        for (var iMax = mixinsCollection.length; i < iMax; i += 1) {
            Mixins.push(mixinsCollection[i]);
            mixinPrototype = mixinsCollection[i].prototype;
            for (var p in mixinPrototype) {
                if (mixinPrototype.hasOwnProperty(p)) {
                    commonConstructorPrototype[p] = mixinPrototype[p];
                }
            }
        }

        //restore prototypePart and build prototype
        if (hasPrototypePart) {
            if (prototypePart.init) {
                commonConstructorPrototype.init = prototypePart.init;
            }
            if (prototypePart.destructor) {

                commonConstructorPrototype.destructor = prototypePart.destructor;
            }
        }

        //extend prototype
        commonConstructorPrototype.__Constructor = CommonConstructor;
        CommonConstructor.__Mixins = Mixins;

        indexParentsAndMixins(CommonConstructor);

        //save destructor
        if (commonConstructorPrototype.destructor) {
            CommonConstructor.__destructor = commonConstructorPrototype.destructor;
        }

        //add common destructor
        commonConstructorPrototype.destructor = commonDestructor;

        return CommonConstructor;
    },

    /**
     *
     * @param {Object} mixInstance
     * @param {CommonConstructor} MixinConstructor
     * @return {boolean}
     */
    hasMixin: function (mixInstance, MixinConstructor) {
        var Constructor = mixInstance.__Constructor;
        if (Constructor) {
            var mixinsIds = Constructor.__mixinsIds;
            if (mixinsIds) {
                return mixinsIds.indexOf(MixinConstructor.__cmId) !== -1;
            }
        }
        return false;
    }
};

module.exports = classyxin;








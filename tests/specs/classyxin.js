var classyxin = require('classyxin');
var classyxinDefaultTestingExports = require('default-testing').exports.classyxin;

//TODO: [dmitry.makhnev] check hasMixin

describe('classyxin tests', function () {

    it('is define', function () {
        expect(classyxin).toBeDefined();
    });

    describe('indexParentsAndMixins', function () {
        var indexParentsAndMixins = classyxinDefaultTestingExports.indexParentsAndMixins;

        it('was exported', function () {
            expect(indexParentsAndMixins).toBeDefined();
        });

        it('isFunction', function () {
            expect(indexParentsAndMixins).toEqual(jasmine.any(Function));
        });

        var multiClassesTreeFixture = require('../fixtures/multiClassesTree.js');

        it('fixture is define', function () {
            expect(multiClassesTreeFixture).toBeDefined();
        });

        describe('correct work', function () {

            indexParentsAndMixins(multiClassesTreeFixture);

            it('has correct parents __classesIds', function () {
                expect(multiClassesTreeFixture.__classesIds).toEqual([10, 8, 7, 6, 5, 4, 3, 2, 1, 22, 21, 9, 11, 12]);
            });

            it('has correct parents __mixinsIds', function () {
                expect(multiClassesTreeFixture.__mixinsIds).toEqual([4, 8, 6, 7, 1, 2]);
            });

        });

    });

    describe('classes', function () {
        
        describe('createCommonConstructor', function () {

            it('return function', function () {
                var CommonConstructor = classyxin.createCommonConstructor();
                expect(CommonConstructor).toEqual(jasmine.any(Function));
            });

            it('create instance of CommonConstructor', function () {
                var CommonConstructor = classyxin.createCommonConstructor();
                var instance = new CommonConstructor();
                expect(instance).toEqual(jasmine.any(Object));
            });

        });

        describe('createClass', function () {

            describe('create simple class', function () {

                it('return function', function () {
                    var CXClass = classyxin.createClass();
                    expect(CXClass).toEqual(jasmine.any(Function));
                });

                it('instance', function () {
                    var CXClass = classyxin.createClass();
                    var instance = new CXClass();
                    expect(instance).toEqual(jasmine.any(Object));
                });

            });

            describe('create class', function () {

                it('has properties in proto', function () {
                    var CXClass = classyxin.createClass({
                            booleanProp: true,
                            method: function () {}
                        });

                    expect(CXClass.prototype.booleanProp).toBe(true);
                    expect(CXClass.prototype.method).toEqual(jasmine.any(Function));
                });

                it('instance has property', function () {
                    var CXClass = classyxin.createClass({
                            booleanProp: true,
                            method: function () {}
                        });
                    var instance = new CXClass();

                    expect(instance.booleanProp).toBe(true);
                    expect(instance.method).toEqual(jasmine.any(Function));
                });

                it('call init in constructor', function () {
                    var CXClass = classyxin.createClass({
                            booleanProp: true,
                            init: function () {
                                this.booleanProp = false;
                            }
                        });
                    
                    var instance = new CXClass();

                    expect(instance.booleanProp).toBe(false);
                });

            });

            describe('create class with parent', function () {

                var Parent = classyxin.createClass({
                        counter: 0,
                        init: function () {
                            this.counter += 1;
                        } 
                    });

                var Child;
                var childInstance;

                describe('Child', function () {
                    it('create', function () {
                        Child = classyxin.createClass(
                            {
                                childProp: 0,
                                init: function () {
                                    this.counter *= 3;
                                }
                            },
                            Parent
                        );
                        expect(Child).toEqual(jasmine.any(Function));
                    });

                    it('init', function () {
                        childInstance = new Child();

                        expect(childInstance).toEqual(jasmine.any(Object));
                    });

                    it('correct properties', function () {
                        expect(childInstance.counter).toEqual(jasmine.any(Number));
                        expect(childInstance.init).toEqual(jasmine.any(Function));
                        expect(childInstance.childProp).toBe(0);
                    });

                    it('correct init results', function () {
                        expect(childInstance.counter).toBe(3);
                    });


                    it('instance of Parent', function () {
                        expect(classyxin.instanceOf(childInstance, Parent)).toBeTruthy();
                    });

                    it('instance of Child', function () {
                        expect(classyxin.instanceOf(childInstance, Child)).toBeTruthy();
                    });

                });


                var SubChild;
                var subChildInstance;

                describe('SubChild', function () {
                    it('create', function () {
                        SubChild = classyxin.createClass(
                            {
                                subChildProp: 0,
                                init: function () {
                                    this.counter -= 2;
                                }
                            },
                            Child,
                            false
                        );
                        expect(Child).toEqual(jasmine.any(Function));
                    });

                    it('init', function () {
                        subChildInstance = new SubChild();
                        expect(subChildInstance).toEqual(jasmine.any(Object));
                    });

                    it('correct properties', function () {
                        expect(subChildInstance.counter).toEqual(jasmine.any(Number));
                        expect(subChildInstance.init).toEqual(jasmine.any(Function));
                        expect(subChildInstance.childProp).toBe(0);
                        expect(subChildInstance.subChildProp).toBe(0);
                    });

                    it('correct init results', function () {
                        expect(subChildInstance.counter).toBe(-1);
                    });

                    it('instance of Parent', function () {
                        expect(classyxin.instanceOf(subChildInstance, Parent)).toBeTruthy();
                    });

                    it('instance of Child', function () {
                        expect(classyxin.instanceOf(subChildInstance, Child)).toBeTruthy();
                    });

                    it('instance of SubChild', function () {
                        expect(classyxin.instanceOf(subChildInstance, SubChild)).toBeTruthy();
                    });

                });



            });



        });
        
    });

    var Events = classyxin.createMixin({
        _listeners: null,
        _handlers: null,

        init: function () {
            this._listeners = [];
            this._handlers = [];
        },

        on: function () {},
        off: function () {}
    });

    var List = classyxin.createMixin({
        _list: null,

        init: function () {
            this._list = [];
        },

        push: function () {},
        pop: function () {},
        shift: function () {},
        unsift: function () {}
    });

    var Observer = classyxin.createMixin({
        model: null,

        init: function (model) {
            if (model) {
                this.model = model;
            }
        },

        bindModel: function (model) {
            this.model = model;
        },

        onChange: function () {},
        offChange: function () {}

    });

    describe('mixins', function () {

        it('create Mix', function () {
            var Mix = classyxin.createMix(
                {
                    type: '',
                    init: function (model, type) {
                        this.type = type;
                    }
                },
                Events,
                Observer,
                List
            );
            expect(Mix).toEqual(jasmine.any(Function));
            expect(Mix.prototype.__Constructor).toEqual(jasmine.any(Function));
        });


        function checkMix (mixInstance, needCheckMixProp) {
            it('is object', function () {
                expect(mixInstance).toEqual(jasmine.any(Object));
            });

            describe('correct properties', function () {

                it('has Events properties', function () {
                    expect(mixInstance._listeners).toEqual([]);
                    expect(mixInstance._handlers).toEqual([]);
                    expect(mixInstance.on).toEqual(jasmine.any(Function));
                    expect(mixInstance.off).toEqual(jasmine.any(Function));
                });

                it('has Observer properties', function () {
                    expect(mixInstance.model).toEqual(jasmine.any(Object));
                    expect(mixInstance.bindModel).toEqual(jasmine.any(Function));
                    expect(mixInstance.onChange).toEqual(jasmine.any(Function));
                    expect(mixInstance.offChange).toEqual(jasmine.any(Function));
                });

                it('has List properties', function () {
                    expect(mixInstance._list).toEqual([]);
                    expect(mixInstance.push).toEqual(jasmine.any(Function));
                    expect(mixInstance.pop).toEqual(jasmine.any(Function));
                    expect(mixInstance.shift).toEqual(jasmine.any(Function));
                    expect(mixInstance.unsift).toEqual(jasmine.any(Function));
                });

                if (needCheckMixProp !== false) {
                    it('has Mix properties', function () {
                        expect(mixInstance.type).toBeDefined();
                    });
                }

            });

            describe('correct init', function () {

                it('Observer init', function () {
                    expect(mixInstance.model.lib).toBe('classyxin');
                });

                if (needCheckMixProp !== false) {
                    it('Mix init', function () {
                        expect(mixInstance.type).toBe('default');
                    });
                }

            });
        }


        describe('default mix', function () {
            var Mix = classyxin.createMix(
                {
                    type: '',
                    init: function (model, type) {
                        this.type = type;
                    }
                },
                Events,
                Observer,
                List
            );

            var mixInstance = new Mix(
                {
                    lib: 'classyxin'
                },
                'default'
            );

            checkMix(mixInstance);
        });

        describe('mix with array', function () {
            var Mix = new classyxin.createMix(
                {
                    type: '',
                    init: function (model, type) {
                        this.type = type
                    }
                },
                [Events, Observer, List]
            );

            var mixInstanceWithArray = new Mix(
                {lib: 'classyxin'},
                'default'
            );
            checkMix(mixInstanceWithArray);
        });

        describe('mix instance without prototype object', function () {
            var Mix = new classyxin.createMix(
                null,
                [Events, Observer, List]
            );
            var mixInstanceWithoutPrototypeObject = new Mix(
                {lib: 'classyxin'}
            );
            checkMix(mixInstanceWithoutPrototypeObject, false);
        });

        describe('create mix instance with array only', function () {
            var Mix = new classyxin.createMix(
                [Events, Observer, List]
            );
            var mixInstanceWithArrayOnly = new Mix(
                {lib: 'classyxin'}
            );
            checkMix(mixInstanceWithArrayOnly, false);
        });

    });
    
    describe('createMix with deep chains of classes', function () {
        var Parent = classyxin.createClass({
                counter: 0,
                parentProp: 'parent',
                init: function () {
                    this.counter += 1;
                }
            });

        var Child = classyxin.createClass(
                {
                    childProp: 'child',
                    init: function () {
                        this.counter *= 100;
                    }
                },
                Parent
            );

        var SubChild = classyxin.createClass(
                {
                    subChildProp: 'subChild',
                    init: function () {
                        this.counter -= 2;
                    }
                },
                Child,
                false
            );

        var Mix = classyxin.createMix(
            {
                mixProp: 'mix',
                type: '',
                init: function (model, type) {
                    this.counter *= 2;
                    this.type = type;
                }
            },
            Events,
            Observer,
            List
        );

        var MixWithMixesAndNestedClasses;

        it('create mix', function () {
            MixWithMixesAndNestedClasses = classyxin.createMix(
                {
                    init: function () {
                        this.counter += 4;
                    }
                },
                SubChild,
                Mix
            );
            expect(MixWithMixesAndNestedClasses).toEqual(jasmine.any(Function));
        });

        var mixInstance;
        it('create instance of mix', function () {
            mixInstance = new MixWithMixesAndNestedClasses(
                {
                    lib: 'classyxin'
                },
                'default'
            );
            expect(mixInstance).toEqual(jasmine.any(Object));
        });

        describe('correct properties', function () {

            it('has Events properties', function () {
                expect(mixInstance._listeners).toEqual([]);
                expect(mixInstance._handlers).toEqual([]);
                expect(mixInstance.on).toEqual(jasmine.any(Function));
                expect(mixInstance.off).toEqual(jasmine.any(Function));
            });

            it('has Observer properties', function () {
                expect(mixInstance.model).toEqual(jasmine.any(Object));
                expect(mixInstance.bindModel).toEqual(jasmine.any(Function));
                expect(mixInstance.onChange).toEqual(jasmine.any(Function));
                expect(mixInstance.offChange).toEqual(jasmine.any(Function));
            });

            it('has List properties', function () {
                expect(mixInstance._list).toEqual([]);
                expect(mixInstance.push).toEqual(jasmine.any(Function));
                expect(mixInstance.pop).toEqual(jasmine.any(Function));
                expect(mixInstance.shift).toEqual(jasmine.any(Function));
                expect(mixInstance.unsift).toEqual(jasmine.any(Function));
            });

            it('Parent properties', function () {
                expect(mixInstance.parentProp).toBeDefined();
            });

            it('Child properties', function () {
                expect(mixInstance.childProp).toBeDefined();
            });

            it('SubChild properties', function () {
                expect(mixInstance.subChildProp).toBeDefined();
            });

            it('has Mix properties', function () {
                expect(mixInstance.type).toBeDefined();
            });


        });

        describe('correct init', function () {

            it('Observer init', function () {
                expect(mixInstance.model.lib).toBe('classyxin');
            });


            it('Mix init', function () {
                expect(mixInstance.type).toBe('default');
            });

            it('counter init', function () {
                expect(mixInstance.counter).toBe(2);
            });


        });

    });

    describe('child with mix parent', function () {
        var Mixin1 = classyxin.createMixin({
            mixin1Prop: 'mixin1',
            init: function () {
                this.counter += 1;
            }
        });
        var Mixin2 = classyxin.createMixin({
            mixin1Prop: 'mixin2',
            init: function () {
                this.counter += 1;
            }
        });
        var Mix = classyxin.createMix(
            {
                mixProto: 'mix',
                init: function () {
                    this.counter += 2;
                }
            },
            Mixin1,
            Mixin2
        );
        var ChildOfMix = classyxin.createClass(
            {
                counter: 0,
                init: function () {
                    this.counter /= 2;
                }
            },
            Mix
        );

        var instanceChildOfMix = new ChildOfMix();

        it('correctInit', function () {
            expect(instanceChildOfMix.counter).toBe(2);
        });

    });

    describe('destructors', function () {
        var Parent = classyxin.createClass({
            counter: 0,
            init: function () {
                this.counter += 1;
            },
            destructor: function () {
                this.counter -= 1;
            }
        });

        var Child = classyxin.createClass(
            {
                init: function () {
                    this.counter *= 2;
                },
                destructor: function () {
                    this.counter /= 2;
                }
            },
            Parent
        );

        var SubChild = classyxin.createClass(
            {
                init: function () {
                    this.counter /= .5;
                },
                destructor: function () {
                    this.counter *= .5;
                }
            },
            Child,
            false
        );

        it('single class destructor', function () {
            var parentInstance = new Parent();
            parentInstance.destructor();
            expect(parentInstance.counter).toBe(0);
        });

        it('chain classes destructor', function () {
            var childInstance = new Child();
            childInstance.destructor();
            expect(childInstance.counter).toBe(0);
        });

        it('chain classes destructor', function () {
            var subInstance = new SubChild();
            subInstance.destructor();
            expect(subInstance.counter).toBe(0);
        });

        var Mixin1 = classyxin.createMixin({
            init: function () {
                this.counter += 1;
            },
            destructor: function () {
                this.counter -= 1;
            }
        });

        var Mixin2 = classyxin.createMixin({
            init: function () {
                this.counter *= 3;
            },
            destructor: function () {
                this.counter /= 3;
            }
        });

        var Mix = classyxin.createMix(
            {
                counter: 0,
                init: function () {
                    this.counter /= 3;
                },
                destructor: function () {
                    this.counter *= 3;
                }
            },
            Mixin1,
            Mixin2
        );

        it('mixin destructor', function () {
            var mixInstance = new Mix();
            expect(mixInstance.counter).toBe(1);
            mixInstance.destructor();
            expect(mixInstance.counter).toBe(0);
        });

        var MixWithSubChild = classyxin.createMix(
            {
                init: function () {
                    this.counter += 10;
                },
                destructor: function () {
                    this.counter -= 10;
                }
            },
            SubChild,
            Mix
        );

        var mixWithSubChildInstance;

        it('correct init', function () {
            mixWithSubChildInstance = new MixWithSubChild();
            expect(mixWithSubChildInstance.counter).toBe(13);
        });

        it('correct destruction', function () {
            mixWithSubChildInstance.destructor();
            expect(mixWithSubChildInstance.counter).toBe(0);
        });


    });



});
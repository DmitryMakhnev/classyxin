var classyxin = require('classyxin');

describe('classyxin tests', function () {

    it('is define', function () {
        expect(classyxin).toBeDefined();
    });

    describe('classes', function () {
        
        describe('createClassConstructor', function () {

            it('return function', function () {
                var ClassConstructor = classyxin.createClassConstructor();
                expect(ClassConstructor).toEqual(jasmine.any(Function));
            });

            it('create instance of ClassConstructor', function () {
                var ClassConstructor = classyxin.createClassConstructor();
                var instance = new ClassConstructor();
                expect(instance).toEqual(jasmine.any(Object));
            });

        });

        describe('configureParent', function () {
            var configuredParent;

            var ClassConstructor = classyxin.createClassConstructor();
            var settings = {
                    needInit: false
                };

            it('has ParentConfigurator constructor', function () {
                expect(classyxin.ParentConfigurator).toEqual(jasmine.any(Function));
            });

            it('created', function () {
                configuredParent = classyxin.configureParent(
                    ClassConstructor,
                    settings
                );
            });

            it('correct properties', function () {
                expect(configuredParent.parent).toBe(ClassConstructor);
                expect(configuredParent.settings).toBe(settings);
            });

            it('destructor works', function () {
                configuredParent.destructor();
            });

            it('correct destruction', function () {
                expect(configuredParent.parent).toBe(null);
                expect(configuredParent.settings).toBe(null);
            });

        });
        
        describe('mixin', function () {
            var mixin;

            it('has Mixin constructor', function () {
                expect(classyxin.Mixin).toEqual(jasmine.any(Function));
            });

            it('created', function () {
                mixin = classyxin.createMixin({
                    foo: 'bar',
                    num: 1
                });
            });

            it('correct base properties', function () {
                expect(mixin.base.foo).toBe('bar');
                expect(mixin.base.num).toBe(1);
            });

            it('destructor works', function () {
                mixin.destructor();
            });

            it('correct destruction', function () {
                expect(mixin.base).toBe(null);
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
                            Parent,
                            {
                                childProp: 0,
                                init: function () {
                                    this.counter *= 3;
                                }
                            }
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
                            classyxin.configureParent(
                                Child, {
                                    needInit: false
                                }
                            ),
                            {
                                subChildProp: 0,
                                init: function () {
                                    this.counter -= 2;
                                }
                            }
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

    //var Events = classyxin.createMixin({
    //    _listeners: null,
    //    _handlers: null,
    //
    //    init: function () {
    //        this._listeners = [];
    //        this._handlers = [];
    //    },
    //
    //    on: function () {},
    //    off: function () {}
    //});
    //
    //var List = classyxin.createMixin({
    //    _list: null,
    //
    //    init: function () {
    //        this._list = [];
    //    },
    //
    //    push: function () {},
    //    pop: function () {},
    //    shift: function () {},
    //    unsift: function () {}
    //});
    //
    //var Observer = classyxin.createMixin({
    //    model: null,
    //
    //    init: function (model) {
    //        if (model) {
    //            this.model = model;
    //        }
    //    },
    //
    //    bindModel: function (model) {
    //        this.model = model;
    //    },
    //
    //    onChange: function () {},
    //    offChange: function () {}
    //
    //});

    //TODO: [dmitry.makhnev] mixins tests
    //TODO: [dmitry.makhnev] classes without auto inits and destructor tests


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

    });



});
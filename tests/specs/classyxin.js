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

            describe('createClass with mixin', function () {

                var mixin = classyxin.createMixin({
                    mixinMethod: function () {
                        this.counter += 2;
                    },
                    mixinProp: 22
                });

                var ParentClass = classyxin.createClass({
                    counter: 0,
                    init: function () {
                        this.counter += 3;
                    }
                });

                var ChildClass = classyxin.createClass(
                    mixin,
                    ParentClass,
                    {
                        init: function () {
                            this.mixinMethod();
                            this.counter /= 5;
                        }
                    }
                );

                var childClassInstance = new ChildClass();

                it('has mixin method', function () {
                    expect(childClassInstance.mixinMethod).toEqual(jasmine.any(Function));
                });

                it('has mixin prop', function () {
                    expect(childClassInstance.mixinProp).toBe(22);
                });

                it('correct init', function () {
                    expect(childClassInstance.counter).toBe(1);
                });

                it('hasMixin', function () {
                    expect(classyxin.hasMixin(childClassInstance, mixin)).toBeTruthy();
                });

            });

            describe('createClass with deep multiple inheritance and mixins', function () {

                var mixin = classyxin.createMixin({
                    mixinMethod: function () {
                        this.counter += 2;
                    }
                });

                var mixin2= classyxin.createMixin({
                    mixin2Method: function () {
                        this.counter -=2;
                    }
                });

                var ParentClass = classyxin.createClass({
                    counter: 0,
                    init: function () {
                        this.counter += 2.5;
                    }
                });

                var FirstChildClass = classyxin.createClass(
                    ParentClass,
                    {
                        init: function () {
                            this.counter *= 2;
                        }
                    }
                );

                var SecondChildClass = classyxin.createClass(
                    mixin,
                    {
                        init: function () {
                            this.counter /= 5;
                        }
                    }
                );

                var SubChildClass;

                it('create SubChildClass', function () {
                    SubChildClass = classyxin.createClass(
                        FirstChildClass,
                        SecondChildClass,
                        mixin2,
                        {
                            init: function () {
                                this.mixinMethod();
                                this.mixin2Method();
                                this.counter *= 2;
                            }
                        }
                    )
                });

                var subChildInstance;

                it('init SubChildClass', function () {
                    subChildInstance = new SubChildClass();
                });

                it('correct init', function () {
                    expect(subChildInstance.counter).toBe(2);
                });

                it('has mixin', function () {
                    expect(classyxin.hasMixin(subChildInstance, mixin)).toBeTruthy();
                });

                it('has mixin2', function () {
                    expect(classyxin.hasMixin(subChildInstance, mixin2)).toBeTruthy();
                });

                it('instance of ParentClass', function () {
                    expect(classyxin.instanceOf(subChildInstance, ParentClass)).toBeTruthy();
                });

                it('instance of FirstChildClass', function () {
                    expect(classyxin.instanceOf(subChildInstance, FirstChildClass)).toBeTruthy();
                });

                it('instance of SecondChildClass', function () {
                    expect(classyxin.instanceOf(subChildInstance, SecondChildClass)).toBeTruthy();
                });


            });

        });

        describe('use constructor method and parentConstructor', function () {

            var ParentClass = classyxin.createClass({
                counter: 0,
                construct: function (param) {
                    this.counter += param;
                }
            });

            var ChildClass = classyxin.createClass(
                ParentClass,
                {
                    construct: function (param1, param2) {
                        this.counter += param1 - param2;
                    }
                }
            );

            describe('constructor auto call', function () {
                var childInstance;
                it('init', function () {
                    childInstance = new ChildClass(2, 1);
                });
                it('correct instance', function () {
                    expect(childInstance.counter).toBe(1);
                });
            });

            var SubChildClass = classyxin.createClass(
                ChildClass,
                {
                    init: function () {
                        classyxin.callConstruct(this, ParentClass, 2);
                        classyxin.callConstruct(this, ChildClass, [2, 1]);
                        this.counter *= 2;
                    }
                }
            );

            var subChildInstance;

            it('init child', function () {
                subChildInstance = new SubChildClass();
            });

            it('childInstance has not constructor property', function () {
                expect(subChildInstance.construct).toBeFalsy();
            });

            it('correct init', function () {
                expect(subChildInstance.counter).toBe(6);
            });

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
            Parent,
            {
                init: function () {
                    this.counter *= 2;
                },
                destructor: function () {
                    this.counter /= 2;
                }
            }
        );

        var SubChild = classyxin.createClass(
            classyxin.configureParent(
                Child,
                {
                    needInit: false,
                    needDestructor: false
                }
            ),
            {
                init: function () {
                    this.counter /= .5;
                },
                destructor: function () {
                    this.counter *= .5;
                }
            }
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
            expect(subInstance.counter).toBe(2);
            subInstance.destructor();
            expect(subInstance.counter).toBe(0);
        });

    });



});
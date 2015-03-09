module.exports = {
    __Mixins: [
        {
            __ParentConstructor: {
                __Mixins: [
                    {
                        __ParentConstructor: {
                            __isInitParent: true,
                            __ParentConstructor: {
                                __cmId: 21,
                                prototype: {
                                    init: function () {}
                                }
                            },

                            __cmId: 22,
                            prototype: {
                                init: function () {}
                            }
                        },
                        __cmId: 1,
                        prototype: {
                            init: function () {
                                this.initStack.push('2');
                            }
                        }
                    },
                    {
                        __cmId: 2,
                        prototype: {
                            init: function () {
                                this.initStack.push('3');
                            }
                        }
                    }
                ],
                __cmId: 3,
                prototype: {
                    init: function () {
                        this.initStack.push('4');
                    }
                }
            },
            __cmId: 4,
            prototype: {
                init: function () {
                    this.initStack.push('5');
                }
            }
        },
        {
            __Mixins: [
                {
                    __ParentConstructor: {
                        __cmId: 5,
                        prototype: {
                            init: function () {
                                this.initStack.push('6');
                            }
                        }
                    },
                    __cmId: 6,
                    prototype: {
                        init: function () {
                            this.initStack.push('7');
                        }
                    }
                },
                {
                    __cmId: 7,
                    prototype: {
                        init: function () {
                            this.initStack.push('9');
                        }
                    }
                }
            ],
            __cmId: 8,
            prototype: {
                init: function () {
                    this.initStack.push('10');
                }
            }
        }
    ],
    __ParentConstructor: {
        __cmId: 9,
        __ParentConstructor: {
            __ParentConstructor: {
                __cmId: 12,
                prototype: {
                    init: function () {}
                }
            },
            __isInitParent: true,

            __cmId: 11,
            prototype: {
                init: function () {}
            }
        },
        prototype: {
            init: function () {
                this.initStack = ['supper'];
            }
        }
    },
    __isInitParent: true,
    __cmId: 10,
    prototype: {
        init: function () {
            this.initStack.push('this');
        }
    }
};
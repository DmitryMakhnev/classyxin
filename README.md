#classinx

Simple JavaScript classes and mixins library with auto inits and auto destructors

Getting Started
-----

Compressed file saved in /dist as classyxin.js and packed with web pack as UMD module. Global var in UMD is `classyxin`

Full descriptions is coming soon


Usage
-----

### Creating classes ###

Create simple classes with auto inits and auto destructors

```js

var Animal = classyxin.createClass(
    {
        name: '',
        speech: '',
        say: function () {
            var animal = this;
            console.log(animal.speech);
            return animal;
        },
        init: function (name, speech) {
            var animal = this;
            animal.name = name;
            if (speech) {
                animal.speech = speech;
            }

        },
        destructor: function () {
            var animal = this;
            animal.name = null;
            animal.speech = null;
            animal.say = null;
        }
    }
);

var Cat = classyxin.createClass(
    {
        isFluffy: false,
        init: function (name, speech, isFluffy) {
            var cat = this;
            cat.speech += ' Mrrrrr...';
            cat.isFluffy = isFluffy || false;
        },
        destructor: function () {
            this.isFluffy = null
        }
    },
    Animal
);

var MyCat = classyxin.createClass(
    {
        isSmart: false,
        getPI: function () {
            var myCat = this;
            if (myCat.isSmart) {
                console.log(Math.PI);
            } else {
                console.log('life: "Sorry Louie"');
            }
            return myCat;
        },
        init: function (name, speech) {
            this.isSmart = (name === 'Vincent') && (speech === 'Mur');
        },
        destructor: function () {
            var myCat = this;
            myCat.isSmart = null;
            myCat.getPI = null;
        }
    },
    Cat
);

var myCat = new MyCat('Vincent', 'Mur', true);

console.log(myCat.name); //Vincent
myCat.say(); //Mur Mrrrrr...
console.log(myCat.isFluffy); //true
console.log(myCat.isSmart); //true
myCat.getPI(); //3.141592653589793

myCat.destructor();

console.log(myCat.name); //null
console.log(myCat.say); //null
console.log(myCat.isFluffy); //null
console.log(myCat.isSmart); //null
console.log(myCat.getPI); //null

```

### Creating mixes ###

Create simple mixes with auto inits and auto destructors

```js

var Events = classyxin.createMixin({
    _listeners: null,
    _handlers: null,

    init: function () {
        var events = this;
        events._listeners = [];
        events._handlers = [];
    },

    destructor: function () {
        var events = this;
        events._listeners = null;
        events._handlers = null;
    },

    on: function () {},
    off: function () {}
});

var List = classyxin.createMixin({
    _list: null,

    init: function () {
        this._list = [];
    },

    destructor: function () {
        this._list = null;
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

    destructor: function () {
        this.model = null;
    },

    bindModel: function (model) {
        this.model = model;
    },

    onChange: function () {},
    offChange: function () {}

});

var Mix = classyxin.createMix(
    {
        type: '',
        init: function (model, type) {
            this.type = type;
        },
        destructor: function () {
            this.type = null;
        }
    },
    Events,
    Observer,
    List
);

var mix = new Mix({lib: 'classyxin'}, 'default');

console.log(mix.type); //default
console.log(mix.model.lib); //classyxin
console.log(mix._listeners); //[]
console.log(mix._handlers); //[]
console.log(mix._list); //[]

mix.destructor();

console.log(mix.type); //null
console.log(mix.model.lib); //null
console.log(mix._listeners); //null
console.log(mix._handlers); //null
console.log(mix._list); //null

```

### Creating mixes with classes and classes with mixes :O ###

Creating mixes with classes and classes with mixes with auto inits and auto destructors

```js

var Events = classyxin.createMixin({
    _listeners: null,
    _handlers: null,

    init: function () {
        var events = this;
        events._listeners = [];
        events._handlers = [];
    },

    destructor: function () {
        var events = this;
        events._listeners = null;
        events._handlers = null;
    },

    on: function () {},
    off: function () {}
});

var List = classyxin.createMixin({
    _list: null,

    init: function () {
        this._list = [];
    },

    destructor: function () {
        this._list = null;
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

    destructor: function () {
        this.model = null;
    },

    bindModel: function (model) {
        this.model = model;
    },

    onChange: function () {},
    offChange: function () {}

});

var Mix = classyxin.createMix(
    {
        type: '',
        init: function () {
            var mix = this;
            mix.type = this.isSmart ? 'smart' : 'little smart';
        },
        destructor: function () {
            this.type = null;
        }
    },
    Events,
    Observer,
    List
);

var Animal = classyxin.createClass(
    {
        name: '',
        speech: '',
        say: function () {
            var animal = this;
            console.log(animal.speech);
            return animal;
        },
        init: function (name, speech) {
            var animal = this;
            if (typeof name === 'string') {
                animal.name = name;
            } else {
                animal.name = name.name;
            }

            if (speech) {
                animal.speech = speech;
            }

        },
        destructor: function () {
            var animal = this;
            animal.name = null;
            animal.speech = null;
            animal.say = null;
        }
    }
);

var Cat = classyxin.createClass(
    {
        isFluffy: false,
        init: function (name, speech, isFluffy) {
            var cat = this;
            cat.speech += ' Mrrrrr...';
            cat.isFluffy = isFluffy || false;
        },
        destructor: function () {
            this.isFluffy = null
        }
    },
    Animal
);

var MyCat = classyxin.createClass(
    {
        isSmart: false,
        getPI: function () {
            var myCat = this;
            if (myCat.isSmart) {
                console.log(Math.PI);
            } else {
                console.log('life: "Sorry Louie"');
            }
            return myCat;
        },
        init: function (name, speech) {
            var myCat = this;
            myCat.isSmart = (myCat.model.name === 'Vincent') && (speech === 'Mur');
        },
        destructor: function () {
            var myCat = this;
            myCat.isSmart = null;
            myCat.getPI = null;
        }
    },
    Cat
);

var MyMixedCat = classyxin.createMix(
    {
        isFavorite: false,
        init: function (name, speech, isFluffy) {
            var myMixedCat = this;
            myMixedCat.isFavorite = isFluffy && myMixedCat.isSmart ? true : false;
        },
        destructor: function () {
            this.isFavorite = null;
        }
    },
    Mix,
    MyCat
);

var myMixedCat = new MyMixedCat({name: 'Vincent'}, 'Mur', true);

console.log(myMixedCat.isFavorite); //true
console.log(myMixedCat.isSmart); //true
console.log(myMixedCat.model); //{name: 'Vincent'}
console.log(myMixedCat.name); //Vincent
myMixedCat.say(); //Mur Mrrrrr...
myMixedCat.getPI(); //3.141592653589793
console.log(myMixedCat._listeners); //[]
console.log(myMixedCat._handlers); //[]
console.log(myMixedCat._list); //[]

myMixedCat.destructor();

console.log(myMixedCat.isFavorite); //null
console.log(myMixedCat.isSmart);  //null
console.log(myMixedCat.model);  //null
console.log(myMixedCat.name);  //null
console.log(myMixedCat.say); //null
console.log(myMixedCat.getPI);  //null
console.log(myMixedCat._listeners);  //null
console.log(myMixedCat._handlers);  //null
console.log(myMixedCat._list);  //null

```


Docs
-----

###classyxin.createClass(PrototypeObject, Parent, isNeedInitParent)
###classyxin.createMixin(PrototypeObject, Parent, isNeedInitParent)
###classyxin.createMix(PrototypeObject, Mixin, Mixin...)
###classyxin.instanceOf(someInstance, ClassyxinClass);
###classyxin.hasMixin(someInstance, ClassyxinClass);

Full docs is common soon

Licence
-----

MIT
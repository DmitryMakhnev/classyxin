#classyxin

Simple JavaScript classes and mixins library with multiple inheritance, auto inits and auto destructors


Getting Started
-----

### In Node.js ###

You can install using Node Package Manager (npm):

`npm install classyxin --save`

### In Browsers ###

Compressed file saved in `/dist/classyxin.js` and packed with webpack as UMD module. Global var in UMD is `classyxin`

`bower install classyxin --save`

```html
<script type="text/javascript" src="bower_components/classyxin/dist/classyxin.js"></script>
```


Usage
-----

### Creating a Class ###

Basic Class with init

```javascript
var classyxin = require('classyxin');

var Foo = classyxin.createClass({
    prop: 1,
    method: function () {
        this.prop += 1;
    },
    //call auto then new Foo and save in auto inits chain for inheritance 
    init: function () {
        this.prop += 1;
    }
});

var fooInstance = new Foo();
fooInstance.method();

fooInstance.prop; //2
```

Basic Class with construct

```javascript
var classyxin = require('classyxin');

var Foo = classyxin.createClass({
    prop: 1,
    method: function () {
        this.prop += 1;
    },
    //call auto then new Foo and not save in auto inits chain for inheritance 
    construct: function () {
        this.prop += 1;
    }
});

var fooInstance = new Foo();
fooInstance.method();

fooInstance.prop; //2
```

### Creating a Class with inheritance ###

#### Single inheritance ####

```javascript
var classyxin = require('classyxin');

var Foo = classyxin.createClass({
    prop: 'a',
    method: function () {
        this.prop += 'd';
    },   
    init: function () {
        this.prop += 'b';
    }
});


var Bar = classyxin.createClass(
    Foo,
    {
        method2: function () {
            this.prop += 'e';
        },
        construct: function () {
            this.prop += 'c';
        }
    }
);

var barInstance = new Bar();
barInstance.prop; //abc

barInstance.method();
barInstance.method2();

barInstance.prop; //abcde
```

#### Inheritance chain #### 

```javascript
var classyxin = require('classyxin');

var Foo = classyxin.createClass({
    prop: 'a',
    init: function () {
        this.prop += 'b';
    }
});


var Bar = classyxin.createClass(
    Foo,
    {
        init: function () {
            this.prop += 'c';
        }
    }
);

var Baz = classyxin.createClass(
    Bar,
    {
        init: function () {
            this.prop += 'd'
        }
    }
);

var bazInstance = new Baz();
bazInstance.prop; //abcd
```

#### Multiple inheritance #### 

```javascript
var classyxin = require('classyxin');

var Foo = classyxin.createClass({
    prop: 'a',
    init: function () {
        this.prop += 'b';
    }
});


var Bar = classyxin.createClass(
    {
        init: function () {
            this.prop += 'c';
        }
    }
);

var Baz = classyxin.createClass(
    Foo,
    Bar,
    {
        init: function () {
            this.prop += 'd';
        }
    }
);

var bazInstance = new Baz();
bazInstance.prop; //abcd
```


#### Inheritance with parent configuration ####

```javascript

var classyxin = require('classyxin');

var Foo = classyxin.createClass({
    prop: 'a',
    init: function () {
        this.prop += 'b';
    }
});


var Bar = classyxin.createClass(
    {
        init: function () {
            this.prop += 'c';
        }
    }
);

var Baz = classyxin.createClass(
    classyxin.configureParent(
        Foo,
        {
            needInit: false
        }
    ),
    Bar,
    {
        init: function () {
            this.prop += 'd';
        }
    }
);

var bazInstance = new Baz();
bazInstance.prop; //acd
```

### Creating a Class with mixin ###

Use mixins for share properties in some classes

```javascript
var classyxin = require('classyxin');

var mixin = classyxin.createMixin({
    mixinMethod: function () {
        this.prop += 'c';
    }
});

var Foo = classyxin.createClass(
    mixin,
    {
        prop: 'a',
        init: function () {
            this.mixinMethod();
            this.prop += 'b';
        }
    }
);


var Bar = classyxin.createClass(
    mixin,
    {
        prop: 'a',
        init: function () {
            this.mixinMethod();
            this.prop += 'c';
        }
    });

var fooInstance = new Foo();
fooInstance.prop; //acb

var barInstance = new Bar();
barInstance.prop; //acc
```

###You can create any combo for createClass()

```javascript
var classyxin = require('classyxin');

var mixin1 = classyxin.createMixin({
    mixin1Method: function () {
        this.prop += '_m1';
    }
});

var mixin2 = classyxin.createMixin({
    mixin2Method: function () {
        this.prop += '_m2';
    }
});

var Foo = classyxin.createClass(
    mixin1,
    {
        prop: 'a',
        init: function (char1, char2) {
            this.prop += 'b' + char1 + char2;
        }
    }
);


var Bar = classyxin.createClass(
    {
        init: function (char1, char2) {
            this.prop += 'c' + char1 + char2;
        }
    }
);

var Baz = classyxin.createClass(
    Foo,
    classyxin.configureParent(
        Bar,
        {
            needInit: false
        }
    ),
    mixin2,
    {
        init: function (char1, char2) {
            this.mixin1Method();
            this.mixin2Method();
            this.prop += 'd' + char1 + char2;
        }
    }
);

var bazInstance = new Baz('z', 'x');
bazInstance.prop; //abzx_m1_m2dzx
```


### Check instanceOf###

```javascript
var classyxin = require('classyxin');

var Foo = classyxin.createClass(
    {
        prop: 'a',
        init: function () {
            this.prop += 'b';
        }
    }
);


var Bar = classyxin.createClass(
    Foo,
    {
        init: function () {
            this.prop += 'c';
        }
    });


var barInstance = new Bar();
barInstance.prop; //abc

classyxin.instanceOf(barInstance, Bar);//true
classyxin.instanceOf(barInstance, Foo);//true
```

### Check has mixin###

```javascript
var classyxin = require('classyxin');

var mixin = classyxin.createMixin({
    mixinMethod: function () {
        this.prop += 'b';
    }
});

var Foo = classyxin.createClass(
    mixin,
    {
        prop: 'a',
        init: function () {
            this.mixinMethod();
            this.prop += 'c';
        }
    }
);


var Bar = classyxin.createClass(
    Foo,
    {
        init: function () {
            this.mixinMethod();
            this.prop += 'd';
        }
    });


var barInstance = new Bar();
barInstance.prop; //abccd

classyxin.hasMixin(barInstance, mixin);//true
```

###Call parent construct###

```javascript
var classyxin = require('classyxin');

var Foo = classyxin.createClass(
    {
        prop: 'a',
        construct: function (char1, char2) {
            this.prop += 'b' + char1 + char2;
        }
    }
);


var Bar = classyxin.createClass(
    Foo,
    {
        construct: function (char1, char2) {
            this.prop += 'e' + char1 + char2;
        }
    }
);

var Baz = classyxin.createClass(
    Bar,
    {
        construct: function () {
            classyxin.callConstruct(this, Foo, 'c', 'd');
            classyxin.callConstruct(this, Bar, ['f', 'g']);
            this.prop += 'h';
        }
    }
);

var bazInstance = new Baz();
bazInstance.prop; //abcdefgh
```

###Inits arguments

var classyxin = require('classyxin');

var Foo = classyxin.createClass(
    {
        prop: 'a',
        init: function (char1, char2) {
            this.prop += 'b' + char1 + char2;
        }
    }
);


var Bar = classyxin.createClass(
    Foo,
    {
        init: function (char1, char2) {
            this.prop += 'c' + char1 + char2;
        }
    }
);

var Baz = classyxin.createClass(
    Bar,
    {
        init: function (char1, char2) {
            this.prop += 'd' + char1 + char2;
        }
    }
);

var bazInstance = new Baz('z', 'x');
bazInstance.prop; //abzxczxdzx


API
-----

###Main methods

####createClass([ClassConstructor...], [ParentConfigurator...], [Mixin...], [Object Prototype])
Main method for create classes

####configureParent(ClassConstructor, Object settings)
Configure parent for inheritance  

####createMixin(Object) 
Method for create mixins 

####instanceOf(instance, ClassConstructor)
Check instanceOf

####hasMixin(instance, Mixin)
Check hasMixin

####callConstruct(instance, ParentClassConstructor, [*...|Array])
Call instance for parent class constructor

###Some open parts

####createClassConstructor()
createClassConstructor constructor

####ParentConfigurator(ClassConstructor, Object settings)
ParentConfigurator constructor

####Mixin(Object)
Mixin constructor



Licence
-----

MIT
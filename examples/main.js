var classyxin = require('classyxin');

var Events = classyxin.createClass({
    proto: {
        _handlers: null,
        _listeners: null,
        init: function () {
            var events = this;
            events._handlers = [];
            events._listeners = [];
        },
        on: function () {},
        off: function () {},
        fire: function () {}
    }
});

var Signal = classyxin.createClass({
    proto: {
        _handlers: null,
        _listeners: null,
        init: function () {
            var events = this;
            events._handlers = [];
            events._listeners = [];
        },
        on: function () {},
        off: function () {},
        fire: function () {}
    }
});


var mixin = classyxin.createMixin({
    wu: 'tang',
    clan: 'true'
});

var DasClass = classyxin.createClass(
    Events,
    classyxin.configureParent(
        Signal,
        {
            needInit: false
        }
    ),
    mixin,
    {
        _handlers: null,
        _listeners: null,
        init: function () {
            var events = this;
            events._handlers = [];
            events._listeners = [];
        },
        on: function () {},
        off: function () {},
        fire: function () {}
    }
);

classyxin.instanceOf(DasClass, Signal);

var DaasClass = {
    parents: [Events, null, Signal, {}]
};

classyxin.instanceOf(DasClass, Signal);

var disalabe = classyxin.createClass({
    extends: [
        Events
    ],
    proto: {
        isDisabled: false,
        disalabe_node: null,
        initDisable: function (node) {
            var disalabe = this;
            disalabe.disalabe_node = node;
            return disalabe;

        },
        destructor: function () {
            var disalabe = this;
            disalabe.disalabe_node = null;
        },
        setDisable: function (isDisabled) {
            var disalabe = this;
            if (isDisabled !== disalabe.isDisabled) {
                disalabe.isDisabled = isDisabled;

                if (disalabe.disalabe_node) {
                    if (isDisabled) {
                        disalabe.disalabe_node.setAttribute('disabled', 'disabled');
                    } else {
                        disalabe.disalabe_node.removeAttribute('disabled');
                    }
                }

                disalabe.fire('disabled:change', isDisabled);
            }
        }
    }
});

var focuable = classyxin.createClass({
    extends: [
        Events
    ],
    proto: {
        isFocused: false,
        focusable_node: null,
        initFocus: function (node) {
            var focusable = this;
            focusable.focusable_node = node;
            node.addEventListener('focus', focusable.handelEvent, false);
            node.addEventListener('blur', focusable.handelEvent, false);
            return focusable;
        },
        destructor: function () {
            var focusable = this,
                node = focusable.focusable_node;
            node.removeEventListener('focus', focusable.handelEvent, false);
            node.removeEventListener('blur', focusable.handelEvent, false);
            focusable.focusable_node = null;
        },
        handelEvent: function (e) {
            var focusable = this;
            switch (e.type){
                case 'focus':
                    focusable.isFocused = true;
                    focusable.fire('focus:change', true);
                    break;
                case 'blur':
                    focusable.isFocused = false;
                    focusable.fire('focus:change', false);
                    break;
            }
        }
    }
});

var pressable = classyxin.createClass({
    extends: [
        Events
    ],
    proto: {
        isPressed: false,
        pressable_node: null,
        initPressable: function (node) {
            var pressable = this;
            pressable.pressable_node = node;
            node.addEventListener('mousedown', pressable.handleEvent, false);
            node.addEventListener('mouseup', pressable.handleEvent, false);
        },
        destructor: function () {
            var pressable = this,
                node = pressable.pressable_node;
            node.removeEventListener('mousedown', pressable.handleEvent, false);
            node.removeEventListener('mouseup', pressable.handleEvent, false);
            pressable.pressable_node = null;
        },
        handleEvent: function (e) {
            var pressable = this;
            switch (e.type) {
                case 'mousedown':
                    pressable.isPressed = true;
                    pressable.fire('press');
                    break;
                case 'mouseup':
                    pressable.fire('unpress');
                    if (pressable.isPressed) {
                        pressable.fire('pressed', e);
                        pressable.isPressed = false;
                    }
                    break;
            }
        }
    }
});

//think about 2 and more same classes in 2 mix (merge by id? first is main!)

//handleEvent можно заложить в массив (перекрытие?)

//inits?

function buttonPressed (e) {
    var button = this;
    if (button.basisAction) {
        button.basisAction(e);
    }
}

var button = classyxin.createClass({
    extends: [disalabe, focuable, pressable],
    proto: {
        node: null,
        basisAction: null,
        initButton: function (node, action) {
            var button = this;
            button.node = node;
            //im think is cool!
            button.initPressable(node);
            button.initDisable(node);
            button.initFocus(node);
            if (action) {
                button.basisAction = action;
            }
            button.on('pressed', buttonPressed);
        },
        destructor: function () {

        },
        handleEvent: function (e) {
            var button = this;
            switch (e) {
                case 'click':
                    if (button.basisAction) {
                        button.basisAction(e);
                    }
                    button.fire('action', e);
                    break;
            }
        }
    }
});

var Observer = classyxin.createClass({
    proto: {
        model: null,

        init: function (model) {
            var observe = this;
            if (model) {
                observe.model = model;
            }
        },
        bindModel: function () {},
        unbindModel: function () {},
        onChange: function () {},
        offChange: function () {}
    }
});

var List = classyxin.createClass({
    extends: [
        Events
    ],
    proto: {
        _items: null,

        _replicators: null,

        init: function (items) {
            var list = this;
            list._replicators = [];
            if (items) {
                list._items = items;
            }
        },

        bindItems: function (items) {},
        push: function () {},
        pop: function () {},
        shift: function () {},
        unshift: function () {},

        bindReplicator: function (replicator) {
            var list = this;
            list._replicators.push(replicator);
            replicator.bindItems(list._items);
            list.on('push', replicationPush, replicator);
            list.on('pop', replicationPop, replicator);
            list.on('shift', replicationShift, replicator);
            list.on('unshift', replicationUnsift, replicator);
            return list;
        },
        unbindReplicator: function (replicator) {

        }

    }
});

var ListInstances = classyxin.createClass({
    extends: [
        List
    ],
    proto: {
        _instanceConstructor: null,

        init: function (items) {
            var listInstances = this;

            return listInstances.bindItems(items);
        },

        bindInstanceConstructor: function (instanceConstructor) {
            var listInstances = this;
            listInstances._instanceConstructor = instanceConstructor;
            return listInstances;
        },

        /*@Override*/
        bindItems: function (items) {
            var listInstances = this;

            forEach(listInstances.items, function (item) {
                item.destructor();
            });

            forEach(items, function (item, index, items, listInstances) {
                listInstances.items[index] = new listInstances._instanceConstructor(item);
            }, listInstances);

            return listInstances;
        }

    }
});

var remoteListProto = {
    _requestPromise: null,
    _syncPromise: null,
    _remoteListConfig: null,
    addRemoteListConfig: function () {},
    request: function () {},
    sync: function () {}
};

var RemoteList = classyxin.createClass({
    extends: [
        List
    ],
    proto: remoteListProto
});

var RemoteListInstances = classyxin.createClass({
    extends: [
        ListInstances
    ],
    proto: remoteListProto
});

var localDBListProto = {
    _requestPromise: null,
    _syncPromise: null,
    _localDBListConfig: null,
    addLocalDBConfig: function () {},
    request: function () {},
    sync: function () {}
};

var LocalDBList = classyxin.createClass({
    extends: [
        List
    ],
    proto: localDBListProto
});

var LocalDBListInstances = classyxin.createClass({
    extends: [
        ListInstances
    ],
    proto: localDBListProto
});

var operationHistoryItem = classyxin.createClass({
    proto: function () {

    }
});

var OperationsHistoryList = classyxin.create({
    extends: [
        RemoteListInstances
    ],

    proto: {

    }
});

var LocalOperationHistoryStorage = classyxin.create({
    extends: [
        LocalDBListInstances
    ]
});

var operationHistoryList = new OperationsHistoryList();
var localOperationHistoryStorage = new LocalOperationHistoryStorage();
operationHistoryList.addRemoteListConfig({});
operationHistoryList.bindReplicator(localOperationHistoryStorage);







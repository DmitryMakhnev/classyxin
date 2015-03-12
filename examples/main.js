var classyxin = require('classyxin');

var disalabe = classyxin.createClass({
    extends: [Events],
    proto: {
        isDisabled: false,
        node: null,
        initDisable: function (node) {
            var disalabe = this;
            disalabe.node = node;
            return disalabe;

        },
        setDisable: function (isDisabled) {
            var disalabe = this;
            if (isDisabled !== disalabe.isDisabled) {
                disalabe.isDisabled = isDisabled;
                disalabe.fire('disabled:change', isDisabled);
            }
        }
    }
});

var focuable = classyxin.createClass({
    extends: [Events],
    proto: {
        isFocused: false,
        node: null,
        initFocus: function (node) {
            var focusable = this;
            focusable.node = node;
            return focusable;
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

var button = classyxin.createClass({
    extends: [disalabe, focuable],
    proto: {
        node: null,
        basisAction: null,
        initButton: function (node, action) {
            var button = this;
            button.node = node;
            if (action) {
                button.basisAction = action;
            }
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
operationHistoryList.bindReplicator(localOperationHistoryStorage); ???







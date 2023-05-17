"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var styles_1 = require("@material-ui/core/styles");
var Grid_1 = require("@material-ui/core/Grid");
var List_1 = require("@material-ui/core/List");
var Card_1 = require("@material-ui/core/Card");
var CardHeader_1 = require("@material-ui/core/CardHeader");
var ListItem_1 = require("@material-ui/core/ListItem");
var ListItemText_1 = require("@material-ui/core/ListItemText");
var ListItemIcon_1 = require("@material-ui/core/ListItemIcon");
var Checkbox_1 = require("@material-ui/core/Checkbox");
var Button_1 = require("@material-ui/core/Button");
var Divider_1 = require("@material-ui/core/Divider");
var dataBase_1 = require("../../redux/dataBase");
var react_toastify_1 = require("react-toastify");
var useStyles = styles_1.makeStyles(function (theme) { return ({
    root: {
        margin: "auto",
        backgroundColor: "#EDEDED",
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 200,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: "auto",
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}); });
function not(a, b) {
    return a.filter(function (value) { return b.indexOf(value) === -1; });
}
function intersection(a, b) {
    return a.filter(function (value) { return b.indexOf(value) !== -1; });
}
function union(a, b) {
    return a.concat(not(b, a));
}
function TransferList(props) {
    var _a = props.printer, group = _a.group, printerIP = _a.printerIP, list = _a.list, idKey = _a.idKey;
    var classes = useStyles();
    // const [fromGroup, setfromGroup] = React.useState([]);
    var _b = React.useState([]), checked = _b[0], setChecked = _b[1];
    var _c = React.useState([]), left = _c[0], setLeft = _c[1];
    var _d = React.useState([]), right = _d[0], setRight = _d[1];
    var leftChecked = intersection(checked, left);
    var rightChecked = intersection(checked, right);
    React.useEffect(function () {
        setRight(list.data);
        dataBase_1.default.HandelGroup({ _type: "get" }, function (callback) {
            setLeft(callback.data);
        });
    }, []);
    var handleSave = function () {
        // console.log(fromGroup)
        dataBase_1.default.HandlePrinterGroups({ _type: "updateList", list: right, IP: printerIP, id: idKey }, function (callback) {
            react_toastify_1.toast("Updated successfully", {
                position: "top-right",
                autoClose: 5000,
                type: "success",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
        // console.log(right);
    };
    var handleToggle = function (value) { return function () {
        var currentIndex = checked.indexOf(value);
        var newChecked = checked.slice();
        if (currentIndex === -1) {
            newChecked.push(value);
        }
        else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    }; };
    var numberOfChecked = function (items) { return intersection(checked, items).length; };
    var handleToggleAll = function (items) { return function () {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        }
        else {
            setChecked(union(checked, items));
        }
    }; };
    var handleCheckedRight = function () {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };
    var handleCheckedLeft = function () {
        dataBase_1.default.HandlePrinterGroups({ _type: "removeFromGroup", rightChecked: rightChecked }, function (callback) {
            react_toastify_1.toast("Removed successfully", {
                position: "top-right",
                autoClose: 5000,
                type: "success",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };
    var customList = function (title, items) { return (React.createElement(Card_1.default, null,
        React.createElement(CardHeader_1.default, { className: classes.cardHeader, avatar: React.createElement(Checkbox_1.default, { onClick: handleToggleAll(items), checked: numberOfChecked(items) === items.length && items.length !== 0, indeterminate: numberOfChecked(items) !== items.length &&
                    numberOfChecked(items) !== 0, disabled: items.length === 0, inputProps: { "aria-label": "all items selected" } }), title: title, subheader: numberOfChecked(items) + "/" + items.length + " selected" }),
        React.createElement(Divider_1.default, null),
        React.createElement(List_1.default, { className: classes.list, dense: true, component: "div", role: "list" },
            items.map(function (value) {
                var labelId = "" + value.key;
                return (React.createElement(ListItem_1.default, { key: labelId, role: "listitem", button: true, onClick: handleToggle(value) },
                    React.createElement(ListItemIcon_1.default, null,
                        React.createElement(Checkbox_1.default, { checked: checked.indexOf(value) !== -1, tabIndex: -1, disableRipple: true, inputProps: { "aria-labelledby": labelId } })),
                    React.createElement(ListItemText_1.default, { id: labelId, primary: value.group })));
            }),
            React.createElement(ListItem_1.default, null)))); };
    return (React.createElement("div", null,
        React.createElement(Grid_1.default, { container: true, spacing: 2, justifyContent: "center", alignItems: "center", className: classes.root },
            React.createElement(Grid_1.default, { item: true }, customList("Main list", left)),
            React.createElement(Grid_1.default, { item: true },
                React.createElement(Grid_1.default, { container: true, direction: "column", alignItems: "center" },
                    React.createElement(Button_1.default, { variant: "outlined", size: "small", className: classes.button, onClick: handleCheckedRight, disabled: leftChecked.length === 0, "aria-label": "move selected right" }, ">"),
                    React.createElement(Button_1.default, { variant: "outlined", size: "small", className: classes.button, onClick: handleCheckedLeft, disabled: rightChecked.length === 0, "aria-label": "move selected left" }, "<"))),
            React.createElement(Grid_1.default, { item: true }, customList(group, right))),
        React.createElement(Button_1.default, { onClick: function () {
                handleSave();
            }, color: "primary", variant: "contained" }, "Save")));
}
exports.default = TransferList;
//# sourceMappingURL=TransferList.js.map
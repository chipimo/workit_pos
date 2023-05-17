"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
var styles_1 = require("@material-ui/core/styles");
var Radio_1 = require("@material-ui/core/Radio");
var RadioGroup_1 = require("@material-ui/core/RadioGroup");
var FormControlLabel_1 = require("@material-ui/core/FormControlLabel");
var FormControl_1 = require("@material-ui/core/FormControl");
var FormLabel_1 = require("@material-ui/core/FormLabel");
var Button_1 = require("@material-ui/core/Button");
var FormHelperText_1 = require("@material-ui/core/FormHelperText");
var Divider_1 = require("@material-ui/core/Divider");
var TextField_1 = require("@material-ui/core/TextField");
var Table_1 = require("@material-ui/core/Table");
var TableBody_1 = require("@material-ui/core/TableBody");
var TableCell_1 = require("@material-ui/core/TableCell");
var TableContainer_1 = require("@material-ui/core/TableContainer");
var TableHead_1 = require("@material-ui/core/TableHead");
var TableRow_1 = require("@material-ui/core/TableRow");
var Paper_1 = require("@material-ui/core/Paper");
var Typography_1 = require("@material-ui/core/Typography");
var dataBase_1 = require("../../redux/dataBase");
var IconButton_1 = require("@material-ui/core/IconButton");
var More_1 = require("@material-ui/icons/More");
var Close_1 = require("@material-ui/icons/Close");
var Fade_1 = require("@material-ui/core/Fade");
var Backdrop_1 = require("@material-ui/core/Backdrop");
var Modal_1 = require("@material-ui/core/Modal");
var TransferList_1 = require("./TransferList");
var react_toastify_1 = require("react-toastify");
var useStyles = styles_1.makeStyles(function (theme) { return ({
    formControl: {
        margin: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1, 1, 0, 0),
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}); });
var index = function (props) {
    var _a = React.useState("usb"), value = _a[0], setValue = _a[1];
    var _b = React.useState(""), printerName = _b[0], setPrinterName = _b[1];
    var _c = React.useState(""), printerIP = _c[0], setPrinterIP = _c[1];
    var _d = React.useState("1"), receipts = _d[0], setReceipts = _d[1];
    var _e = React.useState({}), printer = _e[0], setPrinter = _e[1];
    var _f = React.useState(false), openMdodel = _f[0], setOpenMdodel = _f[1];
    var _g = React.useState([]), rows = _g[0], setRows = _g[1];
    var classes = useStyles();
    var handleChange = function (event) {
        setValue(event.target.value);
    };
    React.useEffect(function () {
        getPrintGroups();
        dataBase_1.default.getPrintOuts(function (callback) {
            setReceipts(callback);
        });
    }, []);
    var getPrintGroups = function () {
        dataBase_1.default.HandlePrinterGroups({ _type: "get" }, function (callback) {
            setRows(callback);
        });
    };
    return (React.createElement("div", { style: {
            backgroundColor: "#EDEDED",
            padding: 20,
            height: "80vh",
        } },
        React.createElement("div", { style: { paddingBottom: 10 } }, "Printer Settings"),
        React.createElement(Divider_1.default, null),
        React.createElement("div", { style: { display: "flex", paddingTop: 10 } },
            React.createElement("div", { style: { width: "40%" } },
                React.createElement(FormControl_1.default, { component: "fieldset" },
                    React.createElement(FormLabel_1.default, { component: "legend" }, "Local Printer out puts Settings"),
                    React.createElement(RadioGroup_1.default, { "aria-label": "printerIO", name: "gender1", value: value, onChange: handleChange },
                        React.createElement(FormControlLabel_1.default, { value: "usb", control: React.createElement(Radio_1.default, null), label: "User USB Printer" }),
                        React.createElement(FormControlLabel_1.default, { value: "network", control: React.createElement(Radio_1.default, null), label: "User Network Printer" })),
                    React.createElement(FormHelperText_1.default, null, "Printer Name"),
                    React.createElement(TextField_1.default, { id: "outlined-basic", label: "Printer name", variant: "outlined" }),
                    React.createElement("div", { style: { padding: 10 } }),
                    React.createElement(TextField_1.default, { id: "outlined-basic", label: "Printer IP", variant: "outlined" }),
                    React.createElement(Button_1.default, { type: "submit", variant: "outlined", color: "primary", className: classes.button }, "Save printer"))),
            React.createElement("div", { style: {
                    width: "60%",
                    border: "none",
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderLeftColor: "#AAAAAA",
                    padding: 10,
                    borderRadius: 5,
                } },
                React.createElement("div", null,
                    React.createElement("h3", null, "List of network printers")),
                React.createElement("div", { style: { display: "flex" } },
                    React.createElement(TextField_1.default, { id: "outlined-basic", label: "Printer name", variant: "outlined", size: "small", value: printerName, onChange: function (event) {
                            setPrinterName(event.target.value);
                        } }),
                    React.createElement("div", { style: { padding: 10 } }),
                    React.createElement(TextField_1.default, { id: "outlined-basic", label: "Printer IP", size: "small", variant: "outlined", value: printerIP, onChange: function (event) {
                            setPrinterIP(event.target.value);
                        } }),
                    React.createElement("div", { style: { padding: 10 } }),
                    React.createElement(Button_1.default, { type: "submit", size: "small", variant: "contained", color: "primary", className: classes.button, onClick: function () {
                            dataBase_1.default.HandlePrinterGroups({ printerIP: printerIP, printerName: printerName, _type: "set" }, function (callback) {
                                dataBase_1.default.HandlePrinterGroups({ _type: "get" }, function (callback) {
                                    setRows(callback);
                                });
                            });
                        } }, "Add Printer")),
                React.createElement("div", { style: { marginTop: 10 } },
                    React.createElement(TableContainer_1.default, { component: Paper_1.default },
                        React.createElement(Table_1.default, { size: "small", "aria-label": "a dense table" },
                            React.createElement(TableHead_1.default, null,
                                React.createElement(TableRow_1.default, null,
                                    React.createElement(TableCell_1.default, null, "Printer Name"),
                                    React.createElement(TableCell_1.default, { align: "right" }, "Number of Groups"),
                                    React.createElement(TableCell_1.default, { align: "right" }, "Action"))),
                            React.createElement(TableBody_1.default, null, rows.map(function (row) { return (React.createElement(TableRow_1.default, { key: row.idKey },
                                React.createElement(TableCell_1.default, { component: "th", scope: "row" },
                                    React.createElement(Typography_1.default, { variant: "subtitle1", component: "h2" }, row.group)),
                                React.createElement(TableCell_1.default, { align: "right" },
                                    React.createElement(Typography_1.default, { variant: "subtitle1", component: "h2" },
                                        row.printerIP,
                                        " ")),
                                React.createElement(TableCell_1.default, { align: "right" },
                                    React.createElement(IconButton_1.default, { onClick: function () {
                                            setPrinter(row);
                                            setOpenMdodel(true);
                                        }, "aria-label": "more" },
                                        React.createElement(More_1.default, null))))); }))))))),
        React.createElement(Divider_1.default, { style: { marginTop: 20 } }),
        React.createElement("div", { style: { marginTop: 20 } },
            React.createElement("div", null, "Receipt Print Outs"),
            React.createElement(FormControl_1.default, { component: "fieldset" },
                React.createElement(FormLabel_1.default, { component: "legend" }, "Set the number of receipts print out. Default is"),
                React.createElement("div", { style: { padding: 10 } }),
                React.createElement(TextField_1.default, { type: "number", id: "outlined-basic", label: "Number Of Receipts", size: "small", variant: "outlined", value: receipts, onChange: function (event) {
                        setReceipts(event.target.value);
                    } }),
                React.createElement("div", { style: { padding: 10 } }),
                React.createElement(Button_1.default, { type: "submit", size: "small", variant: "contained", color: "primary", className: classes.button, onClick: function () {
                        dataBase_1.default.setPrintOuts(receipts, function (callback) {
                            if (callback)
                                react_toastify_1.toast("Saved successfully", {
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
                    } }, "Save"))),
        React.createElement(Modal_1.default, { "aria-labelledby": "transition-modal-title", "aria-describedby": "transition-modal-description", className: classes.modal, open: openMdodel, onClose: function () {
                setOpenMdodel(false);
                getPrintGroups();
            }, closeAfterTransition: true, BackdropComponent: Backdrop_1.default, BackdropProps: {
                timeout: 500,
            } },
            React.createElement(Fade_1.default, { in: openMdodel },
                React.createElement("div", { className: classes.paper },
                    React.createElement(IconButton_1.default, { onClick: function () {
                            setOpenMdodel(false);
                            getPrintGroups();
                        }, "aria-label": "close" },
                        React.createElement(Close_1.default, null)),
                    React.createElement(TransferList_1.default, { printer: printer }),
                    React.createElement("div", { style: { height: 10 } }),
                    React.createElement(Divider_1.default, null),
                    React.createElement(Button_1.default, { style: { marginTop: 8 }, onClick: function () {
                            dataBase_1.default.HandlePrinterGroups({ printer: printer, _type: "delete" }, function (callback) {
                                react_toastify_1.toast("Deleted successfully", {
                                    position: "top-right",
                                    autoClose: 5000,
                                    type: "success",
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                });
                                setOpenMdodel(false);
                                getPrintGroups();
                            });
                        }, color: "secondary", variant: "outlined" }, "Delete this printer group"))))));
};
var mapStateToProps = function (state) { return ({}); };
var mapDispatchToProps = {};
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(index);
//# sourceMappingURL=index.js.map
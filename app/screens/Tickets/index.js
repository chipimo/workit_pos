"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
var react_router_dom_1 = require("react-router-dom");
var antd_1 = require("antd");
var react_redux_1 = require("react-redux");
var dataBase_1 = require("../../redux/dataBase");
var core_1 = require("@material-ui/core");
var styles_1 = require("@material-ui/core/styles");
var IconButton_1 = require("@material-ui/core/IconButton");
var TextField_1 = require("@material-ui/core/TextField");
var Autocomplete_1 = require("@material-ui/lab/Autocomplete");
var PrintOutlined_1 = require("@material-ui/icons/PrintOutlined");
var RangePicker = antd_1.DatePicker.RangePicker;
var dateNow = new Date(); // Creating a new date object with the current date and time
var year = dateNow.getFullYear(); // Getting current year from the created Date object
var monthWithOffset = dateNow.getUTCMonth() + 1; // January is 0 by default in JS. Offsetting +1 to fix date for calendar.
var month = // Setting current Month number from current Date object
 monthWithOffset.toString().length < 2 // Checking if month is < 10 and pre-prending 0 to adjust for date input.
    ? "0" + monthWithOffset
    : monthWithOffset;
var date = dateNow.getUTCDate().toString().length < 2 // Checking if date is < 10 and pre-prending 0 if not to adjust for date input.
    ? "0" + dateNow.getUTCDate()
    : dateNow.getUTCDate();
var materialDateInput = year + "-" + month + "-" + date; // combining to format for defaultValue or value attribute of material <TextField>
var DateNumInput = "" + year + month + date;
var ipcRenderer = require("electron").ipcRenderer;
var Currency = require("react-currency-formatter");
var moment = require("moment");
var useStyles = styles_1.makeStyles(function (theme) { return ({
    container: {
        zIndex: 8000,
        backgroundColor: "#fff",
        color: "#3b3b3b",
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}); });
var format = "HH:mm";
var useRowStyles = styles_1.makeStyles(function (theme) { return ({
    root: {
        "& > *": {
            borderBottom: "unset",
        },
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
    var _a = React.useState({
        columns: [
            { title: "Date", field: "ItemName" },
            { title: "Time", field: "amountInstore" },
            { title: "Quantity Sold", field: "alertOut" },
        ],
        data: [],
    }), state = _a[0], setState = _a[1];
    var _b = React.useState({
        data: [],
    }), productsList = _b[0], setProductsList = _b[1];
    var _c = React.useState({
        date: "",
        cashier: "",
        compInfo: {},
    }), productInfo = _c[0], setProductInfo = _c[1];
    var _d = React.useState(0), ProductTotalSales = _d[0], setProductTotalSales = _d[1];
    var _e = React.useState(0), ProductTotalDiscount = _e[0], setProductTotalDiscount = _e[1];
    var _f = React.useState(0), TotalSales = _f[0], setTotalSales = _f[1];
    var classes = useRowStyles();
    var _g = React.useState({ value: moment() }), selectedDate = _g[0], setSelectedDate = _g[1];
    var _h = React.useState([]), users = _h[0], setUsers = _h[1];
    var _j = React.useState(null), totalsList = _j[0], settotalsList = _j[1];
    var _k = React.useState(0), totalCash = _k[0], settotalCash = _k[1];
    var _l = React.useState(0), GrossTotalSales = _l[0], setGrossTotalSales = _l[1];
    var _m = React.useState(0), totalCard = _m[0], settotalCard = _m[1];
    var _o = React.useState(0), totalOthers = _o[0], settotalOthers = _o[1];
    var _p = React.useState(false), isModalVisible = _p[0], setIsModalVisible = _p[1];
    var history = react_router_dom_1.useHistory();
    var columns = [
        {
            title: "Print",
            key: "TicketList",
            render: function (row) { return (React.createElement(IconButton_1.default, { "aria-label": "print row", size: "small", onClick: function () {
                    var itemData = [];
                    console.log(props.Dep);
                    row.TicketList.list.map(function (list) {
                        props.dispatchEvent({
                            type: "RESTATECART",
                        });
                        setTimeout(function () {
                            props.dispatchEvent({
                                type: "ADDTOCART",
                                payload: {
                                    items: {
                                        id: list.productKey,
                                        ItemName: list.ItemName,
                                        productKey: list.productKey,
                                        sallingprice: list.sallingprice,
                                        initalPrice: list.initalPrice,
                                        isTaxEnabled: list.isTaxEnabled,
                                        quantity: list.qnt,
                                        amountInstore: list.amountInstore,
                                        qnt: list.qnt,
                                        isAddedToCart: false,
                                        istaxed: "copy",
                                    },
                                },
                            });
                        });
                    }, 300);
                    props.dispatchEvent({
                        type: "PRINTHISTORY",
                        invoiceNumber: row.InvoiceNumber,
                        user: row.userName,
                        PaymentType: row.PaymentType,
                        Date: row.Date,
                        time: row.time,
                        company: props.Dep.dep,
                    });
                    setTimeout(function () {
                        history.push("/pos");
                    }, 100);
                } },
                React.createElement(PrintOutlined_1.default, null))); },
        },
        {
            title: "Date",
            dataIndex: "Date",
            key: "Date",
        },
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Quantity Sold",
            dataIndex: "TotalQt",
            key: "TotalQt",
        },
        {
            title: "Description",
            dataIndex: "TicketList",
            key: "TicketList",
            render: function (rows) { return (React.createElement("table", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Product Name"),
                    React.createElement("th", null, "Quantity"),
                    props.User.userLogged.prevarges === "1" ? (React.createElement("th", null, "Buy price")) : null,
                    React.createElement("th", null, "Selling price")),
                rows.list.map(function (productRow, index) { return (React.createElement("tr", { key: index },
                    React.createElement("td", null, productRow.ItemName),
                    React.createElement("td", null, productRow.qnt),
                    props.User.userLogged.prevarges === "1" ? (React.createElement("td", null, productRow.buyingPrice)) : null,
                    React.createElement("td", null, productRow.initalPrice))); }))); },
        },
        {
            title: "Payment",
            dataIndex: "PaymentType",
            key: "PaymentType",
        },
        {
            title: "Cash sale",
            dataIndex: "GrandTotal",
            key: "GrandTotal",
        },
        {
            title: "Discount",
            dataIndex: "Discount",
            key: "Discount",
        },
        {
            title: "Cash split",
            dataIndex: "Cash_slipt",
            key: "Cash_slipt",
        },
        {
            title: "Card split",
            dataIndex: "Card_slipt",
            key: "Card_slipt",
        },
        {
            title: "User",
            dataIndex: "userName",
            key: "action",
        },
    ];
    var showModal = function () {
        setIsModalVisible(true);
    };
    var handleOk = function () {
        setIsModalVisible(false);
    };
    var handleCancel = function () {
        setIsModalVisible(false);
    };
    var _q = React.useState({
        startDate: 0,
        endDate: 0,
    }), DefaultDate = _q[0], setDefaultDate = _q[1];
    var _r = React.useState({
        startTime: 0,
        endTime: 0,
    }), DefaultTime = _r[0], setDefaultTime = _r[1];
    var _s = React.useState({
        startDate: "",
        endDate: "",
    }), dateString = _s[0], setDateString = _s[1];
    var onPrintFile = function () {
        if (state.data.length !== 0)
            ipcRenderer.send("do_print_saleReports", {
                data: totalsList,
                productsList: productsList,
                TotalSales: TotalSales,
                currency: props.UseCurrency.currencyInUse.currency.symbol_native,
                productInfo: productInfo,
            });
    };
    var onTimeChange = function (TimeValue, timeString) {
        // console.log(timeString);
        setDefaultTime(__assign({}, DefaultTime, { startTime: timeString[0], endTime: timeString[1] }));
    };
    var onChange = function (value, inputValue) {
        dataBase_1.default.HandelReports({
            _type: "get_sales_tickets_byDate_Casher",
            user: { id: props.User.userLogged.id },
            date: value.format("MM/DD/YYYY"),
        }, function (reciveCallback) {
            // console.log(reciveCallback.data);
            var card = [];
            var cash = [];
            var split = [];
            var others = [];
            var CashGrandTotal = 0;
            var CasDiscount = 0;
            var CashBalance = 0;
            var CardGrandTotal = 0;
            var CardDiscount = 0;
            var CardBalance = 0;
            reciveCallback.data.map(function (tickts) {
                // console.log(tickts);
                if (tickts.PaymentType === "Card") {
                    card.push(tickts);
                }
                else if (tickts.PaymentType === "Cash") {
                    cash.push(tickts);
                }
                else if (tickts.PaymentType === "split") {
                    split.push(tickts);
                }
                else {
                    others.push(tickts);
                }
            });
            var data = { card: card, cash: cash, split: split, others: others };
            settotalsList(data);
            card.map(function (list) {
                CardGrandTotal = parseFloat(list.GrandTotal) + CardGrandTotal;
                CardDiscount = parseFloat(list.Discount) + CardDiscount;
                CardBalance = parseFloat(list.Balance) + CardBalance;
            });
            split.map(function (split) {
                CardGrandTotal = parseFloat(split.Card_slipt) + CardGrandTotal;
                CashGrandTotal = parseFloat(split.Cash_slipt) + CashGrandTotal;
            });
            cash.map(function (list) {
                CashGrandTotal = parseFloat(list.GrandTotal) + CashGrandTotal;
                CasDiscount = parseFloat(list.Discount) + CasDiscount;
                CashBalance = parseFloat(list.Balance) + CashBalance;
            });
            settotalCard(CardGrandTotal);
            settotalCash(CashGrandTotal);
            setProductsList(__assign({}, productsList, { data: [] }));
            reciveCallback.data.sort(compare);
            setState(__assign({}, state, { data: reciveCallback.data }));
            var totals = 0;
            var GrossTotals = 0;
            reciveCallback.data.map(function (items) {
                totals = parseFloat(items.GrandTotal) + totals;
                GrossTotals =
                    parseFloat(items.GrandTotal) +
                        GrossTotals +
                        parseFloat(items.Discount);
                items.TicketList.list.map(function (productlist) {
                    productsList.data.push(productlist);
                    setProductsList(__assign({}, productsList, { data: productsList.data }));
                });
            });
            setTotalSales(totals);
            setGrossTotalSales(GrossTotals);
        });
        setSelectedDate(__assign({}, selectedDate, { value: value }));
    };
    var onOpenChange = function (dateValue) {
        // console.log(dateValue);
        var start_date = dateValue[0].format("YYYY-MM-DD");
        var start_end = dateValue[1].format("YYYY-MM-DD");
        var dateStartSplit = start_date.split("-");
        var dateEndSplit = start_end.split("-");
        var DateStartValue = "" + dateStartSplit[0] + dateStartSplit[1] + dateStartSplit[2];
        var DateEndValue = "" + dateEndSplit[0] + dateEndSplit[1] + dateEndSplit[2];
        setDefaultDate(__assign({}, DefaultDate, { startDate: DateStartValue, endDate: DateEndValue }));
        // console.log(DateStartValue);
        // console.log(DateEndValue);
    };
    var disabledDate = function (currentDate, inputValue) {
        return false;
    };
    var compare = function (a, b) {
        return b.timeRange - a.timeRange;
    };
    React.useEffect(function () {
        dataBase_1.default.HandleGetUser(function (callback) {
            setUsers(callback);
        });
        if (props.ViewType === "reports")
            dataBase_1.default.HandelReports({
                _type: "get_sales_tickets_byDateRange",
                startTime: props.startTime,
                endTime: props.endTime,
                startDate: parseInt(props.startDate),
                endDate: parseInt(props.endDate),
            }, function (reciveCallback) {
                // console.log(reciveCallback.data); 
                var card = [];
                var cash = [];
                var split = [];
                var others = [];
                var CashGrandTotal = 0;
                var CasDiscount = 0;
                var CashBalance = 0;
                var CardGrandTotal = 0;
                var CardDiscount = 0;
                var CardBalance = 0;
                reciveCallback.data.map(function (tickts) {
                    if (tickts.PaymentType === "Card") {
                        card.push(tickts);
                    }
                    else if (tickts.PaymentType === "Cash") {
                        cash.push(tickts);
                    }
                    else if (tickts.PaymentType === "split") {
                        split.push(tickts);
                    }
                    else {
                        others.push(tickts);
                    }
                });
                var data = { card: card, cash: cash, split: split, others: others };
                settotalsList(data);
                card.map(function (list) {
                    CardGrandTotal = parseFloat(list.GrandTotal) + CardGrandTotal;
                    CardDiscount = parseFloat(list.Discount) + CardDiscount;
                    CardBalance = parseFloat(list.Balance) + CardBalance;
                });
                split.map(function (split) {
                    CardGrandTotal = parseFloat(split.Card_slipt) + CardGrandTotal;
                    CashGrandTotal = parseFloat(split.Cash_slipt) + CashGrandTotal;
                });
                cash.map(function (list) {
                    CashGrandTotal = parseFloat(list.GrandTotal) + CashGrandTotal;
                    CasDiscount = parseFloat(list.Discount) + CasDiscount;
                    CashBalance = parseFloat(list.Balance) + CashBalance;
                });
                settotalCard(CardGrandTotal);
                settotalCash(CashGrandTotal);
                var totals = 0;
                var GrossTotals = 0;
                var productTotals = 0;
                var productdiscount = 0;
                // var productListArry = [];
                var tempArry = [];
                reciveCallback.data.sort(compare);
                setState(__assign({}, state, { data: reciveCallback.data }));
                // console.log(reciveCallback.data);
                reciveCallback.data.map(function (items) {
                    totals = parseFloat(items.GrandTotal) + totals;
                    GrossTotals =
                        parseFloat(items.GrandTotal) +
                            GrossTotals +
                            parseFloat(items.Discount);
                    productdiscount = parseFloat(items.Discount) + productdiscount;
                    setProductInfo(__assign({}, productInfo, { cashier: items.userName, date: props.dateString.startDate + " - " + props.dateString.endDate, 
                        // time: items.userName,
                        compInfo: props.Dep }));
                    items.TicketList.list.map(function (productlist) {
                        productTotals =
                            parseFloat(productlist.initalPrice) + productTotals;
                        tempArry.push(productlist);
                    });
                });
                setProductsList(__assign({}, productsList, { data: tempArry }));
                setProductTotalSales(productTotals);
                setProductTotalDiscount(productdiscount);
                setTotalSales(totals);
                setGrossTotalSales(GrossTotals);
            });
        else
            dataBase_1.default.HandelReports({
                _type: "get_sales_tickets_byCasher",
                user: { id: props.User.userLogged.id },
                startDate: parseInt(DateNumInput),
                endDate: parseInt(DateNumInput),
            }, function (reciveCallback) {
                // console.log(reciveCallback.data);
                var card = [];
                var cash = [];
                var split = [];
                var others = [];
                var CashGrandTotal = 0;
                var CasDiscount = 0;
                var CashBalance = 0;
                var CardGrandTotal = 0;
                var CardDiscount = 0;
                var CardBalance = 0;
                reciveCallback.data.map(function (tickts) {
                    if (tickts.PaymentType === "Card") {
                        card.push(tickts);
                    }
                    else if (tickts.PaymentType === "Cash") {
                        cash.push(tickts);
                    }
                    else if (tickts.PaymentType === "split") {
                        split.push(tickts);
                    }
                    else {
                        others.push(tickts);
                    }
                });
                var data = { card: card, cash: cash, split: split, others: others };
                settotalsList(data);
                // console.log(data);
                card.map(function (list) {
                    CardGrandTotal = parseFloat(list.GrandTotal) + CardGrandTotal;
                    CardDiscount = parseFloat(list.Discount) + CardDiscount;
                    CardBalance = parseFloat(list.Balance) + CardBalance;
                });
                split.map(function (split) {
                    CardGrandTotal = parseFloat(split.Card_slipt) + CardGrandTotal;
                    CashGrandTotal = parseFloat(split.Cash_slipt) + CashGrandTotal;
                });
                cash.map(function (list) {
                    CashGrandTotal = parseFloat(list.GrandTotal) + CashGrandTotal;
                    CasDiscount = parseFloat(list.Discount) + CasDiscount;
                    CashBalance = parseFloat(list.Balance) + CashBalance;
                });
                settotalCard(CardGrandTotal);
                settotalCash(CashGrandTotal);
                var totals = 0;
                var GrossTotals = 0;
                var productTotals = 0;
                var productdiscount = 0;
                // var productListArry = [];
                var tempArry = [];
                reciveCallback.data.sort(compare);
                // console.log(reciveCallback.data);
                setState(__assign({}, state, { data: reciveCallback.data }));
                reciveCallback.data.map(function (items) {
                    totals = parseFloat(items.GrandTotal) + totals;
                    GrossTotals =
                        parseFloat(items.GrandTotal) +
                            GrossTotals +
                            parseFloat(items.Discount);
                    productdiscount = parseFloat(items.Discount) + productdiscount;
                    // console.log(items);
                    setProductInfo(__assign({}, productInfo, { cashier: items.userName, date: items.Date, compInfo: props.Dep }));
                    items.TicketList.list.map(function (productlist) {
                        productTotals =
                            parseFloat(productlist.initalPrice) + productTotals;
                        tempArry.push(productlist);
                    });
                });
                setProductsList(__assign({}, productsList, { data: tempArry }));
                setProductTotalSales(productTotals);
                setProductTotalDiscount(productdiscount);
                setTotalSales(totals);
                setGrossTotalSales(GrossTotals);
            });
    }, [props]);
    var sliptTimeRange = function () {
        if (DefaultTime.startTime !== 0 && DefaultTime.endTime !== 0) {
            var startTimeSplit = DefaultTime.startTime.split(":");
            var startTimeValue = "" + startTimeSplit[0] + startTimeSplit[1];
            var endTimeSplit = DefaultTime.endTime.split(":");
            var endTimeValue = "" + endTimeSplit[0] + endTimeSplit[1];
            return {
                startTimeSet: parseInt(startTimeValue),
                endTimeSet: parseInt(endTimeValue),
            };
        }
        else
            return {
                startTimeSet: 0,
                endTimeSet: 0,
            };
    };
    var handleGetSaleData = function (prop) {
        // console.log(prop);
        dataBase_1.default.HandelReports({
            _type: "get_sales_tickets_byCasherAndTime",
            user: { id: props.User.userLogged.id },
            startTime: prop.time.startTimeSet,
            endTime: prop.time.endTimeSet,
            startDate: parseInt(prop.startDate),
            endDate: parseInt(prop.endDate),
        }, function (reciveCallback) {
            // console.log(reciveCallback.data);
            var card = [];
            var cash = [];
            var split = [];
            var others = [];
            var CashGrandTotal = 0;
            var CasDiscount = 0;
            var CashBalance = 0;
            var CardGrandTotal = 0;
            var CardDiscount = 0;
            var CardBalance = 0;
            reciveCallback.data.map(function (tickts) {
                if (tickts.PaymentType === "Card") {
                    card.push(tickts);
                }
                else if (tickts.PaymentType === "Cash") {
                    cash.push(tickts);
                }
                else if (tickts.PaymentType === "split") {
                    split.push(tickts);
                }
                else {
                    others.push(tickts);
                }
            });
            var data = { card: card, cash: cash, split: split, others: others };
            settotalsList(data);
            // console.log(data);
            card.map(function (list) {
                CardGrandTotal = parseFloat(list.GrandTotal) + CardGrandTotal;
                CardDiscount = parseFloat(list.Discount) + CardDiscount;
                CardBalance = parseFloat(list.Balance) + CardBalance;
            });
            split.map(function (split) {
                CardGrandTotal = parseFloat(split.Card_slipt) + CardGrandTotal;
                CashGrandTotal = parseFloat(split.Cash_slipt) + CashGrandTotal;
            });
            cash.map(function (list) {
                CashGrandTotal = parseFloat(list.GrandTotal) + CashGrandTotal;
                CasDiscount = parseFloat(list.Discount) + CasDiscount;
                CashBalance = parseFloat(list.Balance) + CashBalance;
            });
            settotalCard(CardGrandTotal);
            settotalCash(CashGrandTotal);
            var totals = 0;
            var GrossTotals = 0;
            var productTotals = 0;
            var productdiscount = 0;
            // var productListArry = [];
            var tempArry = [];
            reciveCallback.data.sort(compare);
            // console.log(reciveCallback.data);
            setState(__assign({}, state, { data: reciveCallback.data }));
            reciveCallback.data.map(function (items) {
                totals = parseFloat(items.GrandTotal) + totals;
                GrossTotals =
                    parseFloat(items.GrandTotal) +
                        GrossTotals +
                        parseFloat(items.Discount);
                productdiscount = parseFloat(items.Discount) + productdiscount;
                // console.log(items);
                setProductInfo(__assign({}, productInfo, { cashier: items.userName, date: items.Date, compInfo: props.Dep }));
                items.TicketList.list.map(function (productlist) {
                    productTotals = parseFloat(productlist.initalPrice) + productTotals;
                    tempArry.push(productlist);
                });
            });
            setProductsList(__assign({}, productsList, { data: tempArry }));
            setProductTotalSales(productTotals);
            setProductTotalDiscount(productdiscount);
            setTotalSales(totals);
            setGrossTotalSales(GrossTotals);
        });
    };
    return (React.createElement("div", { style: {
            padding: 6,
            paddingLeft: 27,
            paddingRight: 27,
            height: "86vh",
            overflow: "auto",
        } },
        React.createElement("div", { style: { display: "flex", backgroundColor: "#F7F7F7" } },
            props.ViewType !== "reports" ? (
            // <div style={{ height: 30, width: 220 }}>
            //   <Calendar
            //     onChange={onChange}
            //     value={selectedDate.value}
            //     allowClear={true}
            //     disabled={false}
            //     placeholder={"please input date"}
            //     format={"MM/DD/YYYY"}
            //     className={classes.container}
            //     onOpenChange={onOpenChange}
            //     disabledDate={disabledDate}
            //   />
            // </div>
            React.createElement("div", { style: {
                    height: 50,
                    position: "fixed",
                    zIndex: 400,
                    // backgroundColor: "#3b3b3b",
                    display: "flex",
                } },
                React.createElement("div", { style: { marginTop: 10 } },
                    React.createElement(RangePicker, { onChange: function (value) {
                            onOpenChange(value);
                        } })),
                React.createElement("div", { style: { marginLeft: 10, marginTop: 10 } },
                    React.createElement(antd_1.TimePicker.RangePicker
                    // defaultValue={moment("12:08", format)}
                    , { 
                        // defaultValue={moment("12:08", format)}
                        onChange: onTimeChange, format: format })),
                React.createElement("div", null,
                    React.createElement(core_1.Button, { variant: "outlined", style: { marginLeft: 15, marginTop: 10 }, onClick: function () {
                            handleGetSaleData({
                                startDate: DefaultDate.startDate,
                                endDate: DefaultDate.endDate,
                                time: sliptTimeRange(),
                            });
                        } }, "Submit")),
                React.createElement("div", { style: { marginLeft: 10, marginTop: 10 } },
                    React.createElement(core_1.Button, { onClick: onPrintFile, color: "primary", variant: "outlined" }, "Print Report")),
                React.createElement("div", { style: { marginLeft: 10, marginTop: 10 } },
                    React.createElement(core_1.Button, { onClick: function () {
                            ipcRenderer.send("save_csv", {
                                type: "FilteredInvoiceList",
                                header: [
                                    {
                                        id: "Date",
                                        title: "Date",
                                    },
                                    {
                                        id: "TotalQt",
                                        title: "Quantity Sold",
                                    },
                                    {
                                        id: "Balance",
                                        title: "Description",
                                    },
                                    {
                                        id: "PaymentType",
                                        title: "Payment",
                                    },
                                    {
                                        id: "GrandTotal",
                                        title: "Cash sale",
                                    },
                                    {
                                        id: "Discount",
                                        title: "Discount",
                                    },
                                    {
                                        id: "Cash_slipt",
                                        title: "Cash split",
                                    },
                                    {
                                        id: "Card_slipt",
                                        title: "Card split",
                                    },
                                ],
                                data: state.data,
                            });
                        }, color: "primary", variant: "outlined" }, "Export to Excel file")))) : null,
            props.ViewType === "reports" ? (React.createElement("div", { style: { display: "flex" } },
                React.createElement(Autocomplete_1.default, { id: "combo-box-demo", options: users, getOptionLabel: function (option) { return option.userName; }, style: { width: 300 }, onChange: function (event, newData) {
                        dataBase_1.default.HandelReports({
                            _type: "get_sales_tickets_byCasher",
                            user: newData,
                            startDate: parseInt(props.startDate),
                            endDate: parseInt(props.endDate),
                        }, function (reciveCallback) {
                            // console.log(reciveCallback);
                            setState(__assign({}, state, { data: [] }));
                            var card = [];
                            var cash = [];
                            var split = [];
                            var others = [];
                            var CashGrandTotal = 0;
                            var CasDiscount = 0;
                            var CashBalance = 0;
                            var CardGrandTotal = 0;
                            var CardDiscount = 0;
                            var CardBalance = 0;
                            reciveCallback.data.map(function (tickts) {
                                if (tickts.PaymentType === "Card") {
                                    card.push(tickts);
                                }
                                else if (tickts.PaymentType === "Cash") {
                                    cash.push(tickts);
                                }
                                else if (tickts.PaymentType === "split") {
                                    split.push(tickts);
                                }
                                else {
                                    others.push(tickts);
                                }
                            });
                            var data = { card: card, cash: cash, split: split, others: others };
                            settotalsList(data);
                            // console.log(data);
                            card.map(function (list) {
                                CardGrandTotal =
                                    parseFloat(list.GrandTotal) + CardGrandTotal;
                                CardDiscount = parseFloat(list.Discount) + CardDiscount;
                                CardBalance = parseFloat(list.Balance) + CardBalance;
                            });
                            split.map(function (split) {
                                CardGrandTotal =
                                    parseFloat(split.Card_slipt) + CardGrandTotal;
                                CashGrandTotal =
                                    parseFloat(split.Cash_slipt) + CashGrandTotal;
                            });
                            cash.map(function (list) {
                                CashGrandTotal =
                                    parseFloat(list.GrandTotal) + CashGrandTotal;
                                CasDiscount = parseFloat(list.Discount) + CasDiscount;
                                CashBalance = parseFloat(list.Balance) + CashBalance;
                            });
                            settotalCard(CardGrandTotal);
                            settotalCash(CashGrandTotal);
                            var totals = 0;
                            var GrossTotals = 0;
                            var productTotals = 0;
                            var productdiscount = 0;
                            // var productListArry = [];
                            var tempArry = [];
                            reciveCallback.data.sort(compare);
                            setState(__assign({}, state, { data: reciveCallback.data }));
                            reciveCallback.data.map(function (items) {
                                totals = parseFloat(items.GrandTotal) + totals;
                                GrossTotals =
                                    parseFloat(items.GrandTotal) +
                                        GrossTotals +
                                        parseFloat(items.Discount);
                                productdiscount =
                                    parseFloat(items.Discount) + productdiscount;
                                // console.log(items);
                                setProductInfo(__assign({}, productInfo, { cashier: items.userName, date: items.Date }));
                                items.TicketList.list.map(function (productlist) {
                                    productTotals =
                                        parseFloat(productlist.initalPrice) + productTotals;
                                    tempArry.push(productlist);
                                });
                            });
                            setProductsList(__assign({}, productsList, { data: tempArry }));
                            setProductTotalSales(productTotals);
                            setProductTotalDiscount(productdiscount);
                            setTotalSales(totals);
                            setGrossTotalSales(GrossTotals);
                        });
                    }, renderInput: function (params) { return (React.createElement(TextField_1.default, __assign({}, params, { label: "filter by cashier", variant: "outlined" }))); } }),
                React.createElement("div", { style: { marginLeft: 10, marginTop: 10 } },
                    React.createElement(core_1.Button, { onClick: onPrintFile, color: "primary", variant: "outlined" }, "Print Report")),
                React.createElement("div", { style: { marginLeft: 10, marginTop: 10 } },
                    React.createElement(core_1.Button, { onClick: function () {
                            ipcRenderer.send("save_csv", {
                                type: "FilteredInvoiceList",
                                header: [
                                    {
                                        id: "Date",
                                        title: "Date",
                                    },
                                    {
                                        id: "TotalQt",
                                        title: "Quantity Sold",
                                    },
                                    {
                                        id: "Balance",
                                        title: "Description",
                                    },
                                    {
                                        id: "PaymentType",
                                        title: "Payment",
                                    },
                                    {
                                        id: "GrandTotal",
                                        title: "Cash sale",
                                    },
                                    {
                                        id: "Discount",
                                        title: "Discount",
                                    },
                                    {
                                        id: "Cash_slipt",
                                        title: "Cash split",
                                    },
                                    {
                                        id: "Card_slipt",
                                        title: "Card split",
                                    },
                                ],
                                data: state.data,
                            });
                        }, color: "primary", variant: "outlined" }, "Export to Excel file")))) : null),
        React.createElement("div", { style: { marginTop: props.ViewType === "reports" ? 20 : 70 } }),
        React.createElement(antd_1.Modal, { title: "Basic Modal", visible: isModalVisible, onOk: handleOk, onCancel: handleCancel },
            React.createElement("div", { className: classes.paper })),
        React.createElement("div", null,
            React.createElement(antd_1.Table, { dataSource: state.data, columns: columns })),
        React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 10 } },
            React.createElement("div", null,
                React.createElement(core_1.Typography, { variant: "h6" },
                    "Total Cash :",
                    React.createElement(Currency, { locale: "en", quantity: totalCash, symbol: "K" })),
                React.createElement(core_1.Typography, { variant: "h6" },
                    "Total Card :",
                    React.createElement(Currency, { locale: "en", quantity: totalCard, symbol: "K" })),
                totalsList !== null ? (React.createElement("div", null, totalsList.others.map(function (t) {
                    return (React.createElement(core_1.Typography, { variant: "h6" },
                        "Total ",
                        t.PaymentType,
                        " :",
                        React.createElement(Currency, { locale: "en", quantity: t.GrandTotal - t.Discount - t.Balance, symbol: "K" })));
                }))) : null,
                React.createElement(core_1.Typography, { style: { color: "red" }, variant: "h5" },
                    "Total sales :",
                    React.createElement(Currency, { locale: "en", quantity: TotalSales, symbol: "K" }))))));
};
function mapStateToProps(state) {
    return {
        Theme: state.Theme,
        Dep: state.Dep,
        User: state.User,
        UseCurrency: state.UseCurrencyReducer,
    };
}
var mapDispatchToProps = function (dispatch) {
    return {
        dispatchEvent: function (data) { return dispatch(data); },
    };
};
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(index);
//# sourceMappingURL=index.js.map
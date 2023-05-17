"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dataBase_1 = require("./app/redux/dataBase");
var formatCurrency = require("format-currency");
var moment = require("moment");
var escpos = require("escpos");
escpos.USB = require("escpos-usb");
escpos.Network = require("escpos-network");
var Alert = require("electron-alert");
var alert = new Alert();
function Printer(type, data) {
    return __awaiter(this, void 0, void 0, function () {
        var options, check, time, opts_1, swalOptions_1, networkDevice, printer_1, device_1, printer_2;
        return __generator(this, function (_a) {
            // console.log(data);
            // console.log(type);
            try {
                options = { encoding: "tis620" /* default */ };
                check = moment(new Date());
                time = check.format("LT");
                opts_1 = { format: "%s%v %c", code: "", symbol: data.currency };
                swalOptions_1 = {
                    title: "The CSV file was written successfully",
                    text: "Written successfully!",
                    type: "error",
                    showCancelButton: false,
                };
                if (type === "network") {
                    networkDevice = new escpos.Network(data.networkPrinter[0].printerIp);
                    printer_1 = new escpos.Printer(networkDevice, options);
                    networkDevice.open(function (error) {
                        printer_1
                            .align("ct")
                            .encode("tis620")
                            .text(" ")
                            .font("a")
                            .size(1.5, 1.5)
                            .text(data.compInfo.departmentInfo.dep_name)
                            .text(data.compInfo.departmentInfo.road)
                            .text(data.networkPrinter[0].printerName)
                            .text("ORDER")
                            .text("---------------------------------------------")
                            .text("Date " + data.date)
                            .text("Time " + data.time)
                            .text("---------------------------------------------")
                            .text("Table " + data.name)
                            .text("Sales Person " + data.user)
                            .text(" ")
                            .text("---------------------------------------------");
                        data.networkPrinter[0].data.forEach(function (list) {
                            printer_1.size(1, 1).tableCustom([
                                { text: list.ItemName, align: "LEFT", width: 0.44 },
                                {
                                    text: "",
                                    align: "RIGHT",
                                    width: 0.22,
                                },
                                {
                                    text: list.qnt,
                                    align: "RIGHT",
                                    width: 0.33,
                                },
                            ]);
                            if (list.extraMsg)
                                printer_1.text("Massage: " + list.extraMsg);
                            printer_1.text("---------------------------------------------");
                        });
                        printer_1
                            .text("================================================")
                            .cut()
                            .close();
                    });
                }
                else {
                    device_1 = new escpos.USB();
                    printer_2 = new escpos.Printer(device_1, options);
                    if (type === "receipt") {
                        dataBase_1.default.getPrintOuts(function (callback) {
                            // const times = [];
                            for (var i = 0; i < callback; i++) {
                                device_1.open(function (error) {
                                    if (error)
                                        alert.fireWithFrame(swalOptions_1, "Printer Error", null, false);
                                    printer_2
                                        .align("ct")
                                        .encode("tis620")
                                        .text(" ")
                                        .font("a")
                                        .size(1.5, 1.5)
                                        .text(data.department)
                                        .text(data.road)
                                        .text(data.shop)
                                        .text(" ")
                                        .text("Tel: " + data.state.phone)
                                        .text(data.ticketHeader + ":" + data.invoiceNumber)
                                        .text(data.ticketstate)
                                        .tableCustom([
                                        { text: " ", align: "LEFT", width: 0.4 },
                                        { text: " ", align: "CENTER", width: 0.19 },
                                        {
                                            text: "TPIN: " + data.state.tpin,
                                            align: "RIGHT",
                                            width: 0.44,
                                        },
                                    ])
                                        .tableCustom([
                                        {
                                            text: "Date: " + data.date,
                                            align: "LEFT",
                                            width: 0.44,
                                        },
                                        { text: " ", align: "CENTER", width: 0.2 },
                                        { text: "Time: " + data.time, align: "RIGHT", width: 0.4 },
                                    ])
                                        .tableCustom([
                                        { text: "Casher : " + data.user, align: "LEFT", width: 1 },
                                    ])
                                        .text("---------------------------------------------");
                                    var total = 0;
                                    var change = 0;
                                    data.items.forEach(function (element) {
                                        total =
                                            parseFloat(element.initalPrice) * parseInt(element.Qty) +
                                                total;
                                        if (data.AmountPaid !== 0)
                                            change = parseFloat(data.AmountPaid) - total;
                                        printer_2.tableCustom([
                                            {
                                                text: element.ItemName + " x " + element.Qty,
                                                align: "LEFT",
                                                width: 0.49,
                                            },
                                            {
                                                text: formatCurrency(element.initalPrice),
                                                align: "CENTER",
                                                width: 0.16,
                                            },
                                            {
                                                text: formatCurrency(element.initalPrice * element.Qty, opts_1),
                                                align: "RIGHT",
                                                width: 0.35,
                                            },
                                        ]);
                                    });
                                    printer_2
                                        .text("================================================")
                                        .tableCustom([
                                        { text: "Total:", align: "LEFT", width: 0.44 },
                                        { text: " ", align: "CENTER", width: 0.22 },
                                        {
                                            text: formatCurrency(total),
                                            align: "RIGHT",
                                            width: 0.33,
                                        },
                                    ]);
                                    data.ticketHeader !== "Quotation"
                                        ? printer_2.tableCustom([
                                            { text: "Change:", align: "LEFT", width: 0.44 },
                                            { text: " ", align: "CENTER", width: 0.22 },
                                            {
                                                text: formatCurrency(change),
                                                align: "RIGHT",
                                                width: 0.33,
                                            },
                                        ])
                                        : null;
                                    if (data.Discount !== 0)
                                        printer_2.tableCustom([
                                            { text: "Discount", align: "LEFT", width: 0.44 },
                                            { text: " ", align: "CENTER", width: 0.22 },
                                            {
                                                text: formatCurrency(data.Discount),
                                                align: "RIGHT",
                                                width: 0.33,
                                            },
                                        ]);
                                    printer_2
                                        .tableCustom([
                                        { text: "" + data.paymentType, align: "LEFT", width: 0.44 },
                                        {
                                            text: "",
                                            align: "CENTER",
                                            width: 0.22,
                                        },
                                        {
                                            text: formatCurrency(data.AmountPaid),
                                            align: "RIGHT",
                                            width: 0.33,
                                        },
                                    ])
                                        .text("================================================")
                                        .size(2, 2)
                                        .text("THANK YOU & VISIT AGAIN")
                                        .cut()
                                        .cashdraw(2)
                                        .close();
                                });
                            }
                            // times.map((list) => {});
                        });
                    }
                    else if (type === "sale")
                        device_1.open(function (error) {
                            var tempArray = [];
                            if (data.productsList) {
                                data.productsList.data.forEach(function (list) {
                                    var index = tempArray.findIndex(function (x) { return x.productKey === list.productKey; });
                                    if (index != -1) {
                                        tempArray[index].qnt =
                                            parseInt(tempArray[index].qnt) + parseInt(list.qnt);
                                        // console.log(tempArray[index]);
                                    }
                                    else {
                                        tempArray.push(list);
                                    }
                                });
                            }
                            var DataTypes = [];
                            var CashGrandTotal = 0;
                            var CasDiscount = 0;
                            var CashBalance = 0;
                            var CashTotalCash = 0;
                            var TranType = "Cash";
                            var CardGrandTotal = 0;
                            var CardDiscount = 0;
                            var CardBalance = 0;
                            var CardTranType = "Card";
                            var allTotal = 0;
                            var GrandallTotal = 0;
                            printer_2
                                .align("ct")
                                .encode("tis620")
                                .text(" ")
                                .font("a")
                                .size(1.5, 1.5)
                                .text(data.productInfo.compInfo.dep)
                                .text(" ")
                                .text("Tel: " + data.productInfo.compInfo.departmentInfo.phone)
                                .text("Sales Person " + data.productInfo.cashier)
                                .text("" + data.productInfo.date)
                                .text(" ")
                                .text("================================================");
                            if (data.data.cash.length !== 0) {
                                data.data.cash.map(function (list) {
                                    CashGrandTotal = parseFloat(list.GrandTotal) + CashGrandTotal;
                                    CasDiscount = parseFloat(list.Discount) + CasDiscount;
                                    CashBalance = parseFloat(list.Balance) + CashBalance;
                                });
                                data.data.split.map(function (split) {
                                    CashGrandTotal = parseFloat(split.Cash_slipt) + CashGrandTotal;
                                });
                                DataTypes.push({
                                    paymentType: "Cash",
                                    total: CashGrandTotal - CashBalance,
                                });
                            }
                            if (data.data.card.length !== 0) {
                                data.data.card.map(function (list) {
                                    CardGrandTotal = parseFloat(list.GrandTotal) + CardGrandTotal;
                                    CardDiscount = parseFloat(list.Discount) + CardDiscount;
                                    CardBalance = parseFloat(list.Balance) + CardBalance;
                                });
                                data.data.split.map(function (split) {
                                    CardGrandTotal = parseFloat(split.Card_slipt) + CardGrandTotal;
                                });
                                DataTypes.push({
                                    paymentType: "Card",
                                    total: CardGrandTotal - CardBalance,
                                });
                            }
                            if (data.data.others.length !== 0) {
                                data.data.others.map(function (others) {
                                    DataTypes.push({
                                        paymentType: others.PaymentType,
                                        total: parseFloat(others.GrandTotal) - parseFloat(others.Balance),
                                    });
                                });
                            }
                            tempArray.forEach(function (list) {
                                GrandallTotal =
                                    parseFloat(list.initalPrice) * list.qnt + GrandallTotal;
                                printer_2.text(" " + list.ItemName + " -- @ " + parseFloat(list.initalPrice) + " --  *  " + list.qnt + " = " + formatCurrency(parseFloat(list.initalPrice) * list.qnt));
                            });
                            printer_2.text("");
                            printer_2.text("--------------------------------");
                            printer_2.text("Grand Sales : " + formatCurrency(GrandallTotal, opts_1));
                            printer_2.text("--------------------------------");
                            printer_2.text("");
                            printer_2.text("Mode Of Payment");
                            printer_2.text("--------------------------------");
                            DataTypes.map(function (lists) {
                                allTotal = lists.total + allTotal;
                                printer_2.text(lists.paymentType + " : " + formatCurrency(lists.total, opts_1));
                            });
                            printer_2
                                .text("---------------------------------------------")
                                .text("")
                                .text("Discounts")
                                .text("Cash Discount : " + formatCurrency(CasDiscount, opts_1))
                                .text("Card Discount : " + formatCurrency(CardDiscount, opts_1))
                                .text("")
                                .text("Net Total : " + formatCurrency(allTotal, opts_1))
                                .text("---------------------------------------------");
                            printer_2
                                .text("================================================")
                                .cut()
                                .close();
                        });
                    else if (type === "order")
                        device_1.open(function (error) {
                            printer_2
                                .align("ct")
                                .encode("tis620")
                                .text(" ")
                                .font("a")
                                .size(1.5, 1.5)
                                .text("KICHEN ORDER")
                                .text("Sales Person " + data.user)
                                .text(" ")
                                .text("---------------------------------------------");
                            data.data.forEach(function (list) {
                                printer_2.tableCustom([
                                    { text: list.ItemName, align: "LEFT", width: 0.44 },
                                    {
                                        text: formatCurrency(list.initalPrice),
                                        align: "RIGHT",
                                        width: 0.33,
                                    },
                                ]);
                            });
                            printer_2
                                .text("================================================")
                                .cut()
                                .close();
                        });
                    else if (type === "bill")
                        device_1.open(function (error) {
                            var total = 0;
                            printer_2
                                .align("ct")
                                .encode("tis620")
                                .text(" ")
                                .font("a")
                                .size(1.5, 1.5)
                                .text("Bill")
                                .text("Date " + data.date)
                                .text("Time " + data.time)
                                .text("Table " + data.name)
                                .text("Sales Person " + data.user)
                                .text(" ")
                                .text("---------------------------------------------");
                            data.list.data.forEach(function (list) {
                                total = list.initalPrice * list.qnt + total;
                                printer_2.tableCustom([
                                    { text: list.ItemName, align: "LEFT", width: 0.44 },
                                    {
                                        text: list.qnt,
                                        align: "RIGHT",
                                        width: 0.22,
                                    },
                                    {
                                        text: formatCurrency(list.initalPrice * list.qnt),
                                        align: "RIGHT",
                                        width: 0.33,
                                    },
                                ]);
                            });
                            printer_2.text("================================================");
                            printer_2.tableCustom([
                                { text: "Total", aline: "LEFT", width: 0.44 },
                                { text: "==", aline: "RIGHT", width: 0.22 },
                                {
                                    text: formatCurrency(total),
                                    aline: "RIGHT",
                                    width: 0.33,
                                },
                            ]);
                            printer_2
                                .text("================================================")
                                .cut()
                                .close();
                        });
                }
            }
            catch (e) {
                alert.fireWithFrame({
                    title: "Faild to print",
                    text: "" + e,
                    type: "error",
                    showCancelButton: false,
                }, "Printer Error", null, false);
            }
            return [2 /*return*/];
        });
    });
}
exports.default = Printer;
//# sourceMappingURL=Printer.js.map
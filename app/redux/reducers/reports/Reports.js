"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_toastify_1 = require("react-toastify");
var store_1 = require("../../store");
var uuidv4 = require("uuid/v4");
var moment = require("moment");
function CreateId() {
    return uuidv4();
}
var isSent = false;
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
var DateNumInput = "" + year + month + date;
exports.HandleReports = function (props, dbhook, sendCallback) {
    switch (props._type) {
        case "sales":
            // if (configureStore.getState().SocketConn.isConn) {
            //   if (!isSent) {
            //     isSent = true;
            //     configureStore
            //       .getState()
            //       .SocketConn.socket.emit("SALESREPORT", props);
            //     setTimeout(() => {
            //       isSent = false;
            //     }, 500);
            //   }
            // }
            // console.log(props);
            if (!props.data.AmountPaid) {
                props.data.AmountPaid = props.data.GrandTotal;
            }
            dbhook("sales_reports_tikets")
                .insert({
                id: props.data.id,
                Year: props.data.year,
                Day: props.data.day,
                Month: props.data.month,
                InvoiceNumber: props.data.invoiceNumber,
                tableId: "1",
                TicketList: JSON.stringify({ list: props.data.ticketList }),
                Customer: props.data.Customer ? props.data.Customer : "",
                GrandTotal: props.data.GrandTotal,
                AmountPaid: props.data.AmountPaid,
                ChangeDue: props.data.ChangeDue,
                Balance: props.data.Balance,
                RtxGrandTotal: props.isTaxInvoice
                    ? props.data.GrandTotal
                    : props.paymentType === "Credit Card"
                        ? props.data.GrandTotal
                        : props.data.RtxGrandTotal,
                RtxAmountPaid: props.isTaxInvoice
                    ? props.data.AmountPaid
                    : props.paymentType === "Credit Card"
                        ? props.data.AmountPaid
                        : props.data.RtxAmountPaid,
                RtxChangeDue: props.isTaxInvoice
                    ? props.data.ChangeDue
                    : props.paymentType === "Credit Card"
                        ? props.data.ChangeDue
                        : props.data.RtxChangeDue,
                RtxBalance: props.isTaxInvoice
                    ? props.data.Balance
                    : props.paymentType === "Credit Card"
                        ? props.data.Balance
                        : props.data.RtxBalance,
                Discount: props.data.Discount === null ? 0 : props.data.Discount,
                Card_slipt: props.data.Card_slipt,
                Cash_slipt: props.data.Cash_slipt,
                Date: props.data.Date,
                Datetrack: props.data.Datetrack,
                dateRange: parseInt(DateNumInput),
                Department: props.data.department,
                TotalQt: props.data.totalQt,
                User: props.data.user,
                PaymentType: props.data.paymentType,
                isTaxInvoice: props.data.isTaxInvoice,
                isActive: true,
                Note: props.data.note,
                totalTaxFinal: props.data.totalTaxFinal,
                totalTax: props.data.totalTax,
                time: props.data.time,
                timeRange: props.data.timeRange,
                isBackedUp: store_1.default.getState().SocketConn.isConn
                    ? true
                    : false,
            })
                .then(function () {
                props.data.ticketList.map(function (listIngr) {
                    // dbhook
                    //   .select()
                    //   .from("balancesReports")
                    //   .where("name", listIngr.ItemName)
                    //   .then(function (Data) {
                    //     dbhook("balancesReports")
                    //       .where({ name: listIngr.ItemName })
                    //       .update({
                    //         CloseBalance: Data[0].OpenBalance - listIngr.qnt,
                    //         QuantitySold: Data[0].QuantitySold + listIngr.qnt,
                    //       })
                    //       .then(() => {});
                    //   });
                    dbhook
                        .select()
                        .from("ingredients")
                        .where("idKey", listIngr.ingredient)
                        .then(function (Data) {
                        // console.log(listIngr); 
                        if (Data.length !== 0)
                            Data[0].ingredients.data.map(function (list) {
                                dbhook
                                    .select()
                                    .from("materials")
                                    .where("idKey", list.material.idKey)
                                    .then(function (DataResult) {
                                    var ingrInt = parseInt(listIngr.qnt) * parseFloat(list.Qty);
                                    console.log(DataResult);
                                    console.log(parseFloat(DataResult[0].quantity));
                                    console.log(parseFloat(DataResult[0].quantity) - ingrInt);
                                    if (DataResult.length !== 0)
                                        dbhook("materials")
                                            .where({ idKey: DataResult[0].idKey })
                                            .update({
                                            quantity: parseFloat(DataResult[0].quantity) - ingrInt,
                                        })
                                            .then(function () {
                                            dbhook("materialsReport")
                                                .insert({
                                                idKey: DataResult[0].idKey,
                                                materialName: DataResult[0].materialName,
                                                measuredBy: DataResult[0].measuredBy,
                                                quantityStarted: parseFloat(DataResult[0].quantity),
                                                quantityOpening: parseFloat(DataResult[0].quantity),
                                                quantityClosing: parseFloat(DataResult[0].quantity) - ingrInt,
                                                DateEntered: moment().format("MM/DD/YYYY"),
                                                DateEnded: DataResult[0].DateEntered,
                                                DateUpdated: moment().format("MM/DD/YYYY"),
                                                DateRange: parseInt(DateNumInput),
                                            })
                                                .then(function () {
                                                sendCallback(true);
                                            });
                                        });
                                    // resolve(true);
                                });
                            });
                    });
                });
                dbhook
                    .select()
                    .from("sales_reports_totals")
                    .where("Department", props.data.department)
                    .then(function (MainData) {
                    if (MainData.length === 0) {
                        dbhook("sales_reports_totals")
                            .insert({
                            id: props.data.id,
                            Year: props.data.year,
                            Day: props.data.day,
                            Month: props.data.month,
                            SrNo: 1,
                            GrandTotal: props.data.GrandTotal,
                            AmountPaid: props.data.AmountPaid,
                            ChangeDue: props.data.ChangeDue,
                            Balance: props.data.Balance,
                            RtxGrandTotal: props.isTaxInvoice
                                ? props.data.GrandTotal
                                : props.paymentType === "Credit Card"
                                    ? props.data.GrandTotal
                                    : props.data.RtxGrandTotal,
                            RtxAmountPaid: props.isTaxInvoice
                                ? props.data.AmountPaid
                                : props.paymentType === "Credit Card"
                                    ? props.data.AmountPaid
                                    : props.data.RtxAmountPaid,
                            RtxChangeDue: props.isTaxInvoice
                                ? props.data.ChangeDue
                                : props.paymentType === "Credit Card"
                                    ? props.data.ChangeDue
                                    : props.data.RtxChangeDue,
                            RtxBalance: props.isTaxInvoice
                                ? props.data.Balance
                                : props.paymentType === "Credit Card"
                                    ? props.data.Balance
                                    : props.data.RtxBalance,
                            Discount: props.data.Discount ? props.data.Discount : 0,
                            Date: props.data.Date,
                            Datetrack: props.data.Datetrack,
                            DateTrackNumber: props.data.DateTrackNumber,
                            Department: props.data.department,
                            totalTaxFinal: props.data.totalTaxFinal,
                            totalTax: props.data.totalTax,
                            time: props.data.time,
                            timeRange: props.data.timeRange,
                            isBackedUp: store_1.default.getState().SocketConn.isConn
                                ? true
                                : false,
                        })
                            .then(function () {
                            sendCallback({ id: props.data.id });
                        });
                    }
                    else {
                        dbhook
                            .select()
                            .from("sales_reports_totals")
                            .where("Date", props.data.Date)
                            .then(function (data) {
                            if (data.length !== 0) {
                                // console.log(data);
                                // console.log(props.data);
                                dbhook("sales_reports_totals")
                                    .where("Date", props.data.Date)
                                    .update({
                                    GrandTotal: parseFloat(props.data.GrandTotal) +
                                        parseFloat(data[0].GrandTotal),
                                    AmountPaid: parseFloat(props.data.AmountPaid) +
                                        parseFloat(data[0].AmountPaid),
                                    ChangeDue: parseFloat(props.data.ChangeDue) +
                                        parseFloat(data[0].ChangeDue),
                                    Balance: props.data.Balance + parseFloat(data[0].Balance),
                                    RtxGrandTotal: props.isTaxInvoice
                                        ? parseFloat(props.data.GrandTotal) +
                                            parseFloat(data[0].GrandTotal)
                                        : props.paymentType === "Credit Card"
                                            ? parseFloat(props.data.GrandTotal) +
                                                parseFloat(data[0].GrandTotal)
                                            : parseFloat(props.data.RtxGrandTotal) +
                                                parseFloat(data[0].RtxGrandTotal),
                                    RtxAmountPaid: props.isTaxInvoice
                                        ? parseFloat(props.data.AmountPaid) +
                                            parseFloat(data[0].AmountPaid)
                                        : props.paymentType === "Credit Card"
                                            ? parseFloat(props.data.AmountPaid) +
                                                parseFloat(data[0].AmountPaid)
                                            : parseFloat(props.data.RtxAmountPaid) +
                                                parseFloat(data[0].RtxAmountPaid),
                                    RtxChangeDue: props.isTaxInvoice
                                        ? parseFloat(props.data.ChangeDue) +
                                            parseFloat(data[0].ChangeDue)
                                        : props.paymentType === "Credit Card"
                                            ? parseFloat(props.data.ChangeDue) +
                                                parseFloat(data[0].ChangeDue)
                                            : parseFloat(props.data.RtxChangeDue) +
                                                parseFloat(data[0].RtxChangeDue),
                                    RtxBalance: props.isTaxInvoice
                                        ? parseFloat(props.data.Balance) +
                                            parseFloat(data[0].Balance)
                                        : props.paymentType === "Credit Card"
                                            ? parseFloat(props.data.Balance) +
                                                parseFloat(data[0].Balance)
                                            : parseFloat(props.data.RtxBalance) +
                                                parseFloat(data[0].RtxBalance),
                                    Discount: props.data.Discount
                                        ? parseFloat(props.data.Discount) +
                                            parseFloat(data[0].Discount)
                                        : 0,
                                    totalTaxFinal: Number(props.data.totalTaxFinal) +
                                        Number(data[0].totalTaxFinal),
                                    totalTax: Number(props.data.totalTax) +
                                        Number(data[0].totalTax),
                                })
                                    .then(function () {
                                    sendCallback({ id: props.data.id });
                                });
                            }
                            else {
                                dbhook("sales_reports_totals")
                                    .insert({
                                    id: props.data.id,
                                    Year: props.data.year,
                                    Day: props.data.day,
                                    Month: props.data.month,
                                    SrNo: MainData.length + 1,
                                    GrandTotal: props.data.GrandTotal,
                                    AmountPaid: props.data.AmountPaid,
                                    ChangeDue: props.data.ChangeDue,
                                    Balance: props.data.Balance,
                                    RtxGrandTotal: props.isTaxInvoice
                                        ? props.data.GrandTotal
                                        : props.paymentType === "Credit Card"
                                            ? props.data.GrandTotal
                                            : props.data.RtxGrandTotal,
                                    RtxAmountPaid: props.isTaxInvoice
                                        ? props.data.AmountPaid
                                        : props.paymentType === "Credit Card"
                                            ? props.data.AmountPaid
                                            : props.data.RtxAmountPaid,
                                    RtxChangeDue: props.isTaxInvoice
                                        ? props.data.ChangeDue
                                        : props.paymentType === "Credit Card"
                                            ? props.data.ChangeDue
                                            : props.data.RtxChangeDue,
                                    RtxBalance: props.isTaxInvoice
                                        ? props.data.Balance
                                        : props.paymentType === "Credit Card"
                                            ? props.data.Balance
                                            : props.data.RtxBalance,
                                    Discount: props.data.Discount
                                        ? props.data.Discount
                                        : 0,
                                    Date: props.data.Date,
                                    Datetrack: props.data.Datetrack,
                                    DateTrackNumber: props.data.DateTrackNumber,
                                    Department: props.data.department,
                                    totalTaxFinal: props.data.totalTaxFinal,
                                    totalTax: props.data.totalTax,
                                    time: props.data.time,
                                    timeRange: props.data.timeRange,
                                    isBackedUp: store_1.default.getState().SocketConn
                                        .isConn
                                        ? true
                                        : false,
                                })
                                    .then(function () {
                                    sendCallback({ id: props.data.id });
                                });
                            }
                        });
                    }
                });
            });
            break;
        case "update_credit_sale":
            dbhook("credit_sales")
                .where({ idKey: props.data.id })
                .update({
                is_paid: true,
            })
                .then(function () {
                sendCallback(true);
            });
            break;
        case "credit_sale":
            console.log(props);
            console.log(parseFloat(props.data.amounOwing));
            dbhook("credit_sales")
                .insert({
                idKey: props.data.id,
                Year: props.data.year,
                Day: props.data.day,
                Month: props.data.month,
                InvoiceNumber: props.data.invoiceNumber,
                tableId: "1",
                TicketList: JSON.stringify({ list: props.data.ticketList }),
                Customer: props.data.Customer ? props.data.Customer : "",
                GrandTotal: props.data.GrandTotal,
                AmountPaid: parseFloat(props.data.amountCreditPaid),
                ChangeDue: props.data.ChangeDue,
                Balance: props.data.Balance,
                RtxGrandTotal: props.isTaxInvoice
                    ? props.data.GrandTotal
                    : props.paymentType === "Credit Card"
                        ? props.data.GrandTotal
                        : props.data.RtxGrandTotal,
                RtxAmountPaid: props.isTaxInvoice
                    ? parseFloat(props.data.amountCreditPaid)
                    : props.paymentType === "Credit Card"
                        ? parseFloat(props.data.amountCreditPaid)
                        : props.data.RtxAmountPaid,
                RtxChangeDue: props.isTaxInvoice
                    ? props.data.ChangeDue
                    : props.paymentType === "Credit Card"
                        ? props.data.ChangeDue
                        : props.data.RtxChangeDue,
                RtxBalance: props.isTaxInvoice
                    ? props.data.Balance
                    : props.paymentType === "Credit Card"
                        ? props.data.Balance
                        : props.data.RtxBalance,
                Discount: 0,
                Card_slipt: props.data.Card_slipt,
                Cash_slipt: props.data.Cash_slipt,
                Date: props.data.Date,
                Datetrack: props.data.Datetrack,
                dateRange: parseInt(DateNumInput),
                Department: props.data.department,
                TotalQt: props.data.totalQt,
                User: props.data.user,
                PaymentType: props.data.paymentType,
                isTaxInvoice: props.data.isTaxInvoice,
                isActive: true,
                Note: props.data.note,
                totalTaxFinal: props.data.totalTaxFinal,
                totalTax: props.data.totalTax,
                time: props.data.time,
                timeRange: props.data.timeRange,
                isBackedUp: store_1.default.getState().SocketConn.isConn
                    ? true
                    : false,
                amoun_owing: parseFloat(props.data.amounOwing) === 0
                    ? parseFloat(props.data.GrandTotal)
                    : parseFloat(props.data.amounOwing),
                date_to_pay: props.data.dateToPay,
                is_paid: false,
            })
                .then(function () {
                sendCallback(true);
            });
            break;
        case "getCreditReports":
            dbhook
                .select()
                .from("credit_sales")
                .leftJoin("users", "credit_sales.User", "users.id")
                .leftJoin("customers", "credit_sales.Customer", "customers.id")
                .whereBetween("dateRange", [props.startDate, props.endDate])
                .then(function (data) {
                // console.log(data);
                sendCallback({
                    data: data,
                });
            });
            break;
        case "getCredit":
            dbhook
                .select()
                .from("credit_sales")
                .then(function (data) {
                // console.log(data);
                sendCallback({
                    data: data,
                });
            });
            break;
        case "get_sales":
            // console.log(props);
            // if (configureStore.getState().SocketConn.isConn) {
            //   configureStore
            //     .getState()
            //     .SocketConn.socket.emit("GETSALESREPORT", props);
            //   configureStore
            //     .getState()
            //     .SocketConn.socket.on("SALESREPORTSALET", (recivedCallback) => {
            //       var data = recivedCallback;
            //       sendCallback({
            //         data,
            //       });
            //     });
            // } else {
            if (props.startTime === 0)
                dbhook
                    .select()
                    .from("sales_reports_totals")
                    .leftJoin("branches", "sales_reports_totals.Department", "branches.brancheId")
                    .whereBetween("DateTrackNumber", [props.startDate, props.endDate])
                    .then(function (data) {
                    // console.log(data);
                    sendCallback({
                        data: data,
                    });
                });
            else
                dbhook
                    .select()
                    .from("sales_reports_totals")
                    .leftJoin("branches", "sales_reports_totals.Department", "branches.brancheId")
                    .whereBetween("DateTrackNumber", [props.startDate, props.endDate])
                    .andWhere(function () {
                    this.whereBetween("timeRange", [props.startTime, props.endTime]);
                })
                    .then(function (data) {
                    // console.log(data);
                    sendCallback({
                        data: data,
                    });
                });
            // }
            break;
        case "getAll":
            dbhook
                .select()
                .from("sales_reports_totals")
                .then(function (data) {
                sendCallback({
                    data: data,
                });
            });
            break;
        case "get_sales_byCustmore":
            // console.log(props);
            if (props.customer !== "")
                dbhook
                    .select()
                    .from("sales_reports_tikets")
                    .where("Customer", props.customer)
                    .whereBetween("dateRange", [props.startDate, props.endDate])
                    .then(function (data) {
                    // console.log(data);
                    sendCallback({
                        data: data,
                    });
                });
            break;
        case "get_sales_tickets":
            dbhook
                .select()
                .from("sales_reports_tikets")
                .leftJoin("branches", "sales_reports_tikets.Department", "branches.brancheId")
                .leftJoin("users", "sales_reports_tikets.User", "users.id")
                .whereBetween("dateRange", [props.startDate, props.endDate])
                .then(function (data) {
                sendCallback({
                    data: data,
                });
            });
            break;
        case "get_sales_tickets_byDate":
            dbhook
                .select()
                .from("sales_reports_tikets")
                .leftJoin("branches", "sales_reports_tikets.Department", "branches.brancheId")
                .leftJoin("users", "sales_reports_tikets.User", "users.id")
                .where({ Datetrack: props.date })
                .then(function (data) {
                sendCallback({
                    data: data,
                });
            });
            break;
        case "get_sales_tickets_byDateRange":
            if (props.startTime === 0)
                dbhook
                    .select()
                    .from("sales_reports_tikets")
                    .leftJoin("branches", "sales_reports_tikets.Department", "branches.brancheId")
                    .leftJoin("users", "sales_reports_tikets.User", "users.id")
                    .whereBetween("dateRange", [props.startDate, props.endDate])
                    .then(function (data) {
                    sendCallback({
                        data: data,
                    });
                });
            else
                dbhook
                    .select()
                    .from("sales_reports_tikets")
                    .innerJoin("branches", "sales_reports_tikets.Department", "branches.brancheId")
                    .innerJoin("users", "sales_reports_tikets.User", "users.id")
                    .whereBetween("dateRange", [props.startDate, props.endDate])
                    .andWhere(function () {
                    this.whereBetween("timeRange", [props.startTime, props.endTime]);
                })
                    .then(function (data) {
                    // console.log(data);
                    sendCallback({
                        data: data,
                    });
                });
            break;
        case "cancel_ticket":
            var arr = props.invoiceNumber.list.list;
            var amountToDeduct = 0;
            var totals = 0;
            var Totalsells = 0;
            var item_1 = props.invoiceNumber.selectedItem;
            var totalToRemove_1 = parseInt(props.invoiceNumber.amount) * props.invoiceNumber.selling;
            Totalsells = props.invoiceNumber.total - totalToRemove_1;
            var index = arr.findIndex(function (x) { return x.productKey === item_1.productKey; });
            if (arr[index].qnt === 1) {
                amountToDeduct = arr[index].sallingprice;
                arr.splice(index, 1);
            }
            else {
                if (parseInt(props.invoiceNumber.amount) === 1) {
                    totals = arr[index].sallingprice * arr[index].qnt;
                    arr[index].qnt =
                        arr[index].qnt - parseInt(props.invoiceNumber.amount);
                    amountToDeduct = arr[index].sallingprice;
                    // console.log(totals);
                }
                else {
                    totals = arr[index].sallingprice * arr[index].qnt;
                    arr[index].qnt =
                        arr[index].qnt - parseInt(props.invoiceNumber.amount);
                    amountToDeduct =
                        parseInt(props.invoiceNumber.amount) * arr[index].sallingprice;
                }
            }
            // console.log(props);
            // console.log(totals - arr[index].sallingprice);
            // console.log(arr);
            if (props.invoiceNumber.amount < 1)
                react_toastify_1.toast("Amount to reduce is less then amount of product", {
                    position: "top-right",
                    autoClose: 5000,
                    type: "error",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            else
                dbhook("sales_reports_tikets")
                    .where({ InvoiceNumber: props.invoiceNumber.invoiceNumber })
                    .update({
                    // isActive: false,
                    TicketList: { list: arr },
                    GrandTotal: Totalsells,
                })
                    .then(function (data) {
                    dbhook("returns")
                        .insert({
                        id: CreateId(),
                        description: props.invoiceNumber.reason,
                        productName: props.invoiceNumber.selectedItem.ItemName,
                        qnt: props.invoiceNumber.amount,
                        date: moment().format("LLLL"),
                        time: moment().format("LT"),
                        sallingprice: props.invoiceNumber.selectedItem.initalPrice,
                        customer: props.invoiceNumber.customer === ""
                            ? "Walking Customer"
                            : props.invoiceNumber.customer === null
                                ? "Walking Customer"
                                : props.invoiceNumber.customer,
                        invoiceNumber: props.invoiceNumber.invoiceNumber,
                    })
                        .then(function (data) {
                        dbhook
                            .select()
                            .from("sales_reports_totals")
                            .where({ Day: props.invoiceNumber.Day })
                            .then(function (data) {
                            dbhook("sales_reports_totals")
                                .where({ Day: props.invoiceNumber.Day })
                                .update({
                                GrandTotal: data[0].GrandTotal - totalToRemove_1,
                            })
                                .then(function (data) {
                                sendCallback(true);
                            });
                        });
                    });
                });
            break;
        case "all_get_sales_tickets":
            dbhook
                .select()
                .from("sales_reports_tikets")
                .leftJoin("customers", "sales_reports_tikets.Customer", "customers.id")
                .then(function (data) {
                sendCallback({
                    data: data,
                });
            });
            break;
        case "get_sales_tickets_byCasher":
            // console.log(props);
            dbhook
                .select()
                .from("sales_reports_tikets")
                .where({ User: props.user.id })
                .whereBetween("dateRange", [props.startDate, props.endDate])
                .leftJoin("users", "sales_reports_tikets.User", "users.id")
                .then(function (data) {
                sendCallback({
                    data: data,
                });
            });
            break;
        case "get_sales_tickets_byCasherAndTime":
            // console.log(props);
            dbhook
                .select()
                .from("sales_reports_tikets")
                .innerJoin("users", "sales_reports_tikets.User", "users.id")
                .where({ User: props.user.id })
                .whereBetween("dateRange", [props.startDate, props.endDate])
                .andWhere(function () {
                this.whereBetween("timeRange", [props.startTime, props.endTime]);
            })
                .then(function (data) {
                sendCallback({
                    data: data,
                });
            });
            break;
        case "get_sales_tickets_byDate_Casher":
            // console.log(props);
            dbhook
                .select()
                .from("sales_reports_tikets")
                .where({ User: props.user.id })
                .andWhere({ Datetrack: props.date })
                .leftJoin("users", "sales_reports_tikets.User", "users.id")
                .then(function (data) {
                sendCallback({
                    data: data,
                });
            });
            break;
        case "ServerBackup":
            if (props.tabelId === "tikets")
                dbhook("sales_reports_tikets")
                    .where({ id: props.id })
                    .update({
                    isBackedUp: true,
                })
                    .then(function (data) { });
        case "purchases":
            // console.log(props);
            props.purchaseSelected.map(function (nodes) {
                dbhook("purchases")
                    .insert({
                    purchasesKey: CreateId(),
                    productName: nodes.ItemName,
                    group: nodes.id,
                    sellingPrice: nodes.sellingPriceNew
                        ? nodes.sellingPriceNew
                        : nodes.sallingprice,
                    sellingPriceOld: nodes.sallingprice,
                    buyingPrice: nodes.costPrice ? nodes.costPrice : nodes.buyingPrice,
                    buyingPriceOld: nodes.buyingPrice,
                    supplier: nodes.supplierKey ? nodes.supplierKey : "",
                    quantity: nodes.quantity,
                    invoiceNumber: props.invoiceNumber,
                    EventDate: props.EventDate,
                    dateRange: props.dateRange,
                    time: props.time,
                })
                    .then(function () { });
            });
            sendCallback({});
            break;
        // case "get_returns":
        //   dbhook
        //     .select()
        //     .from("purchases")
        //     .whereBetween("dateRange", [props.startDate, props.endDate])
        //     .then(function (data) {
        //       sendCallback({
        //         data,
        //       });
        //     });
        //   break;
        case "get_returns":
            dbhook
                .select()
                .from("returns")
                // .whereBetween("dateRange", [props.startDate, props.endDate])
                .leftJoin("customers", "returns.customer", "customers.id")
                .then(function (data) {
                sendCallback({
                    data: data,
                });
            });
            break;
        case "get_expenses":
            dbhook
                .select()
                .from("expenses")
                .whereBetween("dateRange", [props.startDate, props.endDate])
                .then(function (data) {
                sendCallback({
                    data: data,
                });
            });
            break;
        case "expenses":
            dbhook("expenses")
                .insert({
                idKey: CreateId(),
                description: props.des,
                cost: props.amount,
                date: moment().format("LLLL"),
                time: moment().format("LT"),
                user: props.user,
                branch: props.branch,
                dateRange: props.dateRange,
            })
                .then(function () {
                sendCallback(true);
            });
            break;
        case "edit_expenses":
            dbhook("expenses")
                .where({ idKey: props.id })
                .update({
                description: props.des,
                cost: props.amount,
            })
                .then(function () {
                sendCallback(true);
            });
            break;
        case "delete_expenses":
            // console.log(list);
            dbhook("expenses")
                .where({ idKey: props.id })
                .del()
                .then(function () {
                sendCallback(true);
            });
            break;
        default:
            break;
    }
};
//# sourceMappingURL=Reports.js.map
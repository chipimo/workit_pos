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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var react_toastify_1 = require("react-toastify");
var dataBase_1 = require("../../dataBase");
var store_1 = require("../../store");
var _ = require("lodash");
var uuidv4 = require("uuid/v4");
var ipcRenderer = require("electron").ipcRenderer;
function CreateId() {
    return uuidv4();
}
var GetData = function (props, hook, callback) {
    hook
        .select()
        .from(props.table)
        .where(props.id, props.value)
        .then(function (data) {
        callback({
            data: data,
        });
    });
};
exports.GetTablesByUserName = function (props, dbhook, sendCallback) {
    GetData({ table: "openTables", id: "user", value: props.userName }, dbhook, function (callback) {
        sendCallback(callback);
    });
};
exports.SetTables = function (props, dbhook, sendCallback) {
    GetData({ table: "tables", id: "table", value: props.table }, dbhook, function (callback) {
        if (callback.data.length === 0) {
            dbhook("tables")
                .insert({
                id: CreateId(),
                table: props.table,
                colors: props.colors,
                isOpen: false,
            })
                .then(function () {
                sendCallback({ isSet: true });
            });
        }
        else {
            sendCallback({ isSet: false });
        }
    });
};
exports.GetTables = function (dbhook, sendCallback) {
    dbhook
        .select()
        .from("tables")
        .where({ isOpen: false })
        .then(function (data) {
        sendCallback({
            data: data,
        });
    });
};
exports.HandleBillPrintOut = function (props, dbhook, sendCallback) {
    dbhook
        .select()
        .from("openPrintouts")
        .where({ tableKey: props.id })
        .then(function (data) {
        console.log(data);
    });
};
exports.SetMyTabes = function (props, dbhook, sendCallback) {
    var key = CreateId();
    GetData({ table: "openTables", id: "name", value: props.table }, dbhook, function (callback) {
        if (callback.data.length === 0) {
            dbhook("openTables")
                .insert({
                id: key,
                name: props.table,
                user: props.user,
                date: props.date,
                time: props.time,
                list: props.product_list,
                total: props.total,
                qty: props.qty,
            })
                .then(function () {
                dbhook("tables")
                    .where({ table: props.table })
                    .update({ isOpen: true })
                    .then(function () { });
                props.product_list.data.map(function (product) {
                    dbhook("openPrintouts")
                        .insert({
                        tableKey: key,
                        tableName: props.table,
                        item: product.ItemName,
                        itemList: product,
                        itemKey: product.productKey,
                        date: props.date,
                        time: props.time,
                        qty: props.qty,
                        isOrder: false,
                    })
                        .then(function () { });
                });
                dbhook
                    .select()
                    .from("openTables")
                    .then(function (data) {
                    if (store_1.default.getState().SocketConn.isConn)
                        store_1.default
                            .getState()
                            .SocketConn.socket.emit("TABLE_UPDATE", data);
                    sendCallback(data);
                });
            });
        }
        else {
            react_toastify_1.toast(props.table + " table has already been saved to my tables", {
                position: "top-right",
                autoClose: 5000,
                type: "error",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    });
};
exports.UpdatePrintOuts = function (props, dbhook, sendCallback) {
    // console.log(props);
    dbhook("openPrintouts")
        .insert({
        tableKey: props.key,
        tableName: props.tableName,
        item: props.ItemName,
        itemList: props,
        itemKey: props.productKey,
        date: props.date,
        time: props.time,
        qty: props.qty,
        isOrder: false,
    })
        .then(function () {
        dbhook
            .select()
            .from("openTables")
            .then(function (data) {
            // if (configureStore.getState().SocketConn.isConn)
            //   configureStore
            //     .getState()
            //     .SocketConn.socket.emit("TABLE_UPDATE", data);
        });
    });
};
exports.HandleKitchenPrintOut = function (props, dbhook, sendCallback) {
    var networkPrinter = [];
    var once = false;
    // console.log(props);
    // if (!once)
    dbhook
        .select()
        .from("openPrintouts")
        .where({ tableKey: props.id })
        .then(function (data) { return __awaiter(_this, void 0, void 0, function () {
        var printerList;
        var _this = this;
        return __generator(this, function (_a) {
            once = true;
            if (data.length !== 0) {
                printerList = _.map(data, function (ItemsList) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        dataBase_1.default.HandlePrinterGroups({ _type: "getGrounpWithID", id: ItemsList.itemList.printerID }, function (callback) {
                            if (callback.length !== 0) {
                                if (networkPrinter.length === 0) {
                                    var temArr = [];
                                    temArr.push({
                                        printerIp: callback[0].printerIP,
                                        printerName: callback[0].group,
                                        casher: props.casher,
                                        data: [ItemsList.itemList],
                                    });
                                    networkPrinter = temArr;
                                    // console.log(temArr);
                                }
                                else {
                                    var IndexFilter = networkPrinter.findIndex(function (x) { return x.printerIp === callback[0].printerIP; });
                                    if (IndexFilter !== -1) {
                                        networkPrinter[IndexFilter].data.push(ItemsList.itemList);
                                    }
                                    else {
                                        networkPrinter.push({
                                            printerIp: callback[0].printerIP,
                                            printerName: callback[0].group,
                                            casher: props.casher,
                                            data: [ItemsList.itemList],
                                        });
                                    }
                                }
                                // console.log(networkPrinter);
                                return networkPrinter;
                            }
                        });
                        return [2 /*return*/];
                    });
                }); });
                //   if(networkPrinter.length === 0){
                //     networkPrinter.push({
                //     })
                //   }else{
                //   }
                //   const IndexFilter = menuList.findIndex(
                //     (x) => x === ItemsList.itemList.category
                //   );
                //   const nameItem = menuList[IndexFilter];
                //   const PastryIndexFilter = pastry.findIndex(
                //     (x) => x === ItemsList.itemList.category
                //   );
                //   const PastryNameItem = pastry[PastryIndexFilter];
                //   if (ItemsList.itemList.category === nameItem)
                //     secondaryKitchen.push(ItemsList.itemList);
                //   else if (ItemsList.itemList.category === PastryNameItem)
                //     pastryKitchen.push(ItemsList.itemList);
                //   else mainKitchen.push(ItemsList.itemList);
                // });
                // const printerResult = await Promise.all(printerList);
                // Promise.all(printerList).then((values) => {
                //   console.log(values);
                // });
                setTimeout(function () {
                    var info = {
                        list: data,
                        networkPrinter: networkPrinter,
                        compInfo: props.compInfo,
                        date: props.date,
                        time: props.time,
                        name: props.name,
                        user: props.user,
                    };
                    ipcRenderer.send("network", info);
                    dbhook("openPrintouts")
                        .where({ tableKey: props.id })
                        .del()
                        .then(function (data) { });
                }, 10000);
            }
            else {
                react_toastify_1.toast("This Order is already sent to the kitchen!", {
                    position: "top-right",
                    autoClose: 5000,
                    type: "error",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            return [2 /*return*/];
        });
    }); });
};
exports.GetMyTabes = function (dbhook, sendCallback) {
    dbhook
        .select()
        .from("openTables")
        .then(function (data) {
        sendCallback({
            data: data,
        });
    });
};
exports.DeleteTable = function (props, dbhook, sendCallback) {
    dbhook("tables")
        .where({ table: props.table.table })
        .del()
        .then(function (data) {
        sendCallback({
            isDeleted: true,
        });
    });
};
exports.DeleteTableFromMyTables = function (props, dbhook, sendCallback) {
    dbhook
        .select()
        .from("openTables")
        .where({ id: props.id })
        .then(function (data) {
        dbhook("tables")
            .where({ table: data[0].name })
            .update({
            isOpen: false,
        })
            .then(function () { });
        dbhook("openTables")
            .where({ id: props.id })
            .del()
            .then(function (data) {
            dbhook
                .select()
                .from("openTables")
                .then(function (data) {
                if (store_1.default.getState().SocketConn.isConn)
                    store_1.default
                        .getState()
                        .SocketConn.socket.emit("TABLE_UPDATE", data);
                sendCallback({
                    data: data,
                });
            });
        });
    });
};
exports.EditTables = function (props, dbhook, sendCallback) {
    dbhook("tables")
        .where({ table: props.group.tableName })
        .update({
        table: props.value,
    })
        .then(function () {
        sendCallback({ done: true });
    });
};
exports.AddItemToTables = function (props, dbhook, sendCallback) {
    // console.log(props);
    dbhook("openTables")
        .where({ name: props.tableName })
        .update({
        list: { data: props.selectedRows },
    })
        .then(function () {
        dbhook
            .select()
            .from("openTables")
            .then(function (data) {
            if (store_1.default.getState().SocketConn.isConn)
                store_1.default
                    .getState()
                    .SocketConn.socket.emit("TABLE_UPDATE", data);
            sendCallback({ done: true });
        });
    });
};
exports.UpdateTables = function (props, dbhook, sendCallback) {
    // console.log(props);
    dbhook("openTables")
        .where({ name: props.table })
        .update({
        list: { data: props.product_list.data },
    })
        .then(function () {
        dbhook
            .select()
            .from("openTables")
            .then(function (data) {
            if (store_1.default.getState().SocketConn.isConn)
                store_1.default
                    .getState()
                    .SocketConn.socket.emit("TABLE_UPDATE", data);
            sendCallback({
                data: data,
            });
        });
    });
};
//# sourceMappingURL=index.js.map
import { toast } from "react-toastify";
import appDb from "../../dataBase";
import configureStore from "../../store";

const _ = require("lodash");
const uuidv4 = require("uuid/v4");
const { ipcRenderer } = require("electron");

function CreateId() {
  return uuidv4();
}

const GetData = (props, hook, callback) => {
  hook
    .select()
    .from(props.table)
    .where(props.id, props.value)
    .then(function (data) {
      callback({
        data,
      });
    });
};

export const GetTablesByUserName = (props, dbhook, sendCallback) => {
  GetData(
    { table: "openTables", id: "user", value: props.userName },
    dbhook,
    (callback) => {
      sendCallback(callback);
    }
  );
};

export const SetTables = (props, dbhook, sendCallback) => {
  GetData(
    { table: "tables", id: "table", value: props.table },
    dbhook,
    (callback) => {
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
      } else {
        sendCallback({ isSet: false });
      }
    }
  );
};

export const GetTables = (dbhook, sendCallback) => {
  dbhook
    .select()
    .from("tables")
    .where({ isOpen: false })
    .then(function (data) {
      sendCallback({
        data,
      });
    });
};

export const HandleBillPrintOut = (props, dbhook, sendCallback) => {
  dbhook
    .select()
    .from("openPrintouts")
    .where({ tableKey: props.id })
    .then( function(data) {
   console.log(data)
    
  });
};

export const SetMyTabes = (props, dbhook, sendCallback) => {
  const key = CreateId();

  GetData(
    { table: "openTables", id: "name", value: props.table },
    dbhook,
    (callback) => {
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
              .then(function () {});

            props.product_list.data.map((product) => {
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
                .then(function () {});
            });

            dbhook
              .select()
              .from("openTables")
              .then(function (data) {
                if (configureStore.getState().SocketConn.isConn)
                  configureStore
                    .getState()
                    .SocketConn.socket.emit("TABLE_UPDATE", data);
                sendCallback(data);
              });
          });
      } else {
        toast(`${props.table} table has already been saved to my tables`, {
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
    }
  );
};

export const UpdatePrintOuts = (props, dbhook, sendCallback) => {
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

export const HandleKitchenPrintOut = (props, dbhook, sendCallback) => {
  let networkPrinter = [];
  let once = false;

  // console.log(props);
  // if (!once)
  dbhook
    .select()
    .from("openPrintouts")
    .where({ tableKey: props.id })
    .then(async (data) => {
      once = true;

      if (data.length !== 0) {
        var printerList = _.map(data, async (ItemsList) => {
          appDb.HandlePrinterGroups(
            { _type: "getGrounpWithID", id: ItemsList.itemList.printerID },
            (callback) => {
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
                } else {
                  const IndexFilter = networkPrinter.findIndex(
                    (x) => x.printerIp === callback[0].printerIP
                  );

                  if (IndexFilter !== -1) {
                    networkPrinter[IndexFilter].data.push(ItemsList.itemList);
                  } else {
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
            }
          );
        });

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
        setTimeout(() => {
          
          const info = {
            list: data,
            networkPrinter,
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
            .then(function (data) {});
        }, 10000);

      } else {
        toast(`This Order is already sent to the kitchen!`, {
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

export const GetMyTabes = (dbhook, sendCallback) => {
  dbhook
    .select()
    .from("openTables")
    .then(function (data) {
      sendCallback({
        data,
      });
    });
};

export const DeleteTable = (props, dbhook, sendCallback) => {
  dbhook("tables")
    .where({ table: props.table.table })
    .del()
    .then(function (data) {
      sendCallback({
        isDeleted: true,
      });
    });
};

export const DeleteTableFromMyTables = (props, dbhook, sendCallback) => {
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
        .then(function () {});

      dbhook("openTables")
        .where({ id: props.id })
        .del()
        .then(function (data) {
          dbhook
            .select()
            .from("openTables")
            .then(function (data) {
              if (configureStore.getState().SocketConn.isConn)
                configureStore
                  .getState()
                  .SocketConn.socket.emit("TABLE_UPDATE", data);
              sendCallback({
                data,
              });
            });
        });
    });
};

export const EditTables = (props, dbhook, sendCallback) => {
  dbhook("tables")
    .where({ table: props.group.tableName })
    .update({
      table: props.value,
    })
    .then(function () {
      sendCallback({ done: true });
    });
};

export const AddItemToTables = (props, dbhook, sendCallback) => {
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
          if (configureStore.getState().SocketConn.isConn)
            configureStore
              .getState()
              .SocketConn.socket.emit("TABLE_UPDATE", data);
          sendCallback({ done: true });
        });
    });
};

export const UpdateTables = (props, dbhook, sendCallback) => {
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
          if (configureStore.getState().SocketConn.isConn)
            configureStore
              .getState()
              .SocketConn.socket.emit("TABLE_UPDATE", data);

          sendCallback({
            data,
          });
        });
    });
};

import appDb from "./app/redux/dataBase";

const formatCurrency = require("format-currency");
const moment = require("moment");
const escpos = require("escpos");

escpos.USB = require("escpos-usb");
escpos.Network = require("escpos-network");

const Alert = require("electron-alert");

let alert = new Alert();

async function Printer(type, data) {
  // console.log(data);
  // console.log(type);

  try {
    const options = { encoding: "tis620" /* default */ };

    var check = moment(new Date());

    var time = check.format("LT");
    let opts = { format: "%s%v %c", code: "", symbol: data.currency };

    let swalOptions = {
      title: "The CSV file was written successfully",
      text: "Written successfully!",
      type: "error",
      showCancelButton: false,
    };

    if (type === "network") {
      // console.log(data.networkPrinter[0].printerIp);

      const networkDevice = new escpos.Network(
        data.networkPrinter[0].printerIp
      );
      const printer = new escpos.Printer(networkDevice, options);

      networkDevice.open(function (error) {
        printer
          .align("ct")
          .encode("tis620")
          .text(" ")
          .font("a")
          .size(1.5, 1.5)
          .text(data.compInfo.departmentInfo.dep_name)
          .text(data.compInfo.departmentInfo.road)
          .text(data.networkPrinter[0].printerName)
          .text(`ORDER`)
          .text("---------------------------------------------")
          .text(`Date ${data.date}`)
          .text(`Time ${data.time}`)
          .text("---------------------------------------------")
          .text(`Table ${data.name}`)
          .text(`Sales Person ${data.user}`)
          .text(" ")
          .text("---------------------------------------------");
        data.networkPrinter[0].data.forEach((list) => {
          printer.size(1, 1).tableCustom([
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
          if (list.extraMsg) printer.text(`Massage: ${list.extraMsg}`);
          printer.text("---------------------------------------------");
        });
        printer
          .text("================================================")
          .cut()
          .close();
      });
    } else {
      const device = new escpos.USB();
      const printer = new escpos.Printer(device, options);

      if (type === "receipt") {
        appDb.getPrintOuts((callback) => {
          // const times = [];

          for (var i = 0; i < callback; i++) {
            device.open(function (error) {
              if (error)
                alert.fireWithFrame(swalOptions, "Printer Error", null, false);

              printer
                .align("ct")
                .encode("tis620")
                .text(" ")
                .font("a")
                .size(1.5, 1.5)
                .text(data.department)
                .text(data.road)
                .text(data.shop)
                .text(" ")
                .text(`Tel: ${data.state.phone}`)
                .text(`${data.ticketHeader}:${data.invoiceNumber}`)
                .text(data.ticketstate)
                .tableCustom([
                  { text: " ", align: "LEFT", width: 0.4 },
                  { text: " ", align: "CENTER", width: 0.19 },
                  {
                    text: `TPIN: ${data.state.tpin}`,
                    align: "RIGHT",
                    width: 0.44,
                  },
                ])
                .tableCustom([
                  {
                    text: `Date: ${data.date}`,
                    align: "LEFT",
                    width: 0.44,
                  },
                  { text: " ", align: "CENTER", width: 0.2 },
                  { text: `Time: ${data.time}`, align: "RIGHT", width: 0.4 },
                ])
                .tableCustom([
                  { text: `Casher : ${data.user}`, align: "LEFT", width: 1 },
                ])
                .text("---------------------------------------------");
              let total = 0;
              let change = 0;

              data.items.forEach((element) => {
                total =
                  parseFloat(element.initalPrice) * parseInt(element.Qty) +
                  total;
                if (data.AmountPaid !== 0)
                  change = parseFloat(data.AmountPaid) - total;

                printer.tableCustom([
                  {
                    text: `${element.ItemName} x ${element.Qty}`,
                    align: "LEFT",
                    width: 0.49,
                  },
                  {
                    text: formatCurrency(element.initalPrice),
                    align: "CENTER",
                    width: 0.16,
                  },
                  {
                    text: formatCurrency(
                      element.initalPrice * element.Qty,
                      opts
                    ),
                    align: "RIGHT",
                    width: 0.35,
                  },
                ]);
              });

              printer
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
                ? printer.tableCustom([
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
                printer.tableCustom([
                  { text: `Discount`, align: "LEFT", width: 0.44 },
                  { text: " ", align: "CENTER", width: 0.22 },
                  {
                    text: formatCurrency(data.Discount),
                    align: "RIGHT",
                    width: 0.33,
                  },
                ]);
              printer
                .tableCustom([
                  { text: `${data.paymentType}`, align: "LEFT", width: 0.44 },
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
      } else if (type === "sale")
        device.open(function (error) {
          let tempArray = [];

          if (data.productsList) {
            data.productsList.data.forEach((list) => {
              const index = tempArray.findIndex(
                (x) => x.productKey === list.productKey
              );
              if (index != -1) {
                tempArray[index].qnt =
                  parseInt(tempArray[index].qnt) + parseInt(list.qnt);
                // console.log(tempArray[index]);
              } else {
                tempArray.push(list);
              }
            });
          }

          const DataTypes = [];
          let CashGrandTotal = 0;
          let CasDiscount = 0;
          let CashBalance = 0;
          let CashTotalCash = 0;
          let TranType = "Cash";
          let CardGrandTotal = 0;
          let CardDiscount = 0;
          let CardBalance = 0;
          let CardTranType = "Card";
          let allTotal = 0;
          let GrandallTotal = 0;
          printer
            .align("ct")
            .encode("tis620")
            .text(" ")
            .font("a")
            .size(1.5, 1.5)
            .text(data.productInfo.compInfo.dep)
            .text(" ")
            .text(`Tel: ${data.productInfo.compInfo.departmentInfo.phone}`)
            .text(`Sales Person ${data.productInfo.cashier}`)
            .text(`${data.productInfo.date}`)
            .text(" ")
            .text("================================================");
          if (data.data.cash.length !== 0) {
            data.data.cash.map((list) => {
              CashGrandTotal = parseFloat(list.GrandTotal) + CashGrandTotal;
              CasDiscount = parseFloat(list.Discount) + CasDiscount;
              CashBalance = parseFloat(list.Balance) + CashBalance;
            });
            data.data.split.map((split) => {
              CashGrandTotal = parseFloat(split.Cash_slipt) + CashGrandTotal;
            });
            DataTypes.push({
              paymentType: "Cash",
              total: CashGrandTotal - CashBalance,
            });
          }
          if (data.data.card.length !== 0) {
            data.data.card.map((list) => {
              CardGrandTotal = parseFloat(list.GrandTotal) + CardGrandTotal;
              CardDiscount = parseFloat(list.Discount) + CardDiscount;
              CardBalance = parseFloat(list.Balance) + CardBalance;
            });
            data.data.split.map((split) => {
              CardGrandTotal = parseFloat(split.Card_slipt) + CardGrandTotal;
            });
            DataTypes.push({
              paymentType: "Card",
              total: CardGrandTotal - CardBalance,
            });
          }
          if (data.data.others.length !== 0) {
            data.data.others.map((others) => {
              DataTypes.push({
                paymentType: others.PaymentType,
                total:
                  parseFloat(others.GrandTotal) - parseFloat(others.Balance),
              });
            });
          }
          tempArray.forEach((list) => {
            GrandallTotal =
              parseFloat(list.initalPrice) * list.qnt + GrandallTotal;
            printer.text(
              ` ${list.ItemName} -- @ ${parseFloat(list.initalPrice)} --  *  ${
                list.qnt
              } = ${formatCurrency(parseFloat(list.initalPrice) * list.qnt)}`
            );
          });
          printer.text("");
          printer.text(`--------------------------------`);
          printer.text(`Grand Sales : ${formatCurrency(GrandallTotal, opts)}`);
          printer.text(`--------------------------------`);
          printer.text(``);
          printer.text(`Mode Of Payment`);
          printer.text(`--------------------------------`);
          DataTypes.map((lists) => {
            allTotal = lists.total + allTotal;
            printer.text(
              `${lists.paymentType} : ${formatCurrency(lists.total, opts)}`
            );
          });
          printer
            .text("---------------------------------------------")
            .text("")
            .text("Discounts")
            .text(`Cash Discount : ${formatCurrency(CasDiscount, opts)}`)
            .text(`Card Discount : ${formatCurrency(CardDiscount, opts)}`)
            .text("")
            .text(`Net Total : ${formatCurrency(allTotal, opts)}`)
            .text("---------------------------------------------");
          printer
            .text("================================================")
            .cut()
            .close();
        });
      else if (type === "order")
        device.open(function (error) {
          printer
            .align("ct")
            .encode("tis620")
            .text(" ")
            .font("a")
            .size(1.5, 1.5)
            .text(`KICHEN ORDER`)
            .text(`Sales Person ${data.user}`)
            .text(" ")
            .text("---------------------------------------------");
          data.data.forEach((list) => {
            printer.tableCustom([
              { text: list.ItemName, align: "LEFT", width: 0.44 },
              {
                text: formatCurrency(list.initalPrice),
                align: "RIGHT",
                width: 0.33,
              },
            ]);
          });
          printer
            .text("================================================")
            .cut()
            .close();
        });
      else if (type === "bill")
        device.open(function (error) {
          let total = 0;

          printer
            .align("ct")
            .encode("tis620")
            .text(" ")
            .font("a")
            .size(1.5, 1.5)
            .text(`Bill`)
            .text(`Date ${data.date}`)
            .text(`Time ${data.time}`)
            .text(`Table ${data.name}`)
            .text(`Sales Person ${data.user}`)
            .text(" ")
            .text("---------------------------------------------");
          data.list.data.forEach((list) => {
            total = list.initalPrice * list.qnt + total;

            printer.tableCustom([
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
          printer.text("================================================");
          printer.tableCustom([
            { text: "Total", aline: "LEFT", width: 0.44 },
            { text: "==", aline: "RIGHT", width: 0.22 },
            {
              text: formatCurrency(total),
              aline: "RIGHT",
              width: 0.33,
            },
          ]);
          printer
            .text("================================================")
            .cut()
            .close();
        });
    }
  } catch (e) {
    alert.fireWithFrame(
      {
        title: "Faild to print",
        text: `${e}`,
        type: "error",
        showCancelButton: false,
      },
      "Printer Error",
      null,
      false
    );
  }
}

export default Printer;

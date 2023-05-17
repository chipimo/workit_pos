import React = require("react");
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
import { useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { DatePicker, Table, Modal, TimePicker } from "antd";
import { connect } from "react-redux";
import appDb from "../../redux/dataBase";
import Row from "./Row";
import { Typography, Divider, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import PrintIcon from "@material-ui/icons/PrintOutlined";
import MoreIcon from "@material-ui/icons/More";

const { RangePicker } = DatePicker;

const dateNow = new Date(); // Creating a new date object with the current date and time
const year = dateNow.getFullYear(); // Getting current year from the created Date object
const monthWithOffset = dateNow.getUTCMonth() + 1; // January is 0 by default in JS. Offsetting +1 to fix date for calendar.
const month = // Setting current Month number from current Date object
  monthWithOffset.toString().length < 2 // Checking if month is < 10 and pre-prending 0 to adjust for date input.
    ? `0${monthWithOffset}`
    : monthWithOffset;
const date =
  dateNow.getUTCDate().toString().length < 2 // Checking if date is < 10 and pre-prending 0 if not to adjust for date input.
    ? `0${dateNow.getUTCDate()}`
    : dateNow.getUTCDate();

const materialDateInput = `${year}-${month}-${date}`; // combining to format for defaultValue or value attribute of material <TextField>
const DateNumInput = `${year}${month}${date}`;

const { ipcRenderer } = require("electron");
const Currency = require("react-currency-formatter");
const moment = require("moment");

const useStyles = makeStyles((theme) => ({
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
}));

const format = "HH:mm";

const useRowStyles = makeStyles((theme) => ({
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
}));

const index = (props) => {
  const [state, setState] = React.useState({
    columns: [
      { title: "Date", field: "ItemName" },
      { title: "Time", field: "amountInstore" },
      { title: "Quantity Sold", field: "alertOut" },
    ],
    data: [],
  });
  const [productsList, setProductsList] = React.useState({
    data: [],
  });
  const [productInfo, setProductInfo] = React.useState({
    date: "",
    cashier: "",
    compInfo: {},
  });
  const [ProductTotalSales, setProductTotalSales] = React.useState(0);
  const [ProductTotalDiscount, setProductTotalDiscount] = React.useState(0);
  const [TotalSales, setTotalSales] = React.useState(0);
  const classes = useRowStyles();
  const [selectedDate, setSelectedDate] = React.useState({ value: moment() });
  const [users, setUsers] = React.useState([]);
  const [totalsList, settotalsList] = React.useState(null);
  const [totalCash, settotalCash] = React.useState(0);
  const [GrossTotalSales, setGrossTotalSales] = React.useState(0);
  const [totalCard, settotalCard] = React.useState(0);
  const [totalOthers, settotalOthers] = React.useState(0);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const history = useHistory();

  const columns = [
    {
      title: "Print",
      key: "TicketList",
      render: (row) => (
        <IconButton
          aria-label="print row"
          size="small"
          onClick={() => {
            var itemData = []; 

            console.log(props.Dep);

            row.TicketList.list.map((list) => {
              props.dispatchEvent({
                type: "RESTATECART",
              });

              setTimeout(() => {
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

            setTimeout(() => {
              history.push("/pos");
            }, 100);
          }}
        >
          <PrintIcon />
        </IconButton>
      ),
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
      render: (rows) => (
        <table>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            {props.User.userLogged.prevarges === "1" ? (
              <th>Buy price</th>
            ) : null}
            <th>Selling price</th>
          </tr>
          {rows.list.map((productRow, index) => (
            <tr key={index}>
              <td>{productRow.ItemName}</td>
              <td>{productRow.qnt}</td>
              {props.User.userLogged.prevarges === "1" ? (
                <td>{productRow.buyingPrice}</td>
              ) : null}
              <td>{productRow.initalPrice}</td>
            </tr>
          ))}
        </table>
      ),
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [DefaultDate, setDefaultDate] = React.useState({
    startDate: 0,
    endDate: 0,
  });
  const [DefaultTime, setDefaultTime] = React.useState({
    startTime: 0,
    endTime: 0,
  });

  const [dateString, setDateString] = React.useState({
    startDate: "",
    endDate: "",
  });

  const onPrintFile = () => {

    if (state.data.length !== 0)
      ipcRenderer.send("do_print_saleReports", {
        data: totalsList,
        productsList,
        TotalSales,
        currency: props.UseCurrency.currencyInUse.currency.symbol_native,
        productInfo,
      });
  };

  const onTimeChange = (TimeValue, timeString) => {
    // console.log(timeString);
    setDefaultTime({
      ...DefaultTime,
      startTime: timeString[0],
      endTime: timeString[1],
    });
  };

  const onChange = (value, inputValue) => {
    appDb.HandelReports(
      {
        _type: "get_sales_tickets_byDate_Casher",
        user: { id: props.User.userLogged.id },
        date: value.format("MM/DD/YYYY"),
      },
      (reciveCallback) => {
        // console.log(reciveCallback.data);

        const card = [];
        const cash = [];
        const split = [];
        const others = [];

        let CashGrandTotal = 0;
        let CasDiscount = 0;
        let CashBalance = 0;

        let CardGrandTotal = 0;
        let CardDiscount = 0;
        let CardBalance = 0;

        reciveCallback.data.map((tickts) => {
          // console.log(tickts);
          if (tickts.PaymentType === "Card") {
            card.push(tickts);
          } else if (tickts.PaymentType === "Cash") {
            cash.push(tickts);
          } else if (tickts.PaymentType === "split") {
            split.push(tickts);
          } else {
            others.push(tickts);
          }
        });

        const data = { card, cash, split, others };
        settotalsList(data);

        card.map((list) => {
          CardGrandTotal = parseFloat(list.GrandTotal) + CardGrandTotal;
          CardDiscount = parseFloat(list.Discount) + CardDiscount;
          CardBalance = parseFloat(list.Balance) + CardBalance;
        });

        split.map((split) => {
          CardGrandTotal = parseFloat(split.Card_slipt) + CardGrandTotal;
          CashGrandTotal = parseFloat(split.Cash_slipt) + CashGrandTotal;
        });

        cash.map((list) => {
          CashGrandTotal = parseFloat(list.GrandTotal) + CashGrandTotal;
          CasDiscount = parseFloat(list.Discount) + CasDiscount;
          CashBalance = parseFloat(list.Balance) + CashBalance;
        });

        settotalCard(CardGrandTotal);
        settotalCash(CashGrandTotal);

        setProductsList({ ...productsList, data: [] });

        reciveCallback.data.sort(compare);

        setState({
          ...state,
          data: reciveCallback.data,
        });

        var totals = 0;
        var GrossTotals = 0;

        reciveCallback.data.map((items) => {
          totals = parseFloat(items.GrandTotal) + totals;
          GrossTotals =
            parseFloat(items.GrandTotal) +
            GrossTotals +
            parseFloat(items.Discount);

          items.TicketList.list.map((productlist) => {
            productsList.data.push(productlist);
            setProductsList({ ...productsList, data: productsList.data });
          });
        });

        setTotalSales(totals);
        setGrossTotalSales(GrossTotals);
      }
    );
    setSelectedDate({ ...selectedDate, value: value });
  };

  const onOpenChange = (dateValue) => {
    // console.log(dateValue);

    const start_date = dateValue[0].format("YYYY-MM-DD");
    const start_end = dateValue[1].format("YYYY-MM-DD");

    const dateStartSplit = start_date.split("-");
    const dateEndSplit = start_end.split("-");

    const DateStartValue = `${dateStartSplit[0]}${dateStartSplit[1]}${dateStartSplit[2]}`;
    const DateEndValue = `${dateEndSplit[0]}${dateEndSplit[1]}${dateEndSplit[2]}`;

    setDefaultDate({
      ...DefaultDate,
      startDate: DateStartValue,
      endDate: DateEndValue,
    });

    // console.log(DateStartValue);
    // console.log(DateEndValue);
  };

  const disabledDate = (currentDate, inputValue) => {
    return false;
  };

  const compare = (a, b) => {
    return b.timeRange - a.timeRange;
  };

  React.useEffect(() => {
    appDb.HandleGetUser((callback) => {
      setUsers(callback);
    });

    if (props.ViewType === "reports")
      appDb.HandelReports(
        {
          _type: "get_sales_tickets_byDateRange",
          startTime: props.startTime,
          endTime: props.endTime,
          startDate: parseInt(props.startDate),
          endDate: parseInt(props.endDate),
        },
        (reciveCallback) => {
          // console.log(reciveCallback.data); 

          const card = [];
          const cash = [];
          const split = [];
          const others = [];

          let CashGrandTotal = 0;
          let CasDiscount = 0;
          let CashBalance = 0;

          let CardGrandTotal = 0;
          let CardDiscount = 0;
          let CardBalance = 0;

          reciveCallback.data.map((tickts) => {
            if (tickts.PaymentType === "Card") {
              card.push(tickts);
            } else if (tickts.PaymentType === "Cash") {
              cash.push(tickts);
            } else if (tickts.PaymentType === "split") {
              split.push(tickts);
            } else {
              others.push(tickts);
            }
          });

          const data = { card, cash, split, others };
          settotalsList(data);

          card.map((list) => {
            CardGrandTotal = parseFloat(list.GrandTotal) + CardGrandTotal;
            CardDiscount = parseFloat(list.Discount) + CardDiscount;
            CardBalance = parseFloat(list.Balance) + CardBalance;
          });

          split.map((split) => {
            CardGrandTotal = parseFloat(split.Card_slipt) + CardGrandTotal;
            CashGrandTotal = parseFloat(split.Cash_slipt) + CashGrandTotal;
          });

          cash.map((list) => {
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

          setState({
            ...state,
            data: reciveCallback.data,
          });

          // console.log(reciveCallback.data);

          reciveCallback.data.map((items) => {
            totals = parseFloat(items.GrandTotal) + totals;
            GrossTotals =
              parseFloat(items.GrandTotal) +
              GrossTotals +
              parseFloat(items.Discount);
            productdiscount = parseFloat(items.Discount) + productdiscount;

            setProductInfo({
              ...productInfo,
              cashier: items.userName,
              date: `${props.dateString.startDate} - ${props.dateString.endDate}`,
              // time: items.userName,
              compInfo: props.Dep,
            });

            items.TicketList.list.map((productlist) => {
              productTotals =
                parseFloat(productlist.initalPrice) + productTotals;
              tempArry.push(productlist);
            });
          });

          setProductsList({ ...productsList, data: tempArry });
          setProductTotalSales(productTotals);
          setProductTotalDiscount(productdiscount);
          setTotalSales(totals);
          setGrossTotalSales(GrossTotals);
        }
      );
    else
      appDb.HandelReports(
        {
          _type: "get_sales_tickets_byCasher",
          user: { id: props.User.userLogged.id },
          startDate: parseInt(DateNumInput),
          endDate: parseInt(DateNumInput),
        },
        (reciveCallback) => {
          // console.log(reciveCallback.data);

          const card = [];
          const cash = [];
          const split = [];
          const others = [];

          let CashGrandTotal = 0;
          let CasDiscount = 0;
          let CashBalance = 0;

          let CardGrandTotal = 0;
          let CardDiscount = 0;
          let CardBalance = 0;

          reciveCallback.data.map((tickts) => {
            if (tickts.PaymentType === "Card") {
              card.push(tickts);
            } else if (tickts.PaymentType === "Cash") {
              cash.push(tickts);
            } else if (tickts.PaymentType === "split") {
              split.push(tickts);
            } else {
              others.push(tickts);
            }
          });

          const data = { card, cash, split, others };
          settotalsList(data);
          // console.log(data);

          card.map((list) => {
            CardGrandTotal = parseFloat(list.GrandTotal) + CardGrandTotal;
            CardDiscount = parseFloat(list.Discount) + CardDiscount;
            CardBalance = parseFloat(list.Balance) + CardBalance;
          });

          split.map((split) => {
            CardGrandTotal = parseFloat(split.Card_slipt) + CardGrandTotal;
            CashGrandTotal = parseFloat(split.Cash_slipt) + CashGrandTotal;
          });

          cash.map((list) => {
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

          setState({
            ...state,
            data: reciveCallback.data,
          });

          reciveCallback.data.map((items) => {
            totals = parseFloat(items.GrandTotal) + totals;
            GrossTotals =
              parseFloat(items.GrandTotal) +
              GrossTotals +
              parseFloat(items.Discount);
            productdiscount = parseFloat(items.Discount) + productdiscount;
            // console.log(items);
            setProductInfo({
              ...productInfo,
              cashier: items.userName,
              date: items.Date,
              compInfo: props.Dep,
            });

            items.TicketList.list.map((productlist) => {
              productTotals =
                parseFloat(productlist.initalPrice) + productTotals;
              tempArry.push(productlist);
            });
          });

          setProductsList({ ...productsList, data: tempArry });
          setProductTotalSales(productTotals);
          setProductTotalDiscount(productdiscount);
          setTotalSales(totals);
          setGrossTotalSales(GrossTotals);
        }
      );
  }, [props]);

  const sliptTimeRange = () => {
    if (DefaultTime.startTime !== 0 && DefaultTime.endTime !== 0) {
      const startTimeSplit = DefaultTime.startTime.split(":");
      const startTimeValue = `${startTimeSplit[0]}${startTimeSplit[1]}`;

      const endTimeSplit = DefaultTime.endTime.split(":");
      const endTimeValue = `${endTimeSplit[0]}${endTimeSplit[1]}`;

      return {
        startTimeSet: parseInt(startTimeValue),
        endTimeSet: parseInt(endTimeValue),
      };
    } else
      return {
        startTimeSet: 0,
        endTimeSet: 0,
      };
  };

  const handleGetSaleData = (prop) => {
    // console.log(prop);

    appDb.HandelReports(
      {
        _type: "get_sales_tickets_byCasherAndTime",
        user: { id: props.User.userLogged.id },
        startTime: prop.time.startTimeSet,
        endTime: prop.time.endTimeSet,
        startDate: parseInt(prop.startDate),
        endDate: parseInt(prop.endDate),
      },
      (reciveCallback) => {
        // console.log(reciveCallback.data);

        const card = [];
        const cash = [];
        const split = [];
        const others = [];

        let CashGrandTotal = 0;
        let CasDiscount = 0;
        let CashBalance = 0;

        let CardGrandTotal = 0;
        let CardDiscount = 0;
        let CardBalance = 0;

        reciveCallback.data.map((tickts) => {
          if (tickts.PaymentType === "Card") {
            card.push(tickts);
          } else if (tickts.PaymentType === "Cash") {
            cash.push(tickts);
          } else if (tickts.PaymentType === "split") {
            split.push(tickts);
          } else {
            others.push(tickts);
          }
        });

        const data = { card, cash, split, others };
        settotalsList(data);
        // console.log(data);

        card.map((list) => {
          CardGrandTotal = parseFloat(list.GrandTotal) + CardGrandTotal;
          CardDiscount = parseFloat(list.Discount) + CardDiscount;
          CardBalance = parseFloat(list.Balance) + CardBalance;
        });

        split.map((split) => {
          CardGrandTotal = parseFloat(split.Card_slipt) + CardGrandTotal;
          CashGrandTotal = parseFloat(split.Cash_slipt) + CashGrandTotal;
        });

        cash.map((list) => {
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

        setState({
          ...state,
          data: reciveCallback.data,
        });

        reciveCallback.data.map((items) => {
          totals = parseFloat(items.GrandTotal) + totals;
          GrossTotals =
            parseFloat(items.GrandTotal) +
            GrossTotals +
            parseFloat(items.Discount);
          productdiscount = parseFloat(items.Discount) + productdiscount;
          // console.log(items);
          setProductInfo({
            ...productInfo,
            cashier: items.userName,
            date: items.Date,
            compInfo: props.Dep,
          });

          items.TicketList.list.map((productlist) => {
            productTotals = parseFloat(productlist.initalPrice) + productTotals;
            tempArry.push(productlist);
          });
        });

        setProductsList({ ...productsList, data: tempArry });
        setProductTotalSales(productTotals);
        setProductTotalDiscount(productdiscount);
        setTotalSales(totals);
        setGrossTotalSales(GrossTotals);
      }
    );
  };

  return (
    <div
      style={{
        padding: 6,
        paddingLeft: 27,
        paddingRight: 27,
        height: "86vh",
        overflow: "auto",
      }}
    >
      <div style={{ display: "flex", backgroundColor: "#F7F7F7" }}>
        {props.ViewType !== "reports" ? (
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
          <div
            style={{
              height: 50,
              position: "fixed",
              zIndex: 400,
              // backgroundColor: "#3b3b3b",
              display: "flex",
            }}
          >
            <div style={{ marginTop: 10 }}>
              <RangePicker
                onChange={(value) => {
                  onOpenChange(value);
                }}
              />
            </div>

            {/* <div>
              <TextField
                id="date"
                label="From Date"
                type="date"
                defaultValue={materialDateInput}
                onChange={(event) => onOpenChange(event, "startDate")}
                // className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div style={{ marginLeft: 30 }}>
              <TextField
                id="date"
                label="Date To"
                type="date"
                defaultValue={materialDateInput}
                onChange={(event) => onOpenChange(event, "endDate")}
                // className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div> */}

            <div style={{ marginLeft: 10, marginTop: 10 }}>
              <TimePicker.RangePicker
                // defaultValue={moment("12:08", format)}
                onChange={onTimeChange}
                format={format}
              />
              {/* <TextField
                id="time"
                label="Time Date"
                type="time"
                defaultValue={moment().format("HH:mm")}
                onChange={(event) => onTimeChange(event, "startTime")}
                // className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              /> */}
            </div>
            {/* <div style={{ marginLeft: 30 }}>
              <TimePicker
                defaultValue={moment("12:08", format)}
                format={format}
              />
              <TextField
                id="time"
                label="Time To"
                type="time"
                defaultValue={moment().format("HH:mm")}
                onChange={(event) => onTimeChange(event, "endTime")}
                // className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div> */}
            <div>
              <Button
                variant="outlined"
                style={{ marginLeft: 15, marginTop: 10 }}
                onClick={() => {
                  handleGetSaleData({
                    startDate: DefaultDate.startDate,
                    endDate: DefaultDate.endDate,
                    time: sliptTimeRange(),
                  });
                }}
              >
                Submit
              </Button>
            </div>

            <div style={{ marginLeft: 10, marginTop: 10 }}>
              <Button onClick={onPrintFile} color="primary" variant="outlined">
                Print Report
              </Button>
            </div>

            <div style={{ marginLeft: 10, marginTop: 10 }}>
              <Button
                onClick={() => {
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
                }}
                color="primary"
                variant="outlined"
              >
                Export to Excel file
              </Button>
            </div>
          </div>
        ) : null}

        {props.ViewType === "reports" ? (
          <div style={{ display: "flex" }}>
            <Autocomplete
              id="combo-box-demo"
              options={users}
              getOptionLabel={(option) => option.userName}
              style={{ width: 300 }}
              onChange={(event, newData) => {
                appDb.HandelReports(
                  {
                    _type: "get_sales_tickets_byCasher",
                    user: newData,
                    startDate: parseInt(props.startDate),
                    endDate: parseInt(props.endDate),
                  },
                  (reciveCallback) => {
                    // console.log(reciveCallback);
                    setState({
                      ...state,
                      data: [],
                    });

                    const card = [];
                    const cash = [];
                    const split = [];
                    const others = [];

                    let CashGrandTotal = 0;
                    let CasDiscount = 0;
                    let CashBalance = 0;

                    let CardGrandTotal = 0;
                    let CardDiscount = 0;
                    let CardBalance = 0;

                    reciveCallback.data.map((tickts) => {
                      if (tickts.PaymentType === "Card") {
                        card.push(tickts);
                      } else if (tickts.PaymentType === "Cash") {
                        cash.push(tickts);
                      } else if (tickts.PaymentType === "split") {
                        split.push(tickts);
                      } else {
                        others.push(tickts);
                      }
                    });

                    const data = { card, cash, split, others };
                    settotalsList(data);
                    // console.log(data);

                    card.map((list) => {
                      CardGrandTotal =
                        parseFloat(list.GrandTotal) + CardGrandTotal;
                      CardDiscount = parseFloat(list.Discount) + CardDiscount;
                      CardBalance = parseFloat(list.Balance) + CardBalance;
                    });

                    split.map((split) => {
                      CardGrandTotal =
                        parseFloat(split.Card_slipt) + CardGrandTotal;
                      CashGrandTotal =
                        parseFloat(split.Cash_slipt) + CashGrandTotal;
                    });

                    cash.map((list) => {
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

                    setState({
                      ...state,
                      data: reciveCallback.data,
                    });

                    reciveCallback.data.map((items) => {
                      totals = parseFloat(items.GrandTotal) + totals;
                      GrossTotals =
                        parseFloat(items.GrandTotal) +
                        GrossTotals +
                        parseFloat(items.Discount);
                      productdiscount =
                        parseFloat(items.Discount) + productdiscount;
                      // console.log(items);

                      setProductInfo({
                        ...productInfo,
                        cashier: items.userName,
                        date: items.Date,
                      });

                      items.TicketList.list.map((productlist) => {
                        productTotals =
                          parseFloat(productlist.initalPrice) + productTotals;
                        tempArry.push(productlist);
                      });
                    });

                    setProductsList({
                      ...productsList,
                      data: tempArry,
                    });
                    setProductTotalSales(productTotals);
                    setProductTotalDiscount(productdiscount);
                    setTotalSales(totals);
                    setGrossTotalSales(GrossTotals);
                  }
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="filter by cashier"
                  variant="outlined"
                />
              )}
            />

            <div style={{ marginLeft: 10, marginTop: 10 }}>
              <Button onClick={onPrintFile} color="primary" variant="outlined">
                Print Report
              </Button>
            </div>

            <div style={{ marginLeft: 10, marginTop: 10 }}>
              <Button
                onClick={() => {
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
                }}
                color="primary"
                variant="outlined"
              >
                Export to Excel file
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ marginTop: props.ViewType === "reports" ? 20 : 70 }} />

      {/* <MaterialTable
        icons={tableIcons}
        title="Product reorder list"
        columns={state.columns}
        data={state.data}
      /> */}

      <Modal
        title="Basic Modal"
        visible={isModalVisible}  
        onOk={handleOk}
        onCancel={handleCancel}
      >
       <div className={classes.paper}>
         
        </div>
      </Modal>

      <div>
        <Table dataSource={state.data} columns={columns} />
      </div>

      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}
      >
        <div>
          <Typography variant="h6">
            Total Cash :
            <Currency locale="en" quantity={totalCash} symbol="K" />
          </Typography>
          <Typography variant="h6">
            Total Card :
            <Currency locale="en" quantity={totalCard} symbol="K" />
          </Typography>
          {totalsList !== null ? (
            <div>
              {totalsList.others.map((t) => {
                return (
                  <Typography variant="h6">
                    Total {t.PaymentType} :
                    <Currency
                      locale="en"
                      quantity={t.GrandTotal - t.Discount - t.Balance}
                      symbol="K"
                    />
                  </Typography>
                );
              })}
            </div>
          ) : null}
          <Typography style={{ color: "red" }} variant="h5">
            Total sales :
            <Currency locale="en" quantity={TotalSales} symbol="K" />
          </Typography>
        </div>
      </div>
    </div>
  ); 
};

function mapStateToProps(state) {
  return {
    Theme: state.Theme,
    Dep: state.Dep,
    User: state.User,
    UseCurrency: state.UseCurrencyReducer,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchEvent: (data) => dispatch(data),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(index);

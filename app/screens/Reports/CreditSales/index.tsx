const React = require("react");
import { Button, Divider, TextField, Typography } from "@material-ui/core";
import { Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import appDb from "../../../redux/dataBase";

const moment = require("moment");
const { ipcRenderer } = require("electron");

const uuidv4 = require("uuid/v4");

function CreatId() {
  return uuidv4();
}

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
const DateNumInput = `${year}${month}${date}`; // combining to format for defaultValue or value attribute of material <TextField>

const columns = [
  { id: "name", label: "Customer Name", minWidth: 170 },
  { id: "InvoiceNumber", label: "Invoice", minWidth: 80 },
  {
    id: "AmountPaid",
    label: "Paid",
    minWidth: 100,
    align: "right",
  },
  {
    id: "amoun_owing",
    label: "Owing",
    minWidth: 140,
    align: "right",
  },
  {
    id: "GrandTotal",
    label: "Grand Total",
    minWidth: 100,
    align: "right",
  },
  {
    id: "Date",
    label: "Date",
    minWidth: 100,
    align: "left",
  },
  {
    id: "date_to_pay",
    label: "Date To Pay",
    minWidth: 100,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "is_paid",
    label: "Status",
    minWidth: 110,
    align: "left",
  },
  {
    id: "userName",
    label: "Casher",
    minWidth: 160,
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    minWidth: 110,
    align: "left",
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

const index = (props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState({ data: [] });
  const [DefaultDate, setDefaultDate] = React.useState({
    startDate: 0,
    endDate: 0,
  });
  const [DefaultTime, setDefaultTime] = React.useState({
    startTime: 0,
    endTime: 0,
  });

  React.useEffect(() => {
    handleGetSaleData({
      startDate: parseInt(DateNumInput),
      endDate: parseInt(DateNumInput),
    });
    setDefaultDate({
      ...DefaultDate,
      startDate: parseInt(DateNumInput),
      endDate: parseInt(DateNumInput),
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onOpenChange = (dateValue, type) => {
    const dateSplit = dateValue.target.value.split("-");
    const DateValue = `${dateSplit[0]}${dateSplit[1]}${dateSplit[2]}`;

    setDefaultDate({ ...DefaultDate, [type]: DateValue });
  };

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
    appDb.HandelReports(
      {
        _type: "getCreditReports",
        startDate: prop.startDate,
        endDate: prop.endDate,
      },
      (callback) => {
        // console.log(callback);

        setRows({ ...rows, data: callback.data });
      }
    );
  };

  const saveCSV = () => {
    ipcRenderer.send("save_csv", {
      type: "MaterialsList",
      data: rows.data,
      header: [
        {
          id: "Date",
          title: "As At Date",
        },
        { id: "name", title: "Product Name" },
        { id: "OpenBalance", title: "Open Balance" },
        {
          id: "CloseBalance",
          title: "Close Balance",
        },
        {
          id: "QuantitySold",
          title: "Quantity Sold",
        },
      ],
    });
  };

  return (
    <div
      style={{
        padding: 10,
        height: "90vh",
        width: "88vw",
        backgroundColor: props.Theme.theme === "light" ? "#F1F1F1" : "#3b3b3b",
      }}
    >
      <div style={{ padding: 10, display: "flex" }}>
        <Icon
          name="calculator"
          color="teal"
          circular
          inverted={props.Theme.theme === "light" ? false : true}
        />
        <Typography style={{ marginLeft: 10 }} variant="h6">
          Credit Sales Reports
        </Typography>
      </div>
      <Divider />
      <div style={{ padding: 10 }}>
        <div
          style={{
            display: "flex",
          }}
        >
          <div>
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
          </div>
          {/* 
          <div style={{ marginLeft: 10 }}>
            <TextField
              id="time"
              label="Time Date"
              type="time"
              defaultValue={moment().format("HH:mm")}
              onChange={(event) => onTimeChange(event, "startTime")}
              // className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div style={{ marginLeft: 30 }}>
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
                });
              }}
            >
              Submit
            </Button>
          </div>
          <div style={{ marginLeft: 10 }}>
            <Button
              variant="outlined"
              style={{ marginLeft: 15, marginTop: 10 }}
              onClick={() => {
                saveCSV();
              }}
            >
              Export to excel
            </Button>
          </div>
        </div>
      </div>
      <Divider />
      <div style={{ marginTop: 15 }}>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    console.log(row);

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.idKey}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "is_paid" ? (
                                <div>
                                  {value ? (
                                    <div
                                      style={{
                                        padding: 5,
                                        color: "#fff",
                                        background: "green",
                                      }}
                                    >
                                      Paid
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        padding: 5,
                                        color: "#fff",
                                        background: "red",
                                      }}
                                    >
                                      Not Paid
                                    </div>
                                  )}
                                </div>
                              ) : column.id === "action" ? (
                                <Button
                                  disabled={row.is_paid}
                                  onClick={() => {
                                    appDb.HandelReports(
                                      {
                                        _type: "sales",
                                        _data_type: "sales_reports",
                                        data: {
                                          id: row.idKey,
                                          invoiceNumber: row.InvoiceNumber,
                                          ticketList: row.TicketList.list,
                                          totalQt: row.TotalQt,
                                          Customer: row.Customer,
                                          GrandTotal: row.GrandTotal,
                                          AmountPaid: row.GrandTotal,
                                          ChangeDue: 0,
                                          Balance: 0,
                                          RtxGrandTotal: row.GrandTotal,
                                          RtxAmountPaid: row.GrandTotal,
                                          RtxChangeDue: 0,
                                          RtxBalance: 0,
                                          Card_slipt: 0,
                                          Cash_slipt: 0,
                                          Date: row.Date,
                                          Datetrack: row.Datetrack,
                                          DateTrackNumber: row.dateRange,
                                          // time: moment().format("LT"),
                                          user: row.User,
                                          department: row.Department,
                                          company: "",
                                          paymentType: row.PaymentType,
                                          // isMuti: en,
                                          isTaxInvoice: row.isTaxInvoice,
                                          note: row.Note,
                                          time: row.time,
                                          timeRange: row.timeRange,
                                          Discount: 0,
                                          totalTaxFinal: row.totalTaxFinal,
                                          totalTax: row.totalTax,
                                          year: row.Year,
                                          day: row.Day,
                                          month: row.Month,
                                          currency: "ZMK",
                                        },
                                      },
                                      (callback) => {
                                        appDb.HandelReports(
                                          {
                                            _type: "update_credit_sale",
                                            _data_type: "sales_reports",
                                            data: callback,
                                          },
                                          (sendCallback) => {
                                            handleGetSaleData({
                                              startDate: DefaultDate.startDate,
                                              endDate: DefaultDate.endDate,
                                            });
                                          }
                                        );
                                      }
                                    );
                                  }}
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                >
                                  CashUp
                                </Button>
                              ) : column.format && typeof value === "number" ? (
                                column.format(value)
                              ) : (
                                value
                              )}

                              {/* {column.id === "action" ? (
                                <Button>Settle Payment</Button>
                              ) : column.format && typeof value === "number" ? (
                                column.format(value)
                              ) : (
                                value
                              )} */}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    Theme: state.Theme,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchEvent: (data) => dispatch(data),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(index);

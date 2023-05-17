import React = require("react");
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import appDb from "../../redux/dataBase";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/More";
import CloseIcon from "@material-ui/icons/Close";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import Modal from "@material-ui/core/Modal";
import TransferList from "./TransferList";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
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
}));

const index = (props) => {
  const [value, setValue] = React.useState("usb");
  const [printerName, setPrinterName] = React.useState("");
  const [printerIP, setPrinterIP] = React.useState("");
  const [receipts, setReceipts] = React.useState("1");
  const [printer, setPrinter] = React.useState({});
  const [openMdodel, setOpenMdodel] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const classes = useStyles();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  React.useEffect(() => {
    getPrintGroups();
    appDb.getPrintOuts(callback=>{
      setReceipts(callback)
    })
  }, []);

  const getPrintGroups = () => {
    appDb.HandlePrinterGroups({ _type: "get" }, (callback) => {
      setRows(callback);
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#EDEDED",
        padding: 20,
        height: "80vh",
      }}
    >
      <div style={{ paddingBottom: 10 }}>Printer Settings</div>
      <Divider />
      <div style={{ display: "flex", paddingTop: 10 }}>
        <div style={{ width: "40%" }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              Local Printer out puts Settings
            </FormLabel>
            <RadioGroup
              aria-label="printerIO"
              name="gender1"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="usb"
                control={<Radio />}
                label="User USB Printer"
              />

              <FormControlLabel
                value="network"
                control={<Radio />}
                label="User Network Printer"
              />
            </RadioGroup>

            <FormHelperText>Printer Name</FormHelperText>
            <TextField
              id="outlined-basic"
              label="Printer name"
              variant="outlined"
            />
            <div style={{ padding: 10 }} />
            <TextField
              id="outlined-basic"
              label="Printer IP"
              variant="outlined"
            />

            <Button
              type="submit"
              variant="outlined"
              color="primary"
              className={classes.button}
            >
              Save printer
            </Button>
          </FormControl>
        </div>
        <div
          style={{
            width: "60%",
            border: "none",
            borderStyle: "solid",
            borderWidth: 1,
            borderLeftColor: "#AAAAAA",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <div>
            <h3>List of network printers</h3>
          </div>
          <div style={{ display: "flex" }}>
            <TextField
              id="outlined-basic"
              label="Printer name"
              variant="outlined"
              size="small"
              value={printerName}
              onChange={(event) => {
                setPrinterName(event.target.value);
              }}
            />
            <div style={{ padding: 10 }} />
            <TextField
              id="outlined-basic"
              label="Printer IP"
              size="small"
              variant="outlined"
              value={printerIP}
              onChange={(event) => {
                setPrinterIP(event.target.value);
              }}
            />
            <div style={{ padding: 10 }} />
            <Button
              type="submit"
              size="small"
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => {
                appDb.HandlePrinterGroups(
                  { printerIP, printerName, _type: "set" },
                  (callback) => {
                    appDb.HandlePrinterGroups({ _type: "get" }, (callback) => {
                      setRows(callback);
                    });
                  }
                );
              }}
            >
              Add Printer
            </Button>
          </div>
          <div style={{ marginTop: 10 }}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Printer Name</TableCell>
                    <TableCell align="right">Number of Groups</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.idKey}>
                      <TableCell component="th" scope="row">
                        <Typography variant="subtitle1" component="h2">
                          {row.group}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="subtitle1" component="h2">
                          {row.printerIP}{" "}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          onClick={() => {
                            setPrinter(row);
                            setOpenMdodel(true);
                          }}
                          aria-label="more"
                        >
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      <Divider style={{ marginTop: 20 }} />

      <div style={{ marginTop: 20 }}>
        <div>Receipt Print Outs</div>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            Set the number of receipts print out. Default is
          </FormLabel>

          <div style={{ padding: 10 }} />
          <TextField
            type="number"
            id="outlined-basic"
            label="Number Of Receipts"
            size="small"
            variant="outlined"
            value={receipts}
            onChange={(event) => {
              setReceipts(event.target.value);
            }}
          />
          <div style={{ padding: 10 }} />
          <Button
            type="submit"
            size="small"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              appDb.setPrintOuts(receipts, (callback) => {
                if (callback)
                  toast(`Saved successfully`, {
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
            }}
          >
            Save
          </Button>
        </FormControl>
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openMdodel}
        onClose={() => {
          setOpenMdodel(false);
          getPrintGroups();
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openMdodel}>
          <div className={classes.paper}>
            <IconButton
              onClick={() => {
                setOpenMdodel(false);
                getPrintGroups();
              }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <TransferList printer={printer} />
            <div style={{ height: 10 }} />
            <Divider />
            <Button
              style={{ marginTop: 8 }}
              onClick={() => {
                appDb.HandlePrinterGroups(
                  { printer, _type: "delete" },
                  (callback) => {
                    toast(`Deleted successfully`, {
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
                  }
                );
              }}
              color="secondary"
              variant="outlined"
            >
              Delete this printer group
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(index);

const { SerialPort } = require("serialport");
let port;

async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if (err) {
      console.log(err.message);
      return;
    } else {
    }

    if (ports.length === 0) {
      console.log("No ports discovered");
    }

    var MYport;

    ports.forEach(function (port) {
      if (port.path == "COM2") {
        console.log("Found It");
        MYport = port.path.toString();
        console.log(MYport);
      }
    });

    port = new SerialPort({
      path: "COM2",
      baudRate: 2400,
      autoOpen: true,
    });

    // console.log(port.isOpen);
    port.on("open", function (err) {
      const clear = Buffer.from("0CH", "hex");
      port.write(clear);

      port.write("HELLO");
    });
  });
}

function PrintToDisplay(display) {
  // console.log(display);
  if (display.type === "clearDisplay") {
    const clear = Buffer.from("0CH", "hex");
    
    port.write(clear);
    port.write("HELLO");

  } else {
    const clear = Buffer.from("0CH", "hex");
    port.write(clear);
    port.write(display.message.toString());
  }
}

listSerialPorts();

export default PrintToDisplay;

// function listPorts() {
//   listSerialPorts();
//   setTimeout(listPorts, 2000);
// }

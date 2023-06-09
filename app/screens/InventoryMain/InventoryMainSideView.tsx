const React = require("react");
import { connect } from "react-redux";

 const InventoryMainSideView = (props) => {
  React.useEffect(() => {
    props.dispatchEvent({
      type: "CHANGEVIEW",
      view: "inventoryMain",
      title: "Inventory settings",
    });
  }, []);
  return <div></div>;
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchEvent: (data) => dispatch(data),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InventoryMainSideView);

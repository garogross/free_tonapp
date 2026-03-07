import { createPortal } from "react-dom";

const NewPortalProvider = (props) => {
  const portalId = props.id ? props.id : "modals";
  return createPortal(props.children, document.getElementById(portalId));
};

export default NewPortalProvider;

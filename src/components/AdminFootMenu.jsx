import { adminFootMenuItems } from "../data.js";
import "./AdminFootMenu.css";
import MenuItem from "./MenuItem";

export default function FootMenu({
  setAdminCurrentContent,
  adminCurrentContent,
}) {
  console.log({ adminFootMenuItems });

  return (
    <div className="foot-menu">
      <MenuItem
        {...adminFootMenuItems[0]}
        isActive={adminCurrentContent === "adminstatistic"}
        onClick={() => setAdminCurrentContent("adminstatistic")}
      />
      <MenuItem
        {...adminFootMenuItems[1]}
        isActive={adminCurrentContent === "admintransactions"}
        onClick={() => setAdminCurrentContent("admintransactions")}
      />
      <MenuItem
        {...adminFootMenuItems[2]}
        isActive={adminCurrentContent === "adminad"}
        onClick={() => setAdminCurrentContent("adminad")}
      />
      <MenuItem
        {...adminFootMenuItems[3]}
        isActive={adminCurrentContent === "adminsettings"}
        onClick={() => setAdminCurrentContent("adminsettings")}
      />
    </div>
  );
}

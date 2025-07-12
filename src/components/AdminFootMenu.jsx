import './AdminFootMenu.css';
import MenuItem from './MenuItem';
import { adminFootMenuItems } from '../data.js';

export default function FootMenu({ setCurrentContent, currentContent}) {
  return (
    <div className="foot-menu">
        <MenuItem {...adminFootMenuItems[0]} isActive={currentContent === 'adminstatistic'} onClick={() => setCurrentContent('adminstatistic')}/>
        <MenuItem {...adminFootMenuItems[1]} isActive={currentContent === 'admintransactions'} onClick={() => setCurrentContent('admintransactions')}/>
        <MenuItem {...adminFootMenuItems[2]} isActive={currentContent === 'adminad'} onClick={() => setCurrentContent('adminad')}/>
        <MenuItem {...adminFootMenuItems[3]} isActive={currentContent === 'adminsettings'} onClick={() => setCurrentContent('adminsettings')}/>
    </div>
  )
}

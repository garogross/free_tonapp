import './FootMenu.css';
import MenuItem from './MenuItem';
import { footMenuItems } from '../data.js';

export default function FootMenu({ setCurrentContent, currentContent}) {
  return (
    <div className="foot-menu">
        <MenuItem {...footMenuItems[0]} isActive={currentContent === 'cran'} onClick={() => setCurrentContent('cran')}/>
        <MenuItem {...footMenuItems[2]} isActive={currentContent === 'staking'} onClick={() => setCurrentContent('staking')}/>
        <MenuItem {...footMenuItems[1]} isActive={currentContent === 'challenges'} onClick={() => setCurrentContent('challenges')}/>
        <MenuItem {...footMenuItems[3]} isActive={currentContent === 'friends'} onClick={() => setCurrentContent('friends')}/>
        <MenuItem {...footMenuItems[4]} isActive={currentContent === 'profile'} onClick={() => setCurrentContent('profile')}/>
    </div>
  )
}

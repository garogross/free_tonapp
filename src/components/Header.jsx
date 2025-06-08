import './Header.css';
import logo from '../assets/logo.svg';
import LanguageSelector from './LanguageSelector';
import BackButton from './BackButton';

export default function Header( { setCurrentContent, path } ) {
    return (
        <header className="header">
            {path !== 'None' && <BackButton setCurrentContent={setCurrentContent} path={path} />}
            <div className="name">FreeTon</div>
            <div className="logo">
                <img src={logo} alt="FreeTon" />
            </div>
            <LanguageSelector />    
        </header>
    );
}
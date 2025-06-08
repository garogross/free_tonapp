import './BackButton.css'
import backIcon from '../assets/back.svg'

export default function BackButton( { setCurrentContent, path } ) {
    return (
        <div className="back-button" onClick={() => setCurrentContent(path)}>
            <img src={backIcon} alt="back" />
        </div>
    )
}
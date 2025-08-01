import './BackButton.css'

export default function BackButton( { setCurrentContent, path } ) {
    return (
        <div className="back-button" onClick={() => setCurrentContent(path)}>
            <img src="/assets/back.svg" alt="back" />
        </div>
    )
}
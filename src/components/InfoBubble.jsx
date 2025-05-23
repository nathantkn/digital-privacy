import '../styles/InfoBubble.css';

const InfoBubble = ({ active, id }) => {
    return (
        <div className={`info-bubble ${active ? 'active' : ''}`} id={id}>
            <span>i</span>
        </div>
    );
};

export default InfoBubble;
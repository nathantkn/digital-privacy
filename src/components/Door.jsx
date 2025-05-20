import "../styles/Door.css";
import Randall from "../assets/randall.webp";
import Sulley from "../assets/sulley.webp";
import Celia from "../assets/celia.webp";
import BooDoorFrame from "../assets/boo-door.jpg";

export default function Door({ doorOpen, monsterVisible }) {
    return (
        <div className="door-container">
            <div className="door-frame" />
            <img src={BooDoorFrame} className={`door ${doorOpen ? "open" : ""}`} alt="Door" />
            <div className="door-bottom" />

            {/* Monster avatars that appear when door opens */}
            {monsterVisible && (
                <>
                    <div className="monster-avatar monster-right">
                        <img src={Randall} className="monster-img randall" alt="Randall" />
                    </div>
                
                    <div className="monster-avatar monster-up">
                        <img src={Sulley} className="monster-img sulley" alt="Sulley" />
                    </div>
                
                    <div className="monster-avatar monster-left">
                        <img src={Celia} className="monster-img celia" alt="Celia" />
                    </div>
                </>
            )}
        </div>
    );
}
import "../styles/LandingPageCanister.css";

export default function LandingPageCanister({ scareEnergy }) {
    return (
        <div className="canister-container">
            <div className="scream-canister">
                <div className="canister-body">
                    <div className="meter-display">
                        <div className="meter-symbol minus">-</div>
                        <div className="energy-bar">
                            <div 
                                className="energy-fill"
                                style={{ width: `${scareEnergy}%` }}
                            />
                        </div>
                        <div className="meter-symbol plus">+</div>
                    </div>
                </div>
                <div className="canister-cap left-cap"></div>
                <div className="canister-cap right-cap"></div>
            </div>
        </div>
    );
}
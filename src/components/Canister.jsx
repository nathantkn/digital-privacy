import React from 'react';
import "../styles/Canister.css";

const Canister = ({ screamLevel }) => {
    return (
        <div className="canister-container">
            <div className="scream-canister">
                <div className="canister-body">
                    <div className="meter-display">
                        <div className="meter-symbol minus">-</div>
                        <div className="meter-segments">
                            <div className={`segment ${screamLevel >= 20 ? 'active' : ''}`}></div>
                                <div className={`segment ${screamLevel >= 40 ? 'active' : ''}`}></div>
                                <div className={`segment ${screamLevel >= 60 ? 'active' : ''}`}></div>
                                <div className={`segment ${screamLevel >= 80 ? 'active' : ''}`}></div>
                        </div>
                        <div className="meter-symbol plus">+</div>
                    </div>
                </div>
                <div className="canister-cap left-cap"></div>
                <div className="canister-cap right-cap"></div>
            </div>
        </div>
    );
};

export default Canister;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import Logo from "../assets/logo.png";
import Door from "./Door";
import Canister from "./LandingPageCanister";

function LandingPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [doorOpen, setDoorOpen] = useState(false);
    const [scareEnergy, setScareEnergy] = useState(0);
    const [monsterVisible, setMonsterVisible] = useState(false);
    const navigate = useNavigate();

    // Animation for the fade-in intro
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Dynamic energy meter animation
    useEffect(() => {
    const energyInterval = setInterval(() => {
        setScareEnergy((prev) => {
            const increaseAmount = Math.random() * 2 + 0.5;
            const newValue = prev + increaseAmount;
            const cappedValue = Math.min(newValue, 100);
        
            // If scare bar reaches full, open the door
            if (cappedValue >= 100 && !doorOpen) {
                setDoorOpen(true);
                // Show monster after door opens
                setTimeout(() => {
                    setMonsterVisible(true);
                }, 1000);
            }
        
            return cappedValue;
        });
    }, 200);
        return () => clearInterval(energyInterval);
    }, [doorOpen]);

    const handleGetStarted = () => {
        navigate("/chat");
    };

    return (
        <div className="landing-container">
            {/* Animated background elements */}
            {/* <div className="background-bubbles">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="bubble"
                        style={{
                        width: `${20 + Math.random() * 30}px`,
                        height: `${20 + Math.random() * 30}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${5 + Math.random() * 10}s`,
                        animationDelay: `${Math.random() * 5}s`,
                    }}
                    />
                ))}
            </div> */}

            {/* Main content with slide-in animation */}
            <div className={`landing-content ${isVisible ? "visible" : ""}`}>
                <div className="landing-card">
                    <div className="landing-header">
                        <img src={Logo} className="logo" alt="Logo" />
                        <p className="landing-tagline">Learn about data privacy and AI in a fun, safe environment!</p>
                    </div>

                    {/* Door Component */}
                    <Door doorOpen={doorOpen} monsterVisible={monsterVisible} />

                    {/* Energy Meter Component */}
                    <Canister scareEnergy={scareEnergy} />

                    {/* CTA Button */}
                    <button
                        onClick={handleGetStarted}
                        className="cta-button"
                    >
                        Get Started
                    </button>

                    <p className="footer-text">
                        Discover How Monsters Could Collect Your Data To Scare You!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
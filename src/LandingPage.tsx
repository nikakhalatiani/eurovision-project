import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import HeartBackground from "./Background.tsx";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // Define the target date and time
  const targetDateTime = new Date("2025-05-12T19:00:00Z").getTime(); // Use getTime() to convert to milliseconds

  // Calculate initial countdown value in milliseconds
  const [countdown, setCountdown] = useState(
    targetDateTime - new Date().getTime()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime(); // Get current time in milliseconds
      const remainingTime = targetDateTime - now;
      setCountdown(remainingTime);
      if (remainingTime <= 0) {
        clearInterval(timer);
        navigate("/rapp");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateTime]);

  const handleNavigate = () => {
    setIsLoading(true);
    navigate("/app");
  };

  // Format the countdown for display
  const formatCountdown = (time: number): string => {
    if (time <= 0) {
      return "0 seconds";
    }
    const parts: string[] = [];
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / 1000 / 3600) % 24);
    const days = Math.floor(time / 1000 / 86400);

    if (days > 0) {
      parts.push(`${days} day${days > 1 ? "s" : ""}`);
    }
    if (hours > 0) {
      parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    }
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
    }

    return parts.join(", ");
  };

  return (
    <><HeartBackground /><div className="landing">
      <div className="parent">
        <h2>Welcome to Voter</h2>
        <div className="count">{formatCountdown(countdown)} till</div>
        <div className="euro">Eurovision 2025</div>
        <button
          className="try-button"
          onClick={handleNavigate}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Test it Now"}
        </button>
      </div>
    </div></>
  );
};

export default LandingPage;

import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // Define the target date and time
  const targetDateTime = new Date('2024-05-07T23:00:00').getTime(); // Use getTime() to convert to milliseconds

  // Calculate initial countdown value in milliseconds
  const [countdown, setCountdown] = useState(targetDateTime - new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime(); // Get current time in milliseconds
      const remainingTime = targetDateTime - now;
      setCountdown(remainingTime);
      if (remainingTime <= 0) {
        clearInterval(timer);
        navigate('/rapp');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateTime]);

  const handleNavigate = () => {
    setIsLoading(true);
    navigate('/app');
  };

  // Format the countdown for display
  const formatCountdown = (time:number) => {
    if (time <= 0) {
      return "0 seconds";
    }
    const seconds = Math.floor(time / 1000 % 60);
    const minutes = Math.floor(time / 1000 / 60 % 60);
    const hours = Math.floor(time / 1000 / 3600 % 24);
    const days = Math.floor(time / 1000 / 86400);
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  return (
    <div className="landing">
        <div className='parent'>
        <h2>Welcome to Voter</h2>
      <div className='count'>{formatCountdown(countdown)} till</div>
        <div className='euro'>Eurovision 2024</div>
      <button className='try-button' onClick={handleNavigate} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Test it Now'}
      </button>
        </div>
   
    </div>
  );
};

export default LandingPage;

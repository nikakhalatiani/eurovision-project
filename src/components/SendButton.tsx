import React from 'react';
import './SendButton.css';

type SendButtonProps = {
    handleSubmission: () => void;
};

const SendButton: React.FC<SendButtonProps> = ({
    handleSubmission
}) => {
    return (
        <button type="button" onClick={handleSubmission} className='s-button'>Lock in Top 10</button>
    );
};

export default SendButton;
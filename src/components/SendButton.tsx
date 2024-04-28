import React from "react";
import "./SendButton.css";

type SendButtonProps = {
  content: string;
  handleSubmission: () => void;
};

const SendButton: React.FC<SendButtonProps> = ({
  content,
  handleSubmission,
}) => {
  return (
    <button type="button" onClick={handleSubmission} className="s-button">
      {content}
    </button>
  );
};

export default SendButton;

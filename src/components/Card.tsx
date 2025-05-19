"use client";

import "../Styles/Card.css";

interface CardProps {
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
}

const Card = ({ title, content, actions }: CardProps) => {
  return (
    <div className="card-container card-animate">
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <div className="card-description">{content}</div>
        {actions && <div className="card-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default Card;

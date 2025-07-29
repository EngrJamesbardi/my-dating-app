
import React from 'react';

interface PageProps {
  params: {
    matchId: string;
  };
}

const ChatPage = ({ params }: PageProps) => {
  const { matchId } = params;

  return (
    <div>
      <h1>Chat Page</h1>
      <p>Match ID: {matchId}</p>
    </div>
  );
};

export default ChatPage;

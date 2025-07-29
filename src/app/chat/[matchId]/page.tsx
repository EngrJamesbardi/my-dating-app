

interface PageProps {
  params: {
    matchId: string;
  };
}

export default function ChatPage({ params }: PageProps) {
  const { matchId } = params;

  return (
    <div>
      <h1>Chat Page</h1>
      <p>Match ID: {matchId}</p>
    </div>
  );
}

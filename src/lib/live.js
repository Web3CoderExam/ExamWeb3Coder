export function isSessionLive(session) {
  if (!session || !session.startTime || !session.endTime) return false;
  const now = new Date();
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  return now >= start && now <= end;
}
import useSWR from 'swr';

export default function useEvents(user: any, endpoint: string) {
  // We do a request to /api/events only if the user is logged in
  const { data: events, mutate } = useSWR(
    user?.isLoggedIn ? `/api${endpoint}` : null
  );

  return { events, mutate };
}

// hooks/useCurrentUser.ts
import { useGetCurrentUserQuery } from '@/redux/api/userApi';
import { selectIsAuthenticated } from '@/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { User } from '@/types/user'; // Ensure User type is imported

interface UseCurrentUserResult {
  user: User | null;
  isLoading: boolean;
  isFetching: boolean; // Added isFetching for more granular loading state
  error: any;
  refetchCurrentUser: () => void; // Added refetch function
}

export function useCurrentUser(): UseCurrentUserResult {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Use the RTK Query hook to fetch the user data
  const {
    data: currentUserResponse,
    isLoading: isUserQueryLoading,
    isFetching: isUserQueryFetching, // Use isFetching to know when refetches are happening
    error,
    refetch: refetchCurrentUser,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated, // Only fetch if authenticated
    // You can add refetchOnMountOrArgChange: true, or refetchOnReconnect: true
    // depending on your caching strategy.
    refetchOnMountOrArgChange: true,
  });

  // The actual user object is nested inside the data property of the response
  const user = currentUserResponse?.data?.data || null;

  // The overall loading state is true if authenticated AND the query is loading/fetching
  const isLoading =
    isAuthenticated && (isUserQueryLoading || isUserQueryFetching);

  return {
    user,
    isLoading,
    isFetching: isUserQueryFetching, // Expose isFetching
    error,
    refetchCurrentUser, // Expose refetch
  };
}

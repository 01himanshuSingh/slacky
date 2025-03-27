import { useQuery } from "convex/react";
import { api } from '../../../../convex/_generated/api';

export const usercurrentuser = () => {
  // Call the backend query to fetch the user data
  const data = useQuery(api.users.getUserData);
  const isLoading = data === undefined;
  
  return { data, isLoading };
};

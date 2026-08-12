import { useQuery } from '@tanstack/react-query';
import { getUser, getUsers } from '@/api/user.api.ts';

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUser(id),
  });
};


export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};

//In Component: const { data, isLoading } = useUsers();
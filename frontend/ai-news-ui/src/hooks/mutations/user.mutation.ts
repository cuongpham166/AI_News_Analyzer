import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/api/user.api.ts';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
};




/*
const mutation = useCreateUser();

mutation.mutate({
  name: "John",
});
* */

/*
* Component
    ↓
useCreateUser()        (TanStack Query)
    ↓
createUser()           (API function)
    ↓
privateApi.post()      (Axios)
    ↓
Backend
*
* */
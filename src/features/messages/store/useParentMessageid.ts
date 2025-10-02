import { useQueryState, parseAsString } from 'nuqs';

export const useParentMessageId = () => {
  return useQueryState("parentMessageId", parseAsString.withDefault(null));
};

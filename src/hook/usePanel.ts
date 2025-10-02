import { useParentMessageId } from "@/features/messages/store/useParentMessageid";
export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId();
    const onOpenMessage = (id: string) => {
        setParentMessageId(id);
    };
    const onClose = () => {
        setParentMessageId(null);
    };
    return {
        parentMessageId,
        onOpenMessage,
        onClose,
    };
}
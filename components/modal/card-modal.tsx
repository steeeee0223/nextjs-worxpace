import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent } from "@/components/ui";
import { useCardModal } from "@/hooks";
import { fetchUrl } from "@/lib/fetch";
import { CardWithList } from "@/lib/types";

import { Header } from "./header";

const CardModal = () => {
    const { id, isOpen, onClose } = useCardModal();
    const { data } = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetchUrl(`/api/cards/${id}`),
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                {data ? <Header data={data} /> : <Header.Skeleton />}
            </DialogContent>
        </Dialog>
    );
};

export default CardModal;

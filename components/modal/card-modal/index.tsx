import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent } from "@/components/ui";
import { useCardModal } from "@/hooks";
import { fetchUrl } from "@/lib/fetch";
import { CardWithList } from "@/lib/types";

import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./action";

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
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                    <div className="col-span-3">
                        <div className="w-full space-y-6">
                            {data ? (
                                <Description data={data} />
                            ) : (
                                <Description.Skeleton />
                            )}
                        </div>
                    </div>
                    {data ? <Actions data={data} /> : <Actions.Skeleton />}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CardModal;

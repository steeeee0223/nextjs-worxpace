import { useQuery } from "@tanstack/react-query";
import { AuditLog } from "@prisma/client";

import { Dialog, DialogContent } from "@/components/ui";
import { useCardModal } from "@/hooks";
import { CardWithList, fetchUrl } from "@/lib";

import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./action";
import { Activity } from "./activity";

const CardModal = () => {
    const { id, isOpen, onClose } = useCardModal();
    const { data } = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetchUrl(`/api/cards/${id}`),
    });
    const { data: logs } = useQuery<AuditLog[]>({
        queryKey: ["card-logs", id],
        queryFn: () => fetchUrl(`/api/cards/${id}/logs`),
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
                            {logs ? (
                                <Activity data={logs} />
                            ) : (
                                <Activity.Skeleton />
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

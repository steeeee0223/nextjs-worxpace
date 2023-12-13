export type TreeItem = {
    id: string;
    title: string;
    parentId?: string | null;
    isArchived?: boolean;
};

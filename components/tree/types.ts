export type TreeItem = {
    id: string;
    title: string;
    parentId?: string | null;
    isArchived?: boolean;
    icon?: string | null;
};

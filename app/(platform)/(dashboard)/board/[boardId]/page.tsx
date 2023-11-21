type Params = {
    params: { boardId: string };
};

const BoardPage = ({ params: { boardId } }: Params) => {
    return <div className="">Board ID - {boardId}</div>;
};

export default BoardPage;

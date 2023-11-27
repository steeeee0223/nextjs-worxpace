type Params = { params: { personalId: string } };

const Personal = ({ params: { personalId } }: Params) => {
    return <div className="w-full mb-20">Personal Page - {personalId}</div>;
};

export default Personal;

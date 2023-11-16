type Params = { params: { organizationId: string } };

const Organization = ({ params: { organizationId } }: Params) => {
    return <div className="">Organization - {organizationId}</div>;
};

export default Organization;

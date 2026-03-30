import {Table} from "antd"

const DataTable = ({columns, data}) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
           
            <Table
             columns={columns}
             dataSource={data}
             pagination={{pageSize: 5}}
             />
        </div>
    );
}

export default DataTable;

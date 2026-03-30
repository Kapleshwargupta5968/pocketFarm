import {Card, Statistic} from 'antd';
const StatsCard = ({title, value}) => {
    return (
        <Card className='shadow-sm rounded-xl'>
            <Statistic title={title} value={value}/>
        </Card>
    )
}

export default StatsCard
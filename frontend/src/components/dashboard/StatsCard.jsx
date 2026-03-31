import {Card, Statistic} from 'antd';
import React from 'react';
const StatsCard = React.memo(({title, value}) => {
    return (
        <Card className='shadow-sm rounded-xl'>
            <Statistic title={title} value={value}/>
        </Card>
    );
});

export default StatsCard;
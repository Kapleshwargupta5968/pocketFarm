import {Spin} from 'antd'
const Loader = ({fullScreen = false, text = "loading..."}) => {

    if(fullScreen){
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-3">
                <Spin size="large" description={text} />
                <p className="text-gray-500">{text}</p>
            </div>
        );
    }

    return(
        <div className="flex flex-col items-center justify-center py-6 gap-2">
            <Spin size="large" description={text} />
            <p className="text-gray-500">{text}</p>
        </div>
    )

};

export default Loader;
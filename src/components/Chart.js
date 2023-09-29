import React, { useEffect, useState } from 'react'
import '../../node_modules/react-vis/dist/style.css';
import { XYPlot } from 'react-vis';
import { AreaSeries } from 'react-vis';
import { Hint } from 'react-vis';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Chart = () => {
    const [data, setData] = useState([]);
    const [hintData, setHintData] = useState(null);
    const today = new Date();
    const [date, setDate] = useState(today);

    useEffect(() => {
        fetch('https://api.llama.fi/summary/fees/lyra?dataType=dailyFees')
            .then(res => res.json())
            .then((res) => {
                const rawData = res.totalDataChart;
                const formattedData = rawData.map(([timeStamp, value]) => ({ "x": timeStamp, "y": value }));
                setData(formattedData);
            })
    }, [])

    useEffect(() => {
        if(hintData){
            let currDate = new Date(hintData.x)
            setDate(currDate)
        }
    }, [hintData])

    return (
        // <Button onClick={() => console.log(data)}>sdfdsfdsf</Button>
        <XYPlot height={500} width={1300}>
            <AreaSeries color="#86becd" data={data} onNearestXY={(datapoint) => {
                setHintData(datapoint)
            }}>
            </AreaSeries>
            {hintData && <Hint value={hintData}>
                <span style={{ backgroundColor: '#000000', padding: '4px', borderRadius:'4px', display: 'block' }}>
                    {`${months[date.getMonth()]} ${date.getDate()}, ${date.getHours()}:${date.getMinutes()}`}
                    <br/>
                    &#36; {hintData.y}
                </span>
            </Hint>}
        </XYPlot>
    )
}

export default Chart
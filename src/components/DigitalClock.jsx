import {useState,useEffect} from "react";

   
const DigitalClock=()=>{

const[clock,setClock]=useState(new Date())
useEffect(()=>{
    const IntervalId=setInterval(()=>{
        setClock(new Date());
    },1000)
    return()=>{
        clearInterval(IntervalId)
    }
},[])
const formatTime=()=>{
    let hours=clock.getHours();
    const minutes=clock.getMinutes();
    const seconds=clock.getSeconds();
    
    const meridiem= hours >= 12 ? "PM" : "AM";
    hours=hours % 12||12;
    return `${padZero(hours)}:${padZero(minutes)}:
    ${padZero(seconds)}:
    ${meridiem}`

}
const padZero=(number)=>{
    return (number <10? "0":"")+number
}

return(
    <div>
        <div className="text-2xl font-bold">
            <p>{formatTime()}</p>
        </div>
    </div>
)

}
export default DigitalClock;

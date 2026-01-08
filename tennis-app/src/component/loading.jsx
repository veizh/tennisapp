import { useEffect, useRef, useState } from "react"
import tennisBall from "../ball-1.svg"
import tennisBall2 from "../ball-2.svg"
import tennisBall3 from "../ball-3.svg"
export const Loading = ()=>{
    let[load,setLoad]  = useState(".")
       const dots = [".", "..", "..."];

    useEffect(() => {
        const interval = setInterval(() => {
            setLoad(prev => dots[(dots.indexOf(prev) + 1) % dots.length]);
        }, 400);

        return () => clearInterval(interval);
    }, []);
return(
    <div className="loading__page">
        <div className="loading__text">Chargement</div>
        <div className="loading__svg">

        <img src={tennisBall} alt="" />
        <img src={tennisBall3} alt="" />
        <img src={tennisBall2} alt="" />
        </div>
    </div>
)
}
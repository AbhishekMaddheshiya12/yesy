import { Typography } from "@mui/material";

const SubmitAnimation = ()=>{
    return (
        <>
            <svg style={{margin:'auto',marginTop:'20px',background:'none',display:'block',shapeRendering:'auto'}} width="100" height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#2c3e5d" stroke="#2c3e5d" stroke-width="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#2B2B2B" stroke="#2B2B2B" stroke-width="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#2B2B2B" stroke="#2B2B2B" stroke-width="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
            {/* <Typography sx={{textAlign:"center" ,color:"2c3e5d",fontWeight:"bold",fontSize:"18px"}}>Processing...</Typography> */}
        </>
    )
}
export default SubmitAnimation;
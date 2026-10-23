import React from 'react';
export default function Player({width='100%',height='100%',playing=false,muted=true,loop=false}:any){return <video src="/components/cult-ui/sample.webm" controls muted={muted} loop={loop} autoPlay={playing} style={{width,height}} />;}

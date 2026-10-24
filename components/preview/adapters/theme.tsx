import {useState} from 'react';
export function useTheme(){const [theme,setValue]=useState(document.documentElement.classList.contains('dark')?'dark':'light');return {theme,resolvedTheme:theme,setTheme:(value:string)=>{setValue(value);document.documentElement.classList.toggle('dark',value==='dark');}};}

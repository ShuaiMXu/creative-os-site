import React from 'react';
export default function Link({href,prefetch,replace,scroll,legacyBehavior,passHref,...props}:any){return <a {...props} href={typeof href==='string'?href:'#'} />;}

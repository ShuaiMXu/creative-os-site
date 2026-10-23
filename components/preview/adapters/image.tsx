import React from 'react';
// Browser preview adapter only. Published Next.js source stays unchanged.
export default function Image({src,alt='',fill,priority,quality,placeholder,blurDataURL,loader,unoptimized,onLoadingComplete,...props}: any) {
 return <img {...props} alt={alt} src={typeof src==='string'?src:src?.src} loading={priority?'eager':'lazy'} style={{...(fill?{position:'absolute',inset:0,width:'100%',height:'100%'}:{}),...props.style}} />;
}

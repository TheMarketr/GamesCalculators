export type SpeedUnit='Mbps'|'Gbps';
export function calculateDownload(sizeGb:number,speed:number,unit:SpeedUnit,efficiency=.9){const mbps=Math.max(.01,speed)*(unit==='Gbps'?1000:1);const idealSeconds=Math.max(0,sizeGb)*8000/mbps;const seconds=idealSeconds/Math.max(.1,Math.min(1,efficiency));return{mbps,idealSeconds,seconds,completionTimestamp:Date.now()+seconds*1000}}

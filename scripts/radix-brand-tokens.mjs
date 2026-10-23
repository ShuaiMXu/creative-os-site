import * as radix from '@radix-ui/colors';
import {readFileSync,writeFileSync} from 'node:fs';
const path=new URL('../packages/design-tokens/happyhands.json',import.meta.url);
const tokens=JSON.parse(readFileSync(path,'utf8'));
const roles={'bg':['gray',1],'bg-raised':['gray',2],'bg-sunken':['gray',3],'bg-hover':['gray',4],'ink':['gray',12],'ink-2':['gray',12],'ink-muted':['gray',11],'ink-subtle':['gray',11],'line':['gray',6],'line-strong':['gray',8],'primary':['gray',12],'on-primary':['gray',1],'brand':['orange',9],'on-brand':['gray',12],'brand-text':['orange',11],'brand-soft':['orange',3],'success':['green',11],'success-soft':['green',3],'warning':['amber',11],'warning-soft':['amber',3],'danger':['red',11],'danger-soft':['red',3],'info':['blue',11],'info-soft':['blue',3],'ring':['blue',8],'chart-1':['gray',12],'chart-2':['gray',11],'chart-3':['gray',8],'chart-4':['orange',9],'chart-5':['green',9],'chart-6':['red',9]};
for (const mode of ['light','dark']) {
 for(const [name,[scale,step]] of Object.entries(roles))tokens[mode][name]=radix[scale+(mode==='dark'?'Dark':'')][scale+step];
 Object.assign(tokens[mode],{'on-media':radix.grayDark.gray12,'media-scrim':radix.blackA.blackA9,'scrim':radix.blackA.blackA8,'shadow-control':'none','shadow-float':`0 8px 24px ${radix.blackA.blackA4}`,'shadow-toast':`0 8px 24px ${radix.blackA.blackA4}`,'radius-sm':'4px','radius-md':'8px','radius-lg':'12px','radius-xl':'12px'});
}
writeFileSync(path,JSON.stringify(tokens,null,2)+'\n');

// Adapted from Cult UI base-tooltip, MIT, revision 7f031dc812f7bda10213bab62752dd6d080297ff.
// Original source and license: vendor/cult-ui/upstream/base-tooltip.json and LICENSE.md.
import React, {type ReactElement} from 'react';
import {Tooltip as Primitive} from '@base-ui/react/tooltip';
import {Slot} from '@radix-ui/react-slot';
import './tooltip.css';

export function Tooltip({label,children}:{label:string;children:ReactElement}) {
 return <Primitive.Provider delay={400}>
  <Primitive.Root>
   <Primitive.Trigger render={(props)=><Slot {...props}/>}>{children}</Primitive.Trigger>
   <Primitive.Portal>
    <Primitive.Positioner side="bottom" sideOffset={6} className="hh-tooltip-positioner">
     <Primitive.Popup className="hh-tooltip">{label}</Primitive.Popup>
    </Primitive.Positioner>
   </Primitive.Portal>
  </Primitive.Root>
 </Primitive.Provider>;
}

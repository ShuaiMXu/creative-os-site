import React from 'react';
import {Tooltip,TooltipProvider,TooltipTrigger,TooltipContent} from '@/registry/default/ui/base-tooltip';
export default function Demo(){return <TooltipProvider><Tooltip><TooltipTrigger>Review guidance</TooltipTrigger><TooltipContent>Compare the same page and viewport before approving.</TooltipContent></Tooltip></TooltipProvider>;}

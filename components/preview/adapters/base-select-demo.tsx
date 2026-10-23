import React from 'react';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/registry/default/ui/base-select';
export default function Demo(){return <div className="w-64 space-y-4"><h2>Review scope</h2><Select defaultValue="page" items={{page:"Current page",project:"Whole project"}}><SelectTrigger aria-label="Review scope"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="page">Current page</SelectItem><SelectItem value="project">Whole project</SelectItem></SelectContent></Select></div>;}

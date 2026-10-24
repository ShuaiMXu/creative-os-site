"""Package the static storyboard in a PDF. Requires Pillow and reportlab.
Run from the repository root. Does not generate video or alter scene imagery.
"""
import json, subprocess
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
root=Path(__file__).resolve().parent.parent
base=root/'public/film/storyboard'
data=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {timing} from './film/storyboard/scenes.js';console.log(JSON.stringify(timing))"],cwd=root,text=True))
for name,file in [('Film','InstrumentSans-Regular.ttf'),('FilmBold','InstrumentSans-Bold.ttf')]:pdfmetrics.registerFont(TTFont(name,str(base/'fonts'/file)))
out=base/'HappyHands-Storyboard-V7.pdf';c=canvas.Canvas(str(out),pagesize=(1280,1040));c.setTitle('HappyHands — Product film storyboard V7');c.setAuthor('HappyHands')
def t(x,y,s,size=15,bold=False,color='#20221f'):
 c.setFont('FilmBold' if bold else 'Film',size);c.setFillColor(HexColor(color));c.drawString(x,y,s)
def paragraph(x,y,s,width,size=16):
 words=s.split();line='';step=size*1.4
 for word in words:
  candidate=(line+' '+word).strip()
  if pdfmetrics.stringWidth(candidate,'Film',size)>width:
   t(x,y,line,size);y-=step;line=word
  else:line=candidate
 if line:t(x,y,line,size);y-=step
 return y
for i,s in enumerate(data):
 c.setFillColor(HexColor('#f7f6f3'));c.rect(0,0,1280,1040,fill=1,stroke=0)
 # A scene is still a 16:9 composition. Brand and main captions use real assets/fonts.
 x,y,w,h=32,270,1216,684
 c.drawImage(ImageReader(str(base/s['plate'])),x,y,width=w,height=h)
 start=s['start'];end=start+s['seconds'];tc=lambda v:f'{v//60:02}:{v%60:02}'
 t(32,993,f"{tc(start)}–{tc(end)}  ·  Scene {i+1} of {len(data)}",16,color='#625e56');t(420,991,s['title'],25,True)
 t(32,238,'What happens',16,True);paragraph(32,211,s['action'],570,16)
 t(664,238,'Camera & transition',16,True);paragraph(664,211,s['camera']+' '+s['transition'],584,16)
 t(32,119,'Voiceover draft',14,True);paragraph(32,96,s['voiceover'],1216,14)
 t(32,32,'Illustrative demo · Northstar is fictional · Awaiting storyboard approval · No video production started',12,color='#625e56')
 c.showPage()
# Include production boundaries and font/brand rules in the downloadable artefact.
t(48,977,'Brand, type and capability boundaries',31,True)
y=915
for heading,body in [('Official identity','Use the original HappyHands hand-and-wordmark artwork. The HTML/CSS scene compositions use the repository logo asset without changing its proportions.'),('Typeface roles','Instrument Sans Regular and Bold: exact loaded files for HappyHands film captions, controls and the review page. Instrument Serif Regular: display only inside the fictional Northstar project. Both use included OFL notices. All UI lettering is deterministically typeset in HTML/CSS with the self-hosted fonts.'),('Truthful demonstration','The scene imagery, code and pixel labels are illustrative. Before showing executed or verified outcomes in the finished film, replace them with a real scoped sample and its Harness evidence. Model candidates require confirmation; Foundation approval and human acceptance are separate decisions.'),('Current execution boundary','The public website carries project/task/source paths into the local workbench; it does not execute coding agents in the cloud. Codex CLI and Claude Code CLI are registered adapters. Captures cover declared states and viewports, not every unseen route.'),('Approval boundary','This deliverable is a static 85-second storyboard and narration draft. No video, sound, target-project edit, acceptance or production deployment is included.')]:
 t(48,y,heading,20,True);y-=36;y=paragraph(48,y,body,1170,18)-32
c.save();print(out)

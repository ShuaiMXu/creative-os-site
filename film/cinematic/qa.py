"""Inspect encoded media and make review sheets. Never equate sampling with playback."""
from pathlib import Path
import json,subprocess
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parent
VIDEO=ROOT/'out/HappyHands-Follow-the-change-C-v3b.mp4'
OUT=ROOT/'out/review-v3b';OUT.mkdir(exist_ok=True)
def run(args):return subprocess.run(args,capture_output=True,text=True,encoding='utf8',errors='replace',check=True)
meta=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(VIDEO)]).stdout)
(OUT/'media.json').write_text(json.dumps({'format':{k:v for k,v in meta['format'].items() if k!='filename'},'streams':meta['streams']},indent=2))
for name,fps in [('dense',5),('blind',2)]:
    folder=OUT/name;folder.mkdir(exist_ok=True)
    run(['ffmpeg','-v','error','-y','-i',str(VIDEO),'-vf',f'fps={fps}',str(folder/'%04d.jpg')])
    files=sorted(folder.glob('*.jpg'))
    for start in range(0,len(files),12):
        sheet=Image.new('RGB',(1440,4*294),'#eeeeee');d=ImageDraw.Draw(sheet)
        for j,f in enumerate(files[start:start+12]):
            x=j%3*480;y=j//3*294;sheet.paste(Image.open(f).resize((480,270)),(x,y));d.text((x+8,y+274),f'{(start+j)/fps:.2f}s / frame {round((start+j)/fps*30)}',fill='#202020')
        sheet.save(OUT/f'{name}-{start//12+1:02}.jpg',quality=90)
# Delivery overview spans the whole encoded movie, rather than source stills.
files=sorted((OUT/'dense').glob('*.jpg'));sheet=Image.new('RGB',(1440,5*294),'#eee');d=ImageDraw.Draw(sheet)
for i in range(15):
    idx=round(i*(len(files)-1)/14);im=Image.open(files[idx]).resize((480,270));x=i%3*480;y=i//3*294;sheet.paste(im,(x,y));d.text((x+8,y+274),f'{idx/5:.1f}s',fill='black')
sheet.save(OUT/'overview.jpg',quality=92)
black=run(['ffmpeg','-hide_banner','-i',str(VIDEO),'-vf','blackdetect=d=0.05:pix_th=0.02','-an','-f','null','NUL']).stderr
(OUT/'blackdetect.txt').write_text(black,encoding='utf8')
loud=run(['ffmpeg','-hide_banner','-i',str(VIDEO),'-vn','-af','ebur128=peak=true','-f','null','NUL']).stderr
(OUT/'loudness.txt').write_text(loud,encoding='utf8')
print(json.dumps({'duration':meta['format']['duration'],'size':meta['format']['size'],'video':[{k:s[k] for k in ['width','height','avg_frame_rate','nb_frames'] if k in s} for s in meta['streams'] if s['codec_type']=='video'],'dense_frames':len(files),'black_intervals':[line for line in black.splitlines() if 'black_start:' in line]},indent=2))
print(loud[loud.rfind('Summary:'):])

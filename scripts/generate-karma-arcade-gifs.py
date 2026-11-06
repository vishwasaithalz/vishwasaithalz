#!/usr/bin/env python3
"""Original lightweight GIFs for the six KARMA projects. No remote images, fonts, or APIs."""
from pathlib import Path
from math import cos, sin, pi
from PIL import Image, ImageDraw, ImageFont
import random

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "arcade-gifs"
OUT.mkdir(parents=True, exist_ok=True)
W, H, N = 480, 270, 24
BG = (12, 16, 38)
CYAN = (101, 222, 255)
PINK = (255, 115, 168)
LIME = (169, 255, 120)
YELLOW = (255, 197, 90)
VIOLET = (216, 163, 255)
WHITE = (247, 241, 255)
MUTED = (165, 172, 203)

def font(size, bold=False):
    variant = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    candidates = [
        "/usr/share/fonts/truetype/dejavu/" + variant,
        "/usr/local/share/fonts/" + variant,
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

SM = font(11)
MID = font(17, True)
BIG = font(21, True)

def base(title, subtitle, accent, frame):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    for x in range(0, W, 24):
        d.line((x, 0, x, H), fill=(19, 28, 54), width=1)
    for y in range(0, H, 24):
        d.line((0, y, W, y), fill=(19, 28, 54), width=1)
    d.rounded_rectangle((7, 7, 473, 263), radius=16, outline=accent, width=3)
    d.rectangle((14, 14, 465, 67), fill=(27, 31, 61))
    d.text((26, 19), title, font=BIG, fill=WHITE)
    d.text((27, 48), subtitle, font=SM, fill=accent)
    d.rectangle((26, 239, 455, 243), fill=(41, 48, 82))
    d.rectangle((26, 239, 26+int(429*frame/(N-1)), 243), fill=accent)
    return im, d

def logsentry(f):
    im, d = base("LOGSENTRY", "DEFENSIVE EVENT TRACE", PINK, f)
    for i in range(6):
        y=91+i*23
        hot=i==(f//4)%6
        color=PINK if hot else (53, 69, 106)
        d.rounded_rectangle((29,y,449,y+17), radius=4, fill=color if hot else (29,38,69))
        d.text((39,y+1),f"EVENT {4624+i:04d}  |  LOCAL AUDIT  |  {'FLAGGED' if hot else 'REVIEW'}",font=SM,fill=(12,16,38) if hot else MUTED)
    d.rectangle((29,91+(f//4)%6*23,34,108+(f//4)%6*23), fill=YELLOW)
    return im

def recon(f):
    im, d = base("RECON LITE", "OFFLINE HTTP HEADER INSPECTION", CYAN, f)
    headers=["CONTENT-SECURITY-POLICY","STRICT-TRANSPORT-SECURITY","X-CONTENT-TYPE-OPTIONS","REFERRER-POLICY","PERMISSIONS-POLICY"]
    for i,h in enumerate(headers):
        y=92+i*26
        d.text((30,y),h,font=SM,fill=WHITE)
        d.rounded_rectangle((315,y-2,444,y+14),radius=5,fill=(32,64,81))
        x=315+int(129*min(1,max(0,(f-i*3)/13)))
        d.rounded_rectangle((315,y-2,max(319,x),y+14),radius=5,fill=CYAN)
    d.line((30+int(f/(N-1)*418),88,30+int(f/(N-1)*418),221),fill=PINK,width=3)
    return im

def automation(f):
    im, d = base("AI AUTOMATION LAB", "REPRODUCIBLE WORKFLOWS", VIOLET, f)
    nodes=[(85,146),(241,119),(391,150)]
    for a,b in [(0,1),(1,2)]:
        d.line((*nodes[a],*nodes[b]),fill=(93,69,141),width=6)
    for i,(x,y) in enumerate(nodes):
        d.rounded_rectangle((x-50,y-30,x+50,y+30),radius=12,fill=(43,32,81),outline=VIOLET,width=2)
        d.text((x-34,y-6),["INPUT","MOCK","OUTPUT"][i],font=SM,fill=WHITE)
    t=(f%(N//2))/(N//2)
    section=(f//(N//2))%2
    a,b=nodes[section],nodes[section+1]
    x=int(a[0]+(b[0]-a[0])*t)
    y=int(a[1]+(b[1]-a[1])*t)
    d.ellipse((x-9,y-9,x+9,y+9),fill=LIME)
    d.text((140,216),"DETERMINISTIC  /  TESTABLE  /  LOCAL",font=SM,fill=YELLOW)
    return im

def cyberplayground(f):
    im,d=base("CYBERPLAYGROUND","SAFE SECURITY ARCADE",YELLOW,f)
    d.rectangle((25,200,454,211),fill=(59,92,115))
    for i in range(7):
        x=50+i*66
        y=194-(20 if i%3==0 else 0)
        d.rectangle((x,y,x+26,200),fill=CYAN)
    playerx=45+int(365*(f/(N-1)))
    playery=174-int(abs(sin(f*pi/5))*45)
    d.rectangle((playerx,playery,playerx+20,playery+22),fill=PINK)
    d.rectangle((playerx+14,playery+5,playerx+18,playery+9),fill=WHITE)
    for i in range(3):
        x=114+i*134
        d.ellipse((x,112,x+17,129),fill=LIME if (f+i*4)%12<8 else (62,86,75))
    d.text((34,218),"AUTHORIZED LABS ONLY",font=SM,fill=YELLOW)
    return im

def yyyh(f):
    im,d=base("YINYANGYOHACKERS","THE 2013 INTERNET REBOOT",PINK,f)
    cx,cy=242,151
    d.ellipse((cx-67,cy-67,cx+67,cy+67),fill=(24,31,63),outline=VIOLET,width=3)
    angle=2*pi*f/N
    for j in range(12):
        a=angle+2*pi*j/12
        x=int(cx+cos(a)*53); y=int(cy+sin(a)*53)
        d.ellipse((x-3,y-3,x+3,y+3),fill=CYAN if j%2 else PINK)
    d.arc((cx-49,cy-49,cx+49,cy+49),int(f*15),int(f*15)+185,fill=YELLOW,width=9)
    d.text((cx-39,cy-7),"2013",font=MID,fill=WHITE)
    d.text((32,217),"OLD WEB  /  NEW BUILDS",font=SM,fill=LIME)
    return im

def ops(f):
    im,d=base("KARMA OPS","THE ENGINEERING WORKSHOP",LIME,f)
    cx,cy=240,157
    for r in [42,69,94]:
        d.ellipse((cx-r,cy-r,cx+r,cy+r),outline=(51,87,89),width=2)
    a=2*pi*f/N
    d.pieslice((cx-95,cy-95,cx+95,cy+95),int(f*15),int(f*15)+24,fill=(23,76,67))
    d.line((cx,cy,cx+int(cos(a)*96),cy+int(sin(a)*96)),fill=LIME,width=4)
    for i,(ang,r) in enumerate([(1.3,70),(2.8,45),(4.7,90),(5.6,63)]):
        x=cx+int(cos(ang)*r); y=cy+int(sin(ang)*r)
        d.ellipse((x-7,y-7,x+7,y+7),fill=CYAN if f%12>=i*3 else YELLOW)
    d.ellipse((cx-18,cy-18,cx+18,cy+18),fill=VIOLET)
    d.text((cx-7,cy-7),"K",font=MID,fill=BG)
    return im

GENERATORS = {
    "logsentry": logsentry,
    "recon-lite": recon,
    "automation-lab": automation,
    "cyberplayground": cyberplayground,
    "yyyh": yyyh,
    "karma-ops": ops,
}

def main():
    for name, generator in GENERATORS.items():
        images = [generator(i).quantize(colors=128, method=Image.Quantize.MEDIANCUT) for i in range(N)]
        path=OUT / f"{name}.gif"
        images[0].save(path, save_all=True, append_images=images[1:],
                       optimize=True, loop=0, duration=95, disposal=2)
        assert path.stat().st_size>1000, f"Failed to write {name}"
        print(f"{name}: {path.stat().st_size} bytes, {N} frames")

if __name__=="__main__":
    main()

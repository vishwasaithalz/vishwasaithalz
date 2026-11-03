#!/usr/bin/env python3
"""KARMA public-source, read-only health probe. No credentials required."""
import json, os, urllib.request, urllib.error
from datetime import datetime, timezone

TARGETS = [
    {"repo":"YYYH","url":"https://yyyh-phi.vercel.app/","expected":"YinYangYoHackers"},
    {"repo":"flagship-api","url":"https://flagship-api.vercel.app/","expected":"Flagship API"},
    {"repo":"nextjs-boilerplate","url":"https://nextjs-boilerplate-ten-alpha-14.vercel.app/","expected":"Northstar"},
    {"repo":"recon-lite","url":"https://recon-lite.vercel.app/","expected":"RECON LITE"},
    {"repo":"CyberPlayground","url":"https://cyber-playground-nu.vercel.app/","expected":"CyberPlayground"},
]
def check(item):
    result = {"repo":item["repo"],"url":item["url"],"status":"unknown","http":None,"error":None,"contentVerified":False}
    try:
        request = urllib.request.Request(item["url"],headers={"User-Agent":"KARMA-Health-Check/1.0"})
        with urllib.request.urlopen(request, timeout=15) as response:
            result["http"] = response.status
            body = response.read(250000).decode("utf-8", errors="replace")
            result["contentVerified"] = item["expected"].casefold() in body.casefold()
            result["contentCheckMethod"] = "raw response text, not JavaScript-rendered DOM"
            result["status"] = ("reachable" if result["contentVerified"] else "attention") if 200 <= response.status < 400 else "attention"
            if 200 <= response.status < 400 and not result["contentVerified"]:
                result["error"] = "Expected text absent from raw HTML; may require browser-rendered check"
    except urllib.error.HTTPError as exc:
        result["http"] = exc.code
        result["status"] = "protected" if exc.code in (401,403) else "attention"
        result["error"] = "HTTP response " + str(exc.code)
    except Exception as exc:
        result["status"] = "attention"
        result["error"] = type(exc).__name__ + ": " + str(exc)[:160]
    return result

def main():
    data={"schema":1,"checkedAt":datetime.now(timezone.utc).isoformat(),"method":"HTTP GET + expected page text from GitHub Actions; not a browser or full functional test","checks":[check(t) for t in TARGETS]}
    path=os.path.join(os.path.dirname(__file__),"health.json")
    with open(path,"w",encoding="utf-8") as f: json.dump(data,f,indent=2);f.write("\n")
    print(json.dumps(data,indent=2))
if __name__=="__main__": main()

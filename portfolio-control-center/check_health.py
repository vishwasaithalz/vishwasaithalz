#!/usr/bin/env python3
"""KARMA public-source, read-only health probe. No credentials required."""
import json, os, urllib.request, urllib.error
from datetime import datetime, timezone

TARGETS = [
    {"repo":"YYYH","url":"https://yyyh-phi.vercel.app/"},
    {"repo":"flagship-api","url":"https://flagship-api.vercel.app/"},
    {"repo":"nextjs-boilerplate","url":"https://nextjs-boilerplate-ten-alpha-14.vercel.app/"},
    {"repo":"recon-lite","url":"https://recon-lite.vercel.app/"},
    {"repo":"CyberPlayground","url":"https://cyber-playground-nu.vercel.app/"},
]
def check(item):
    result = {"repo":item["repo"],"url":item["url"],"status":"unknown","http":None,"error":None}
    try:
        request = urllib.request.Request(item["url"],headers={"User-Agent":"KARMA-Health-Check/1.0"})
        with urllib.request.urlopen(request, timeout=15) as response:
            result["http"] = response.status
            result["status"] = "reachable" if 200 <= response.status < 400 else "attention"
    except urllib.error.HTTPError as exc:
        result["http"] = exc.code
        result["status"] = "protected" if exc.code in (401,403) else "attention"
        result["error"] = "HTTP response " + str(exc.code)
    except Exception as exc:
        result["status"] = "attention"
        result["error"] = type(exc).__name__ + ": " + str(exc)[:160]
    return result

def main():
    data={"schema":1,"checkedAt":datetime.now(timezone.utc).isoformat(),"method":"HTTP GET from GitHub Actions; not a browser or full functional test","checks":[check(t) for t in TARGETS]}
    path=os.path.join(os.path.dirname(__file__),"health.json")
    with open(path,"w",encoding="utf-8") as f: json.dump(data,f,indent=2);f.write("\n")
    print(json.dumps(data,indent=2))
if __name__=="__main__": main()

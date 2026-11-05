#!/usr/bin/env python3
"""Read-only public GitHub repository quality report. No credentials required."""
import json
import os
import urllib.request
from datetime import datetime, timezone

OWNER = "vishwasaithalz"
REPOS = ["YYYH","flagship-api","recon-lite","nextjs-boilerplate","vishwasaithalz","LogSentry","CyberPlayground","AI-Automation-Lab","KARMA-Ops-Monitor"]
def get(path):
    req = urllib.request.Request("https://api.github.com/"+path, headers={"Accept":"application/vnd.github+json","User-Agent":"karma-quality-monitor"})
    with urllib.request.urlopen(req,timeout=15) as res:
        return json.load(res)
def audit(repo):
    p=f"repos/{OWNER}/{repo}"
    info=get(p)
    tree=get(f"{p}/git/trees/{info['default_branch']}?recursive=1")
    paths={item["path"] for item in tree.get("tree",[]) if item["type"]=="blob"}
    checks={"license":bool(info.get("license")),"readme":"README.md" in paths,"security_policy":"SECURITY.md" in paths,"ci_workflow":any(s.startswith(".github/workflows/") for s in paths),"tests":any(s.startswith("tests/") or s.startswith("test/") for s in paths)}
    return {"repository":repo,"visibility":info["visibility"],"head":info.get("default_branch"),"checks":checks,"passed":sum(checks.values()),"total":len(checks),"note":"Public metadata checks only. Not a secrets or vulnerability scan."}
def main():
    results=[]
    for repo in REPOS:
        try:results.append(audit(repo))
        except Exception as e:results.append({"repository":repo,"error":str(e)})
    os.makedirs("reports",exist_ok=True)
    out={"generated_at":datetime.now(timezone.utc).isoformat(),"scope":"public repositories only","results":results}
    with open("reports/public-quality.json","w",encoding="utf-8") as f:json.dump(out,f,indent=2)
    with open("reports/public-quality.md","w",encoding="utf-8") as f:
        f.write("# KARMA public repository quality\n\nGenerated: "+out["generated_at"]+"\n\n")
        f.write("| Repository | License | README | Security policy | CI | Tests |\n|---|---|---|---|---|---|\n")
        for r in results:
            c=r.get("checks",{})
            f.write("| "+r["repository"]+" | "+" | ".join("Yes" if c.get(k) else "No" for k in ["license","readme","security_policy","ci_workflow","tests"])+" |\n")
        f.write("\nRead-only metadata inventory. This does not certify security or production readiness.\n")
if __name__=="__main__":main()

#!/usr/bin/env python3
"""Read public GitHub repository metadata without credentials or write access."""
import json
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

OWNER = "vishwasaithalz"
REPOS = ("LogSentry", "recon-lite", "AI-Automation-Lab", "CyberPlayground", "YYYH", "KARMA-Ops-Monitor")

def main():
    results = []
    for name in REPOS:
        url = f"https://api.github.com/repos/{OWNER}/{name}"
        request = Request(url, headers={"Accept": "application/vnd.github+json", "User-Agent": "karma-public-metrics/1.0"})
        try:
            with urlopen(request, timeout=10) as response:
                data = json.load(response)
            results.append({"repository": name, "stars": data["stargazers_count"], "forks": data["forks_count"], "open_issues": data["open_issues_count"], "url": data["html_url"]})
        except (HTTPError, URLError, TimeoutError, KeyError, ValueError) as error:
            print(f"Could not retrieve {name}: {error}", file=sys.stderr)
            results.append({"repository": name, "status": "unavailable"})
    print(json.dumps({"source": "GitHub public REST API", "repositories": results}, indent=2))
    return 1 if any("status" in item for item in results) else 0

if __name__ == "__main__":
    raise SystemExit(main())

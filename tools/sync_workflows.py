"""Sync this plugin with the AutoDL.Art ComfyUI workflow catalogue.

    python tools/sync_workflows.py            fetch the live catalogue, regenerate every file, report what changed
    python tools/sync_workflows.py --offline  regenerate from the saved official-workflows.json (no network)
    python tools/sync_workflows.py --check    like --offline but write nothing; exit 1 if any file is stale (CI)
    python tools/sync_workflows.py --table    print the README / API.md model table

Generated: official-workflows.json, workflows.json, examples.json (hand-written
entries are kept, new workflows get one), prices.json and the WORKFLOWS table in
plugin.js. Standard library only.
"""
import argparse
import datetime
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
API = "https://www.autodl.art/api/v1/comfyui/workflows"
MOTION, TTS = "wan2.2animate-v4-motion_retargeting", "indextts2-v1"
ALIASES = {MOTION: "wan2.2-animate-move", TTS: "IndexTTS-2"}
SNAPSHOT_FIELDS = ["uuid", "name", "description", "content", "cover_image_url", "price", "version",
                   "billing_interval_seconds", "input_rules", "input_example", "output_example",
                   "api_reference_url", "endpoint_info", "price_type", "billing_config", "created_at",
                   "updated_at", "usage_count_7d"]
CATALOG_ORDER = ["workflowId", "name", "type", "timeoutSeconds", "promptField", "secondsField",
                 "audios", "videos", "resolutions", "rules", "input_reference"]
ORIENT = {"竖": "portrait", "横": "landscape", "(1:1)": "square"}
ORIENT_ZH = {"portrait": "竖", "landscape": "横", "square": "方"}
HOST = "https://your-public-file-host.example/"


# ---------------------------------------------------------------- fetching
def http_json(url, body=None):
    request = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None,
                                     headers={"Content-Type": "application/json", "User-Agent": "new-api-plugin-autodl-sync"})
    with urllib.request.urlopen(request, timeout=60) as response:
        payload = json.load(response)
    if payload.get("code") != "Success":
        raise SystemExit(f"AutoDL answered {payload.get('code')} for {url}")
    return payload["data"]


def fetch_official():
    listing = http_json(API, {"page_index": 1, "page_size": 200})["list"]
    snapshot = []
    for item in listing:
        detail = http_json(f"{API}/{item['uuid']}")
        snapshot.append({key: detail[key] for key in SNAPSHOT_FIELDS if key in detail})
    return snapshot


# ---------------------------------------------------------------- catalogue
def media_keys(rules, kind):
    def order(key):
        if key == "first_frame":
            return (0, 0)
        if key == "last_frame":
            return (0, 1)
        match = re.search(r"_(\d+)$", key)
        return (1, int(match.group(1)) if match else -1)
    return sorted((k for k, v in rules.items() if v.get("type") == kind), key=order)


def resolutions(uuid, rule):
    if uuid == MOTION:
        # The labels say 464x832 / 832x464 while the nodes receive 468, so no exact size is promised.
        return [{"resolution": "464p", "orientation": "portrait", "upstream": "464*832px(竖版)"},
                {"resolution": "464p", "orientation": "landscape", "upstream": "832*464px(横版)"}]
    out = []
    for option in rule["options"]:
        label = option["label"]
        match = re.match(r"^(\d+p)(竖|横|\(1:1\))", label)
        if not match:
            raise SystemExit(f"{uuid}: cannot parse resolution label {label!r}; extend resolutions() first")
        entry = {"resolution": match.group(1), "orientation": ORIENT[match.group(2)], "upstream": label}
        pixels = re.search(r"\((\d+)\*(\d+)\)", label)
        values = option.get("values", {})
        width = next((v for k, v in values.items() if k.endswith("自定义宽")), None)
        height = next((v for k, v in values.items() if k.endswith("自定义高")), None)
        if pixels:
            entry["size"] = f"{pixels.group(1)}x{pixels.group(2)}"
        elif width and height:
            entry["size"] = f"{width}x{height}"
        out.append(entry)
    return out


def rule_of(value):
    rule = {k: v for k, v in value.items() if k not in ("node_id", "field")}
    if rule.get("type") == "enum":
        rule["options"] = [o["label"] if isinstance(o, dict) else o for o in rule["options"]]
    out = {"type": rule.pop("type"), "required": rule.pop("required", False)}
    out.update(rule)
    return out


def catalogue_entry(workflow):
    uuid, rules = workflow["uuid"], workflow["input_rules"]
    audio = uuid == TTS
    entry = {"workflowId": uuid, "name": workflow["name"], "type": "audio" if audio else "video", "timeoutSeconds": 1800}
    entry["promptField"] = "prompt_text" if audio else ("prompt" if "prompt" in rules else None)
    entry["secondsField"] = "duration" if "duration" in rules else ("audio_duration" if "audio_duration" in rules else None)
    entry["input_reference"] = media_keys(rules, "image")
    entry["audios"] = ["prompt_simple", "emo_ref_audio"] if audio else media_keys(rules, "audio")
    entry["videos"] = media_keys(rules, "video")
    entry["resolutions"] = resolutions(uuid, rules["resolution"]) if "resolution" in rules else []
    entry["rules"] = {k: rule_of(v) for k, v in rules.items()}
    return entry


def runtime_rule(key, rule, entry):
    """The subset of an official rule that plugin.js reads at run time."""
    keep = {k: v for k, v in rule.items() if k in ("type", "required", "min", "max", "min_length", "max_length", "options")}
    if "default" in rule and (rule["type"] == "enum" or key == entry["secondsField"]):
        keep["default"] = rule["default"]
    return keep


def plugin_table(catalogue):
    dump = lambda value: json.dumps(value, ensure_ascii=False, separators=(", ", ": "))
    lines = ["const WORKFLOWS = {"]
    for index, (uuid, entry) in enumerate(catalogue.items()):
        head = {k: entry[k] for k in ("workflowId", "name", "type", "timeoutSeconds", "promptField", "secondsField")}
        lines.append(f"  {dump(uuid)}: {{")
        lines.append("    " + dump(head)[1:-1] + ",")
        lines.append("    " + ", ".join(f"{dump(k)}: {dump(entry[k])}" for k in ("input_reference", "audios", "videos")) + ",")
        lines.append('    "resolutions": [' + ("" if entry["resolutions"] else "],"))
        for r in entry["resolutions"]:
            lines.append(f"      {dump(r)},")
        if entry["resolutions"]:
            lines.append("    ],")
        lines.append('    "rules": {')
        for key, rule in entry["rules"].items():
            lines.append(f"      {dump(key)}: {dump(runtime_rule(key, rule, entry))},")
        lines.append("    },")
        lines.append("  }" + ("," if index < len(catalogue) - 1 else ""))
    lines.append("};")
    return "\n".join(lines)


# ---------------------------------------------------------------- examples
def examples(catalogue, previous):
    def required(entry, kind):
        return sum(1 for f in entry[kind] if entry["rules"][f]["required"]) or (2 if entry[kind][:2] == ["first_frame", "last_frame"] else 0)
    openai, minimax = {}, {}
    old_minimax = previous.get("_formats", {}).get("minimax", {})
    for uuid, entry in catalogue.items():
        if uuid in previous and uuid in old_minimax:
            openai[uuid], minimax[uuid] = previous[uuid], old_minimax[uuid]
            continue
        rules = entry["rules"]
        default = next(r for r in entry["resolutions"] if r["upstream"] == rules["resolution"]["default"])
        prompt = "保留手里的话筒" if rules.get("prompt", {}).get("required") is False else "一只猫在雪地中奔跑"
        seconds = rules[entry["secondsField"]]["default"]
        body = {"model": uuid, "prompt": prompt, "seconds": seconds, "resolution": default["resolution"], "orientation": default["orientation"]}
        images, audios, videos = (required(entry, k) for k in ("input_reference", "audios", "videos"))
        if audios:
            body["audios"] = [f"{HOST}reference-{i + 1}.wav" for i in range(audios)]
        if videos:
            body["videos"] = [f"{HOST}reference-{i + 1}.mp4" for i in range(videos)]
        if images:
            refs = [{"image_url": f"{HOST}reference-{i + 1}.png"} for i in range(images)]
            body["input_reference"] = refs[0] if images == 1 else refs
        openai[uuid] = body
        content = [{"type": "text", "text": prompt}]
        content += [{"type": "image_url", "image_url": {"url": f"{HOST}reference-{i + 1}.png"}, "role": "reference_image"} for i in range(images)]
        content += [{"type": "audio_url", "audio_url": {"url": f"{HOST}reference-{i + 1}.wav"}, "role": "reference_audio"} for i in range(audios)]
        content += [{"type": "video_url", "video_url": {"url": f"{HOST}reference-{i + 1}.mp4"}, "role": "reference_video"} for i in range(videos)]
        tier = {"480p": "480P", "768p": "768P"}.get(default["resolution"], default["resolution"])
        minimax[uuid] = {"model": uuid, "content": content, "resolution": tier, "ratio": "9:16", entry["secondsField"]: seconds}
    formats = dict(previous.get("_formats", {}))
    formats["minimax"] = minimax
    # AutoDL's own API takes the workflow's upstream body as-is, so its example is derived from the
    # table every time: prompt, the default length and resolution, and every required media slot.
    formats["autodl"] = {uuid: native_example(entry) for uuid, entry in catalogue.items()}
    formats["dashscope"] = {"wan2.2-animate-move": {
        "model": "wan2.2-animate-move",
        "input": {"image_url": f"{HOST}reference-1.png", "video_url": f"{HOST}reference-1.mp4"},
        "parameters": {"mode": "wan-std"},
    }}
    return {**openai, "_formats": formats}


def native_example(entry):
    rules, body = entry["rules"], {}
    field = entry["promptField"]
    if field:
        body[field] = "用平静的语气读这句话。" if entry["type"] == "audio" else ("保留手里的话筒" if rules[field].get("required") is False else "一只猫在雪地中奔跑")
    if entry["secondsField"]:
        body[entry["secondsField"]] = rules[entry["secondsField"]]["default"]
    if entry["resolutions"]:
        body["resolution"] = rules["resolution"]["default"]
    extension, counts = {"image": "png", "audio": "wav", "video": "mp4"}, {}
    for key, rule in rules.items():
        if rule["type"] in extension and rule.get("required"):
            counts[rule["type"]] = counts.get(rule["type"], 0) + 1
            body[key] = f"{HOST}reference-{counts[rule['type']]}.{extension[rule['type']]}"
    return body


# ---------------------------------------------------------------- prices
def number(value):
    return ("%.6f" % value).rstrip("0").rstrip(".")


def tier_chain(period, prices):
    parts = []
    for i, p in enumerate(prices):
        tier = f'tier("{period}_{p["resolution"]}", u("seconds") * {number(p[period])})'
        parts.append(f"({tier})" if i == len(prices) - 1 else f'u("resolution") == "{p["resolution"]}" ? {tier} : ')
    text = parts[-1]
    for head in reversed(parts[:-1]):
        text = f"({head}{text})"
    return text


def flat_expression(peak, off_peak):
    if peak == off_peak:
        return f'tier("base", u("seconds") * {number(peak)})'
    return f'hour("Asia/Shanghai") < 8 ? tier("off_peak", u("seconds") * {number(off_peak)}) : tier("peak", u("seconds") * {number(peak)})'


def prices(official, verified_on):
    models = {}
    for w in official:
        uuid, config = w["uuid"], w.get("billing_config") or {}
        source = f"{API}/{uuid}"
        if w.get("price_type") == "minimax_h3":
            rows = [{"resolution": r["resolution"], "peak": r["price"] / 1000, "off_peak": r["off_peak_price"] / 1000} for r in config["minimax_h3"]]
            models[uuid] = {"name": w["name"], "source": source, "unit": "CNY per generated video second", "prices": rows,
                            "expression": f'hour("Asia/Shanghai") < 8 ? {tier_chain("off_peak", rows)} : {tier_chain("peak", rows)}'}
        elif w.get("price_type") == "video_sec_cost":
            c = config["video_sec_cost"]
            rows = [{"peak": c["price"] / 1000, "off_peak": c["off_peak_price"] / 1000}]
            models[uuid] = {"name": w["name"], "source": source, "unit": "CNY per actual generated video second", "prices": rows,
                            "expression": flat_expression(rows[0]["peak"], rows[0]["off_peak"])}
        elif w.get("price_type") == "audio_sec_cost":
            c = config["audio_sec_cost"]
            rows = [{"peak": c["price"] / 1000, "off_peak": c["off_peak_price"] / 1000, "minimum": c["minimum_price"] / 1000}]
            models[uuid] = {"name": w["name"], "source": source,
                            "unit": "CNY per generated audio second (minimum charge applied by the plugin as a 10-second floor)",
                            "prices": rows, "expression": flat_expression(rows[0]["peak"], rows[0]["off_peak"])}
        else:
            raise SystemExit(f"{uuid}: unknown price_type {w.get('price_type')!r}; extend prices() first")
        if uuid in ALIASES:
            entry = models[uuid]
            models[ALIASES[uuid]] = {"name": entry["name"], "workflow_id": uuid, **{k: v for k, v in entry.items() if k != "name"}}
    return {"verified_on": verified_on, "timezone": "Asia/Shanghai", "peak_hours": "08:00-24:00", "off_peak_hours": "00:00-08:00",
            "upstream_price_divisor": 1000, "new_api_price_scale": 1,
            "new_api_display_note": "Verified site uses CNY display with USDExchangeRate=1. No FX conversion or extra markup. Existing group multipliers still apply.",
            "source": f"{API}/{{workflow_id}} (billing_config; upstream unit is 0.001 CNY)", "models": models}


# ---------------------------------------------------------------- docs table
def markdown_table(catalogue, price_file):
    def span(entry, kind):
        fields = entry[kind]
        if not fields:
            return None
        if fields[:2] == ["first_frame", "last_frame"]:
            return "2"
        low = sum(1 for f in fields if entry["rules"][f]["required"])
        return f"{low}–{len(fields)}" if low != len(fields) else f"{low}"
    def scene(item):
        e = item[1]
        if e["type"] == "audio":
            return 5
        if e["videos"]:
            return 4
        if e["input_reference"][:2] == ["first_frame", "last_frame"]:
            return 3
        return 2 if e["audios"] else (1 if e["input_reference"] else 0)
    rows = ["| 模型（workflow ID） | 输入媒体 | 文本 | 时长（秒） | 分辨率（方向） | 额外参数 | 官方价 元/秒<br>高峰/低峰 |", "|---|---|---|---|---|---|---|"]
    for uuid, e in sorted(catalogue.items(), key=lambda item: (scene(item), item[0])):
        media = "，".join(f"{n} {s}" for n, s in (("图", span(e, "input_reference")), ("音频", span(e, "audios")), ("视频", span(e, "videos"))) if s) or "—"
        prompt = "✗" if not e["promptField"] else ("可选 " if e["rules"][e["promptField"]]["required"] is False else "") + f"≤{e['rules'][e['promptField']]['max_length']}"
        seconds = f"{e['rules'][e['secondsField']]['min']}–{e['rules'][e['secondsField']]['max']}" if e["secondsField"] else "按成片实测"
        tiers = list(dict.fromkeys(r["resolution"] for r in e["resolutions"]))
        orients = "".join(z for z in "竖横方" if z in {ORIENT_ZH[r["orientation"]] for r in e["resolutions"]})
        res = "/".join(tiers) + f"（{orients}）" if tiers else "—"
        media_fields = e["input_reference"] + e["audios"] + e["videos"]
        extra = [k for k, v in e["rules"].items() if k not in (e["promptField"], e["secondsField"], "resolution", "seed") and k not in media_fields
                 and not k.startswith("emo_") and v["type"] not in ("image", "audio", "video")]
        extra = (["seed"] if "seed" in e["rules"] else []) + (["emo_*"] if e["type"] == "audio" else extra)
        p = price_file["models"][uuid]["prices"]
        price = "<br>".join(f"{x['resolution']} {x['peak']:g}/{x['off_peak']:g}" for x in p) if "resolution" in p[0] \
            else f"{p[0]['peak']:g}/{p[0]['off_peak']:g}" + (f"（最低 {p[0]['minimum']:g} 元）" if "minimum" in p[0] else "")
        name = f"`{uuid}`<br>{e['name']}" + (f"<br>别名 `{ALIASES[uuid]}`" if uuid in ALIASES else "")
        rows.append(f"| {name} | {media} | {prompt} | {seconds} | {res} | {'、'.join(f'`{x}`' for x in extra) or '—'} | {price} |")
    sizes = {}
    for e in catalogue.values():
        for r in e["resolutions"]:
            if "size" in r:
                sizes.setdefault((r["resolution"], r["orientation"]), {}).setdefault(r["size"], 0)
                sizes[(r["resolution"], r["orientation"])][r["size"]] += 1
    size_rows = ["| 档位 | 方向 | `size` | 支持的工作流数 |", "|---|---|---|---|"]
    for (tier, orient), by_size in sorted(sizes.items(), key=lambda x: (int(x[0][0][:-1]), "竖横方".index(ORIENT_ZH[x[0][1]]))):
        for size, count in by_size.items():
            size_rows.append(f"| {tier} | {ORIENT_ZH[orient]} | `{size}` | {count} |")
    return "\n".join(rows) + "\n\n" + "\n".join(size_rows)


# ---------------------------------------------------------------- main
def dumps(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"


def summarize(old, new):
    old_map, new_map = {w["uuid"]: w for w in old}, {w["uuid"]: w for w in new}
    report = [f"+ {u} {new_map[u]['name']}" for u in new_map if u not in old_map]
    report += [f"- {u} {old_map[u]['name']}" for u in old_map if u not in new_map]
    for u in new_map:
        if u not in old_map:
            continue
        for key in ("input_rules", "billing_config"):
            a, b = old_map[u].get(key) or {}, new_map[u].get(key) or {}
            changed = sorted(k for k in set(a) | set(b) if a.get(k) != b.get(k))
            if changed:
                report.append(f"~ {u} {key}: {', '.join(changed)}")
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--offline", action="store_true")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--table", action="store_true")
    args = parser.parse_args()
    snapshot_path = ROOT / "official-workflows.json"
    saved = json.loads(snapshot_path.read_text(encoding="utf-8"))
    previous_catalog = json.loads((ROOT / "workflows.json").read_text(encoding="utf-8"))
    offline = args.offline or args.check or args.table
    official = saved if offline else fetch_official()
    verified_on = previous_catalog.get("verified_on") if offline else datetime.date.today().isoformat()
    catalogue = {w["uuid"]: catalogue_entry(w) for w in official}
    price_file = prices(official, verified_on)
    if args.table:
        print(markdown_table(catalogue, price_file))
        return
    plugin_path = ROOT / "plugin.js"
    plugin = plugin_path.read_text(encoding="utf-8")
    start = plugin.index("const WORKFLOWS = {")
    end = plugin.index("\n};\n", start) + 3
    outputs = {
        snapshot_path: dumps(official),
        ROOT / "workflows.json": dumps({"verified_on": verified_on, "source": API,
                                        "workflows": {k: {f: v[f] for f in CATALOG_ORDER} for k, v in catalogue.items()}}),
        ROOT / "examples.json": dumps(examples(catalogue, json.loads((ROOT / "examples.json").read_text(encoding="utf-8")))),
        ROOT / "prices.json": dumps(price_file),
        plugin_path: plugin[:start] + plugin_table(catalogue) + plugin[end:],
    }
    stale = [p.name for p, text in outputs.items() if p.read_text(encoding="utf-8") != text]
    if args.check:
        if stale:
            print("stale generated files: " + ", ".join(stale) + " -- run: python tools/sync_workflows.py --offline")
            sys.exit(1)
        print(f"generated files are up to date ({len(catalogue)} workflows)")
        return
    for line in summarize(saved, official) or ["official definitions unchanged"]:
        print(line)
    for path, text in outputs.items():
        path.write_text(text, encoding="utf-8", newline="\n")
    print(f"{len(catalogue)} workflows; rewritten: {', '.join(stale) or 'nothing'}")
    if not offline:
        print("Next: node tests.mjs, review new workflows (special fields?), refresh the README/API.md table with --table, bump meta.version.")


if __name__ == "__main__":
    main()

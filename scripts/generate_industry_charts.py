from __future__ import annotations

import argparse
import os
import subprocess
from pathlib import Path

from graphviz import Digraph


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "ops" / "industry-charts"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def apply_common_style(g: Digraph) -> None:
    g.attr(rankdir="LR", fontname="Helvetica", bgcolor="white", splines="ortho", nodesep="0.45", ranksep="0.7")
    g.attr("node", fontname="Helvetica", fontsize="10", style="rounded,filled", color="#2D3748", fillcolor="#F7FAFC")
    g.attr("edge", color="#4A5568", penwidth="1.2", arrowsize="0.8", fontname="Helvetica", fontsize="9")


def add_legend(g: Digraph, prefix: str, include_client_choice: bool = True) -> None:
    with g.subgraph(name=f"cluster_{prefix}_legend") as c:
        c.attr(label="Legend", color="#CBD5E0", style="rounded,dashed")
        c.node(f"{prefix}_task", "Task / Process", shape="box")
        c.node(f"{prefix}_gateway", "Decision Gateway", shape="diamond", fillcolor="#FEFCBF", color="#B7791F")
        if include_client_choice:
            c.node(
                f"{prefix}_choice",
                "Client Choice (E*)",
                shape="parallelogram",
                fillcolor="#FFFBEB",
                color="#B7791F",
            )
        c.node(f"{prefix}_store", "Data Store", shape="cylinder", fillcolor="#EDF2F7")
        c.node(f"{prefix}_event", "Start/End Event", shape="circle", fillcolor="#E6FFFA", color="#2C7A7B")
        c.edge(f"{prefix}_task", f"{prefix}_gateway", style="invis")
        if include_client_choice:
            c.edge(f"{prefix}_gateway", f"{prefix}_choice", style="invis")
            c.edge(f"{prefix}_choice", f"{prefix}_store", style="invis")
        else:
            c.edge(f"{prefix}_gateway", f"{prefix}_store", style="invis")
        c.edge(f"{prefix}_store", f"{prefix}_event", style="invis")


def build_as_is_chart() -> Digraph:
    g = Digraph("as_is_mapping")
    apply_common_style(g)
    g.attr(label="AS-IS DFD (Level 1): Current Catalog Mapping Pipeline", labelloc="t", fontsize="14", fontname="Helvetica-Bold")

    g.node("ext_afc", "E1 AFC backups\n(manual corrections)", shape="box", fillcolor="#FFF5F5")
    g.node("ext_seed", "E2 seed_data.sql\n(product inserts)", shape="box", fillcolor="#FFF5F5")
    g.node("ext_paths", "E3 legacy image paths\n(/images/afc/*)", shape="box", fillcolor="#FFF5F5")
    g.node("proc_map", "P1 Current mapping execution\n(ad-hoc scripts + historical migrations)", shape="box", fillcolor="#F7FAFC")

    with g.subgraph(name="cluster_store") as c:
        c.attr(label="Data Stores", color="#CBD5E0", style="rounded")
        c.node("ds_products", "D1 products", shape="cylinder")
        c.node("ds_specs", "D2 product_specs", shape="cylinder")
        c.node("ds_images", "D3 product_images", shape="cylinder")

    with g.subgraph(name="cluster_serve") as c:
        c.attr(label="Serving", color="#CBD5E0", style="rounded")
        c.node("proc_fetch", "P2 Catalog retrieval\n(getCatalog/getProducts)", shape="box")
        c.node("gw_error", "G1 Supabase error?", shape="diamond", fillcolor="#FEFCBF", color="#B7791F")
        c.node("proc_fallback", "P3 Optional fallback\n(Nhost)", shape="box", fillcolor="#FFFAF0")
        c.node("proc_ui", "P4 Filter API + Product UI", shape="box")

    g.node(
        "risk",
        "Known Defects:\n- duplicate variants\n- inconsistent specs\n- image path/order drift\n- fallback can mask DB failures",
        shape="note",
        fillcolor="#FFF5F5",
        color="#C53030",
    )

    g.edge("ext_afc", "proc_map", label="metadata corrections")
    g.edge("ext_seed", "proc_map", label="core rows/spec seeds")
    g.edge("ext_paths", "proc_map", label="legacy media refs")
    g.edge("proc_map", "ds_products", label="upsert products")
    g.edge("proc_map", "ds_specs", label="backfill specs")
    g.edge("proc_map", "ds_images", label="backfill images")
    g.edge("ds_products", "proc_fetch", label="catalog rows")
    g.edge("ds_specs", "proc_fetch", label="spec overlays")
    g.edge("ds_images", "proc_fetch", label="image ordering")
    g.edge("proc_fetch", "gw_error")
    g.edge("gw_error", "proc_fallback", label="Yes")
    g.edge("gw_error", "proc_ui", label="No")
    g.edge("proc_fallback", "proc_ui", label="fallback dataset")
    g.edge("risk", "proc_ui", style="dashed", color="#C53030")

    add_legend(g, "as_is")
    return g


def build_to_be_chart(show_client_choices: bool = True) -> Digraph:
    g = Digraph("to_be_mapping")
    apply_common_style(g)
    g.attr(rankdir="TB")
    g.attr(label="TO-BE BPMN Workflow: Controlled Supabase Redo", labelloc="t", fontsize="14", fontname="Helvetica-Bold")

    g.node("start", "Start Event", shape="circle", fillcolor="#E6FFFA", color="#2C7A7B")
    g.node("end_ok", "End: Success", shape="doublecircle", fillcolor="#E6FFFA", color="#2C7A7B")
    g.node("end_fail", "End: Aborted/Failed", shape="doublecircle", fillcolor="#FFF5F5", color="#C53030")

    with g.subgraph(name="cluster_lane_data_eng") as c:
        c.attr(label="Lane A: Data Engineering", color="#90CDF4", style="rounded")
        c.node("a1", "A1 Load AFC backups (primary)", shape="box", fillcolor="#EBF8FF")
        c.node("a2", "A2 Load seed_data.sql (secondary)", shape="box", fillcolor="#EBF8FF")
        c.node("a3", "A3 Parse + normalize by slug", shape="box")
        c.node("a3b", "A3b Build canonical slug key\nbrand-category-model", shape="box")
        c.node("g1b", "G1b Slug/name collision?", shape="diamond", fillcolor="#FEFCBF", color="#B7791F")
        c.node("a3c", "A3c Create alias map + redirect rules", shape="box", fillcolor="#FFFAF0")
        c.node("g1", "G1 Field conflict?", shape="diamond", fillcolor="#FEFCBF", color="#B7791F")
        c.node("a4", "A4 Resolve conflicts\n(AFC priority) + write diff log", shape="box", fillcolor="#FFFAF0")
        c.node("g2", "G2 Mandatory core fields complete?", shape="diamond", fillcolor="#FEFCBF", color="#B7791F")
        c.node("a5", "A5 Data curation fix + rerun normalize", shape="box", fillcolor="#FFF5F5")
        c.node("a6", "A6 Build category spec profiles\n(Seating/Tables/Workstations/Soft-seating/Storage/Education)", shape="box")
        c.node("a7", "A7 Enrich records with category-specific specs", shape="box")
        c.node("g2b", "G2b Category spec contract satisfied?", shape="diamond", fillcolor="#FEFCBF", color="#B7791F")
        c.node("a8", "A8 Build staging payloads", shape="box")

    with g.subgraph(name="cluster_lane_qa") as c:
        c.attr(label="Lane B: QA + Governance", color="#90CDF4", style="rounded")
        c.node("b1", "B1 Run validation suite\n(slug uniqueness, category-spec coverage, image reachability)", shape="box")
        c.node("g3", "G3 Validation passed?", shape="diamond", fillcolor="#FEFCBF", color="#B7791F")
        c.node("b2", "B2 Defect triage + mapping rule patch", shape="box", fillcolor="#FFF5F5")
        c.node("b3", "B3 Change approval checkpoint", shape="box", fillcolor="#EBF8FF")
        c.node("g4", "G4 Approved for cutover?", shape="diamond", fillcolor="#FEFCBF", color="#B7791F")

    with g.subgraph(name="cluster_lane_dba") as c:
        c.attr(label="Lane C: Database Operations", color="#90CDF4", style="rounded")
        c.node("c1", "C1 Begin transaction window", shape="box", fillcolor="#E6FFFA")
        c.node("c2", "C2 Upsert categories", shape="box")
        c.node("c3", "C3 Upsert product core", shape="box")
        c.node("c4", "C4 Upsert specs + metadata", shape="box")
        c.node("c5", "C5 Upsert media + ordering", shape="box")
        c.node("g5", "G5 Transaction successful?", shape="diamond", fillcolor="#FEFCBF", color="#B7791F")
        c.node("c6", "C6 Commit transaction", shape="box", fillcolor="#E6FFFA")
        c.node("c7", "C7 Rollback transaction", shape="box", fillcolor="#FFF5F5", color="#C53030")

    with g.subgraph(name="cluster_lane_post") as c:
        c.attr(label="Lane D: Post-Cutover Control", color="#90CDF4", style="rounded")
        c.node("d1", "D1 Run full product-page smoke audit", shape="box")
        c.node("g6", "G6 Post-cutover audit clean?", shape="diamond", fillcolor="#FEFCBF", color="#B7791F")
        c.node("d2", "D2 Publish report + lock snapshot", shape="box", fillcolor="#E6FFFA")
        c.node("d3", "D3 Revert to backup snapshot", shape="box", fillcolor="#FFF5F5", color="#C53030")

    if show_client_choices:
        with g.subgraph(name="cluster_lane_client") as c:
            c.attr(label="Lane E: Client Choices", color="#90CDF4", style="rounded")
            c.node(
                "e1",
                "E1 Client choice: slug policy\n(canonical-only / alias-redirect / keep-legacy)\n[planning only]",
                shape="parallelogram",
                fillcolor="#FFFBEB",
                color="#B7791F",
            )
            c.node(
                "e2",
                "E2 Client choice: spec strictness per category\n(strict / standard / lenient)\n[planning only]",
                shape="parallelogram",
                fillcolor="#FFFBEB",
                color="#B7791F",
            )
            c.node(
                "e3",
                "E3 Client choice: go/no-go preference\n[planning only]",
                shape="parallelogram",
                fillcolor="#FFFBEB",
                color="#B7791F",
            )

    g.edge("start", "a1")
    g.edge("start", "a2")
    g.edge("a1", "a3")
    g.edge("a2", "a3")
    g.edge("a3", "a3b")
    g.edge("a3b", "g1b")
    if show_client_choices:
        g.edge("e1", "g1b", label="advisory", style="dashed", color="#B7791F")
    g.edge("g1b", "a3c", label="Yes")
    g.edge("g1b", "g1", label="No")
    g.edge("a3c", "g1")
    g.edge("g1", "a4", label="Yes")
    g.edge("g1", "g2", label="No")
    g.edge("a4", "g2")
    g.edge("g2", "a6", label="Yes")
    g.edge("g2", "a5", label="No")
    g.edge("a6", "a7")
    g.edge("a7", "g2b")
    g.edge("g2b", "a8", label="Yes")
    g.edge("g2b", "a5", label="No")
    g.edge("a5", "a3", label="loop")

    g.edge("a8", "b1")
    if show_client_choices:
        g.edge("e2", "b1", label="advisory", style="dashed", color="#B7791F")
    g.edge("b1", "g3")
    g.edge("g3", "b3", label="Yes")
    g.edge("g3", "b2", label="No")
    g.edge("b2", "a3", label="rework")
    g.edge("b3", "g4")
    if show_client_choices:
        g.edge("e3", "g4", label="advisory", style="dashed", color="#B7791F")
    g.edge("g4", "c1", label="Yes")
    g.edge("g4", "end_fail", label="No")

    g.edge("c1", "c2")
    g.edge("c2", "c3")
    g.edge("c3", "c4")
    g.edge("c4", "c5")
    g.edge("c5", "g5")
    g.edge("g5", "c6", label="Yes")
    g.edge("g5", "c7", label="No")
    g.edge("c7", "end_fail")

    g.edge("c6", "d1")
    g.edge("d1", "g6")
    g.edge("g6", "d2", label="Yes")
    g.edge("g6", "d3", label="No")
    g.edge("d3", "end_fail")
    g.edge("d2", "end_ok")

    add_legend(g, "to_be", include_client_choice=show_client_choices)
    return g


def render_chart(graph: Digraph, name: str) -> tuple[Path, Path]:
    source = OUT_DIR / f"{name}.dot"
    source.write_text(graph.source, encoding="utf-8")
    dot_exe = Path("C:/Program Files/Graphviz/bin/dot.exe")
    if not dot_exe.exists():
        raise FileNotFoundError(f"Graphviz dot executable not found: {dot_exe}")
    os.environ["GRAPHVIZ_DOT"] = str(dot_exe)

    svg_path = OUT_DIR / f"{name}.svg"
    png_path = OUT_DIR / f"{name}.png"
    subprocess.run(
        [str(dot_exe), "-Tsvg", str(source), "-o", str(svg_path)],
        check=True,
    )
    subprocess.run(
        [str(dot_exe), "-Tpng", str(source), "-o", str(png_path)],
        check=True,
    )
    source.unlink(missing_ok=True)
    return svg_path, png_path


def parse_bool(value: str) -> bool:
    normalized = value.strip().lower()
    if normalized in {"1", "true", "yes", "y", "on"}:
        return True
    if normalized in {"0", "false", "no", "n", "off"}:
        return False
    raise argparse.ArgumentTypeError("Expected true/false")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate industry-standard mapping charts")
    parser.add_argument(
        "--show-client-choices",
        type=parse_bool,
        default=True,
        help="Include advisory Lane E client choices (true/false). Default: true",
    )
    args = parser.parse_args()

    as_is = build_as_is_chart()
    to_be = build_to_be_chart(show_client_choices=args.show_client_choices)
    as_is_svg, as_is_png = render_chart(as_is, "as_is_dfd")
    to_be_name = "to_be_bpmn_choices_on" if args.show_client_choices else "to_be_bpmn_choices_off"
    to_be_svg, to_be_png = render_chart(to_be, to_be_name)
    canonical_svg = OUT_DIR / "to_be_bpmn.svg"
    canonical_png = OUT_DIR / "to_be_bpmn.png"
    canonical_svg.write_text(to_be_svg.read_text(encoding="utf-8"), encoding="utf-8")
    canonical_png.write_bytes(to_be_png.read_bytes())

    print(str(as_is_svg))
    print(str(as_is_png))
    print(str(to_be_svg))
    print(str(to_be_png))
    print(str(canonical_svg))
    print(str(canonical_png))


if __name__ == "__main__":
    main()

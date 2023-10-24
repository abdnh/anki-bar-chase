from __future__ import annotations

import os
import sys
from typing import Any, Sequence

from anki import hooks
from anki.collection import Collection
from anki.notes import NoteId
from aqt import gui_hooks, mw
from aqt.qt import *
from aqt.reviewer import Reviewer
from aqt.webview import WebContent

sys.path.append(os.path.join(os.path.dirname(__file__), "vendor"))

from .config import config
from .consts import consts

BAR_HTML = (
    """

<div id='counter-bar'>
<div class="progress"></div>
<p class="counter item">1</p>
<p class="countdown item">0:04</p>
</div>
<script>
globalThis.counterBar = new CounterBar();
globalThis.counterBar.setCountDown(%d);
</script>
"""
    % config["countdown_seconds"]
)


def on_reviewer_card_action(*args: Any, **kwargs: Any) -> None:
    mw.reviewer.web.eval(
        "globalThis.counterBar.setCounter(globalThis.counterBar.counter + 1);"
    )


def on_notes_will_be_deleted(col: Collection, note_ids: Sequence[NoteId]) -> None:
    if mw.reviewer.card.nid in note_ids:
        mw.taskman.run_on_main(on_reviewer_card_action)


def add_bar_to_reviewer(web_content: WebContent, context: object | None) -> None:
    if not isinstance(context, Reviewer):
        return
    web_base = f"/_addons/{consts.module}/web"
    web_content.body = BAR_HTML + web_content.body
    web_content.css.append(f"{web_base}/counter_bar.css")
    web_content.js.append(f"{web_base}/counter_bar.js")


gui_hooks.webview_will_set_content.append(add_bar_to_reviewer)
mw.addonManager.setWebExports(__name__, r"web/.*")

gui_hooks.reviewer_did_answer_card.append(on_reviewer_card_action)
gui_hooks.reviewer_will_bury_card.append(on_reviewer_card_action)
gui_hooks.reviewer_will_bury_note.append(on_reviewer_card_action)
gui_hooks.reviewer_will_suspend_card.append(on_reviewer_card_action)
gui_hooks.reviewer_will_suspend_note.append(on_reviewer_card_action)
hooks.notes_will_be_deleted.append(on_notes_will_be_deleted)

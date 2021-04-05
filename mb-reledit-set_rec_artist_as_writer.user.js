/* global $ MB relEditor requests server */
'use strict';
// ==UserScript==
// @name         MusicBrainz relation editor: Set writer relation from recording artist
// @namespace    mbz-loujine
// @author       loujine
// @version      2021.4.5
// @downloadURL  https://raw.githubusercontent.com/loujine/musicbrainz-scripts/set_writer/mb-reledit-set_rec_artist_as_writer.user.js
// @updateURL    https://raw.githubusercontent.com/loujine/musicbrainz-scripts/set_writer/mb-reledit-set_rec_artist_as_writer.user.js
// @supportURL   https://github.com/loujine/musicbrainz-scripts
// @icon         https://raw.githubusercontent.com/loujine/musicbrainz-scripts/master/icon.png
// @description  musicbrainz.org relation editor: Set writer relation from recording artist
// @compatible   firefox+tampermonkey
// @license      MIT
// @require      https://raw.githubusercontent.com/loujine/musicbrainz-scripts/master/mbz-loujine-common.js
// @include      http*://*musicbrainz.org/release/*/edit-relationships
// @grant        none
// @run-at       document-end
// ==/UserScript==

function setWriter(workRels, artistCreditNames) {
    const vm = MB.releaseRelationshipEditor;
    artistCreditNames.map(credit => {
        workRels.map(rel => {
            const work = rel.entities()[1];
            const dialog = new MB.relationshipEditor.UI.AddDialog({
                viewModel: vm,
                source: work,
                target: credit.artist,
            });
            dialog.accept();
        });
    });
}

function applyWriter() {
    let idx = 0;

    MB.relationshipEditor.UI.checkedRecordings().forEach(rec => {
        setTimeout(function () {
            requests.GET(`/ws/js/entity/${rec.gid}`, resp => {
                setWriter(rec.performances(), JSON.parse(resp).artistCredit.names);
            });
        }, idx * server.timeout);
        idx += 1;
    });
}

(function displayToolbar() {
    relEditor.container(document.querySelector('div.tabs'))
             .insertAdjacentHTML('beforeend', `
        <h3>
          <span>
            Set writer on selected recordings
          </span>
        </h3>
        <div>
          <input type="button" id="setWriter" value="Apply">
        </div>
    `);
})();

$(document).ready(function () {
    let appliedNote = false;
    document.getElementById('setWriter').addEventListener('click', () => {
        applyWriter();
        if (!appliedNote) {
            relEditor.editNote(GM_info.script);
            appliedNote = true;
        }
    });
    return false;
});

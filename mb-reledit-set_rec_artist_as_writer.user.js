/* global $ MB relEditor */
'use strict';
// ==UserScript==
// @name         MusicBrainz relation editor: Set writer relation from recording artist
// @namespace    mbz-loujine
// @author       loujine
// @version      2021.4.4
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

function setWriter() {
    const selectedRecordings = MB.relationshipEditor.UI.checkedRecordings();
    const vm = MB.releaseRelationshipEditor;

    selectedRecordings.map(rec => {
        rec.artistCredit.names.map(credit => {
            rec.relationships().filter(
                rel => rel.entityTypes === 'recording-work'
            ).map(rel => {
                const work = rel.entities()[1];
                console.log(work);
                const dialog = new MB.relationshipEditor.UI.AddDialog({
                    viewModel: vm,
                    source: work,
                    target: credit.artist,
                });
                dialog.accept();
            });
        });
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
        setWriter();
        if (!appliedNote) {
            relEditor.editNote(GM_info.script);
            appliedNote = true;
        }
    });
    return false;
});

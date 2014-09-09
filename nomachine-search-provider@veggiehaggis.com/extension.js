/* Putty Search Provider for Gnome Shell
 *
 * Copyright (c) 2014 Graham Clark
 *
 * Heavily based on ssh-search-provider@gnome-shell-extensions.brot.github.com
 *
 * This programm is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This programm is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const Main = imports.ui.main;
const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const St = imports.gi.St;
const Util = imports.misc.util;
const IconGrid = imports.ui.iconGrid;

//
// puttySearchProvider holds the instance of the search provider
// implementation. If null, the extension is either uninitialized
// or has been disabled via disable().
//
var puttySearchProvider = null;

const PuttySearchIconBin = new Lang.Class({
    Name: 'PuttySearchIconBin',

    _init: function(name) {
        this.actor = new St.Bin({ reactive: true, track_hover: true });
        this.icon = new IconGrid.BaseIcon(name,
                                          { showLabel: true,
                                            createIcon: Lang.bind(this, this.createIcon)});
        this.actor.child = this.icon.actor;
        this.actor.label_actor = this.icon.label;
    },

    createIcon: function(size) {
        let box = new Clutter.Box();
        let icon = new St.Icon({ icon_name: 'putty', icon_size: size });
        box.add_child(icon);
        return box;
    }
});

function PuttySearchProvider() {
    this._init();
}

PuttySearchProvider.prototype = {

    _init: function(name) {
        this.configHosts = [];
        let filename = GLib.build_filenamev([GLib.get_home_dir(), '/.putty/', 'sessions']);
        this.configDir = Gio.file_new_for_path(filename);
        this.sessionsMonitor = this.configDir.monitor_directory(Gio.FileMonitorFlags.NONE, null);
        this.sessionsMonitor.connect('changed', Lang.bind(this, this._onSessionsChanged));
        this._onSessionsChanged(null, this.configDir, null, Gio.FileMonitorEvent.CREATED);
    },

    _onSessionsChanged: function(filemonitor, dir, other_file, event_type) {
        this.configHosts = [];
        if (this.configDir.query_exists (null)) {
	    let enumerator = this.configDir.enumerate_children('standard::name,standard::type',
							       Gio.FileQueryInfoFlags.NONE, null);
	    let file_info;
            while ((file_info = enumerator.next_file (null)) != null) {
		if (file_info.get_name() != "Default%20Settings") {
		    this.configHosts.push(file_info.get_name());
		}
            }
	}
    },

    createResultObject: function(result, terms) {
        let icon = new PuttySearchIconBin(result.name);
        return icon;
    },

    getResultMetas: function(resultIds, callback) {
        let metas = resultIds.map(this.getResultMeta, this);
        callback(metas);
    },

    getResultMeta: function(resultId) {
	return { 'id': resultId, 'name': resultId };
    },

    activateResult: function(id) {
        let cmd = ["putty", "-load"];
	cmd.push(id);
        Util.spawn(cmd);
    },

    _checkHostnames: function(hostnames, terms) {
        let searchResults = [];
        for (let i=0; i<hostnames.length; i++) {
            for (let j=0; j<terms.length; j++) {
		if (hostnames[i].indexOf(terms[j]) != -1) {
		    searchResults.push(hostnames[i]);
		}
            }
        }
        return searchResults;
    },

    _getResultSet: function(sessions, terms) {
        let results = this._checkHostnames(this.configHosts, terms);
        this.searchSystem.setResults(this, results);
    },

    getInitialResultSet: function(terms) {
        return this._getResultSet(this._sessions, terms);
    },

    getSubsearchResultSet: function(previousResults, terms) {
        return this._getResultSet(this._sessions, terms);
    },

    filterResults: function (results, max) {
        return results.slice(0, max);
    }

};

function init(meta) {
}

function enable() {
    if (!puttySearchProvider) {
        puttySearchProvider = new PuttySearchProvider();
        Main.overview.addSearchProvider(puttySearchProvider);
    }
}

function disable() {
    if  (puttySearchProvider) {
        Main.overview.removeSearchProvider(puttySearchProvider);
        puttySearchProvider.sessionsMonitor.cancel();
        puttySearchProvider = null;
    }
}

//======================================================================
// Local Variables:
// js-indent-level: 4
// indent-tabs-mode: nil
// End:

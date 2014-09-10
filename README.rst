NoMachine Search Provider for Gnome Shell
=========================================

Load your NoMachine (NX) sessions from the Gnome Shell overview:
 
.. image:: https://dl.dropboxusercontent.com/u/2039645/nomachine-search-provider.png

This is a blatant copy of my earlier Putty search provider, which itself was heavily based this on the SSH Search Provider extension by Bernd
Schlapsi. You might also use the `Remmina search provider <https://extensions.gnome.org/extension/473/remmina-search-provider/>`_ if you use the NX
plugin.


Requirements
------------

I'm running Ubuntu 14.04, and I can only vouch for Gnome Shell 3.10. 


Installation
------------

This extension is pending review at http://extensions.gnome.org. Until/unless it's accepted, here's how to use it:

#. Clone the repository.
#. Symlink the ``nomachine-search-provider@veggiehaggis.com`` directory from ``~/.local/share/gnome-shell/extensions/``.
#. Activate the extension using the ``gnome-tweak-tool``.
#. Restart the Gnome Shell e.g. Alt-F2 r <enter>


Info
----

:Author:   Graham Clark <grclark@gmail.com>
:License:  GPL v3
:Version:  1

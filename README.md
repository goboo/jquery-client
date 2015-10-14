[![GoBoo - GET IT. BOOK IT.](http://goboo.de/logo/200-gray.png)](http://goboo.de)

jQuery Client
=============

This is a [GoBoo](http://goboo.de) Client written in jQuery/JavaScript.

Installation
------------

### with bower

```bash
$ bower install goboo-jquery-client
```

### manually

Download the current [repository archive](https://github.com/goboo/jquery-client/archive/master.zip).

:heavy_exclamation_mark: You also need a copy of our [goboo-js-adapter](https://github.com/goboo/js-adapter/archive/master.zip)!

Integration
-----------

Include the following files, depending on your needs.

### with bower

- Javascripts
  - `bower_components/jquery/dist/jquery.min.js`
  - `bower_components/jquery-ui/jquery-ui.min.js`
  - `bower_components/date-w3c-format/Date.toW3CString.min.js`
  - `bower_components/goboo-js-adapter/dist/javascripts/goboo-adapter.js`
  - `bower_components/goboo-jquery-client/third-party/jquery.formatDateTime.js`
  - `bower_components/goboo-jquery-client/third-party/tag-it.js`
  - `bower_components/goboo-jquery-client/dist/javascripts/jquery.goboo-client.js`

- Stylesheets
  - `bower_components/jquery-ui/themes/base/jquery-ui.min.css`
  - `bower_components/goboo-jquery-client/third-party/tagit.ui-zendesk.css`
  - `bower_components/goboo-jquery-client/dist/stylesheets/jquery.goboo-client.css`

### without bower

- JavaScripts
  - `assets/goboo-js-adapter/dist/javascripts/goboo-adapter.with-deps.js`, included dependencies:
    - [Date.toW3CString](https://github.com/bit3/date-w3c-format)
  - `assets/goboo-jquery-client/dist/javascripts/jquery.goboo-client.with-deps.js`, included dependencies:
    - [jquery](https://jquery.org/)
    - [jqueryui](http://jqueryui.com/)
    - [jquery.formatDateTime](https://github.com/agschwender/jquery.formatDateTime)
    - [jquery.tag-it](http://aehlke.github.io/tag-it/)

- Stylesheets
  - `assets/goboo-jquery-client/dist/stylesheets/jquery.goboo-client.with-deps.css`, included dependencies:
    - [jqueryui](http://jqueryui.com/)
    - [jquery.tag-it](http://aehlke.github.io/tag-it/)


Markup
------

For a markup example, see the [demo files](dist/demo). For a running example see [goboo.github.io/jquery-client](http://goboo.github.io/jquery-client/).

Customisation
-------------

For customisation include the [scss source](sources/stylesheets) into you build chain.
You can find a list of all available variables in the [jquery.goboo-client.scss](sources/stylesheets/jquery.goboo-client.scss).

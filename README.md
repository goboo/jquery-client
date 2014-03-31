[![GoBoo - GET IT. BOOK IT.](http://goboo.de/logo/200-gray.png)](http://goboo.de)

jQuery Client
=============

This is a [GoBoo](http://goboo.de) Client written in jQuery/JavaScript.

Installation
------------

Download the [jquery.goboo-client.js](dist/jquery.goboo-client.js) or the minified
[jquery.goboo-client.min.js](dist/jquery.goboo-client.min.js), the
[jquery.goboo-client.css](dist/jquery.goboo-client.css) or the minified
[jquery.goboo-client.min.css](dist/jquery.goboo-client.min.css)
and put them somewhere into your project.

Also download the [jquery.goboo-client.deps.js](dist/jquery.goboo-client.deps.jss) or the minified
[jquery.goboo-client.deps.min.js](dist/jquery.goboo-client.deps.min.js), the
[jquery.goboo-client.deps.css](dist/jquery.goboo-client.deps.css) or the minified
[jquery.goboo-client.deps.min.css](dist/jquery.goboo-client.deps.min.css)
and put them somewhere into your project.

For a basic markup, see the [html examples](html).

Then add the following to your HTML:

```html
<link rel="stylesheet" type="text/css" href="jquery.goboo-client.deps.css">
<link rel="stylesheet" type="text/css" href="jquery.goboo-client.css">

<script src="path/to/jquery.goboo-client.deps.js"></script>
<script src="path/to/jquery.goboo-client.js"></script>

<!-- initialize the calendar -->
<script>$('#goboo_calendar').gobooCalendar();</script>

<!-- initialize the slot details -->
<script>$('#goboo_slot_details').gobooSlotDetails();</script>

<!-- initialize the booking mask -->
<script>$('#goboo_booking').gobooBookingMask();</script>
```

Customisation
-------------

For customisation manipulate write your own variable values into the [customer.scss](src/css/customer.scss),
You can find a list of all available variables in the [variables.scss](src/css/variables.scss).

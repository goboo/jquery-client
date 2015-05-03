/*
 * GoBoo - GET IT. BOOK IT. [http://goboo.de]
 *
 * (c) Tristan Lins <t.lins@goboo.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * jquery client for {@link http://goboo.de goboo - GET IT. BOOK IT}
 *
 * online booking system by karo media
 *
 * @module goboo/Client/jQuery
 * @copyright 2014 {@link mailto:t.lins@goboo.de Tristan Lins}
 * @license {@link http://opensource.org/licenses/MIT MIT}
 * @author Tristan Lins <t.lins@goboo.de>
 * @link http://goboo.de
 */

(function ($) {
    "use strict";

    $.gobooBookingMask = {};
    $.gobooBookingMask.defaultOptions = {
        /** id of room */
        'room': '',
        /** id of slot */
        'slot': '',

        'bookingMask': false,

        /**
         * define how successors can be selected,
         *
         * false          - disable successors selection (you need to remove the HTML from the template)
         * 'subsequent'   - only select subsequent slots (radio)
         * 'undetermined' - the successors are free to choose (checkbox)
         */
        'successorsSelectionMode': 'subsequent',
        /**
         * Label for the "no more slots" selection in "subsequent" selection mode.
         */
        'successorNoSelectionLabel': '-',

        /** start datetime format */
        'startDateTimeFormat': 'dd. MM \'\'y hh:ii',
        /** end datetime format */
        'endDateTimeFormat': '',
        /** datetime format */
        'timeFormat': '{start} - {duration}',
        /** duration datetime format */
        'durationDateTimeFormat': 'hh:ii',
        /** play time datetime format */
        'playTimeDateTimeFormat': 'hh:ii',
        /** successor datetime format */
        'successorDateTimeFormat': 'hh:ii',

        /** selector to id container */
        'idSelector': '[data-goboo="id"]',
        /** selector to start datetime container */
        'startDateTimeSelector': '[data-goboo="start-datetime"]',
        /** selector to end datetime container */
        'endDateTimeSelector': '[data-goboo="end-datetime"]',
        /** selector to playTime container */
        'durationSelector': '[data-goboo="duration"]',
        /** selector to play time container */
        'playTimeSelector': '[data-goboo="play-time"]',
        /** selector to capacity container */
        'capacitySelector': '[data-goboo="capacity"]',
        /** selector to attendance container */
        'attendanceSelector': '[data-goboo="attendance"]',
        /** selector to availableModes container */
        'modesSelector': '[data-goboo="modes"]',

        /** selector to time container */
        'timeSelector': '[data-goboo="time"]',
        /** selector to duration datetime container */
        'durationDateTimeSelector': '[data-goboo="duration-datetime"]',
        /** selector to play time datetime container */
        'playTimeDateTimeSelector': '[data-goboo="play-time-datetime"]',

        /** selector to form element */
        'formInputSelector': 'form',
        /** selector to name input element */
        'nameInputSelector': 'input[name="name"]',
        /** selector to mobile input element */
        'mobileInputSelector': 'input[name="mobile"]',
        /** selector to email input element */
        'emailInputSelector': 'input[name="email"]',
        /** selector to street input element */
        'streetInputSelector': 'input[name="street"]',
        /** selector to postcode input element */
        'postcodeInputSelector': 'input[name="postcode"]',
        /** selector to city input element */
        'cityInputSelector': 'input[name="city"]',
        /** selector to mode vote input element */
        'modeInputSelector': '.goboo_game_mode_vote',
        /** selector to player count input element */
        'playerCountInputSelector': 'select[name="player_count"]',
        /** selector to players input element */
        'playersInputSelector': '#goboo_players',
        /** selector to exclusive input element */
        'exclusiveInputSelector': 'input[name="exclusive"]',
        /** selector to successors loader element */
        'successorsLoaderActionSelector': '.goboo_booking_successors_loader',
        /** selector to successors selection container element */
        'successorsContainerInputSelector': '.goboo_booking_successors_selection',
        /** selector to notes input element */
        'notesInputSelector': 'input[name="notes"],textarea[name="notes"]',

        /** selector to book action button element */
        'bookActionSelector': '.goboo_book_action',

        'idFormatter': function(id, slot, options) {
            return id;
        },
        'startDateTimeFormatter': function(startDateTime, slot, options) {
            return $.formatDateTime(options.startDateTimeFormat, startDateTime);
        },
        'endDateTimeFormatter': function(endDateTime, slot, options) {
            return $.formatDateTime(options.endDateTimeFormat, endDateTime);
        },
        'durationFormatter': function(duration, slot, options) {
            return Math.round(duration);
        },
        'playTimeFormatter': function(playTime, slot, options) {
            return Math.round(playTime);
        },
        'capacityFormatter': function(capacity, slot, options) {
            return capacity;
        },
        'attendanceFormatter': function(attendance, slot, options) {
            return attendance;
        },
        'modesFormatter': function(modes, slot, options) {
            var elements = [];

            var maxVotes = 0;
            $.each(modes, function(token, mode) {
                if ((mode.getMinAttendance() === null || slot.getAttendance() >= mode.getMinAttendance()) &&
                    (mode.getMaxAttendance() === null || slot.getAttendance() <= mode.getMaxAttendance())) {
                    maxVotes = Math.max(mode.getVotes(), maxVotes);
                }
            });
            $.each(modes, function(token, mode) {
                var abbr = $('<abbr></abbr>')
                    .attr('title', mode.getDescription())
                    .attr('data-goboo-votes', mode.getVotes())
                    .text(mode.getLabel());

                if (mode.getMinAttendance() !== null && slot.getAttendance() < mode.getMinAttendance() ||
                    mode.getMaxAttendance() !== null && slot.getAttendance() > mode.getMaxAttendance()) {
                    abbr.addClass('goboo_mode_invalid');
                }
                else if (maxVotes > 0 && mode.getVotes() >= maxVotes) {
                    abbr.addClass('goboo_mode_prefered');
                }

                elements.push(abbr.get(0));
            });

            return elements;
        },
        'timeFormatter': function(slot, options) {
            return options.patternFormatter(options.timeFormat, slot, options);
        },
        'durationDateTimeFormatter': function(duration, slot, options) {
            var hours = parseInt(duration / 60);
            var minutes = duration % 60;
            var durationDateTime = new Date();
            durationDateTime.setTime(0);
            durationDateTime.setHours(hours);
            durationDateTime.setMinutes(minutes);
            durationDateTime.setSeconds(0);
            return $.formatDateTime(options.durationDateTimeFormat, durationDateTime);
        },
        'playTimeDateTimeFormatter': function(playTime, slot, options) {
            var hours = parseInt(playTime / 60);
            var minutes = playTime % 60;
            var playTimeDateTime = new Date();
            playTimeDateTime.setTime(0);
            playTimeDateTime.setHours(hours);
            playTimeDateTime.setMinutes(minutes);
            playTimeDateTime.setSeconds(0);
            return $.formatDateTime(options.playTimeDateTimeFormat, playTimeDateTime);
        },
        'patternFormatter': function(buffer, slot, options) {
            var elements = [];
            var rgxp = /\{\w+\}/;
            var pos;
            while ((pos = buffer.search(rgxp)) !== -1) {
                var pre = buffer.substr(0, pos);
                buffer = buffer.substr(pos);

                if (pre) {
                    elements.push(document.createTextNode(pre));
                }

                pos = buffer.search('}');
                var field = buffer.substring(1, pos);
                var value = options.fieldFormatter(field, slot, options);
                if ($.isArray(value)) {
                    $.each(value, function(index, element) {
                        elements.push(element);
                    });
                }
                else {
                    elements.push(document.createTextNode(value));
                }

                buffer = buffer.substr(pos+1);
            }

            if (buffer) {
                elements.push(document.createTextNode(buffer));
            }

            return elements;
        },
        'fieldFormatter': function (field, slot, options) {
            switch (field) {
                case 'id':
                    return options.idFormatter(slot.getId(), slot, options);
                    break;
                case 'start':
                case 'startDateTime':
                    return options.startDateTimeFormatter(slot.getStartDateTime(), slot, options);
                    break;
                case 'end':
                case 'endDateTime':
                    return options.endDateTimeFormatter(slot.getEndDateTime(), slot, options);
                    break;
                case 'duration':
                    return options.durationFormatter(slot.getDuration(), slot, options);
                    break;
                case 'playTime':
                    return options.durationFormatter(slot.getPlayTime() || slot.getDuration(), slot, options);
                    break;
                case 'durationDateTime':
                    return options.durationDateTimeFormatter(slot.getDuration(), slot, options);
                    break;
                case 'playTimeDateTime':
                    return options.playTimeDateTimeFormatter(slot.getPlayTime() || slot.getDuration(), slot, options);
                    break;
                case 'capacity':
                    return options.capacityFormatter(slot.getCapacity(), slot, options);
                    break;
                case 'attendance':
                    return options.attendanceFormatter(slot.getAttendance(), slot, options);
                    break;
                case 'modes':
                case 'availableModes':
                    return options.modesFormatter(slot.getAvailableModes(), slot, options);
                    break;
                default:
                    var formatter = field + 'Formatter';
                    if (options[formatter]) {
                        return options[formatter](slot, options);
                    }
                    throw "Could not format slot field " + field + ", no formatter available!";
            }
        },

        'preRender': function() {
        },
        'postRender': function() {
            var players = this.container.find('.goboo_players');

            if (players.size()) {
                var classes = "" + players.prop('class');
                classes = classes.replace(/goboo_players_count_\d+/, '');
                classes = classes.replace(/goboo_players_\d+/, '');
                players.prop('class', classes);
                players
                    .addClass('goboo_players_count_' + this.currentSlot.getCapacity())
                    .addClass('goboo_players_' + (1 + this.currentSlot.getAttendance()));

                players.find('*[data-goboo="attendance"]').text(1 + this.currentSlot.getAttendance());
            }
        },
        'renderForm': function(slot, callback) {
            var selector = this.options.formInputSelector;
            callback(this.container.find(selector));
        },
        'renderNameInput': function(slot, callback) {
            var selector = this.options.nameInputSelector;
            callback(this.container.find(selector));
        },
        'renderMobileInput': function(slot, callback) {
            var selector = this.options.mobileInputSelector;
            callback(this.container.find(selector));
        },
        'renderEmailInput': function(slot, callback) {
            var selector = this.options.emailInputSelector;
            callback(this.container.find(selector));
        },
        'renderStreetInput': function(slot, callback) {
            var selector = this.options.streetInputSelector;
            callback(this.container.find(selector));
        },
        'renderPostcodeInput': function(slot, callback) {
            var selector = this.options.postcodeInputSelector;
            callback(this.container.find(selector));
        },
        'renderCityInput': function(slot, callback) {
            var selector = this.options.cityInputSelector;
            callback(this.container.find(selector));
        },
        'renderModeInput': function(slot, callback) {
            if (this.currentSlot.getAvailableModes().length) {
                this.container.removeClass('goboo_no_modes');

                if (!this.modeVoteDummy) {
                    var selector = this.options.modeInputSelector;
                    this.modeVoteDummy = this.container.find(selector);
                    this.modeVoteContainer = this.modeVoteDummy.parent();
                    this.modeVoteDummy.detach();
                }

                if (this.modeVoteDummy) {
                    this.modeVoteContainer.empty();

                    var modes = this.currentSlot.getAvailableModes();
                    var elements = [];
                    $.each(modes, $.proxy(function(index, mode) {
                        var element = this.modeVoteDummy.clone();
                        element.find('input').val(mode.getToken());
                        element.append(' ').append(mode.getDescription());
                        elements.push(element.get(0));
                    }, this));
                }

                this.modeVoteContainer.append(elements);

                callback($(elements));
            }
            else {
                this.container.addClass('goboo_no_modes');
                callback($());
            }
        },
        'renderPlayerCountInput': function(slot, callback) {
            var selector = this.options.playerCountInputSelector;
            var select = this.container.find(selector);

            select.empty();
            for (var count = 1; count <= (slot.getCapacity() - slot.getAttendance()); count ++) {
                select.append($('<option></option>').val(count).text(count + ' Spieler'));
            }

            callback(select);
        },
        'renderPlayersInput': function(slot, callback) {
            var playerCountSelector = this.options.playerCountInputSelector;
            var playerCountInput    = this.container.find(playerCountSelector);

            var playersSelector = this.options.playersInputSelector;
            var playersList     = this.container.find(playersSelector);

            playersList = playersList
                .clone(false, false)
                .replaceAll(playersList);

            playersList.empty();
            playersList.tagit({
                placeholderText: 'Nickname...',
                beforeTagAdded: function(event, ui) {
                    var tags     = playersList.tagit("assignedTags");
                    var tagCount = tags.length;

                    return (slot.getCapacity() - slot.getAttendance()) > tagCount;
                },
                afterTagAdded: function(event, ui) {
                    var tags     = playersList.tagit("assignedTags");
                    var tagCount = tags.length;

                    if (playerCountInput.val() < tagCount) {
                        playerCountInput.val(tagCount).change();
                    }
                }
            });

            callback(playersList);
        },
        'renderExclusiveInput': function(slot, callback) {
            var selector = this.options.playerCountInputSelector;
            var select = this.container.find(selector);

            selector = this.options.exclusiveInputSelector;
            var input = this.container.find(selector);

            if (slot.getAttendance() > 0) {
                input.prop('disabled', true);
            }
            else {
                var self = this;

                input.prop('disabled', false);
                input.off('change').change(function() {
                    if (input.prop('checked')) {
                        var players = self.container.find('.goboo_players');

                        if (players.size()) {
                            var classes = "" + players.prop('class');
                            classes = classes.replace(/goboo_players_count_\d+/, '');
                            classes = classes.replace(/goboo_players_\d+/, '');
                            players.prop('class', classes);
                            players
                                .addClass('goboo_players_count_' + slot.getCapacity())
                                .addClass('goboo_players_' + slot.getCapacity());

                            players.find('*[data-goboo="attendance"]').text(slot.getCapacity());
                        }


                        select.prop('disabled', true);
                    }
                    else {
                        select.prop('disabled', false);
                        select.change();
                    }
                });
            }

            input.prop('checked', false);

            callback(input);
        },
        'renderSuccessorsInput': function(slot, callback) {
            if (!this.options.successorsSelectionMode) {
                callback(false);
                return;
            }

            var self = this;

            var loaderSelector = this.options.successorsLoaderActionSelector;
            var loaderContainer = this.container.find(loaderSelector);

            var selectionContainerSelector = this.options.successorsContainerInputSelector;
            var selectionContainer = this.container.find(selectionContainerSelector);

            loaderContainer.show();
            selectionContainer.empty().hide();
            goboo.env.adapter.listSlotSuccessors(slot, false, function(slots) {
                var inputs = $();

                if (self.options.successorsSelectionMode == 'subsequent') {
                    var input = $('<input>')
                        .attr('type', 'radio')
                        .attr('name', 'successors')
                        .prop('checked', true);

                    var label = $('<label></label>');
                    label
                        .append(input)
                        .append(' ')
                        .append(self.options.successorNoSelectionLabel);

                    var row = $('<div class="goboo_radio"></div>')
                    row.append(label);

                    selectionContainer.append(row);
                }

                for (var index in slots) {
                    var slot = slots[index];

                    var input = $('<input>');

                    if (self.options.successorsSelectionMode == 'undetermined') {
                        input.attr('type', 'checkbox');
                    }
                    else if (self.options.successorsSelectionMode == 'subsequent') {
                        input.attr('type', 'radio');
                    }
                    else {
                        throw 'Unsupported successors selection mode: ' + self.options.successorsSelectionMode;
                    }

                    input.data('slot', slot);
                    input.attr('name', 'successors');
                    input.val(slot.getId());
                    inputs.push(input);

                    var label = $('<label></label>');
                    label
                        .append(input)
                        .append(' ')
                        .append($.formatDateTime(self.options.successorDateTimeFormat, slot.getStartDateTime()));

                    var row = $('<div class="goboo_radio"></div>')
                    row.append(label);

                    selectionContainer.append(row);
                }

                loaderContainer.hide();
                selectionContainer.show();

                callback(inputs);
            });
        },
        'renderNotesInput': function(slot, callback) {
            var selector = this.options.notesInputSelector;
            callback(this.container.find(selector));
        },
        'renderBookAction': function(slot, callback) {
            var selector = this.options.bookActionSelector;
            var button = this.container.find(selector);

            if (slot.getAttendance() >= slot.getCapacity()) {
                button.addClass('disabled');
            }
            else {
                button.removeClass('disabled');
            }

            callback(button);
        },
        'render': function() {
            var self = this;
            var slot = self.currentSlot;
            self.options.preRender.call(self);

            var selectors = {};
            var selectorRegexp = /^(\w+)Selector$/;
            var skipRegexp = /(Input|Action)$/;
            $.each(self.options, function(key, value) {
                var match = selectorRegexp.exec(key);
                if (match && !skipRegexp.test(match[1])) {
                    selectors[match[1]] = value;
                }
            });
            $.each(selectors, function(field, selector) {
                var elements = self.container.find(selector);
                if (elements.length) {
                    var value = self.options.fieldFormatter(field, slot, self.options);

                    elements
                        .empty()
                        .append(value);
                }
            });

            var nameInput = null;
            var mobileInput = null;
            var emailInput = null;
            var streetInput = null;
            var postcodeInput = null;
            var cityInput = null;
            var modeInput = null;
            var playerCountInput = null;
            var playersInput = null;
            var exclusiveInput = null;
            var notesInput = null;
            var successorsInputs = null;
            var bookAction = null;

            var activateForm = function() {
                if (
                    nameInput !== null &&
                    mobileInput !== null &&
                    emailInput !== null &&
                    streetInput !== null &&
                    postcodeInput !== null &&
                    cityInput !== null &&
                    modeInput !== null &&
                    playerCountInput !== null &&
                    playersInput !== null &&
                    exclusiveInput !== null &&
                    notesInput !== null &&
                    successorsInputs !== null &&
                    bookAction !== null
                ) {
                    bookAction.prop('disabled', false);
                }
            };

            self.options.renderNameInput.call(self, slot, function(renderedNameInput) {
                nameInput = renderedNameInput;
                activateForm();
            });
            self.options.renderMobileInput.call(self, slot, function(renderedMobileInput) {
                mobileInput = renderedMobileInput;
                activateForm();
            });
            self.options.renderEmailInput.call(self, slot, function(renderedEmailInput) {
                emailInput = renderedEmailInput;
                activateForm();
            });
            self.options.renderStreetInput.call(self, slot, function(renderedStreetInput) {
                streetInput = renderedStreetInput;
                activateForm();
            });
            self.options.renderPostcodeInput.call(self, slot, function(renderedPostcodeInput) {
                postcodeInput = renderedPostcodeInput;
                activateForm();
            });
            self.options.renderCityInput.call(self, slot, function(renderedCityInput) {
                cityInput = renderedCityInput;
                activateForm();
            });
            self.options.renderModeInput.call(self, slot, function(renderedModeInput) {
                modeInput = renderedModeInput;
                activateForm();
            });
            self.options.renderPlayerCountInput.call(self, slot, function(renderedPlayerCountInput) {
                playerCountInput = renderedPlayerCountInput;
                activateForm();
            });
            self.options.renderPlayersInput.call(self, slot, function(renderedPlayersInput) {
                playersInput = renderedPlayersInput;
                activateForm();
            });
            self.options.renderExclusiveInput.call(self, slot, function(renderedExclusiveInput) {
                exclusiveInput = renderedExclusiveInput;
                activateForm();
            });
            self.options.renderNotesInput.call(self, slot, function(renderedNotesInput) {
                notesInput = renderedNotesInput;
                activateForm();
            });
            self.options.renderSuccessorsInput.call(self, slot, function(renderedSuccessorsInput) {
                successorsInputs = renderedSuccessorsInput;
                activateForm();
            });
            self.options.renderBookAction.call(self, slot, function(renderedBookAction) {
                bookAction = renderedBookAction;
                bookAction.prop('disabled', true);
                activateForm();
            });

            self.options.renderForm.call(self, slot, function(form) {
                form.off('submit');
                form.submit(function(e) {
                    if (bookAction.prop('disabled')) {
                        return;
                    }

                    bookAction.prop('disabled', true);

                    e.preventDefault();

                    var booking = new goboo.Booking();

                    self.options.fetchBookingName.call(self, slot, function(name) {
                        booking.setName(name);
                    });
                    self.options.fetchBookingMobile.call(self, slot, function(mobile) {
                        booking.setMobile(mobile);
                    });
                    self.options.fetchBookingEmail.call(self, slot, function(email) {
                        booking.setEmail(email);
                    });
                    self.options.fetchBookingStreet.call(self, slot, function(street) {
                        booking.setStreet(street);
                    });
                    self.options.fetchBookingPostcode.call(self, slot, function(postcode) {
                        booking.setPostcode(postcode);
                    });
                    self.options.fetchBookingCity.call(self, slot, function(city) {
                        booking.setCity(city);
                    });
                    self.options.fetchBookingSlots.call(self, slot, function(slots) {
                        booking.setSlots(slots);
                    });
                    self.options.fetchBookingPlayerCount.call(self, slot, function(attendance) {
                        booking.setAttendance(attendance);
                    });
                    self.options.fetchBookingPlayers.call(self, slot, function(players) {
                        booking.setPlayers(players);
                    });
                    self.options.fetchBookingExclusive.call(self, slot, function(exclusive) {
                        booking.setExclusive(exclusive);
                    });
                    self.options.fetchBookingModes.call(self, slot, function(modes) {
                        booking.setPreferredModes(modes);
                    });
                    self.options.fetchBookingNotes.call(self, slot, function(notes) {
                        booking.setNotes(notes);
                    });

                    goboo.env.adapter.bookSlot(
                        booking,
                        function(response, xhr) {
                            bookAction.prop('disabled', false);
                            self.options.onSuccess.call(self, response, xhr);
                        },
                        function(error, xhr) {
                            bookAction.prop('disabled', false);
                            self.options.onFailure.call(self, error, xhr);
                        }
                    );
                });
            });

            self.options.postRender.call(self);
        },

        'fetchBookingName': function(slot, callback) {
            var selector = this.options.nameInputSelector;
            var input    = this.container.find(selector);

            callback(input.val());
        },
        'fetchBookingMobile': function(slot, callback) {
            var selector = this.options.mobileInputSelector;
            var input    = this.container.find(selector);

            callback(input.val());
        },
        'fetchBookingEmail': function(slot, callback) {
            var selector = this.options.emailInputSelector;
            var input    = this.container.find(selector);

            callback(input.val());
        },
        'fetchBookingStreet': function(slot, callback) {
            var selector = this.options.streetInputSelector;
            var input    = this.container.find(selector);

            callback(input.val());
        },
        'fetchBookingPostcode': function(slot, callback) {
            var selector = this.options.postcodeInputSelector;
            var input    = this.container.find(selector);

            callback(input.val());
        },
        'fetchBookingCity': function(slot, callback) {
            var selector = this.options.cityInputSelector;
            var input    = this.container.find(selector);

            callback(input.val());
        },
        'fetchBookingModes': function(slot, callback) {
            var selector = this.options.modeInputSelector;
            var inputs   = this.container.find(selector);

            var modes = [];
            $.each(inputs, function(index, input) {
                input = $(input);
                if (input.prop('checked')) {
                    modes.push(input.val());
                }
            });

            callback(modes);
        },
        'fetchBookingPlayerCount': function(slot, callback) {
            var selector = this.options.playerCountInputSelector;
            var input    = this.container.find(selector);

            callback(input.val());
        },
        'fetchBookingPlayers': function(slot, callback) {
            var selector = this.options.playersInputSelector;
            var element  = this.container.find(selector);
            var inputs   = element.find('input[name="tags"]');

            var players = [];
            for (var index = 0; index<inputs.size(); index++) {
                var input = $(inputs[index]);
                players.push(input.val());
            }

            callback(players);
        },
        'fetchBookingExclusive': function(slot, callback) {
            var selector = this.options.exclusiveInputSelector;
            var input    = this.container.find(selector);

            callback(input.prop('checked'));
        },
        'fetchBookingSlots': function(slot, callback) {
            var selectionContainerSelector = this.options.successorsContainerInputSelector;
            var selectionContainer         = this.container.find(selectionContainerSelector);
            var inputs                     = selectionContainer.find('input');

            var slots = [slot];

            if (this.options.successorsSelectionMode == 'subsequent') {
                for (var index = 0; index<inputs.size(); index++) {
                    var input = $(inputs[index]);
                    if (input.data('slot')) {
                        slots.push(input.data('slot'));
                    }
                    if (input.prop('checked')) {
                        break;
                    }
                }
            }
            else if (this.options.successorsSelectionMode == 'undetermined') {
                for (var index = 0; index<inputs.size(); index++) {
                    var input = $(inputs[index]);
                    if (input.prop('checked') && input.data('slot')) {
                        slots.push(input.data('slot'));
                    }
                }
            }

            callback(slots);
        },
        'fetchBookingNotes': function(slot, callback) {
            var selector = this.options.notesInputSelector;
            var input    = this.container.find(selector);

            callback(input.val());
        },

        onSuccess: function(response, xhr) {
            this.api.refresh();
            alert('Die Buchung wurde durchgeführt.');
        },

        onFailure: function (error, xhr) {
            if (error) {
                alert(error);
                return;
            }

            var json = JSON.parse(xhr.responseText);

            if (json.status == 903) {
                alert('Eine Buchung ist nicht möglich, der Zeitraum ist bereits ausgebucht.');
            }
            else if (json.status == 904) {
                alert('Eine exklusive Buchung ist nicht möglich, weil in dem Zeitraum bereits gebucht wurde.');
            }
            else if (json.status == 905) {
                alert('Bitte gib deinen Namen ein.');
                var selector = this.options.nameInputSelector;
                this.container.find(selector).focus();
            }
            else if (json.status == 906) {
                alert('Bitte gib deine Handynummer ein.');
                var selector = this.options.mobileInputSelector;
                this.container.find(selector).focus();
            }
            else if (json.status == 907) {
                alert('Bitte gib deine E-Mail ein.');
                var selector = this.options.emailInputSelector;
                this.container.find(selector).focus();
            }
            else if (json.status == 908) {
                alert('Bitte gib deine Straße ein.');
                var selector = this.options.streetInputSelector;
                this.container.find(selector).focus();
            }
            else if (json.status == 909) {
                alert('Bitte gib deine PLZ ein.');
                var selector = this.options.postcodeInputSelector;
                this.container.find(selector).focus();
            }
            else if (json.status == 910) {
                alert('Bitte gib deine Stadt ein.');
                var selector = this.options.cityInputSelector;
                this.container.find(selector).focus();
            }
            else {
                alert('Es ist ein Serverfehler aufgetreten, bitte versuche es später noch einmal.');
            }
        }
    };

    /**
     * Create a new booking mask to integrate goboo booking system.
     *
     * @memberOf jQuery
     * @access public
     * @param object options
     */
    $.fn.gobooBookingMask = function (options) {
        if (!goboo.env.adapter) {
            throw 'You need to initialize the goboo environment first!';
        }

        var element = $(this[0]);
        var templateOptions = {};
        $.each(
            {
                'room': 'room',
                'slot': 'slot',
                'bookingMask': 'booking-mask',
                'successorsSelectionMode': 'successors-selection-mode',
                'startDateTimeFormat': 'start-datetime-format',
                'endDateTimeFormat': 'end-datetime-format',
                'timeFormat': 'date-format',
                'durationDateTimeFormat': 'duration-time-format',
                'playTimeDateTimeFormat': 'play-time-format',
                'successorDateTimeFormat': 'successor-format',
                'idSelector': 'id-selector',
                'startDateTimeSelector': 'start-datetime-selector',
                'endDateTimeSelector': 'end-datetime-selector',
                'durationSelector': 'duration-selector',
                'playTimeSelector': 'play-time-selector',
                'capacitySelector': 'capacity-selector',
                'attendanceSelector': 'attendance-selector',
                'modesSelector': 'modes-selector',
                'timeSelector': 'time-selector',
                'durationDateTimeSelector': 'duration-datetime-selector',
                'playTimeDateTimeSelector': 'play-time-datetime-selector',
                'formInputSelector': 'form-input-selector',
                'nameInputSelector': 'name-input-selector',
                'mobileInputSelector': 'mobile-input-selector',
                'emailInputSelector': 'email-input-selector',
                'streetInputSelector': 'street-input-selector',
                'postcodeInputSelector': 'postcode-input-selector',
                'cityInputSelector': 'city-input-selector',
                'modeInputSelector': 'mode-input-selector',
                'playerCountInputSelector': 'player-count-input-selector',
                'playersInputSelector': 'player-players-input-selector',
                'exclusiveInputSelector': 'exclusive-input-selector',
                'successorsLoaderActionSelector': 'successors-loader-selector',
                'successorsContainerInputSelector': 'successors-selection-selector',
                'notesInputSelector': 'player-notes-input-selector',
                'bookActionSelector': 'book-action-selector'
            },
            function(option, key) {
                var value = element.data('goboo-' + key);
                if (value !== undefined && value !== null) {
                    templateOptions[option] = value;
                }
            }
        );

        options = $.extend({}, $.gobooBookingMask.defaultOptions, options || {}, templateOptions);

        new (function(container, options) {
            var self = this;
            self.container = container;
            self.options = options;
            self.currentSlot = null;
            self.api = {
                'options': options,
                'setSlot': function (slot, room) {
                    if (room !== undefined) {
                        options.room = room;
                    }
                    options.slot = slot;
                    self.loadSlot(options.slot);
                },
                'refresh': function() {
                    self.loadSlot(options.slot);
                }
            };

            self.loadSlot = function(slot) {
                if (!slot) {
                    self.options.slot = null;
                    self.currentSlot = null;
                    self.container
                        .removeClass('goboo_loading')
                        .addClass('goboo_no_slot');
                    self.container.trigger('goboo:slot-details:change-slot', null);
                }
                else if (slot instanceof goboo.Slot) {
                    self.options.slot = slot.getId();
                    self.currentSlot = slot;
                    options.render.call(self);
                    self.container
                        .removeClass('goboo_loading')
                        .removeClass('goboo_no_slot');
                    self.container.trigger('goboo:slot-details:change-slot', slot);
                }
                else {
                    self.container.addClass('goboo_loading');
                    goboo.env.adapter.getSlot(
                        self.options.room,
                        slot,
                        function(slot) {
                            self.loadSlot(slot);
                        }
                    );
                }
            };

            container.data('goboo', self.api);

            if (options.room && options.slot) {
                self.loadSlot(options.slot);
            }
            self.container.removeClass('goboo_initializing');
        })(element, options);

        return this;
    };
})(jQuery);

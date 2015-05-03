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

    $.gobooSlotDetails = {};
    $.gobooSlotDetails.defaultOptions = {
        /** id of room */
        'room': '',
        /** id of slot */
        'slot': '',

        'bookingMask': false,

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

        /** selector to id container */
        'idSelector': '[data-goboo="id"]',
        /** selector to start datetime container */
        'startDateTimeSelector': '[data-goboo="start-datetime"]',
        /** selector to end datetime container */
        'endDateTimeSelector': '[data-goboo="end-datetime"]',
        /** selector to duration container */
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

        /** selector to book action element */
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
                    return options.playTimeFormatter(slot.getPlayTime() || slot.getDuration(), slot, options);
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

        'showBookingMask': function(slot) {
            alert('You must define the showBookingMask(slot) function!');
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
                    .addClass('goboo_players_' + this.currentSlot.getAttendance());

                players.find('*[data-goboo="attendance"]').text(this.currentSlot.getAttendance());
            }
        },
        'renderBookAction': function() {
            var self = this;
            var selector = this.options.bookActionSelector;
            var button = this.container.find(selector);

            if (this.currentSlot.getAttendance() >= this.currentSlot.getCapacity()) {
                button.addClass('goboo_disabled');
            }
            else {
                button.removeClass('goboo_disabled');
            }

            button.off('click');
            button.click(function(e) {
                e.preventDefault();
                self.options.showBookingMask.call(self, self.currentSlot);
            });
        },
        'render': function() {
            var self = this;
            var slot = self.currentSlot;
            self.options.preRender.call(self);

            var selectors = {};
            var selectorRegexp = /^(\w+)Selector$/;
            var actionRegexp = /Action$/;
            $.each(self.options, function(key, value) {
                var match = selectorRegexp.exec(key);
                if (match && !actionRegexp.test(match[1])) {
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

            self.options.renderBookAction.call(self);

            self.options.postRender.call(self);
        }
    };

    /**
     * Create a new booking mask to integrate goboo booking system.
     *
     * @memberOf jQuery
     * @access public
     * @param object options
     */
    $.fn.gobooSlotDetails = function (options) {
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
                'startDateTimeFormat': 'start-datetime-format',
                'endDateTimeFormat': 'end-datetime-format',
                'timeFormat': 'date-format',
                'durationDateTimeFormat': 'duration-time-format',
                'playTimeDateTimeFormat': 'play-time-time-format',
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
                'bookActionSelector': 'book-action-selector'
            },
            function(option, key) {
                var value = element.data('goboo-' + key);
                if (value !== undefined && value !== null) {
                    templateOptions[option] = value;
                }
            }
        );

        options = $.extend({}, $.gobooSlotDetails.defaultOptions, options || {}, templateOptions);

        new (function(container, options) {
            var self = this;
            self.container = container;
            self.options = options;
            self.currentSlot = null;

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

            container.data(
                'goboo',
                {
                    'options': options,
                    'setSlot': function (slot, room) {
                        if (room !== undefined) {
                            options.room = room;
                        }
                        options.slot = slot;
                        self.loadSlot(options.slot);
                    }
                }
            );

            if (options.room && options.slot) {
                self.loadSlot(options.slot);
            }
            self.container.removeClass('goboo_initializing');
        })(element, options);

        return this;
    };
})(jQuery);

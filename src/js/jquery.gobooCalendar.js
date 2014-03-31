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

	/**
	 * Helper function to extract hours "hh" from a time with format "hhii".
	 *
	 * @param time
	 * @returns {int}
	 */
	function extractHours(time) {
		return parseInt((time / 100) % 100);
	}

	/**
	 * Helper function to extract minutes "ii" from a time with format "hhii".
	 *
	 * @param time
	 * @returns {int}
	 */
	function extractMinutes(time) {
		return parseInt(time % 100);
	}

	var now = new Date();

	$.gobooCalendar = {};
	$.gobooCalendar.defaultOptions = {
		/** id of room */
		'room': '',
		/** the time span the calendar will display */
		'timeSpan': '1week',
		/** the start time the calendar will begin */
		'startTime': 'week',
		/** the first day of week, only used to calculate the week start time */
		'startOfWeek': 0,

		/** count of minutes to create a time indicator */
		'timesSpan': 60,
		'timesFormat': '{time}',
		'timesDateFormat': 'hh:ii',

		/** day date format */
		'dayDateFormat': 'dd.',
		/** move the time span of a day */
		'dayStartOffset': 0,
		/** predefined start time of the day */
		'dayStart': false,
		/** predefined end time of the day */
		'dayEnd': false,
		/** current date format */
		'currentDateFormat': '{from} - {until}',
		/** current date format for from date */
		'currentDateFromFormat': 'dd.',
		/** current date format for from date */
		'currentDateFromMonthFormat': 'dd.',
		/** current date format for until date */
		'currentDateUntilFormat': 'dd. MM',
		/** current date format for until date */
		'currentDateUntilMonthFormat': 'dd. MM',

		/** selector to previous button element */
		'previousButtonSelector': '.goboo_date_selector .goboo_previous',
		/** selector to next button element */
		'nextButtonSelector': '.goboo_date_selector .goboo_next',
		/** selector to current date element */
		'currentDateSelector': '.goboo_date_selector .goboo_current_date',
		/** selector to times container element */
		'timesContainerSelector': '.goboo_calendar .goboo_times',
		/** selector to days container element */
		'daysContainerSelector': '.goboo_calendar .goboo_days',

		/** factory to create a time span element */
		'timeSpanFactory': function(container, time, isFirst, isLast) {
			var self = this;
			var dateFormat = container.data('goboo-date-format') || self.options.timesDateFormat;
			var format = container.data('goboo-format') || self.options.timesFormat;
			var date = $.formatDateTime(dateFormat, time);
			var date = format.replace('{time}', date);
			var element = $('<div></div>')
				.addClass('goboo_time-' + $.formatDateTime('hhii', time))
				.addClass('goboo_time_span_time_' + $.formatDateTime('hhii', time))
				.addClass('goboo_time_span_duration_' + self.options.timesSpan)
				.addClass('goboo_time_span')
				.html(date);
			if (isFirst) {
				element.addClass('goboo_time_span_first');
			}
			if (isLast) {
				element.addClass('goboo_time_span_last');
			}
			return element;
		},
		/** factory to create the current date */
		'currentDateFactory': function(startDate, endDate, currentDateContainer) {
			var self = this;
			var currentDateFormat = currentDateContainer.data('goboo-format') || self.options.currentDateFormat;
			var currentDateFromFormat = currentDateContainer.data('goboo-from-format') || self.options.currentDateFromFormat;
			var currentDateFromMonthFormat = currentDateContainer.data('goboo-from-month-format') || self.options.currentDateFromMonthFormat;
			var currentDateUntilFormat = currentDateContainer.data('goboo-until-format') || self.options.currentDateUntilFormat;
			var currentDateUntilMonthFormat = currentDateContainer.data('goboo-until-month-format') || self.options.currentDateUntilMonthFormat;

			var currentDateFrom = startDate.getMonth() != endDate.getMonth()
				? $.formatDateTime(currentDateFromMonthFormat, startDate)
				: $.formatDateTime(currentDateFromFormat, startDate);
			var currentDateUntil = startDate.getMonth() != endDate.getMonth()
				? $.formatDateTime(currentDateUntilMonthFormat, endDate)
				: $.formatDateTime(currentDateUntilFormat, endDate);

			var currentDate = currentDateFormat
				.replace('{from}', currentDateFrom)
				.replace('{until}', currentDateUntil);
			return $('<span></span>').text(currentDate);
		},
		/** factory to create a day container, that contains all the day records */
		'dayContainerFactory': function(date) {
			var self = this;
			var dayName = $('<div></div>')
				.addClass('goboo_day_name')
				.html($.formatDateTime(self.container.data('goboo-day-date-format') || self.options.dayDateFormat, date));

			var day = $.formatDateTime('yymmdd', date);
			var dayWithoutYear = $.formatDateTime('mmdd', date);
			var dayOfMonth = $.formatDateTime('dd', date);
			var dayOfWeek = date.getDay();
			return $('<div></div>')
				.addClass('goboo_day_' + day)
				.addClass('goboo_day_of_year_' + dayWithoutYear)
				.addClass('goboo_day_of_month_' + dayOfMonth)
				.addClass('goboo_day_of_week_' + dayOfWeek)
				.addClass('goboo_day')
				.append(dayName);
		},
		/** factory to create a slot button */
		'slotButtonFactory': function(slot) {
			var self = this;
			var capacity = slot.getCapacity();
			var attendance = slot.getAttendance();
			var locked = slot.isLocked();
			var button = $('<a></a>')
				.attr('id', 'goboo_slot_' + slot.getId())
				.attr('href', '#goboo_slot_' + slot.getId())
				.addClass('goboo_slot_button');
			if (locked) {
				button.addClass('goboo_slot_locked');
			}
			var players = $('<span></span>')
				.addClass('goboo_slot_players')
				.appendTo(button);

			for (var i=1; i<=capacity; i++) {
				$('<span></span>')
					.addClass('goboo_slot_player_' + i)
					.addClass('goboo_slot_player')
					.addClass((locked || i <= attendance) ? 'goboo_slot_player_used' : 'goboo_slot_player_free')
					.appendTo(players);
			}

			if (locked || attendance >= capacity) {
				button.addClass('goboo_slot_full');
			}
			if (attendance == 0) {
				button.addClass('goboo_slot_empty');
			}

			button.click(function(e) {
				e.preventDefault();
				self.options.showSlotDetails.call(self, slot);
			});

			return button;
		},
		/** factory to create a slot dummy */
		'slotDummyFactory': function(slot) {
			var capacity = slot.getCapacity();
			var attendance = slot.getAttendance();
			var locked = slot.isLocked();
			var button = $('<span></span>')
				.attr('id', 'goboo_slot_' + slot.getId())
				.attr('href', '#goboo_slot_' + slot.getId())
				.addClass('goboo_slot_button');
			if (locked) {
				button.addClass('goboo_slot_locked');
			}
			var players = $('<span></span>')
				.addClass('goboo_slot_players')
				.appendTo(button);

			for (var i=1; i<=capacity; i++) {
				$('<span></span>')
					.addClass('goboo_slot_player_' + i)
					.addClass('goboo_slot_player')
					.addClass((locked || i <= attendance) ? 'goboo_slot_player_used' : 'goboo_slot_player_free')
					.appendTo(players);
			}

			if (locked || attendance >= capacity) {
				button.addClass('goboo_slot_full');
			}
			else if (attendance == 0) {
				button.addClass('goboo_slot_empty');
			}

			return button;
		},
		/** factory to create the slot container */
		'slotContainerFactory': function(slot) {
			var locked = slot.isLocked();

			var time = $.formatDateTime('hhii', slot.getStartDateTime());
			var container = $('<div></div>')
				.addClass('goboo_time_' + time)
				.addClass('goboo_slot_time_' + time)
				.addClass('goboo_slot_duration_' + slot.getDuration())
				.addClass('goboo_slot');

			if (locked) {
				container.addClass('goboo_slot_locked');
			}
			else {
				container.addClass('goboo_slot_attendance_' + slot.getAttendance());
			}

			return container;
		},
		/** factory to create the pause element */
		'pauseFactory': function(pause, onDayStart, onDayEnd) {
			var element = $('<div></div>')
				.addClass('goboo_pause_' + pause)
				.addClass('goboo_pause');
			if (onDayStart) {
				element.addClass('goboo_pause_begin');
			}
			else if (onDayEnd) {
				element.addClass('goboo_pause_end');
			}
			else {
				element.addClass('goboo_pause_between');
			}
			return element;
		},
		/** factory to create an element, that indicate that there are no bookable slots */
		'emptyMessageFactory': function(time) {
			return $('<div></div>')
				.addClass('goboo_empty')
				.addClass('goboo_empty_time_' + time);
		},

		'showSlotDetails': function(slot) {
			alert('You must define the showSlotDetails(slot) function!');
		},

		'renderDay': function(items, dayStartTime, dayEndTime) {
			var self         = this;
			var dayContainer = self.options.dayContainerFactory.call(self, items[0].time);
			var previousItem = null;

			$.each(items, function(index, item) {
				var slot      = item.slot;
				var startTime = slot.getStartDateTime();

				dayStartTime.setDate(startTime.getDate());
				dayStartTime.setMonth(startTime.getMonth());
				dayStartTime.setYear(startTime.getFullYear());

				dayEndTime.setDate(startTime.getDate());
				dayEndTime.setMonth(startTime.getMonth());
				dayEndTime.setYear(startTime.getFullYear());

				if (dayEndTime.getTime() <= dayStartTime.getTime()) {
					dayEndTime.setDate(dayEndTime.getDate() + 1);
				}

				var timeOffset = 0;
				if (!previousItem) {
					timeOffset = startTime.getTime() - dayStartTime.getTime();
				}
				if (previousItem) {
					timeOffset = startTime.getTime() - previousItem.slot.getEndDateTime().getTime();
				}
				if (timeOffset > 0) {
					var pauseElement = self.options.pauseFactory.call(self, timeOffset / 60000, false, true);
					dayContainer.append(pauseElement);
				}

				var slotButton;
				if (!slot.isLocked() && slot.getStartDateTime().getTime() > now.getTime()) {
					slotButton = self.options.slotButtonFactory.call(self, slot);
				}
				else {
					slotButton = self.options.slotDummyFactory.call(self, slot);
				}

				var slotElement = self.options.slotContainerFactory.call(self, slot);
				slotElement.append(slotButton);
				dayContainer.append(slotElement);

				previousItem = item;
			});

			var endTime = previousItem.slot.getEndDateTime();
			var timeOffset = dayEndTime.getTime() - endTime.getTime();
			if (timeOffset > 0 && timeOffset < 86400000) {
				var pauseElement = self.options.pauseFactory.call(self, timeOffset / 60000, false, true);
				dayContainer.append(pauseElement);
			}

			return dayContainer;
		},

		/** poll the calendar */
		'polling': false
	};

	/**
	 * Create a new booking calendar to integrate goboo booking system.
	 *
	 * @memberOf jQuery
	 * @access public
	 * @param object options
	 */
	$.fn.gobooCalendar = function (options) {
		if (!goboo.env.adapter) {
			throw 'You need to initialize the goboo environment first!';
		}

		var element = $(this[0]);
		var templateOptions = {};
		$.each(
			{
				'room': 'room',
				'timeSpan': 'time-span',
				'startTime': 'start-time',
				'startOfWeek': 'start-of-week',
				'timesSpan': 'times-span',
				'timesFormat': 'times-format',
				'timesDateFormat': 'times-date-format',
				'dayDateFormat': 'day-date-format',
				'dayStartOffset': 'day-start-offset',
				'dayStart': 'day-start',
				'dayEnd': 'day-end',
				'currentDateFormat': 'current-date-format',
				'currentDateFromFormat': 'current-date-from-format',
				'currentDateFromMonthFormat': 'current-date-from-month-format',
				'currentDateUntilFormat': 'current-date-until-format',
				'currentDateUntilMonthFormat': 'current-date-until-month-format',
				'previousButtonSelector': 'previous-button-selector',
				'nextButtonSelector': 'next-button-selector',
				'currentDateSelector': 'current-date-selector',
				'timesContainerSelector': 'times-container-selector',
				'daysContainerSelector': 'days-container-selector'
			},
			function(option, key) {
				var value = element.data('goboo-' + key);
				if (value !== undefined) {
					templateOptions[option] = value;
				}
			}
		);

		var options = $.extend({}, $.gobooCalendar.defaultOptions, options || {}, templateOptions);

		if (!options.room) {
			throw 'Room ID is missing for calendar!';
		}

		function getWeekNumber(d) {
			// Copy date so don't modify original
			d = new Date(d);
			d.setHours(0,0,0);
			// Set to nearest Thursday: current date + 4 - current day number
			// Make Sunday's day number 7
			d.setDate(d.getDate() + 4 - (d.getDay()||7));
			// Get first day of year
			var yearStart = new Date(d.getFullYear(),0,1);
			// Calculate full weeks to nearest Thursday
			var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
			// Return array of year and week number
			return [d.getFullYear(), weekNo];
		}

		new (function(container, options) {
			var self = this;
			self.container = container;
			self.options = options;

			self.api = {
				'options': options,
				'refresh': function() {
					self.updateSlots();
				}
			};

			// parse and evaluate time span
			var timespanRegexp = /^(\d+)(hour|day|week|month|year)$/;
			self.timespanMatch = timespanRegexp.exec(options.timeSpan);
			if (!self.timespanMatch) {
				throw 'The time span ' + options.timeSpan + ' is invalid!';
			}

			// determinate the start time of the calendar
			self.currentStartTime = new Date();
			self.currentStartTime.setHours(0);
			self.currentStartTime.setMinutes(0);
			self.currentStartTime.setSeconds(0);

			if (options.dayStartOffset) {
				self.currentStartTime.setHours(options.dayStartOffset);
			}

			var matches = /(month|week|day)(\+|\-|=|>=)(\d+)/.exec(options.startTime);
			if (matches) {
				options.startTime = matches[1];
				options.startTimeOffset = {
					comparator: matches[2],
					value: parseInt(matches[3])
				};
			}
			else {
				options.startTimeOffset = false;
			}

			switch (options.startTime) {
				case 'month':
					self.currentStartTime.setDate(1);

					if (options.startTimeOffset) {
						var value = parseInt(options.startTimeOffset.value);
						switch (options.startTimeOffset.comparator) {
							case '+':
								self.currentStartTime.setMonth(
									self.currentStartTime.getMonth() + value
								);
								break;
							case '-':
								self.currentStartTime.setMonth(
									self.currentStartTime.getMonth() - value
								);
								break;
							case '=':
								self.currentStartTime.setMonth(value);
								break;
							case '>=':
								if (value > self.currentStartTime.getMonth()) {
									self.currentStartTime.setMonth(value);
								}
								break;
						}
					}
					break;
				case 'week':
					var dow = self.currentStartTime.getDay();
					var days = dow - self.options.startOfWeek;
					while (days < 0) {
						days += 7;
					}
					if (days) {
						self.currentStartTime.setDate(self.currentStartTime.getDate() - days);
					}

					if (options.startTimeOffset) {
						var value = options.startTimeOffset.value;
						switch (options.startTimeOffset.comparator) {
							case '+':
								self.currentStartTime.setDate(
									self.currentStartTime.getDate() + (7 * value)
								);
								break;
							case '-':
								self.currentStartTime.setDate(
									self.currentStartTime.getDate() - (7 * value)
								);
								break;
							case '=':
								var woy = getWeekNumber(self.currentStartTime);
								self.currentStartTime.setDate(
									self.currentStartTime.getDate() + (7 * (value - woy[1]))
								);
								break;
							case '>=':
								var woy = getWeekNumber(self.currentStartTime);
								if (
									self.currentStartTime.getFullYear() <= woy[0] &&
									value > woy[1]
								) {
									self.currentStartTime.setDate(
										self.currentStartTime.getDate() + (7 * (value - woy[1]))
									);
								}
								break;
						}
					}
					break;
				case 'day':
					if (options.startTimeOffset) {
						var value = options.startTimeOffset.value;
						switch (options.startTimeOffset.comparator) {
							case '+':
								self.currentStartTime.setDate(
									self.currentStartTime.getDate() + value
								);
								break;
							case '-':
								self.currentStartTime.setDate(
									self.currentStartTime.getDate() - value
								);
								break;
							case '=':
								self.currentStartTime.setDate(value);
								break;
							case '>=':
								if (value > self.currentStartTime.getDate()) {
									self.currentStartTime.setDate(value);
								}
								break;
						}
					}
					break;
				default:
					throw 'Start time ' + self.options.startTime + ' is not known!';
			}

			self.minStartTime = new Date(self.currentStartTime);

			var dayStartTime = new Date();
			dayStartTime.setHours(23);
			dayStartTime.setMinutes(59);
			dayStartTime.setSeconds(0);
			dayStartTime.setMilliseconds(0);

			var dayEndTime = new Date();
			dayEndTime.setHours(0);
			dayEndTime.setMinutes(0);
			dayEndTime.setSeconds(0);
			dayEndTime.setMilliseconds(0);

			self.currentDayTime = {
				start: dayStartTime,
				end: dayEndTime
			};

			self.increaseDate = function(date) {
				switch (self.timespanMatch[2]) {
					case 'hour':
						date.setHours(date.getHours() + 1);
						break;
					case 'day':
						date.setDate(date.getDate() + 1);
						break;
					case 'week':
						date.setDate(date.getDate() + 7);
						break;
					case 'month':
						date.setMonth(date.getMonth() + 1);
						break;
					case 'year':
						date.setFullYear(date.getFullYear() + 1);
						break;
				}
				return date;
			}

			self.decreaseDate = function(date) {
				switch (self.timespanMatch[2]) {
					case 'hour':
						date.setHours(date.getHours() - 1);
						break;
					case 'day':
						date.setDate(date.getDate() - 1);
						break;
					case 'week':
						date.setDate(date.getDate() - 7);
						break;
					case 'month':
						date.setMonth(date.getMonth() - 1);
						break;
					case 'year':
						date.setFullYear(date.getFullYear() - 1);
						break;
				}
				return date;
			}

			/**
			 * Map the slots per day, in relation to the day start offset.
			 *
			 * @param {goboo.Slot[]} slots
			 *
			 * @return {Array} Return an array with items { slot: ..., time: ..., rel: ... },
			 *                 where slot is the goboo.Slot object,
			 *                 time is the slot start time and
			 *                 rel is the relative slot start time, depending on the day start offset.
			 */
			self.mapSlotsPerDay = function(slots) {
				var slotsPerDay = {};

				for (var i=0; i<slots.length; i++) {
					var slot = slots[i];
					var startTime = slot.getStartDateTime();
					var relativeTime;

					if (self.options.dayStartOffset) {
						relativeTime = new Date(startTime);
						relativeTime.setHours(relativeTime.getHours() - self.options.dayStartOffset);
					}
					else {
						relativeTime = startTime;
					}

					var day  = $.formatDateTime('yymmdd', relativeTime);

					if (!slotsPerDay[day]) {
						slotsPerDay[day] = [];
					}

					slotsPerDay[day].push(
						{
							slot: slot,
							time: startTime,
							rel: relativeTime
						}
					);
				}

				return slotsPerDay;
			};

			self.getRequiredDays = function(startDate, endDate) {
				var requiredDate = new Date(startDate);
				var requiredDays = [];

				do {
					requiredDays.push({
						numeric: $.formatDateTime('yymmdd', requiredDate),
						date: new Date(requiredDate)
					});
					requiredDate.setDate(requiredDate.getDate() + 1);
				}
				while (requiredDate.getTime() < endDate.getTime());

				return requiredDays;
			};

			self.generateTimes = function(slotsPerDay) {
				var minTime = null;
				var maxTime = null;

				if (self.options.dayStart !== false && self.options.dayEnd !== false) {
					var time = self.options.dayStart.toString().split(':');

					minTime = new Date();
					minTime.setFullYear(2000);
					minTime.setMonth(0);
					minTime.setDate(1);
					minTime.setHours(parseInt(time[0]));
					minTime.setMinutes(time.length > 1 ? parseInt(time[1]) : 0);
					minTime.setSeconds(0);
					minTime.setMilliseconds(0);

					time = self.options.dayEnd.toString().split(':');

					maxTime = new Date();
					maxTime.setFullYear(2000);
					maxTime.setMonth(0);
					maxTime.setDate(1);
					maxTime.setHours(parseInt(time[0]));
					maxTime.setMinutes(time.length > 1 ? parseInt(time[1]) : 0);
					maxTime.setSeconds(0);
					maxTime.setMilliseconds(0);

					if (maxTime.getTime() < minTime.getTime()) {
						maxTime.setDate(2);
					}
				}
				else {
					$.each(slotsPerDay, function(day, items) {
						var start = null;
						var end   = null;

						$.each(items, function(index, item) {
							if (!start || item.time.getTime() < start.getTime()) {
								start = item.time;
							}
							if (!end || item.slot.getEndDateTime().getTime() > end.getTime()) {
								end = item.slot.getEndDateTime();
							}
						});

						var currentMinTime = new Date(start);
						currentMinTime.setFullYear(2000);
						currentMinTime.setMonth(0);
						currentMinTime.setDate(1);

						var currentMaxTime = new Date(end);
						currentMaxTime.setFullYear(2000);
						currentMaxTime.setMonth(0);
						currentMaxTime.setDate(1);

						if (currentMaxTime.getTime() < currentMinTime.getTime()) {
							currentMaxTime.setDate(2);
						}

						if (!minTime || currentMinTime.getTime() < minTime.getTime()) {
							minTime = currentMinTime;
						}
						if (!maxTime || currentMaxTime.getTime() > maxTime.getTime()) {
							maxTime = currentMaxTime;
						}
					});

					if (!maxTime) {
						maxTime = new Date();
					}
					if (!minTime) {
						minTime = new Date();
					}

					if (self.options.dayStart !== false && self.options.dayStart) {
						var time = self.options.dayStart.toString().split(':');

						minTime.setFullYear(2000);
						minTime.setMonth(0);
						minTime.setDate(1);
						minTime.setHours(parseInt(time[0]));
						minTime.setMinutes(time.length > 1 ? parseInt(time[1]) : 0);
						minTime.setSeconds(0);
						minTime.setMilliseconds(0);
					}
					if (self.options.dayEnd !== false && self.options.dayEnd) {
						var time = self.options.dayEnd.toString().split(':');

						maxTime.setFullYear(2000);
						maxTime.setMonth(0);
						maxTime.setDate(1);
						maxTime.setHours(parseInt(time[0]));
						maxTime.setMinutes(time.length > 1 ? parseInt(time[1]) : 0);
						maxTime.setSeconds(0);
						maxTime.setMilliseconds(0);
					}

					if (maxTime.getTime() < minTime.getTime()) {
						maxTime.setDate(2);
					}
				}

				if (
					self.options.timeSpanFactory &&
					(
						!self.currentDayTime ||
						(
							minTime && maxTime &&
							(
								self.currentDayTime.start.getTime() != minTime.getTime() ||
								self.currentDayTime.end.getTime() != maxTime.getTime()
							)
						)
					)
				) {
					var container = self.container.find(options.timesContainerSelector);
					if (container.length) {
						container.empty();

						var time = new Date(minTime);

						var times = Math.ceil(1440 / options.timesSpan);
						while (time.getTime() < maxTime.getTime()) {
							var nextTime = new Date(time);
							nextTime.setTime(time.getTime() + (1000 * 60 * options.timesSpan));

							for (var j=0; j<container.length; j++) {
								var singleContainer = $(container[j]);
								var element = self.options.timeSpanFactory.call(
									self,
									singleContainer, time, time.getTime() <= minTime.getTime(), nextTime.getTime() >= maxTime.getTime()
								);
								singleContainer.append(element);
							}

							time.setTime(time.getTime() + (1000 * 60 * options.timesSpan));
						}
					}

					self.currentDayTime = {
						start: minTime,
						end: maxTime
					}
				}

				return self.currentDayTime;
			};

			self.updateSlots = function() {
				now = new Date();
				var startDate = self.currentStartTime;
				var endDate = self.increaseDate(new Date(self.currentStartTime));

				goboo.env.adapter.listSlots(
					self.options.room,
					startDate,
					endDate,
					function(slots) {
						var slotsPerDay     = self.mapSlotsPerDay(slots);
						var dayStartEndTime = self.generateTimes(slotsPerDay);
						var requiredDays    = self.getRequiredDays(startDate, endDate);

						var currentDateContainer = self.container.find(options.currentDateSelector);
						var daysContainer = self.container.find(options.daysContainerSelector);
						daysContainer.empty();

						var currentDate = self.options.currentDateFactory.call(self, startDate, endDate, currentDateContainer);
						currentDateContainer.empty().append(currentDate);

						var dayStartTime = new Date(dayStartEndTime.start);
						var dayEndTime   = new Date(dayStartEndTime.end);

						if (slots && slots.length) {
							var dayCount = 0;

							$.each(slotsPerDay, function(day, items) {
								while (requiredDays.length && requiredDays[0].numeric < day) {
									var requiredDay = requiredDays.shift();

									dayStartTime.setDate(requiredDay.date.getDate());
									dayStartTime.setMonth(requiredDay.date.getMonth());
									dayStartTime.setFullYear(requiredDay.date.getFullYear());

									dayEndTime.setDate(requiredDay.date.getDate());
									dayEndTime.setMonth(requiredDay.date.getMonth());
									dayEndTime.setFullYear(requiredDay.date.getFullYear());

									if (dayEndTime.getTime() < dayStartTime.getTime()) {
										dayEndTime.setDate(dayEndTime.getDate() + 1);
									}

									var dayContainer = self.options.dayContainerFactory.call(self, requiredDay.date);
									daysContainer.append(dayContainer);

									var pauseElement = self.options.pauseFactory.call(self, (dayEndTime.getTime() - dayStartTime.getTime()) / 60000, true, true);
									dayContainer.append(pauseElement);

									dayCount ++;
								}

								if (requiredDays.length && requiredDays[0].numeric == day) {
									requiredDays.shift();
								}

								var dayContainer = self.options.renderDay.call(self, items, dayStartTime, dayEndTime);
								daysContainer.append(dayContainer);
								dayCount ++;
							});

							while (requiredDays.length) {
								var requiredDay = requiredDays.shift();

								dayStartTime.setDate(requiredDay.date.getDate());
								dayStartTime.setMonth(requiredDay.date.getMonth());
								dayStartTime.setFullYear(requiredDay.date.getFullYear());

								dayEndTime.setDate(requiredDay.date.getDate());
								dayEndTime.setMonth(requiredDay.date.getMonth());
								dayEndTime.setFullYear(requiredDay.date.getFullYear());

								if (dayEndTime.getTime() < dayStartTime.getTime()) {
									dayEndTime.setDate(dayEndTime.getDate() + 1);
								}

								var dayContainer = self.options.dayContainerFactory.call(self, requiredDay.date);
								daysContainer.append(dayContainer);

								var pauseElement = self.options.pauseFactory.call(self, (dayEndTime.getTime() - dayStartTime.getTime()) / 60000, true, true);
								dayContainer.append(pauseElement);

								dayCount ++;
							}

							var classes = (daysContainer.attr('class') || '').split(/\s+/);
							classes = classes.filter(function(cssClass) {
								return !/^goboo_day_count_\d+$/.test(cssClass);
							});
							classes.push('goboo_day_count_' + dayCount);
							daysContainer.attr('class', classes.join(' '));
						}
						else {
							daysContainer.append(self.options.emptyMessageFactory((dayEndTime - dayStartTime) / 1000));
						}

						self.container.trigger('goboo:slots:update', slots);
					}
				);
			}

			self.updateSlotsDetails = function() {

			};

			self.previousButton = self.container.find(self.options.previousButtonSelector);
			self.previousButton.addClass('goboo_button_disabled');
			self.previousButton.click(function() {
				if (self.currentStartTime.getTime() <= self.minStartTime.getTime()) {
					return false;
				}
				self.decreaseDate(self.currentStartTime);
				self.updateSlots();
				if (self.currentStartTime.getTime() <= self.minStartTime.getTime()) {
					self.previousButton.addClass('goboo_button_disabled');
				}
				return false;
			});

			self.nextButton = self.container.find(self.options.nextButtonSelector);
			self.nextButton.click(function() {
				self.increaseDate(self.currentStartTime);
				self.updateSlots();
				self.previousButton.removeClass('goboo_button_disabled');
				return false;
			});

			var initListener = function() {
				self.container
					.removeClass('goboo_initializing')
					.addClass('goboo_calendar_ready')
					.off('goboo.slots-update', initListener);
			}
			self.container.on('goboo:slots:update', initListener);

			self.updateSlots();

			if (self.options.polling !== false) {
				setInterval(
					function() {
						self.updateSlotsDetails();
					},
					self.options.polling * 1000
				);
			}

			container.data('goboo', self.api);
		})(element, options);

		return this;
	};
})(jQuery);

Date.prototype.toW3CString=function(){var t=this.getFullYear(),e=this.getMonth();e++,10>e&&(e="0"+e);var n=this.getDate();10>n&&(n="0"+n);var o=this.getHours();10>o&&(o="0"+o);var s=this.getMinutes();10>s&&(s="0"+s);var i=this.getSeconds();10>i&&(i="0"+i);var a=-this.getTimezoneOffset(),r=Math.abs(Math.floor(a/60)),c=Math.abs(a)-60*r;10>r&&(r="0"+r),10>c&&(c="0"+c);var u="+";return 0>a&&(u="-"),t+"-"+e+"-"+n+"T"+o+":"+s+":"+i+u+r+":"+c};var goboo=goboo||{};window.goboo=goboo,goboo.env={},goboo.env.adapter=null,goboo.init=function(t){var e={host:"demo.goboo.io"};for(var n in t||{})e[n]=t[n];goboo.env.adapter=new goboo.Adapter(e)},goboo.Adapter=function(t){"use strict";var e={host:"demo.goboo.de",path:""};for(var n in t||{})e[n]=t[n];var o="http://"+e.host+e.path+"/api/v3/";this.listSlots=function(t,e,n,s){var i=[];e&&i.push("from="+encodeURIComponent(e.toW3CString())),n&&i.push("until="+encodeURIComponent(n.toW3CString()));var a="";i.length&&(a="?"+i.join("&"));var r=new XMLHttpRequest;r.open("GET",o+"rest/room/"+t+"/slots"+a,!0),r.onreadystatechange=function(){if(4==r.readyState){var e;e=200!=r.status?!1:JSON.parse(r.responseText);var n=[];if(e)for(var o in e.slots){var i=e.slots[o],a=new goboo.Slot;a.setId(i.id),a.setRoomId(t),a.setStartDateTime(new Date(i.startDateTime)),a.setDuration(i.duration),a.setPlayTime(i.playTime),a.setCapacity(i.capacity),a.setAttendance(i.attendance),a.setPlayers(i.players),a.setLocked(i.locked),n.push(a)}s(n)}},r.send()},this.listSlotPredecessors=function(t,e,n){var s=e?"?limit="+e:"",i=new XMLHttpRequest;i.open("GET",o+"rest/room/"+t.getRoomId()+"/slot/"+t.getId()+"/predecessors"+s,!0),i.onreadystatechange=function(){if(4==i.readyState){var t;t=200!=i.status?!1:JSON.parse(i.responseText);var e=[];if(t)for(var o in t){var s=t[o],a=new goboo.Slot;a.setId(s.id),a.setRoomId(roomId),a.setStartDateTime(new Date(s.startDateTime)),a.setDuration(s.duration),a.setPlayTime(s.playTime),a.setCapacity(s.capacity),a.setAttendance(s.attendance),a.setPlayers(s.players),a.setLocked(s.locked),e.push(a)}n(e)}},i.send()},this.listSlotSuccessors=function(t,e,n){var s=e?"?limit="+e:"",i=new XMLHttpRequest;i.open("GET",o+"rest/room/"+t.getRoomId()+"/slot/"+t.getId()+"/successors"+s,!0),i.onreadystatechange=function(){if(4==i.readyState){var t;t=200!=i.status?!1:JSON.parse(i.responseText);var e=[];if(t)for(var o in t){var s=t[o],a=new goboo.Slot;a.setId(s.id),a.setRoomId(s.room),a.setStartDateTime(new Date(s.startDateTime)),a.setDuration(s.duration),a.setPlayTime(s.playTime),a.setCapacity(s.capacity),a.setAttendance(s.attendance),a.setPlayers(s.players),a.setLocked(s.locked),e.push(a)}n(e)}},i.send()},this.getSlot=function(t,e,n){var s=new XMLHttpRequest;s.open("GET",o+"rest/room/"+t+"/slot/"+e,!0),s.onreadystatechange=function(){if(4==s.readyState){var t;t=200!=s.status?!1:JSON.parse(s.responseText);var e=null;if(t){e=new goboo.Slot,e.setId(t.id),e.setRoomId(t.room),e.setStartDateTime(new Date(t.startDateTime)),e.setDuration(t.duration),e.setPlayTime(t.playTime),e.setCapacity(t.capacity),e.setAttendance(t.attendance),e.setPlayers(t.players),e.setLocked(t.locked);var o=[];for(var i in t.availableModes){var a=new goboo.Mode;a.setToken(modeData.token),a.setLabel(modeData.label),a.setDescription(modeData.description),a.setMinAttendance(modeData.minAttendance),a.setMaxAttendance(modeData.maxAttendance),a.setVotes(modeData.votes),o.push(a)}e.setAvailableModes(o)}n(e)}},s.send()},this.bookSlot=function(t,e,n){var s=t.getSlots(),i=null,a={},r=[];for(var c in s){var u=s[c];i=u.getRoomId(),a[i]=!0,r.push(u.getId())}if(a.length>1)throw"A booking can only contain slots from the same room.";if(!(a.length<1)){var d={name:t.getName(),mobile:t.getMobile(),email:t.getEmail(),street:t.getStreet(),postcode:t.getPostcode(),city:t.getCity(),attendance:t.getAttendance(),players:t.getPlayers(),exclusive:t.isExclusive(),preferredModes:t.getPreferredModes(),notes:t.getNotes(),slots:r},l=new XMLHttpRequest;l.open("POST",o+"rest/room/"+i+"/book",!0),l.setRequestHeader("Content-type","application/json"),l.onreadystatechange=function(){if(4==l.readyState){var t;try{t=JSON.parse(l.responseText)}catch(o){t=!1}t?t.error?n(t.error.message,l):200!=l.status?n(!1,l):e(t,l):n(!1,l)}},l.send(JSON.stringify(d))}}},goboo.Booking=function(){var t,e,n,o,s,i,a,r,c,u,d,l;this.getName=function(){return t},this.setName=function(e){t=e},this.getMobile=function(){return e},this.setMobile=function(t){e=t},this.getEmail=function(){return n},this.setEmail=function(t){n=t},this.getStreet=function(){return o},this.setStreet=function(t){o=t},this.getPostcode=function(){return s},this.setPostcode=function(t){s=t},this.getCity=function(){return i},this.setCity=function(t){i=t},this.getSlots=function(){return a},this.setSlots=function(t){a=t},this.getAttendance=function(){return r},this.setAttendance=function(t){r=t},this.getPlayers=function(){return c},this.setPlayers=function(t){c=t},this.isExclusive=function(){return u},this.setExclusive=function(t){u=t},this.getPreferredModes=function(){return d},this.setPreferredModes=function(t){d=t},this.getNotes=function(){return l},this.setNotes=function(t){l=t}},goboo.Mode=function(){var t,e,n,o,s,i;this.getToken=function(){return t},this.setToken=function(e){t=e},this.getLabel=function(){return e},this.setLabel=function(t){e=t},this.getDescription=function(){return n},this.setDescription=function(t){n=t},this.getMinAttendance=function(){return o},this.setMinAttendance=function(t){o=null!==t?parseInt(t):null},this.getMaxAttendance=function(){return s},this.setMaxAttendance=function(t){s=null!==t?parseInt(t):null},this.getVotes=function(){return i},this.setVotes=function(t){i=parseInt(t)}},goboo.Slot=function(){var t=-1,e=-1,n=new Date,o=null,s=-1,i=null,a=-1,r=!1,c=-1,u=[],d=[];this.getId=function(){return t},this.setId=function(e){t=e},this.getRoomId=function(){return e},this.setRoomId=function(t){e=t},this.getStartDateTime=function(){return n},this.setStartDateTime=function(t){n=t},this.getEndDateTime=function(){if(o)return o;var t=new Date(n);return t.setSeconds(t.getSeconds()+60*s),t},this.setEndDateTime=function(t){o=t},this.getDuration=function(){return s},this.setDuration=function(t){s=parseInt(t)},this.getPlayTime=function(){return i},this.setPlayTime=function(t){i=parseInt(t)},this.getCapacity=function(){return a},this.setCapacity=function(t){a=parseInt(t)},this.isLocked=function(){return r},this.setLocked=function(t){r=t?!0:!1},this.getAttendance=function(){return c},this.setAttendance=function(t){c=null!==t?parseInt(t):null},this.getPlayers=function(){return u},this.setPlayers=function(t){u=t?t:[]},this.getAvailableModes=function(){return d},this.setAvailableModes=function(t){d=t?t:[]}};
//# sourceMappingURL=goboo-adapter.with-deps.js.map
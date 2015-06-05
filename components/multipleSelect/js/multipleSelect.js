


var multipleSelect = /**
 * @param options
 */
        function (options)
        {
            var globObj = {
                events: [],
                dragable: [],
                userevents: {}
            };

            var singleSelectButtonText = 'Set as single select';

            var multiSelectButtonText = 'Set as multi-select';

            var showTickButtonText = 'Show tick';

            var hideTickButtonText = 'Show hotspot outline';

            var correctButtonText = 'Make as correct';

            var incorrectButtonText = 'Make as incorrect';

            this.container = $("#author_content_container"); // main div reference
            this.parentDiv = $('<div class="multipleselect_mainContainer"></div>'); // main div reference
            this.controlPanel = $('<div class="multipleselect_controlPanel popup_container"></div>').hide();// control panel area div for author
            this.contentArea = $('<div class="multipleselect_contentArea"></div>');// actual activity area div

            //this.MS = $('<input type="radio" class="panelEle" name="qtype" value="ms" checked>Multiple Select</input>');
            //this.SS = $('<input type="radio" class="panelEle" name="qtype" value="ms">Single Select</input>');
            this.showHideTickBtn = $('<button class="button_decorator showTick btn btn-primary">' + showTickButtonText + '</button>');//button to show tick in hotspot
            this.hotspotBtn = $('<button class="button_decorator hotSpot btn btn-primary">Add circle hotspot</button>');//button to create hotspot for author
            this.hotspotBtnSquare = $('<button class="button_decorator hotSpot btn btn-primary">Add square hotspot</button>');//button to create hotspot for author
            this.singleSelect = $('<button class="button_decorator hotSpot btn btn-primary">' + singleSelectButtonText + '</button>');//button to single/multi select
            this.closePanel = $('<button class="button_decorator hotSpot btn btn-primary">Close</button>');//button to single/multi select
            this.makeCorrect = $('<button class="button_decorator correct btn btn-warning">' + correctButtonText + '</button>').hide();//button to make hotspot as correct for author
            this.deleteHotSpot = $('<button class="button_decorator deleteHotSpot btn btn-danger">Remove hotspot</button>').hide();//button to delete hotspot for author
            this.clear = $('<button class="button_decorator clear btn btn-danger">Remove group</button>');//button to clear all hotspot for author
            this.noOfCorrectAnsRow = $('<div class="pop-row"><label class="multiselect_label">No of Corr Ans</label><input type="text" id="noOfCorrectAns" class="multiselect_text"></div>');
            this.hotspotSettingPanel = $('<div class="pop-row"><label class="multiselect_label">Width</label><input type="text" id="width" class="multiselect_text"></div>' +
                    '<div class="pop-row"><label class="multiselect_label">Height</label><input type="text" id="height" class="multiselect_text"></div>' +
                    '<div class="pop-row"><label class="multiselect_label">Left</label><input type="text" id="left" class="multiselect_text"></div>' +
                    '<div class="pop-row"><label class="multiselect_label">Top</label><input type="text" id="top" class="multiselect_text"></div>').hide();
            //this.submit = $('<button class="button_decorator submit btn btn-info">Submit</button>');//button to submit question for author
            this.popup = $('<div title="Warning"><p></p></div>');//popup div reference
            this.disableDiv = $('<div class="multipleselect_disableDiv"></div>').hide();//disable div reference
            this.tickDiv = '<div class="tickImg"><img src="components/multipleSelect/images/tick.png" /></div>';
            var _this = this;
            _this.deleted = false;
            var hsId = 0;// variable for hotspot counter
            var ele;
            var isCorrQuest = false; // variable to check is question is correctly formed

            this.isShowTick = false; // variable to check is question is correctly formed

            this.noOfCorrectAns = 1;

            this.clickedSpots = [];

            this.spotsAns = {};

            //console.log(Role)
            this.userType = Role;// variable for usertype
            //initialize function which takes object as parameter
            this.grpId = "Grp" + String(Date.now()).substr(String(Date.now()).length - 4, String(Date.now()).length);

            this.isSingleSelect = false;

            var applyAuthorPropertyMul = function (el, resizeSetting, draggableSetting) {
                //console.log(resizeSetting)
                resizeModule.makeResize(el, resizeSetting.callback1, resizeSetting.callback2, resizeSetting.callback3, resizeSetting.context);
                draggableModule.makeDraggable(el, draggableSetting.callback, draggableSetting.context);
            };
            var mobileEvents = {
                "mousedown": "touchstart",
                "mouseup": "touchend",
                "mousemove": "touchmove",
                "click": "touchstart"
            };
            var windowsEvents = {
                "mousedown": "mousedown",
                "mouseup": "mouseup",
                "mousemove": "mousemove",
                "click": "click"
            }, deviceObj = {
                isConsoleActive: true,
                ua: navigator.userAgent.toLocaleLowerCase(),
                isIPad: function () {
                    return this.ua.indexOf("ipad") != -1;
                },
                isAndroid: function () {
                    return this.ua.indexOf("android") != -1;
                },
                isWindowPhone: function () {
                    return this.ua.indexOf("iemobile") != -1;
                },
                isNetworkAvailable: function () {
                    if (navigator.hasOwnProperty("onLine")) {
                        return navigator.onLine;
                    }
                    return false;
                },
                isFirefox: function () {
                    return this.ua.indexOf("firefox") != -1;
                },
                isWebkit: function () {
                    return this.ua.indexOf('applewebkit') !== -1;
                },
                isIE: function () {
                    return this.ua.indexOf('msie') !== -1 || ua.indexOf('rv:11.0') !== -1;
                },
                isMobile: function () {
                    return this.isIPad() || this.isAndroid() || this.isWindowPhone();
                },
                isWindowOS: function () {
                    return this.ua.indexOf("windows") !== -1;
                },
                isMAC: function () {
                    return this.ua.indexOf("mac") !== -1;
                }
            };
            //
            this.initialize = function (propObj)
            {
                console.log(propObj);
                propObj.width = (propObj.width) ? propObj.width : "250px";
                propObj.height = (propObj.height) ? propObj.height : "250px";
                propObj.isShowTick = (propObj.isShowTick) ? propObj.isShowTick : this.isShowTick;
                propObj.isSingleSelect = (propObj.isSingleSelect) ? propObj.isSingleSelect : this.isSingleSelect;

                propObj.noOfCorrectAns = (propObj.noOfCorrectAns) ? propObj.noOfCorrectAns : this.noOfCorrectAns;

                this.isShowTick = propObj.isShowTick;

                this.parentDiv.css({"left": (String(propObj.left).indexOf("px") != -1) ? propObj.left : propObj.left + "px", "top": (String(propObj.top).indexOf("px") != -1) ? propObj.top : propObj.top + "px", "width": propObj.width, "height": propObj.height});

                this.isSingleSelect = propObj.isSingleSelect;
                this.noOfCorrectAns = propObj.noOfCorrectAns;
                //this.parentDiv.append(this.contentArea);
                this.container.append(this.parentDiv);
                this.container.append(this.controlPanel);
                if (deviceObj.isMobile())
                {
                    globObj.userevents = mobileEvents;
                }
                else
                {
                    globObj.userevents = windowsEvents;
                }
                //console.log(globObj.userevents.click)

                //console.log(this.userType)
                if (this.userType === "author")
                {
                    //this.controlPanel.show();
                    if (propObj.grpId !== undefined && propObj.grpId !== null)
                    {
                        //console.log(propObj.grpId)
                        this.grpId = propObj.grpId;
                    }
                    addEvent(this.hotspotBtn, globObj.userevents.click, function () {
                        var tmpobj = createHotSpot(("hsId" + hsId), "0px", "0px", "120px", "120px", false, 'circle');
                        addDraggable(tmpobj, {callback1: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.resizing(ev, ui);
                            }, callback2: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.resizing(ev, ui);
                            }, callback3: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.resizing(ev, ui);
                            }, context: this}, {callback: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.dragging(ev, ui);
                            }, callback: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.dragging(ev, ui);
                            }, callback: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.dragging(ev, ui);
                            }, context: this});
                        hsId++;
                    });
                    addEvent(this.hotspotBtnSquare, globObj.userevents.click, function () {
                        var tmpobj = createHotSpot(("hsId" + hsId), "0px", "0px", "120px", "120px", false, 'square');
                        addDraggable(tmpobj, {callback1: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.resizing(ev, ui);
                            }, callback2: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.resizing(ev, ui);
                            }, callback3: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.resizing(ev, ui);
                            }, context: this}, {callback: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.dragging(ev, ui);
                            }, callback: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.dragging(ev, ui);
                            }, callback: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.dragging(ev, ui);
                            }, context: this});
                        hsId++;
                    });

                    addEvent(this.showHideTickBtn, globObj.userevents.click, showHideTick);
                    addEvent(this.makeCorrect, globObj.userevents.click, makeCorrect);
                    addEvent(this.deleteHotSpot, globObj.userevents.click, deleteHotSpot);
                    addEvent(this.clear, globObj.userevents.click, deleteGroup);
                    addEvent(this.singleSelect, globObj.userevents.click, isSingleSelect);
                    addEvent(this.closePanel, globObj.userevents.click, closeControlPanel);

                    this.controlPanel.append(this.showHideTickBtn);
                    this.controlPanel.append(this.hotspotBtn);
                    this.controlPanel.append(this.hotspotBtnSquare);
                    this.controlPanel.append(this.singleSelect);
                    this.controlPanel.append(this.clear);
                    this.controlPanel.append(this.noOfCorrectAnsRow);
                    this.controlPanel.append(this.hotspotSettingPanel);
                    this.controlPanel.append(this.makeCorrect);
                    this.controlPanel.append(this.deleteHotSpot);
                    this.controlPanel.append(this.closePanel);

                    this.controlPanel.find('#noOfCorrectAns').val(this.noOfCorrectAns);

                    this.parentDiv.append(this.disableDiv);
                    if (this.isShowTick) {
                        _this.showHideTickBtn.html(hideTickButtonText);
                    }

                    if (this.isSingleSelect) {
                        _this.singleSelect.html(multiSelectButtonText);
                    }

                    this.controlPanel.find('#width').on('blur', function () {
                        $(_this.parentDiv).find("#" + ele.id).css("width", $(this).val());
                    });

                    this.controlPanel.find('#noOfCorrectAns').on('blur', function () {
                        _this.noOfCorrectAns = $(this).val();
                    });

                    this.controlPanel.find('#height').on('blur', function () {
                        $(_this.parentDiv).find("#" + ele.id).css("height", $(this).val());
                    });
                    this.controlPanel.find('#left').on('blur', function () {
                        $(_this.parentDiv).find("#" + ele.id).css("left", $(this).val());
                    });
                    this.controlPanel.find('#top').on('blur', function () {
                        $(_this.parentDiv).find("#" + ele.id).css("top", $(this).val());
                    });
                    var clkCount = 0;
                    addEvent(this.parentDiv, globObj.userevents.click, function (e) {
                        clkCount++;

                        if (clkCount === 1)
                        {
                            var intId = setTimeout(function () {
                                clearTimeout(intId);

                                if (clkCount === 2)
                                {
                                    if (e.target !== e.currentTarget)
                                        return false;

                                    if (_this.controlPanel.css('display') == 'none')
                                    {
                                        var parentLeft = parseInt(_this.parentDiv.css("left").replace("px", ""));
                                        var parentTop = _this.parentDiv.css("top");
                                        var parentWidth = parseInt(_this.parentDiv.css("width").replace("px", "")) + parseInt(_this.parentDiv.css("padding-left").replace("px", "")) + parseInt(_this.parentDiv.css("padding-right").replace("px", ""));
                                        var panelWidth = parseInt(_this.controlPanel.css("width").replace("px", "")) + parseInt(_this.controlPanel.css("padding-left").replace("px", "")) + parseInt(_this.controlPanel.css("padding-right").replace("px", ""));
                                        _this.controlPanel.css({"left": (parentLeft + parentWidth - panelWidth) + "px", "top": parentTop});
                                        _this.makeCorrect.hide();
                                        _this.deleteHotSpot.hide();
                                        _this.hotspotSettingPanel.hide();
                                        _this.controlPanel.show();
                                    }
                                    else
                                    {
                                        _this.controlPanel.hide();
                                    }
                                }
                                clkCount = 0;

                            }, 250);
                        }
                    });
                    addDraggable(this.parentDiv, {callback1: function (ev, ui) {   //applying resizing and draggable to widget
                        }, callback2: function (ev, ui) {   //applying resizing and draggable to widget
                            _this.resizeStartParent(ev, ui);
                            _this.controlPanel.hide();
                        }, callback3: function (ev, ui) {   //applying resizing and draggable to widget
                            _this.resizeStopParent(ev, ui);
                        }, context: this}, {callback: function (ev, ui) {   //applying resizing and draggable to widget

                        }, callback: function (ev, ui) {   //applying resizing and draggable to widget

                        }, callback: function (ev, ui) {   //applying resizing and draggable to widget
                            _this.controlPanel.hide();
                        }, context: this});
                    draggableModule.makeDraggable(this.controlPanel, undefined, undefined);


                    //this.submit.on("click touchstart",submitClicked);
//			console.log(parseInt(this.parentDiv.css("width").replace("px","")));


                    for (var i = 0; i < parseInt(propObj.noOfHotSpot); i++)
                    {

                        //console.log(propObj["hs"+i].id,propObj["hs"+i]._y)
                        var tmpobj = createHotSpot(propObj["hs" + i].id, propObj["hs" + i]._y, propObj["hs" + i]._x, propObj["hs" + i].w, propObj["hs" + i].h, propObj["hs" + i].isCorr, propObj["hs" + i]._t);
                        tmpobj.css({"background-color": "transparent", "left": propObj["hs" + i]._x, "top": propObj["hs" + i]._y, "width": propObj["hs" + i].w, "height": propObj["hs" + i].h});

                        //console.log(typeof propObj["hs"+i].isCorr)
                        if (propObj["hs" + i].isCorr)
                        {
                            tmpobj.css({"border": "2px solid green"});
                            tmpobj.data("prop").isCorr = true;
                        }
                        else
                        {
                            tmpobj.css({"border": "2px solid red"});
                            tmpobj.data("prop").isCorr = false;
                        }
                        addDraggable(tmpobj, {callback1: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.resizing(ev, ui);
                            }, callback2: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.resizing(ev, ui);
                            }, callback3: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.resizing(ev, ui);
                            }, context: this}, {callback: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.dragging(ev, ui);
                            }, callback: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.dragging(ev, ui);
                            }, callback: function (ev, ui) {   //applying resizing and draggable to widget
                                _this.dragging(ev, ui);
                            }, context: this});
                        hsId++;
                    }
                }
                else if (this.userType === "student")
                {
                    //console.log(parseInt(propObj.noOfHotSpot))
                    console.log(propObj.grpId);
                    this.grpId = propObj.grpId;
                    for (var i = 0; i < parseInt(propObj.noOfHotSpot); i++)
                    {
                        this.spotsAns["hsId" + i] = propObj["hs" + i];
                        //console.log(propObj["hs"+i].id,propObj["hs"+i]._y)
                        var tmpobj = createHotSpot(propObj["hs" + i].id, propObj["hs" + i]._y, propObj["hs" + i]._x, propObj["hs" + i].w, propObj["hs" + i].h, propObj["hs" + i].isCorr, propObj["hs" + i]._t);
                        tmpobj.css({"background-color": "transparent", "cursor": "pointer"});
                    }
                    this.controlPanel.hide();
                    this.parentDiv.css({"border": "1px solid transparent"});
                }
            };
            this.resizeStartParent = function (ev, ui)
            {

                for (var i = 0; i < _this.parentDiv.find(".multipleselect_hotSpotCan").length; i++)
                {
                    var ele = _this.parentDiv.find(".multipleselect_hotSpotCan").eq(i);
                    var widPer = (parseInt(ele.css("width").replace("px", "")) / ui.size.width) * 100;
                    var hytPer = (parseInt(ele.css("height").replace("px", "")) / ui.size.height) * 100;
                    var lftPer = (parseInt(ele.css("left").replace("px", "")) / ui.size.width) * 100;
                    var topPer = (parseInt(ele.css("top").replace("px", "")) / ui.size.height) * 100;
                    ele.css({"top": topPer + "%", "left": lftPer + "%", "width": widPer + "%", "height": hytPer + "%"});

                    var data = ele.data("prop");
                    console.log(ele.css("width") + "    " + ele.css("height"));
                    data.width = ele.css("width");
                    data.height = ele.css("height");
                    data.top = ele.css("top");
                    data.left = ele.css("left");

                }
            };
            function addEvent(obj, evn, handle)
            {
                var isFound = false;
                for (var i = 0; i < globObj.events.length; i++)
                {
                    if (globObj.events[i][0] === obj && globObj.events[i][1] === evn && globObj.events[i][2] === handle)
                    {
                        isFound = true;
                        break;
                    }
                }
                if (!isFound)
                {
                    globObj.events[globObj.events.length] = [];
                    globObj.events[globObj.events.length - 1].push(obj, evn, handle);
                }
                obj.on(evn, handle);
            }
            function addDraggable(obj, resizeCallBack, draggableCallBack)
            {

                var isFound = false;
                for (var i = 0; i < globObj.dragable.length; i++)
                {
                    if (globObj.dragable[i] === obj)
                    {
                        isFound = true;
                    }
                }
                if (!isFound)
                {
                    globObj.dragable.push(obj);
                }
                applyAuthorPropertyMul(obj, resizeCallBack, draggableCallBack);
            }
            function removeAllDragable()
            {
                for (var i = 0; i < globObj.dragable.length; i++)
                {
                    globObj.dragable[i].draggable("disable").resizable("disable");
                }
            }
            function addAllDragable()
            {
                for (var i = 0; i < globObj.dragable.length; i++)
                {
                    globObj.dragable[i].draggable("enable").resizable("enable");
                }
            }
            function removeEvent(obj, evn)
            {
                for (var i = 0; i < globObj.events.length; i++)
                {
                    if (globObj.events[i][0] === obj && globObj.events[i][1] === evn)
                    {
                        obj.off(evn, handle);
                        break;
                    }
                }

            }
            function removeAllEvent()
            {
                for (var i = 0; i < globObj.events.length; i++)
                {
                    globObj.events[i][0].off(globObj.events[i][1], globObj.events[i][2]);
                }

            }
            function addAllEvent()
            {
                for (var i = 0; i < globObj.events.length; i++)
                {
                    globObj.events[i][0].on(globObj.events[i][1], globObj.events[i][2]);
                }
            }
            this.resizeParent = function (ev, ui)
            {
                _this.controlPanel.css({"left": (ui.position.left + ui.size.width + 20) + "px", "top": (ui.position.top + 20) + "px"});
            };
            this.resizeStopParent = function (ev, ui)
            {
                //_this.controlPanel.css({"left":(ui.position.left+ui.size.width + 20)+"px","top":(ui.position.top + 20)+"px"});	
            };
            this.resizing = function (e, ui)
            {
                //console.log("here")
                var ele = $("#" + e.target.id);
                var data = ele.data("prop");
                data.width = parseInt(ui.size.width) + "px";
                data.height = parseInt(ui.size.height) + "px";
                data.top = parseInt(ui.position.top) + "px";
                data.left = parseInt(ui.position.left) + "px";
            };
            this.dragging = function (e, ui)
            {
                var ele = $("#" + e.target.id);
                var data = ele.data("prop");
                data.top = parseInt(ui.position.top) + "px";
                data.left = parseInt(ui.position.left) + "px";
            };
            //function to create hotspot
            var createHotSpot = function (id, top, left, width, height, isCor, type)
            {
                if (type == 'square') {
                    spotClass = ' multipleselect_hotSpotCanSquare';
                } else {
                    spotClass = '';
                }
                var hs = $('<div class="multipleselect_hotSpotCan' + spotClass + '" id="' + id + '">' + _this.tickDiv + '</div>');
                _this.parentDiv.append(hs);

                //console.log(top + "   " + left + "    " + width + "    " + height)
                hs.css({"position": "absolute"}).data("prop", {"top": top, "left": left, "width": width, "height": height, "id": id, "isCorr": isCor, "clicked": false}).data("type", type);
                addEvent(hs, globObj.userevents.click, hsClicked);
                if (_this.userType === "student")
                {
                    hs.css({"left": left, "top": top, "width": width, "height": height, "border": "2px solid transparent"});
                }
                if (_this.userType == 'author') {
                    if (_this.isShowTick) {
                        hs.find('.tickImg').show();
                    }
                }
                return hs;
            };

            var setUserAnswer = function (clickedSpots)
            {
                var clickedSpots = $.extend([],_this.clickedSpots);
                for (var i = 0; i < clickedSpots.length; i++)
                {
                    var ele = clickedSpots[i];
                    $(_this.parentDiv).find("#" + ele).trigger('click');
                }
                for (var i = 0; i < clickedSpots.length; i++)
                {
                    var ele = clickedSpots[i];
                    $(_this.parentDiv).find("#" + ele).trigger('click');
                }

            };

            var revealAnswer = function ()
            {
                var clickedSpots = $.extend([],_this.clickedSpots);
                for (var i = 0; i < clickedSpots.length; i++)
                {
                    var ele = clickedSpots[i];
                    $(_this.parentDiv).find("#" + ele).trigger('click');
                }
                _.each(_this.spotsAns, function (ans, key) {
                    if (ans.isCorr) {
                        var ele = key;
                        $(_this.parentDiv).find("#" + ele).trigger('click');
                    }

                });

            };

            //function to get hotspot click event
            var hsClicked = function (e)
            {		//alert(_this.userType)
                ele = e.currentTarget;
                var el = $(_this.parentDiv).find("#" + ele.id);

                if (_this.clickedSpots.contains(ele.id))
                {
                    var index = _this.clickedSpots.indexOf(ele.id);
                    if (index != -1) { // check if notification exist in queue
                        _this.clickedSpots.splice(index, 1);
                    }
                } else {
                    _this.clickedSpots.push(ele.id);
                }

                if (_this.userType === "author")
                {
                    _this.makeCorrect.show();
                    _this.deleteHotSpot.show();
                    _this.hotspotSettingPanel.show();
                    _this.controlPanel.find('#width').val(el.css('width'));
                    _this.controlPanel.find('#height').val(el.css('height'));
                    _this.controlPanel.find('#left').val(el.css('left'));
                    _this.controlPanel.find('#top').val(el.css('top'));
                    if (el.data("prop").isCorr)
                    {
                        _this.makeCorrect.html(incorrectButtonText);
                    }
                    else
                    {
                        _this.makeCorrect.html(correctButtonText);
                    }
                }
                else if (_this.userType === "student")
                {
                    //$("#"+ele.id).css({"background-color":"orange","border-color":"black"})

                    if (_this.isSingleSelect)
                    {

                        for (var i = 0; i < _this.parentDiv.find(".multipleselect_hotSpotCan").length; i++)
                        {
                            _this.parentDiv.find(".multipleselect_hotSpotCan").eq(i).css("border-color", "transparent");
                            _this.parentDiv.find(".multipleselect_hotSpotCan").eq(i).data("prop").clicked = false;
                            if (_this.isShowTick) {
                                _this.parentDiv.find(".multipleselect_hotSpotCan").eq(i).find('.tickImg').hide();
                            }
                        }
                        if (_this.isShowTick) {
                            _this.parentDiv.find("#" + ele.id).find('.tickImg').show();
                        } else {
                            _this.parentDiv.find("#" + ele.id).css("border-color", "black");
                        }
                        _this.parentDiv.find("#" + ele.id).data("prop").clicked = true;
                    }
                    else
                    {
                        if (_this.parentDiv.find("#" + ele.id).data("prop").clicked === true)
                        {
                            _this.parentDiv.find("#" + ele.id).css("border-color", "transparent");
                            _this.parentDiv.find("#" + ele.id).data("prop").clicked = false;
                            if (_this.isShowTick) {
                                _this.parentDiv.find("#" + ele.id).find('.tickImg').hide();
                            }
                        }
                        else
                        {
                            if (_this.isShowTick) {
                                _this.parentDiv.find("#" + ele.id).find('.tickImg').show();
                            } else {
                                _this.parentDiv.find("#" + ele.id).css("border-color", "black");
                            }
                            _this.parentDiv.find("#" + ele.id).data("prop").clicked = true;
                        }
                    }

                }

            };
            //function to make hotspot correct
            var makeCorrect = function (e)
            {
                //console.log($(_this.parentDiv).find("#"+ele.id).data("prop"))
                resizeModule.startElementResize("#" + ele.id);
                if ($(_this.parentDiv).find("#" + ele.id).data("prop").isCorr)
                {
                    $(_this.parentDiv).find("#" + ele.id).css("border-color", "red").data("prop").isCorr = false;
                    _this.makeCorrect.html(correctButtonText);
                }
                else
                {
                    //console.log($(_this.parentDiv).find("#"+ele.id).data("prop"))
                    $(_this.parentDiv).find("#" + ele.id).css("border-color", "green").data("prop").isCorr = true;
                    _this.makeCorrect.html(incorrectButtonText);
                }
                e.stopPropagation();
            };
            //function for submit click event
            var submitClicked = function ()
            {
                var validation = _this.validate();
                if (!validation.result)
                {
                    _this.popup.dialog({
                        modal: true,
                        resizable: false,
                        buttons: {
                            "Ok": function ()
                            {
                                $(this).dialog("close");
                            },
                        }
                    });
                    _this.popup.find("p").html(validation.msg);
                    isCorrQuest = false;
                }
                else
                {
                    _this.popup.find("p").html(validation.msg);
                    _this.popup.dialog({
                        modal: true,
                        resizable: false,
                        buttons: {
                            "Yes": function ()
                            {
                                isCorrQuest = true;
                                console.log(JSON.stringify(_this.getWidgetData()));
                                $(this).dialog("close");
                            },
                            "No": function ()
                            {
                                $(this).dialog("close");
                            }
                        }
                    });

                }
            };

            // Close control panel
            var closeControlPanel = function () {
                _this.controlPanel.hide();
            }

            //function to delete hotspot
            var showHideTick = function (e)
            {
                if (_this.isShowTick) {
                    _this.isShowTick = false;
                    _this.parentDiv.find('.tickImg').hide();
                    _this.showHideTickBtn.html(showTickButtonText);
                } else {
                    _this.isShowTick = true;
                    _this.parentDiv.find('.tickImg').show();
                    _this.showHideTickBtn.html(hideTickButtonText);
                }
            };


            //function to make single/multi Select
            var isSingleSelect = function (e)
            {
                if (_this.isSingleSelect)
                {
                    _this.isSingleSelect = false;
                    _this.singleSelect.html(singleSelectButtonText);
                } else {
                    _this.isSingleSelect = true;
                    _this.singleSelect.html(multiSelectButtonText);
                }
            };

            //function to delete hotspot
            var deleteHotSpot = function (e)
            {
                _this.parentDiv.find("#" + ele.id).remove();
                _this.makeCorrect.hide();
                _this.deleteHotSpot.hide();
                _this.hotspotSettingPanel.hide()
            };

            //function to delete all hotspots
            var deleteGroup = function (e)
            {
                _this.destroy();
                /*_this.contentArea.find(".multipleselect_hotSpotCan").remove();
                 _this.makeCorrect.hide();
                 _this.deleteHotSpot.hide();
                 hsId = 0;
                 ele = null;
                 isCorrQuest = false;*/
            };
            //function to set specific property to parent div
            this.setProperty = function (prop, val)
            {
                this.parentDiv.css(prop, val);
            };
            //function to get specific property of parent div
            this.getProperty = function (prop)
            {
                return this.parentDiv.css(prop);
            };
            //function to validate component
            this.validate = function (attCount)
            {
                var isFound = true;
                var corrAns = 0;
                if (this.userType === "student")
                {
                    for (var i = 0; i < _this.clickedSpots.length; i++)
                    {
                        var ele = _this.clickedSpots[i];
                        if (!_this.spotsAns[ele].isCorr)
                        {
                            isFound = false;
                            if (attCount !== "specific")
                            {
                                //ele.css({"border-color":"red"});
                            }
                        }
                        else
                        {
                            corrAns++;
                        }
                    }

                    if (_this.noOfCorrectAns != corrAns) {
                        isFound = false;
                    }
                    //console.log(this.grpId)
                    if (attCount === "specific")
                    {
                        _this.deactivate();
                    }
                    /*	return {
                     validate : isFound,
                     grpId :	this.grpId
                     }*/
                    return isFound;
                }
                else if (this.userType === "author")
                {
                    var obj;

                    if (parseInt(_this.parentDiv.find(".multipleselect_hotSpotCan").length) <= 0)
                    {
                        obj = {result: false, msg: "Please add hotspots on screen"};
                    }
                    var isFound = false;
                    for (var i = 0; i < parseInt(_this.parentDiv.find(".multipleselect_hotSpotCan").length); i++)
                    {
                        var ele = _this.parentDiv.find(".multipleselect_hotSpotCan").eq(i);
                        if (ele.data("prop").isCorr === true)
                        {
                            isFound = true;
                            obj = {result: true, msg: "Are you sure you want to submit your question?"};
                            break;
                        }
                    }
                    if (!isFound)
                    {
                        obj = {result: false, msg: "Please select atleast one right answer."};
                    }
                    if (!obj.result)
                    {
                        _this.popup.dialog({
                            modal: true,
                            resizable: false,
                            buttons: {
                                "Ok": function ()
                                {
                                    $(this).dialog("close");
                                },
                            }
                        });
                        _this.popup.find("p").html(obj.msg);
                        isCorrQuest = false;
                    }
                    else
                    {
                        _this.popup.find("p").html(obj.msg);
                        _this.popup.dialog({
                            modal: true,
                            resizable: false,
                            buttons: {
                                "Yes": function ()
                                {
                                    isCorrQuest = true;
                                    console.log(JSON.stringify(_this.getWidgetData()));
                                    $(this).dialog("close");
                                },
                                "No": function ()
                                {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                }

            };
            //function to reset component
            this.reset = function ()
            {
                if (this.userType === "author")
                {
                    _this.parentDiv.find(".multipleselect_hotSpotCan").remove();
                    _this.makeCorrect.hide();
                    _this.deleteHotSpot.hide();
                    _this.hotspotSettingPanel.hide()
                    hsId = 0;
                    ele = null;
                    isCorrQuest = false;
                }
                else if (this.userType === "student")
                {
                    _this.clickedSpots = [];
                    for (var i = 0; i < parseInt(_this.parentDiv.find(".multipleselect_hotSpotCan").length); i++)
                    {
                        _this.parentDiv.find(".multipleselect_hotSpotCan").eq(i).css({"border-color": "transparent", "cursor": "pointer"}).data("prop").clicked = false;
                        _this.parentDiv.find(".multipleselect_hotSpotCan").eq(i).find('.tickImg').hide();
                    }

                }
            };
            this.getWidgetType = function () {
                return "multipleSelect";
            };
            //function to get all data related to componenet
            this.getWidgetData = function ()
            {
                if (!_this.deleted) {
                    var returnObj = {
                        "left": this.parentDiv.css("left"),
                        "top": this.parentDiv.css("top"),
                        "width": this.parentDiv.css("width"),
                        "height": this.parentDiv.css("height"),
                        "noOfHotSpot": parseInt(this.parentDiv.find(".multipleselect_hotSpotCan").length),
                        "isCorrQuest": isCorrQuest,
                        "isShowTick": this.isShowTick,
                        "isSingleSelect": this.isSingleSelect,
                        "noOfCorrectAns": this.noOfCorrectAns,
                        "isDactivate": (this.disableDiv.css("display") == "none") ? false : true,
                        "grpId": this.grpId,
                    };
                    var corrCount = 0;
                    for (var i = 0; i < parseInt(this.parentDiv.find(".multipleselect_hotSpotCan").length); i++)
                    {
                        var ele = this.parentDiv.find(".multipleselect_hotSpotCan").eq(i);
                        if (ele.data("prop").isCorr)
                        {
                            corrCount++;
                        }
                        //console.log(ele.data("prop").left + "    " + ele.data("prop").top)
                        var tmpObj = {
                            "id": ele.data("prop").id,
                            "_x": ele.css("left"),
                            "_y": ele.css("top"),
                            "w": ele.css("width"),
                            "h": ele.css("height"),
                            "_t": ele.data("type"),
                            "isCorr": ele.data("prop").isCorr,
                        };

                        returnObj["hs" + i] = tmpObj;
                    }
                    if (corrCount > 1)
                    {
                        //returnObj["isSingleSelect"] = false;
                    }
                    else
                    {
                        //returnObj["isSingleSelect"] = true;
                    }
                    //console.log(returnObj)
                    return JSON.parse(JSON.stringify(returnObj));

                }
                return undefined;
                //console.log(this);
            };
            //function to activate component
            this.activate = function ()
            {
                addAllEvent();
                addAllDragable();
                for (var i = 0; i < parseInt(this.parentDiv.find(".multipleselect_hotSpotCan").length); i++)
                {
                    this.parentDiv.find(".multipleselect_hotSpotCan").css({"cursor": "pointer"});
                }
            };
            //function to deactivate component
            this.deactivate = function ()
            {
                removeAllEvent();
                removeAllDragable();
                for (var i = 0; i < parseInt(this.parentDiv.find(".multipleselect_hotSpotCan").length); i++)
                {
                    this.parentDiv.find(".multipleselect_hotSpotCan").css({"cursor": "auto"});
                }
            };
            //function to destroy component instance
            this.destroy = function ()
            {
                //console.log(_this.parentDiv)
                _this.parentDiv.remove();
                _this.controlPanel.remove();
                _this.deleted = true;
            };

            this.getUserAnswer = function ()
            {
                return _this.clickedSpots;
            };

            /*This will set the user answer*/
            this.setUserAnswer = function (val) {
                setUserAnswer(val);
            };

            /*This will reveal the answers*/
            this.revealAnswer = function () {

                revealAnswer();
            };

            this.initialize(options);
        };
/*
 * Created by ankit.goel on 2/20/14.
 */
/*Dependency files
 * css-labelWidget.css
 * js-jQuery v2.03, underscore v1.6, backbone v1.0, jQueryUI v1.8, ResizeModule.js, DraggableModule.js,Utility.js
 * html-
 * */
/*global $,Backbone,_,window,document,app,Role,draggableModule*/
var ImageUpload = (function(o) {
    "use strict";
    if (o !== window || typeof window.FileReader === "undefined") {
        throw "Your Browser do not support Html5 File Api";
    }

    var ajaxLoader = 'data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA',
            MaxSizeAllow = 1024 * 1024 * 1,
            imageFormatSupport = ["jpg", "png", "gif", "bmp"],
            isRoleAuthor = Role === "author",
            ImageUploaderModel = Backbone.Model.extend({
                "default": {},
                initialize: function(options) {
                    this.initObject = options;
                    this["default"] = options;
                },
                reset: function() {
                    this.set(this.initObject);
                },
                check: function(val) {
                }
            }),
    ImageUploaderView = Backbone.View.extend({
        styles: {
            position: "absolute"
        },
        initialize: function(options) {
            var o = this;
            o.model = options.model;
            o.model.on('change', o.render.bind(o));
            $(options.parent).append($('<div></div>').attr({'id': o.model.get('id'), class: "imgHolder"}).css(o.styles));
            o.el = $(options.parent).find("#" + o.model.get("id"))[0];
            o.$el = $(o.el);
            o.render();
            if (isRoleAuthor) {
                o.applyUploadEvents();
            }
        },
        title: function() {
            this.$el.attr('title', this.model.get('title'));
        },
        render: function() {
            var o = this, m = o.model;
            o.$el.css({
                left: m.get('left'),
                top: m.get('top'),
                height: m.get('height'),
                width: m.get('width')
            }).attr({
                title: m.get('title')
            });
            o.setBackground();

        },
        applyUploadEvents: function() {
            var o = this;
            o.el.ondragover = function() {
                this.classList.add('hover');
                return false;
            };
            o.el.ondragend = function() {
                this.classList.remove('hover');
                return false;
            };
            o.el.ondrop = function(e) {
                o.fileUpload(e, o);
            };
        },
        fileUpload: function(e, o) {
            e.preventDefault();
            var file = e.dataTransfer ? e.dataTransfer.files[0]
                    : e.target.files[0], reader, popup = $("#" + popupManager.popupInitialSetting.popId);
            popup.find('#image_validation_section .validation-msg').html('');
            function validationCheck(file) {
                var fileName = file.name || "", fileSize = file.size;
                var isValid = true, msg = '';

                var extension = fileName.split('.')[1];
                if (!imageFormatSupport.contains(extension)) {
                    isValid = false;
                    msg = "Please use proper image file";
                } else if (fileSize > MaxSizeAllow) {
                    isValid = false;
                    msg = "Max allowed file size is 2MB";
                }

                return {
                    isValid: isValid,
                    msg: msg
                }; // return result and message for error

            }
            var checkResult = validationCheck(file);
            if (!checkResult.isValid) {
                popup.find('#image_validation_section .validation-msg').html(checkResult.msg);
                return false;
            }
            reader = new FileReader();
            reader.onload = function(event) {
                //window.console.log(event.target);
                var i = new Image();
                i.onload = function() {
                    o.model.set({width: this.width, height: this.height, src: this.src});
//                    popup.find("#width").val(this.width + 'px');
//                    popup.find("#height").val(this.height + 'px');
                };
                i.src = event.target.result;
                //o.model.set('src', event.target.result);
            };
            reader.readAsDataURL(file);
            return false;
        },
        width: function() {
            this.$el.width(parseInt(this.model.get("width")));
        },
        height: function() {
            this.$el.height(parseInt(this.model.get("height")));
        },
        left: function() {
            this.$el.css("left", parseInt(this.model.get("left")));
        },
        top: function() {
            this.$el.css("top", parseInt(this.model.get("top")));
        },
        destroy: function() {
            this.model = undefined;
            this.$el.remove();
        },
        updateModel: function() {
            var a = this.$el;
            this.model.set({left: parseInt(a.css('left')), top: parseInt(a.css('top')), height: a.height(), width: a.width()}, {silent: true});
        },
        checkAnswer: function() {

        },
        setBackground: function() {
            this.el.style.background = 'url(' + this.model.get('src') + ') no-repeat 100% 100%';
            this.el.style.backgroundPosition = 'center';
        },
        reset: function() {
            this.model.reset();
        },
        correctVisual: function() {

        }, wrongVisual: function() {

        }
    }),
    uiSetting = {
        //  authorParent: "author_content_container",
        widthDifference: isRoleAuthor ? 10 : 0,
        resizeAndDrag: function(el, resizeSetting, draggableSetting) {
            typeof resizeModule !== "undefined" && resizeModule.makeResize(el, resizeSetting.callback, resizeSetting.context);
            typeof draggableModule !== "undefined" && draggableModule.makeDraggable(el);
        },
        getWidgetTemplate: function(obj) {//overrride this method
        },
        applyAuthorRelatedProperty: function(el, _this) {
            uiSetting.resizeAndDrag(el, {callback: function() {   //applying resizing and draggable to widget
                    // uiSetting.changeHeightAndWidth(arguments[0].target);
                }, context: _this});
        }
    },
    defaultSetting = {
        widgetType: "ImageUpload",
        left: 0,
        top: 0,
        height: 100,
        width: 100,
        id: "",
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAqCAYAAADxughHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAABaZSURBVGhDJZpZjFzpWYbfs5/aq6u62+2tvbXHE49nScaZzERJCEwSlJCZycAkYhHhIiARrhES4qYvgoSQuAQkEOKCi6AoiQSRIEggEhISxZPZsZ2xPfZ02+5uu6u79lN1dp6/xqNW9XLq/P//fe/3LqfGWv+X3y9du64it2Qrl+04ci1fkiPH8VXmtmzPlYpUVunKslxlZV95WcrjGimSyoDXZHEPzy81mQ9VOqHypM/7Kqq0L2qWHqhth+qN92TZufIiYLVUZWEpHkV8P5fDMo7jKUnHms0TeZ4lxypVZMViX2ZNl4vynHeWFu8t5ZeFxPus49/9elnxl5Rn/EFj2WzU3MhxOID9wRfXy2Vxsahj+7LzOYv4Slkg14S/1dnYTCU3NeUouUfKdQUHcay6BiPezwHttNRoPuOeGZumSKWnOB3KsypK85k811GWlapUqlpe7mg46mk4OeR+vNfswxwgTeWztj0vVBSFMueDQ9pZPlacsaCXciOPo+XcqM6h+NbyNI3mH7why3ilkmWuyLI14qZZ6bDxygcb4py2F9IJ3hMneviwx/XSgFOks0PNhkNNkwnXUmF+X5aJklkkm/uVFpsyReGedmkrGufUzFGr1dWRleMUocLBAzm81lptOWEgq1FVUQUJvi+XfVutb365DP22KkET9CS03WERA7GYLgV0iNanUwXAy+bm5p9FLzMWdayEazOq5bBJfm8gQ8UcXrPUlrl8PJqpHjY0nkzkVUPW4HoKURQxG6jS1Rnf08eMNUUXY1vtY6vKKzOF3KAS8B5gZIoYsb8oGlFks67pSL4YAwM3Z+l3n9kUFTWbM5t2rTYX0IVyzkFoGZsEU2wsWXxvu5ZmyaF8iuGC+dCje1SxWrHlcWmDgjSCFncLVGkCASBWrQQLvHtVXxnQSlKgGYB55s8CAfSS+aMQhaOgrGo6jeU0U+5RMKN0h90ZiNhAz3ybJDNlSWwgQ9FczaIZr792frPMY7A3UYWWOXZDVmCgkslyGSY2PxodyOZv8XSguDfjAJ4Ct8Y9DQALusu2rUBlxnw4uaZppMlsrsGU6tGBweEB+AaaCfDlQD7FKMwsAMWCTlTMz2YQwVy9Fiql+64H/pTJDz3NGfwSMhjHw8We8pxuMG9ZnPEV0/kSqP3Di6UZbL5VBpO0m8eYF5c309owZNOW5mAbAmMzUyAQ6uHuPbkUMncs1VtNDjqivQ77KLjOhnGoFjAJ6JSYF4v7pZTcYmB9OuHwGsdAEOiY2bOBoWal6tWGvGYA5RRaWq0Ay55q9TpFLiGfTIkpBjPmAM1xb0iLQBB7SBkFq/73L5YFN/M4+TRm+GgVJKv20jHayqLgJecgMRXzKqbZgWr87uC9ewuGcSoQBDc0e7GolOdzIIob+HUO5aqkC+YXcZIAT0O3dJprzToG561mQzFVSfqRrGmh+eKewLETqHAzhaCDbyh0qvFwpATyCWC1eDIHWcwWrFV4sOucm0dJptEYWix9Jbxa/JcnEUxRaJQOVLrMB6yWQbs5dDnjPXatRktsZZEZPIsFGbqcqtMVjw4kYDjhb5CRZlmsRqem2lKNDrpqdkK6hG4wZ2PmIetzf6NPdL3Srcmlk9Ys11LznKy4oUH/UNE01XycyIkMpCAG5sXom5lP3+hb+NdfKB3DVLmpVqy1tTW5FUOpUCv8LrXgfmBACz06EUVT1RlwwUIP+3fg9IABpjo1dkEHqlQrTeB95LLWafO9zzDeBgKc2zCTz310DFyPZGVr3F96uH97ATejHxl6ZE8GKtBZ6+wGYzLXfO8mOsWFri0HmJU1RNGmmEbrgIKhX0cXups2J22fOqkja+dZqMJYQbuqKXAqLOipgp5YFSAWodRAMOtFKqe0Fb0JO1UWQkiHMBGdTKDCkk0BEP4DGn5Vk+kDzWeIrM8wu2fpRkvyVlStPQdgIgVLXYWNC9wPzMF62eu35H3zp3IPUdIL3H80h7U4RBsUUBBzfy8EAXTRuALQJadx+cRmCVSqdbqw0uKESJzT4LRG3ELFMNRkvqsYmuw6tNdpKuh2NciHalUrOuxtqQbvozpAk06EdTqHYIHrBLaJoslCHzyvopifl7t0IXyCIh3TMN9jU1iRwoeN9tlQFRTgEJZspVB2859e13Kno8nFFdhyoKrZsHEXdNasZ8iE8QQFoZz88tpmbX1Nw1v31DjxiOLWSUVlSxNzAN+Ty839pKbTr72nvxwk+lSzq/6NLY3XjuiQSp6Ahgf7sNZorHkao7zLmo7QAWguYcGC4c5TYAdUC8gjzWHA1obi2TUlVpce4rmSLaUTDznbUTlmJm382gaFvIYvu76tpzL81yTRQQ1mNYTB5i1jZ6J44UYmkymS8Y1fKYuAVh3M9ZG1VWDkaPIw1281Gupdv62RHemz3QDbkOlH7x/q3d2h/vh3XtL2PNI/djvqPXYOZjIakGn43jXNDrbB8KrsdnUxjBaGsrCGsB86U3iMEWpslL9sKG88zUGYT8uA+R6b3eb3sSbRUPUK/u+fr+jxKzvqXLio//zMaQjkLqLrK645CnEJFh0u6EoK6zrOZ85tlkfA7A9u6OvFml7q39czewNt/fBVvXqHKg9DffvNLX3/xiGerKoWJrC7tKJLHz6qD+/e15WyoglQS3NP4XJD7bVl6DEGRnN4H00GKj5UbBb0sSTx1NZ0NqWSDSxHwaEMdW5zbW9xoDkC54SOfOby+L/fVLMX661XPinv1BHmbI+hp2jQsw/xGBMJmvlHOfyvPLbpTlKduTfX2ut7emMS6Y2DiaZ5oDD39YuDPrRoFL+iCKZa8WPoGEsC7LS/rSOjoa6e6FJJTzYVnwPFnKF16zVmBo7HEM6gzsCDzRYebQ51YjNmNVUay1BtH/ba0zwaYESnWqu04etcrX97T+23djR//gnd+2wbW3NXrdV1ZfYEAkLPmBdja3L0qR5gKr0vXdjMwF8P6jXS35kEmvSmmiAAPczZjFPXEKlmkGqawbCYuEfage68vaV9Frx55YaiRkv9sw0hsZAElpzXZF5lwLH3eX0hfgUUb8FgptIz6DWzYKsQreEQGXZ/CPWsuh29+OZQv/5OT//z/dfk0e29P/jkgjGD4BEOcBJ2a+D1BnKMmjMrLi0xvsspP7u+2WJwVy59SLc/ek53Dg+1jygx19JUqpsYQhtHBov4po1uqFPM7olWqDfu93QQIWBPn9PO2qOgfUqlRnwhcIhrCaVYDKONQzVDLaP2CGl1+RIwczW+9jMlo0NMYq5n8F1/cl86ubujv/2PN8Uca/TlT2l6cQOD2eIQJ7A5xkS08Fl4w1lPoVth+CEUlN3p/N7lzdXuhUX6a0CD7qUzSp5e0v5GU+mnj+rwTEvHgNwAn1NDQ57D+7TrvtqZqzu4ziZ4TvBJqyeber9zCbN5Avg0OURbmTF4qLtTX1USkiWAZ0YQyzGWOXCo7871sZ/t6+9++eMKf7Cl7/zrT/XtK7eELZW1hOi+/DnmhUKwYY7AARaGT7VKC5hOVATM7bhUaLrT/dZXS8c6okYTIZubNAgDkPhiWv1w9Kaaja7Wv3VdJWRg3OrncKfLJ3x0sanv3djW8XZL393a0eVGU8efPaMfc5jJ6RPgvwIMU+3/4rbs7a2FYLrbfTV8ukZwynHHJouQDvSRx85rsv9A28ybcQJHluva//hH1PvkJXnkjxjhWzrzCMKKHo1w4A1bIX4mK+4oenBLxRyX0P6rT5fDEadqtuSfO6GVoK1odgAF34Xv24QqFpvkev5vrmtreKgX0I41qv/m/kATHC+xQfcZ4H3YxUVtQ0Od+KoBZpEAqBFz5AC1AkAHkIZtTKPRfCa1AHqzhNmANYeo9yjD5lPIs+22tp57UoPLICU9RIdgvE4LZT+tsvcARtzHoHJfTKWFVk0G9+R87PO/tBlXXdW/96byFly/VIJZLsDR1SuGjQxYJ3r0daqF30r4+YcP+uqExvckagAtY6072PkwwEctNRcMZwxLjHM90lnS8koHSjahDONCPK20gBhupIT5Cgt7Dg1nQNflcAuLH+E0hhMdPNFdqLjPunkWKTmAfsY4gNkQRoW25lNoH7U37zv70iub3aNYDG+s5OFY6Rj/dOK8ysppedBvTEytpIE6V95XEiNciBn+VnYAE8FsF5YDqurq/+jQGDJIMiwHNY/MClQ4swsdorxo18LH1YI6nYKOyToW8DVGNPRqCyLxETsPQY7BfIZN9ynEvI3B5M0Zomuyqk+By4UHRJuAnIWYGz/pnPjaFzf7tOlXT57SQf+uRns9Tdwx3m0JAzdV1XD1d/4bYZqrHVo60yUKu6EmMWIXktuw1bcHU+wGFAlDjYkBQ+AyhWLmnGU2zwhpBCIOZ8JUlFCwAs8G9ObcI+XamcksJsezoQ9e6Szko7WGkg2CHiLpggSfoU9xw7mVyAdFLnEcMkUMidQTrn+0/piyh2d0dOlRneaC6lXo7eYYL3NaQ++YLvVD+TCTEtqeWdoBavcZzBE5IqLK4xkKjU0AI8CR+ApMciocJyxKkYzdNknQODyDd/MF+QCndPFUxuQfIwrW4qHEIqGbqINzJva2K3LPHeX9OUU74HoE0Z2haYhok07XRoqCgewYHo+G93SYvAvp1fTcxof1MXekdHhH+f41raS7+tpRS4+3XZ3FO606sdqU4Xi9oWOtmuKDQ200m3QJS82mBxPyhIu/Mk84jAiaTXEIoxsZKpxwQGMzZoS5xQNA/pvCXjkwXDwaMhpEQOOIau0PFSDG/lpTlVNkG3TKKWcUhDBngl4J5AhtNnB3Vl58edOvHWEeyOu0OZ15euLkuu6++r5Ga7TywNLla+/hjWzwz9/9mqYM7Wq1rvlkrGlhaw9fdRAxjBykRMVZmwOgIeYQVNjYoQTXar43JzPPBCoemZ4hPsKsnGqg/lYKi+Vslq4tLEiuJtflJrvz9wCYBcxENBhSNMiBa20svc/74znKfuwiyn6yoZS8MMAwHsOl3tnbVxX2iX5+FYNW15jc4dwZaWge5MW2HgCrDCiM8V5DELMLhErzmBXrbzZtrPbiMRLXmMc5JrMHYYDRI8kZkxjzJmBVP9pSi8OdXQq1zhodMky/DxzNYcg/KfN24VhVg+NnRcRSUEUIJyMiMt1mLoxIJnTZrOV0n1zdDPxc9Z07iAyYnxwQdGgVI1eHeaLtm9qnxFUoLqHVEUPXYdEBm42A2BTslq6P/TfJDRZi88YsCtvgcyrzcMGwkw3kfHTF9Md99lFN1rvycc2T7X1tI3q9sKnkM5d0Y3Cgs+hRvw9k6Njgxq6880dUffQ8Z++j5qbXCCBFqyHQAXNrmM/5/NmNzXVUctr0tE6rNipr2mGgj6GiQ6Ll3vZDqudp/xEMG1M0vP8Az1NXBPOEDLrP1mq0ucpN83SO//FIbDUWK2kIpvPBWG67qwK1j194VuPf/oSGZ9kYtF4+sa75/15TTlur58/q9a88Lf/yKXwWknl3V1VsUJaz8StvSU9tKF/uUh8ih3OGedslq9M7Y1Ipu/PI+RObh/2BVsDdJE90g0q+75XaqpVoSK7DalPukxukwaqiZ87Iv/VAw2kCxc5hq5FJ9tAuXaZ61bCqfQxdAh1Ph2T0k8c1/qOXlX31BU0vX1R85iQCB22SIOdLllbHsM5P3kYYbS3XYctn2SymcrTa1rmjiOiNHWXcnOSr9aWWrp9qwYIDuVgG82TezNsEQaV66Mj5C5v9nb4O4esfnzurB+SGCfNx4DJ8p4iWy0c1RElb8PqUOSjQh/bVm1TG1qhw1GcEfCq/wiztHg7oCrbw6dOqvPK8+q+8RC5pLiKwZ/KLUQpsuBuPyDgo9o9vyL7bk0M+T926dl56XJV3oFUgXLt6X2fm7JX3tnADL8JsP08YdMQTC0G3sTicJKSzDhLs9F55bDNd9bW/dlT5CgFqeldlh5tDbwEZOS9qSuhQsmoiqaUK8dZ+5x0t4ZSfXAq08vg5DcjrVQQxWqrhdAPt/OHzchpHaRKtQlgLWCiBJs2jP713X63Xrst9/YbmP+UVCGYOdiYu5f18S9Yb9xS+e6DD9/ZUgR0nNgMf1jRednVjXNHw/QfyVyEn0OLYCCkDbx6KO/rSI5sRIlgsV9h4pqzWk1vMWNw4047mdNA8MXSYk8Sll+SQi4ep4nt31IAt3v/ck/JuTzUekvSAhLHn5slLN11StvdQ7g4z9u4tNbd3VWfj3tZdZf1CyVuvqrHUlotlKbEsToDmwFJYARIlzDQbAxu2GbsalJZuPLWu/lXWrBN5WzAaXs/FYVjmUS3FcNxPX9wMIweqg8EX2cfiAjKEtcRF5sFXSCdd6BmYvXVbwZWb2ujt6jnE8Bb+KWche7CjLlHXjeY6xAC2klyjH/5I7lWy+GvvKLi5o6I3VNyDvk8iomT2kKRYoFveMlllPNTMiJp5ZgadOgGZnKI5dHgMXF1Y8bDrK/riJY0v1bTCnkpS4XA6VoVu+3TEav7FC6W9NyZCEoRWqnKPl6rl2OxyZfFATXzVclfb//W2PjpzNbuzp0dpZ4tQ1Yd+fwJFhyPaX/P07nSA5+pgL5iHoCFSLjmhCSMGahKw8jkC+ol1lbdId8TeCGIpH8zkxRADsDVJ1Hy04eDNjKfK6L5dJ+u32VfV03A4VZ1oNrVx5hxuimG0ICirQWfa33i5FLY8RGzC+pISP1Hl0qrmo0TL93e1MSxUTLARb9xVIxrIYgbub5PyzMM4ssoA09iqBXrqVEf3njyqtwczVedAZ8aMPXle/ev3FW8cV9jHIxVTnC1QRScMKdjoUQxtyyZ0sfnSPCgGxtCMKghlgck05JTWTbKUqhTQPGUssDIOzGk6N3PYhyGw+p+/VJYPR2qQ9MxTkIILqhkswkLrYNEe4mav7ShloDeIrC3ywHWqPb1Ag/vkgbOQxIdqmjuhHs4GbAB4LFfVQAQfwEiNEZBE0U2wKpnN2t0BP9uq1GDAHhpDZ6ZL2HW8ViMC+8aruxAL4kyqM6O8gNYEei4wnx6wNebSx4/ZwDhm4B32anW/8Rul+bgM90X4oZVAoDagCs1lgha5PdvShGwQcmwXo9c8vqr9oFCHFGeC0Yghdt65B2W75Aoq1A7ltc2nxFSNA8zJMOYRak61jUh6i4dpZA4yhpkTh42lxGCh8uaTAMf4pgkha5nCtqoqZ+gS8da8ZwZEXQM/SKYYJ8wkpGOeL5sgGPzpF8pKp0lLYQ0YwwYSxYDMYJ50czDz4WiB5fBotY11yRhys6GYjBDMKR/VcsxHEWfAMqkt4sYVjJz5FHbx8YTx6/wzGzE+K2KYjZAtPgEwD6T5/vjqqnI2AzFqcBdieEgm77Y0omCATQ2oM4EsCvRt0S1igs9XiT0yz4C9FBcR/NkrZbi8vPjAJrl/a3GQzNwdpnI5nHkUmmH6bFirmFIx7PjiZqYy5pGlyRtmOI+1ZJnHMswLZL04gPkUbDEL5ryos4nEJkgFJgixRZtfmk+yEq614dqQOFBmwBXc+6h1nZ899mJSbX88UTw0AgmssP8ZZICjQqAhGzrPjPxmmeJZzGcj/iSWZXICw2OCjXlA4Bp+Z6hMVi34m/l42TIDWTEJjZrzO5vXooMVRzhJx4sngKZrufmfDUz6o0jGxZh/5nimO6bL5omj6Yy5PolxtBTJAsIRBetiiVotY0nMp8DmGuaELJLGiVIKZ1EE82muhTXK8kL/D3vjrEgOkCmAAAAAAElFTkSuQmCC",
        isResizeAllow: true,
        title: "Doggy"
    },
    popupManager = {
        popupInitialSetting: {
            popId: 'image_pop_singleton',
            labels: [/* "Enter Text",*/"Text Color", "Background Color"/*,"font-family"*/, "Font Size", "Bold", "Italic", "Underline", "Degree of Rotation"],
            inputName: [
                {id: "src", type: "file", label: "Upload image"},
                 {id: "title", type: "text", label: "Image tool tip"},
                {id: "left", type: "text", label: "Left"},
                {id: "top", type: "text", label: "Top"},
            ],
            buttonList: [
                //  {id:"upload",html:"Upload"},
                {id: "submit", html: "Submit"},
                {id: "removeElement", html: "Remove"},
                {id: "closeImageUpload", html: "Close"}
            ]
        },
        count: 0,
        updateStatus: function(type, popupContainer) {
            if (type === "+") {
                this.count++;
            }
            else {
                this.count && (this.count--);
                this.hide();
            }
            if (this.count <= 0) {
                this.removePop();
            } else {
                this.createPop(popupContainer);
            }
        },
        removePop: function() {
            $('#' + this.popupInitialSetting.popId).remove();
            $('#popup-overlay-imageUpload').remove();
        },
        createPop: function(popupContainer) {
            getConfigurationWindow(this.popupInitialSetting, popupContainer);
        },
        show: function(view, context) {
            this.updatePopFields(view);
            $('#popup-overlay-imageUpload').css('display', 'block');
            $('#image_validation_section .validation-msg').html('');
            var p = $("#" + popupManager.popupInitialSetting.popId).css("display", "block");
            p.find('#submit').off('click', popupManager.updateWidget).on('click', {view: view}, popupManager.updateWidget);
            p.find("#removeElement").off('click', context.destroy).on('click', context.destroy);
            p.find("#src").off('change').on('change', function(e) {
                view.fileUpload(e, view);
            });

        },
        updateWidget: function(e) {
            var m = e.data.view.model;
            var p = $('#' + popupManager.popupInitialSetting.popId);
            var s = popupManager.popupInitialSetting.inputName;
            for (var i = 0; i < s.length; i++) {
                if (s[i].id === "left" || s[i].id === "top" || s[i].id === "width" || s[i].id === "height") {
                    m.set(s[i].id, parseInt(p.find('#' + s[i].id)[0].value));
                } else if (s[i].type === "checkbox") {
                    m.set(s[i].id, p.find('#' + s[i].id)[0].checked);
                } else if (s[i].type === "radio") {
                    if (p.find("#" + s[i].id).is(":checked")) {
                        m.set(s[i].name, p.find('#' + s[i].id).val());
                    }
                } else if (s[i].id === "rotateLabelText") {
                    m.set(s[i].id, (-1) * parseInt(p.find('#' + s[i].id)[0].value));
                } else if (s[i].id !== "src") {
                    m.set(s[i].id, p.find('#' + s[i].id)[0].value);
                }
            }
            popupManager.hide();
        },
        updatePopFields: function(view) {
            var m = view.model;
            var p = $('#' + popupManager.popupInitialSetting.popId);
            var s = popupManager.popupInitialSetting.inputName;
            for (var i = 0; i < s.length; i++) {
                if (s[i].id === "left" || s[i].id === "top") {
                    p.find('#' + s[i].id)[0].value = m.get(s[i].id) + 'px';
                } else if (s[i].type === "checkbox") {
                    p.find('#' + s[i].id)[0].checked = m.get(s[i].id);
                } else if (s[i].type === "radio") {
                    var radioName = s[i].name;
                    var radioVal = m.get(s[i].name);
                    p.find('input[name="' + radioName + '"][value="' + radioVal + '"]').prop('checked', true);
                } else if (s[i].id === "rotateLabelText") {
                    p.find('#' + s[i].id)[0].value = (-1) * parseInt(m.get(s[i].id));
                } else if (s[i].id == "src") {
                    p.find('#' + s[i].id)[0].value = '';
                }
                else {
                    p.find('#' + s[i].id)[0].value = m.get(s[i].id);
                }
            }
        },
        hide: function() {
            $('#popup-overlay-imageUpload').css('display', 'none');
            $("#" + popupManager.popupInitialSetting.popId).css("display", "none");
        }
    };

    function getConfigurationWindow(setting, parent) {
        if ($('#' + setting.popId).length) {
            return false;
        }
        function makeSelect(i, s) {
            var list = s.split(','), a = '<select id="' + i + '">', k;
            for (k = 0; k < list.length; k++) {
                a = a + '<option value="' + list[k] + '">' + list[k] + '</option>';
            }
            return a + '</select>';
        }

        var popEl,
                labelNames = setting.labels,
                inputType = setting.inputName || [],
                buttonList = setting.buttonList || [],
                a = '<div class="popup-overlay" id="popup-overlay-imageUpload"></div><div id="' + setting.popId + '" class="popup_container"><div id="image_validation_section"><span class="validation-msg"></span></div><div>',
                group = false, labelClass, i;
        for (i = 0; i < inputType.length; i++) {
            labelClass = '';
            if (inputType[i].type !== "radio" || (inputType[i].name !== group)) {
                a = a + '</div><div class="pop-row">';
            } else {
                labelClass = 'group-label';
            }

            if (inputType[i].type !== "radio") {
                a = a + '<label class="' + labelClass + '">' + inputType[i].label + '</label>';
            } else if (inputType[i].groupLabel !== undefined) {
                a = a + '<label class="' + labelClass + '">' + inputType[i].groupLabel + '</label>';
            }

            if (inputType[i].type === "select") {
                a = a + makeSelect(inputType[i].id, inputType[i].options);
            } else if (inputType[i].type === "text") {
                a = a + '<input type="' + inputType[i].type + '" id="' + inputType[i].id + '" value="' + inputType[i].value + '">';
            } else if (inputType[i].type === "checkbox") {
                a = a + '<input checked="' + inputType[i].checked + '" type="' + inputType[i].type + '" id="' + inputType[i].id + '" value="' + inputType[i].value + '">';
            } else if (inputType[i].type === "radio") {
                a = a + '<input type="' + inputType[i].type + '" id="' + inputType[i].id + '" name="' + inputType[i].name + '" value="' + inputType[i].value + '">';
            } else if (inputType[i].type === "file") {
                a = a + '<input type="' + inputType[i].type + '" id="' + inputType[i].id + '">';
            }

            if (inputType[i].type === "radio") {
                a = a + '<label class="radio-label">' + inputType[i].label + '</label>';
                group = inputType[i].name;
            }
        }
        a = a + '<div style="clear: both;"></div>';
        for (var x = 0; x < buttonList.length; x++) {
            a = a + '<button class="button_decorator" type="button" id="' + buttonList[x].id + '">' + buttonList[x].html + '</button>';
        }
        $(parent).append(a + '</div>');

        popEl = $('#' + setting.popId);
        popEl.find('#closeImageUpload').on("click", popupManager.hide.bind(popupManager));
        // popEl.find('#upload').on("click", popupManager.hide.bind(popupManager));
        return true;
    }

    function labelWidget(options, imageContainer, popContainer) {
        /*defining all variable at once*/
        var _this = this, cSetting = {}, authParent, tView;
        /*Default setting of widget*/
        function init() {
            cSetting = $.extend({}, defaultSetting, options); //current setting based on options provided in instance making.
            cSetting.id = cSetting.id || (parseInt(Math.random() * 100) + '_ImageUpload_' + Date.now());
            if (imageContainer && popContainer && $(imageContainer).length && $(popContainer).length) {
                //     throw "Parent element is undefined";
                imageContainer = $(imageContainer);
                popContainer = $(popContainer);
            } else {
                imageContainer = $('body');
                popContainer = $('body');
            }
            tView = new ImageUploaderView({model: new ImageUploaderModel(cSetting), parent: imageContainer});
            if (isRoleAuthor) {
                uiSetting.applyAuthorRelatedProperty(tView.el, _this);
                popupManager.updateStatus('+', popContainer);
                tView.$el.bind('dblclick', {view: tView, context: _this}, function(e) {
                    e.stopPropagation();
                    e.data.view.updateModel();
                    popupManager.show(e.data.view, e.data.context);
                });
            }
        }

        init();
        /*
         *Api implementations for widget are here
         *
         */
        /*this will remove the widget from the screen*/
        _this.destroy = function() {
            if (!_this.deleted) {
                _this.deleted = true;
                tView.destroy();
                popupManager.updateStatus('-');
            }
        };
        /*This will reset the widget to its initial settings*/
        _this.reset = function() {
            if (!_this.deleted) {
                return undefined;
            }
        };
        /*This will set the property*/
        _this.setProperty = function(x) {
            if (!_this.deleted) {
                tView.model.set(x);
            }
            return undefined;
        };
        /*This will get the property as per the value provided in the options*/
        _this.getProperty = function(x) {
            if (!_this.deleted) {
                tView.updateModel();
                return tView.model.get(x);
            }
            return undefined;
        };
        /*It will validate the widget against the user inputs*/
        _this.validate = function(type) {
            if (!_this.deleted) {
                return true;
            }
            return undefined;
        };
        /*It will give the all data associated with the widget*/
        _this.getWidgetData = function() {
            if (!_this.deleted) {
                tView.updateModel();
                return tView.model.toJSON();
            }
            return undefined;
        };
        /*This will bring all the user input as each level of feedback*/
        _this.getUserAnswer = function() {
            if (!_this.deleted) {
                return tView.el.find("input").val();
            }
            return undefined;
        };

        _this.getWidgetType = function() {
            return tView.model.get("widgetType");
        };
        _this.deactivate = function() {
        };
        _this.activate = function() {
        };
    }
    labelWidget.prototype.toString = function() {
        return "This is Image Upload widget type";
    };

    return labelWidget;
})(window);
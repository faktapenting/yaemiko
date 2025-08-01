(function ($) {
    $.fn.xvalidation = function (options)
    {
        return this.each(function ()
        {
            var element = $(this);
            // Return early if this element already has a plugin instance
            if (element.data('xvalidation'))
                return;
            // pass options to plugin constructor
            var myplugin = new xvalidation(this, options);
            // Store plugin object in this element's data
            element.data('xvalidation', myplugin);
            element.data().xvalidation.methods.init();
        });
    };
    var xvalidation = function (target, options) {
        var componentObj = {
            telInput: false,
            customValidations: [],
            defaultText: "Invalid Format",
            fields: "fieldset,select,textarea,input[type=hidden],input[type=checkbox],input[type=text],input[type=email],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=datetime-local],input[type=date],input[type=url]",
            parentContainer: false,
            html5xvalidationon: false,
            errorClass: "error",
            notification: true,
            theme: "materialize", // bootstrap | bootstrap | bulma | none
            methods: {
                init: function () {
                    if (options != undefined) {
                        if (options.customValidations != undefined) {
                            componentObj.customValidations = options.customValidations;
                        }
                        if (options.notification != undefined) {
                            componentObj.notification = options.notification;
                        }
                        if (options.theme != undefined) {
                            componentObj.theme = options.theme;
                        }
                        switch (options.theme) {
                            case "bootstrap":
                            {
                                componentObj.errorClass = "has-error";
                                componentObj.parentContainer = true;
                                break;
                            }
                            case "materialize":
                            {
                                componentObj.errorClass = "invalid";
                                break;
                            }
                            case "bulma":
                            {
                                componentObj.errorClass = "is-danger";
                                break;
                            }
                            default:
                            {
                                componentObj.errorClass = "error";
                                break;
                            }

                        }

                        if (options.errorClass != undefined) {
                            componentObj.errorClass = options.errorClass;
                        }
                        if (options.parentContainer != undefined) {
                            componentObj.parentContainer = options.parentContainer;
                        }
                    }

                    $(target).find(componentObj.fields).each(function (i, e) {
                        $(e).data().order = i;

                        if ($(e).data().content === undefined) {
                            $(e).data("content", componentObj.defaultText);
                            $(e).attr("data-content", componentObj.defaultText);
                        }
                        /*
                        if (componentObj.theme == "bootstrap") {

                            $(e).popover({
                                trigger: "manual",
                                title: "Error",
                                container: target,
                                placement: "bottom"
                            });

                            $(e).on("focus", function () {
                                $(e).popover("hide");
                                $(e).parent().removeClass(componentObj.errorClass);
                            });
                            
                            $(e).on('hidden.bs.popover', function () {

                            });
                            $(e).on('shown.bs.popover', function () {
                                $(target).find(componentObj.fields).each(function (j, f) {
                                    if (i != j) {
                                        $(f).popover("hide");
                                        $(f).removeClass(componentObj.errorClass);
                                    }
                                });
                            });
                        }*/
                    });
                    
                    if(componentObj.telInput){
                        if (window.Intl != undefined) {
                            $(target).find("[data-validation=phone]").each(function (i, e) {
                                var telInput = $(e);
                                telInput.intlTelInput({
                                    utilsScript: "/js/utils.js",
                                    formatOnDisplay: true,
                                    customPlaceholder: function (selectedCountryPlaceholder, selectedCountryData) {
                                        return "Introduzca 10 dÃƒÂ­gitos";
                                    },
                                    autoFormat: true,
                                    allowDropdown: true,
                                    preferredCountries: ["mx", "us"]
                                });

                                telInput.blur(function () {
                                    if ($.trim(telInput.val())) {
                                      //  telInput.val(intlTelInputUtils.formatNumber(telInput.intlTelInput("getNumber")));
                                    }
                                });
                            });
                        }
                    }

                },
                validate: function () {

                    var valid = true;
                    $(target).find(componentObj.fields).each(function (i, e) {

                        if ($(e).prop("disabled"))
                            return true;

                        $(e).on("blur", function () {
                            $(this).removeClass(componentObj.errorClass);
                            $(this).next("span").remove();

                        });

                        var data_validation = $(e).data("validation");

                        if ($(e).data().optional) {
                            if ($(e).val().length < 1)
                                return true;
                        }

                        switch (data_validation) {
                            case "empty":
                            {
                                if ($(e).val().length > 0)
                                    valid = false;
                                break;
                            }

                            case "noempty":
                            {
                                if ($(e).val().trim() === "")
                                    valid = false;
                                break;
                            }
                            case "text":
                            {
                                if (!componentObj.methods.isText($(e).val().trim())) {
                                    valid = false;
                                }
                                break;
                            }
                            case "alphanumeric":
                            {
                                if (!componentObj.methods.isAlphaNumeric($(e).val().trim())) {
                                    valid = false;
                                }
                                break;
                            }
                            case "zip":
                            {
                                if (!componentObj.methods.isCP($(e).val())) {
                                    valid = false;
                                }
                                break;
                            }
                            case "email":
                            {
                                if (!componentObj.methods.isEmail($(e).val())) {
                                    valid = false;
                                }
                                break;
                            }
                            case "phone":
                            {
                                if(componentObj.telInput){
                                    if (window.Intl != undefined) {
                                        var telInput = $(e);
                                        console.log("El valor"+telInput.val());
                                        if ($.trim(telInput.val())) {
                                            if (!telInput.intlTelInput("isValidNumber")) {
                                                valid = false;
                                                console.log(telInput.intlTelInput("getNumber"));
                                            }
                                        }
                                    }
                                }
                                if (!componentObj.methods.isPhone($(e).val())) {
                                    valid = false;
                                }
                                break;
                            }
                            case "creditcard":
                            {
                                if (!componentObj.methods.isCreditCard($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "clabe":
                            {
                                if (!componentObj.methods.isClabe($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "numericonly":
                            {
                                if (!componentObj.methods.isNumeric($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "numericonlynozero":
                            {

                                if (!componentObj.methods.isNumeric($(e).val())) {
                                    valid = false;
                                }
                                if ($(e).val() <= 0) {
                                    valid = false;
                                }
                                break;

                            }

                            case "numericorempty":
                            {
                                if ($(e).val() != "") {
                                    if (!componentObj.methods.isNumeric($(e).val().trim())) {
                                        valid = false;
                                    }
                                }
                                break;

                            }
                            case "cvv":
                            {
                                if (!componentObj.methods.isCVV($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "serie":
                            {
                                if (!componentObj.methods.isSerie($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "cvvuser":
                            {
                                if (!componentObj.methods.isCVVuser($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "address":
                            {
                                if (!componentObj.methods.isAddress($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "expirymonth":
                            {
                                if (!componentObj.methods.cc_expiryMonth($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "expiryyear":
                            {
                                if (!componentObj.methods.cc_expiryYear($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "password":
                            {
                                if (!componentObj.methods.isPassword($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "domain":
                            {
                                if (!componentObj.methods.isDomain($(e).val())) {
                                    valid = false;
                                }
                                break;
                            }
                            case "url":
                            {
                                if (!componentObj.methods.isURL($(e).val())) {
                                    valid = false;
                                }
                                break;
                            }
                            case "date":
                            {
                                if (!componentObj.methods.isDate($(e).val())) {
                                    valid = false;
                                }
                                break;
                            }
                            case "rfc":
                            {
                                if (!componentObj.methods.isRFC($(e).val())) {
                                    valid = false;
                                }
                                break;

                            }
                            case "samepassword":
                            {
                                if ($(e).val() === "") {
                                    valid = false;
                                }
                                if ($(e).val() !== $(".samepassword2").val()) {
                                    valid = false;
                                }
                                break;

                            }
                            case "select":
                            {
                                if ($(e).val())
                                    valid = true;
                                else
                                    valid = false;
                                break;

                            }
                            case "checked":
                            {
                                valid = componentObj.methods.isChecked(e);
                            }
                        }

                        if (componentObj.customValidations !== undefined) {
                            for (var key in componentObj.customValidations) {
                                if (data_validation == componentObj.customValidations[key].name) {
                                    if (!componentObj.customValidations[key].validation(e)) {
                                        valid = false;
                                    }
                                }
                            }
                        }


                        if (!valid) {
                            if (componentObj.parentContainer) {
                                $(e).parent().addClass(componentObj.errorClass);
                            } else {
                                $(e).addClass(componentObj.errorClass);
                            }
                            if (componentObj.notification) {
                                switch (componentObj.theme) {
                                    case "materialize":
                                    {
                                        /*toast*/
                                        // Materialize.toast($(e).data().content, 3000, 'rounded');
                                        $(e).next("span.red-text.wrong").remove();
                                        $(e).after("<span class='red-text wrong'>" + $(e).data().content + "</span>");
                                        
                                        break;
                                    }
                                    case "bootstrap":
                                    {
                                        //$(e).popover("show");
                                        $(e).next("span.text-danger").remove();
                                        $(e).after("<span class='text-danger'>" + $(e).data().content + "</span>");
                                        
                                        break;
                                    }
                                    case "bulma":
                                    {
                                        $(e).next("span.has-text-danger").remove();
                                        $(e).after("<span class='has-text-danger is-size-7'>" + $(e).data().content + "</span>");
                                        break;
                                    }
                                    default:
                                    {
                                        alert($(e).data().content);
                                        break;
                                    }
                                }
                            }
                            $("html, body").animate({scrollTop: $(e).offset().top - 105}, 500, function () {
                                //$(e).focus();
                            });
                            return valid;
                        }

                    });

                    return valid;
                },
                isEmail: function (email) {
                    var patternMail = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
                    if (!patternMail.test(email)) {
                        return false;
                    }
                    return true;
                },
                isDomain: function (domain) {
                    var patternDomain = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/);
                    return domain.match(patternDomain);
                },
                isText: function (name) {
                    if (name === "")
                        return false;
                    var patternName = new RegExp(/^[a-zA-ZÃƒÂÃƒâ€°ÃƒÂÃƒâ€œÃƒÅ¡ÃƒÂ¡ÃƒÂ©ÃƒÂ­ÃƒÂ³ÃƒÂºÃƒÂ±Ãƒâ€˜ ]+$/);
                    if (!patternName.test(name)) {
                        return false;
                    }
                    return true;
                },
                isCreditCard: function (value) {
                    if (value.length < 16)
                        return false;
                    // accept only digits, dashes or spaces
                    if (/[^0-9-\s]+/.test(value))
                        return false;

                    // The Luhn Algorithm. It's so pretty.
                    var nCheck = 0, nDigit = 0, bEven = false;
                    value = value.replace(/\D/g, "");

                    for (var n = value.length - 1; n >= 0; n--) {
                        var cDigit = value.charAt(n),
                                nDigit = parseInt(cDigit, 10);

                        if (bEven) {
                            if ((nDigit *= 2) > 9)
                                nDigit -= 9;
                        }

                        nCheck += nDigit;
                        bEven = !bEven;
                    }

                    return (nCheck % 10) == 0;
                },
                isAlphaNumeric: function (name) {
                    if (name === "")
                        return false;
                    var patternName = new RegExp(/^[a-z0-9]+$/i);
                    if (!patternName.test(name)) {
                        return false;
                    }
                    return true;
                },
                isPhone: function (phone) {
                    var patternPhone = new RegExp(/^\d{10}$/);
                    if (!patternPhone.test(phone)) {
                        return false;
                    }
                    return true;
                },
                isCP: function (cp) {
                    var patternCP = new RegExp(/^[0-9]+$/);
                    if ((!patternCP.test(cp)) || cp.length != 5) {
                        return false;
                    }
                    return true;
                },
                isDate: function (date) {
                    var patternDate = new RegExp(/[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/);
                    if ((!patternDate.test(date))) {
                        return false;
                    }
                    return true;
                },
                isRFC: function (rfcStr) {
                    var rfcpat = new RegExp(/^([A-ZÃƒâ€˜&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/);
                    if (!rfcpat.test(rfcStr)) {
                        return false;
                    }
                    return true;
                },
                isClabe: function (clabe) {
                    var patternPhone = new RegExp(/^[0-9]+$/);
                    if (!patternPhone.test(clabe) || clabe.length != 18) {
                        return false;
                    }
                    return true;
                },
                isNumeric: function (n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                },
                isPassword: function (password) {
                    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/;
                    return re.test(password);
                    if (password.length < 8) {
                        return false;
                    }
                    return true;
                },
                isAddress: function (addr) {
                    var patternAddress = new RegExp(/^[a-zA-Z0-9ÃƒÂÃƒâ€°ÃƒÂÃƒâ€œÃƒÅ¡ÃƒÂ¡ÃƒÂ©ÃƒÂ­ÃƒÂ³ÃƒÂºÃƒÂ±Ãƒâ€˜\-().,# ]+$/);
                    if (!patternAddress.test(addr)) {
                        return false;
                    }
                    return true;
                },
                isCVV: function (cvv) {
                    var patternCVV = new RegExp(/^[0-9]+$/);
                    if (!patternCVV.test(cvv) || cvv.length < 3 || cvv.length > 4) {
                        return false;
                    }
                    return true;
                },
                isSerie: function (serie) {
                    if (serie.length == 10) {
                        if (componentObj.methods.isNumeric(serie)) {
                            return true;
                        }
                    }
                    return false;
                },
                isCVVuser: function (cvv) {
                    var patternCVV = new RegExp(/^[A-Z0-9-]+$/);
                    if (!patternCVV.test(cvv) || cvv.length < 3 || cvv.length > 4) {
                        return false;
                    }
                    return true;
                },
                cc_expiryMonth: function (d) {
                    if ((d > 12) || (d <= 0)) {
                        return false;
                    }
                    return true;
                },
                cc_expiryYear: function (d) {
                    if (d !== "") {
                        if (d < new Date().getFullYear() - 2000) {
                            return false;
                        }
                    } else
                        return false;

                    return true;
                },
                isURL: function (url) {
                    var regex = /^(ht|f)tps?:\/\/\w+([\.\-\w]+)?\.([a-z]{2,4}|travel)(:\d{2,5})?(\/.*)?$/i;
                    return regex.test(url);
                },
                isChecked: function (c) {
                    return $(c).is(":checked");
                }

            }
        };
        return componentObj;
    };
})(jQuery);

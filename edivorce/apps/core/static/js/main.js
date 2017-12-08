// Reveal sections as the form is loading
$('input:radio, input:checkbox').each(function () {
    if ($(this).is(':checked')) {
        if ($(this).is(':visible')) {
            reveal($(this));
        }
        // apply css class to big round buttons
        if ($(this).parent().hasClass('btn-radio')) {
            $(this).parent().addClass('active');
        }
    }
});

$('input[type=number]').each(function() {
    if ($(this).is(':visible')) {
        reveal($(this));
    }
});

$(window).load(function(){
    $('#questions_modal, #terms_modal').modal('show');
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body',
        trigger: 'click',
        placement:'auto right'
    });

    // All elements tagged with the following sum related data attributes
    // will be added together and the result written to the html element
    // at the sum target id.
    //      data-sum=[true|false] - indicates input field should be included as an addend of a sum
    //      data-sum_class=[class name] - all elements with the same sum class identifier will be
    //                                      addends of the same sum.
    //      data-sum_target_id=[target id] - id of the html element where result of sum will be written
    $('[data-sum="true"]').on('change', function() {
        var sum_class = $(this).data('sum_class');
        var sum_target_id = $(this).data('sum_target_id');
        sumFields('.' + sum_class, '#' + sum_target_id);
    });

    // All elements tagged with the following mirror related data attributes
    // will have the value of the input fields mirror in other html elements.
    //      data-mirror=[true|false] - indicates when input field changes, the value of the input field should
    //                                  be mirror in one or more other elements.
    //      data-mirror_target=[selector] - selector for the target element to copy value into
    //      data-mirror_scale=[year_up|month_down] - year_up will multiply the number by 12 and month_down will divide the
    //                                                  the number by twelve.
    //      data-mirror_broadcast_change=[true|false] - after change the target element will trigger a change event so
    //                                                  so any listener attached to target element are notified that
    //                                                  contents have changed.
    $('[data-mirror="true"]').on('change', mirrorOnChange);

    // Only close Terms and Conditions when user check the I agree checkbox
    $('#terms_agree_button').on('click', function() {
        $('#terms_warning').remove();
        if ($('#terms_checkbox').is(':checked')) {
            $('#terms_modal').modal('hide');
        }
        else {
            // show warning box and warning message if user does not check the box and click aceept
            $('#terms_and_conditions').addClass('has-warning-box').append('<span id="terms_warning" class="help-block">Please check the box</span>');
        }
    });

    $('body').on('click', function (e) {
        $('[data-toggle=tooltip]').each(function () {
            // hide any open popovers when the anywhere else in the body is clicked
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.tooltip').has(e.target).length === 0) {
                if(!$(e.target).hasClass('keep-tooltip-open')) {
                    $(this).tooltip('hide');
                }
            }
        });
    });

    // when user click textbox beside radio button, check the associated radio button
    $(".other-textbox").on("click", function () {
        $(this).parent().find('.radio-with-other').prop('checked', true);
    });

    $('input[type=number], input[type=radio], input[type=checkbox], input[type=text], .response-textarea, .response-dropdown').on('change', ajaxOnChange);

    // The designers want the dependent elements to be revealed as soon as the user completes input but before
    // they click on the next button. Using the keypress event with a small timeout to mimic an on change event
    // that does not require the current element to loose focus.
    $('input[name=number_children_over_19]').on('keypress', function() {
        var self = $(this);
        setTimeout(function(){ self.trigger('change');}, 50);
    });


    // If relationship is common law and they want spousal support, update spouse_support_act with hidden input field, spouse_support_act_common_law
    if ($("#spouse_support_act_common_law").length) {
        var el = $("#spouse_support_act_common_law");
        var question = el.prop('name');
        var value = getValue(el, question);
        ajaxCall(question, value);
    }

    // Add name button adds new input field for adding other name
    // Maximum of two other name fields allowed
    $("#btn_add_other_names").on('click', function () {
        if ($('#other_names_fields input[type=text]').length < 2) {
            $('#other_names_fields').append($('#other_names_group').children().clone(true));
        }

        showWarningOtherName();
    });

    // Show warning text when there are 2 other name fields
    var showWarningOtherName = function() {
        if ($('#other_names_fields input[type=text]').length >= 2) {
            $('#btn_add_other_names').hide();
            $('#other_name_warning_message').html("<p>Max 2 other names, please enter only the name variations to be shown on the order from the court</p>");
        }
    };

    // show warning message if other name field is already at its maximum number when the page rendered
    showWarningOtherName();

    var listControlGroups = [
        {
            table_selector: "#debt_table",
            add_button_selector: "#btn_add_debt",
            delete_button_selector: ".btn-delete-debt",
            input_field_selector: ".debt-input-field",
            clone_group_class: "debt-group",
            reveal_class: "debt-item-row"
        },
        {
            table_selector: "#expense_table",
            add_button_selector: "#btn_add_expense",
            delete_button_selector: ".btn-delete-expense",
            input_field_selector: ".expense-input-field",
            clone_group_class: "expense-group",
            reveal_class: "expense-item-row"
        },
        {
            table_selector: "#supporting_non_dependent_table",
            add_button_selector: "#btn_add_supporting_non_dependent",
            delete_button_selector: ".btn-delete-supporting-non-dependent",
            input_field_selector: ".supporting-non-dependent-input-field",
            clone_group_class: "supporting-non-dependent-group",
            reveal_class: "supporting-non-dependent-item-row"
        },
        {
            table_selector: "#supporting_dependent_table",
            add_button_selector: "#btn_add_supporting_dependent",
            delete_button_selector: ".btn-delete-supporting-dependent",
            input_field_selector: ".supporting-dependent-input-field",
            clone_group_class: "supporting-dependent-group",
            reveal_class: "supporting-dependent-item-row"
        },
        {
            table_selector: "#supporting_disabled_table",
            add_button_selector: "#btn_add_supporting_disabled",
            delete_button_selector: ".btn-delete-supporting-disabled",
            input_field_selector: ".supporting-disabled-input-field",
            clone_group_class: "supporting-disabled-group",
            reveal_class: "supporting-disabled-item-row"
        },
        {
            table_selector: "#income_others_table",
            add_button_selector: "#btn_add_income_others",
            delete_button_selector: ".btn-delete-income-others",
            input_field_selector: ".income-others-input-field",
            clone_group_class: "income-others-group",
            reveal_class: "income-others-item-row"
        },
        {
            table_selector: "#your_children_table",
            add_button_selector: "#btn_add_child",
            delete_button_selector: ".btn-delete-child",
            input_field_selector: ".child-field",
            clone_group_class: "child-disabled-group",
            reveal_class: "child-item-row",
            customAction: function(settings, newElement) {
                $('.children-questions').show();

                // Want the second list row because that is before the newElement
                // was appended.
                var childCounter = $(settings.input_field_selector).last().closest('tr').prev().attr('data-counter');

                // Update the child id suffix so that now which row in table to update with these values.
                var updatedChildCounter = parseInt(childCounter, 10) + 1;
                newElement.closest('tr').attr('data-counter', updatedChildCounter);
                newElement.find(settings.input_field_selector).each(function() {
                    var fieldId = replaceSuffix($(this).attr('id'), updatedChildCounter);
                    $(this).attr('id', fieldId);
                });

                // Ensure that any previously select fields are cleared before we populate the input field
                // with the row selected in the table.
                $('[type=radio]').prop('checked', false);
                $('.children-input-block').each(function() {
                    resetChildrenInputBlock($(this), updatedChildCounter);
                });

                // When click the delete button for a row, make sure any handlers attached to the inputs
                // have been cleared.
                newElement.find(settings.delete_button_selector).on('click', function() {
                    $('[type=radio]').prop('checked', false);
                    $('.children-input-block').each(function() {
                        resetChildrenInputBlock($(this), 'null');
                    });
                });

                // If the user clicks on the row, then should populate the input fields below the table
                // with the contents of the row.
                newElement.on('click', populateChildInputFields);
            },
            customDeleteAction: function(settings, element) {
                $('[type=radio]').prop('checked', false);
                $('.children-input-block').each(function() {
                    resetChildrenInputBlock($(this), 'null');
                });
                $('.children-questions').hide();
                deleteAddedTableRow(element);
                $('#btn_save_child').trigger('click');
            }
        }
    ];
    listControlGroups.forEach(registerTableRowAddRemoveHandlers);

    var resetChildrenInputBlock = function(element, childCounter) {
        if (element.prop('type') === 'text' || element.prop('type') === 'textarea') {
            element.val('');
        }

        element.find('[data-mirror="true"]').off('change');
        element.find('[data-mirror="true"]').on('change', mirrorOnChange);

        var mirrorTargetId = replaceSuffix(element.attr('data-mirror_target'), childCounter);
        element.attr('data-mirror_target', mirrorTargetId);
    };

    var populateChildInputFields = function() {
        $('.children-questions').show();
        $('.child-item-row').removeClass('table-cell-active');
        $(this).closest('tr').addClass('table-cell-active');

        $('[type=radio]').prop('checked', false);
        var activeChildRow = $(this).attr('data-counter');
        $(this).find('.child-field').each(function() {
            var fieldName = $(this).attr('data-target-form-field');
            var targetInput = $("input[name='" +fieldName + "']");
            if (targetInput.length === 0) {
                targetInput = $("textarea[name='" +fieldName + "']");
            }

            var mirrorTargetId = replaceSuffix(targetInput.attr('data-mirror_target'), activeChildRow);
            targetInput.attr('data-mirror_target', mirrorTargetId);

            if (targetInput.prop('type') === 'text' || targetInput.prop('type') === 'textarea') {
                targetInput.val($(this).text());
                targetInput.show();
            } else if (targetInput.prop('type') === 'radio') {
                targetInput.filter("[value='" + $(this).text() + "']").prop('checked', true);
            }
        });
    };

    $('.child-item-row').on('click', populateChildInputFields);
    $('#btn_save_child').on('click', function() {
        var childrenData = [];
        // The hidden row is the first now so make sure to skip it.
        $('#your_children_table').find('tbody:first').find('tr:gt(0)').each(function() {
           var childData = {};
            $(this).find('.child-field').each(function() {
               childData[$(this).attr('data-target-form-field')] = $(this).text();
            });

            childrenData.push(childData);
        });
        var jsonChildrenData = JSON.stringify(childrenData);
        ajaxCall($(this).prop('name'), jsonChildrenData);
    });

    $("#btn_add_reconciliation_periods").on('click', function () {
        $('#reconciliation_period_fields').append($('#reconciliation_period_group').children().clone());
        // add event lister for newly added from_date field, to_date field, delete button, and date picker
        $('#reconciliation_period_fields .reconciliation-from-date').last().on('change', ajaxOnChange);
        $('#reconciliation_period_fields .reconciliation-to-date').last().on('change', ajaxOnChange);
        $('#reconciliation_period_fields .btn-delete-period').last().on('click', {field_name: 'reconciliation_period_fields', button_name: 'btn_add_reconciliation_periods'}, deleteAddedField);
        date_picker('.date-pickers-group', true);
    });

    // Delete button will remove field and update user responses
    $(".btn-delete-name").on('click', {field_name: 'other_names_fields', button_name: 'btn_add_other_names'}, deleteAddedField);
    $(".btn-delete-period").on('click', {field_name: 'reconciliation_period_fields', button_name: 'btn_add_reconciliation_periods'}, deleteAddedField);

    // add date_picker
    date_picker('.date-picker-group', false);
    date_picker('.date-pickers-group', true);

    // On step_03.html, update text when user enters separation date
    $("#separated_date").on("change", function () {
        $("#separation_date_span").text(" on " + $(this).val());
        // if separation date is less than one year, show alert message
        if (checkSeparationDateLessThanYear($(this).val())) {
            $('#separation_date_alert').show();
        }
        else {
            $('#separation_date_alert').hide();
        }
    });

    // For want which order page
    // If either Spousal support or Division of property and debts is not selected show alert message
    // if user still wants to proceed(click next again), let them proceed to next page
    // DIV-529 Separate alert for child support
    $('#check_order_selected').on('click', function (e) {
        var showAlert = $(this).data('show_alert');
        var childSupport = $('input[data-target_id=child_support_alert]').prop('checked');
        var eligible = false;
        if (!childSupport) {
          var children = $('#unselected_child_support_alert').data('children-of-marriage');
          var under19 = $('#unselected_child_support_alert').data('children-number-under-19');
          var over19 = $('#unselected_child_support_alert').data('children-number-over-19');
          var reasons = $('#unselected_child_support_alert').data('children-financial-support')
          reasons = (reasons || []).filter((el) => { return el !== 'NO'; }).length > 0;
          eligible = children === 'YES' && (under19 > 0 || (over19 > 0 && reasons));
        }
        var proceedNext = $(this).data('proceed');
        if (!showAlert) {
            $(".checkbox-group input:checkbox").not(":checked").each(function () {
                if ($(this).val() === 'Division of property and debts' || $(this).val() === 'Spousal support') {
                    showAlert = true;
                }
            });
        }
        if ((showAlert || (!childSupport && eligible)) && !proceedNext) {
            $('#unselected_orders_alert').show();
            if (showAlert) { $('#unselected_spouse_property_alert').show(); }
            if (!childSupport && eligible) { $('#unselected_child_support_alert').show(); }
            e.preventDefault();
            $(this).data('proceed', true);
        }
    });

    // For Prequalification step 3
    // If there is invalid date on reconciliation period,
    // prevent user from navigate away from the page when user clicks next or back button, or use side navigation
    $('#btn_reconcilaition_back, #btn_reconcilaition_next, .progress-column > a').on('click', function(e){
        if ($('.invalid-date').is(':visible')) {
            e.preventDefault();
            $('.invalid-date').parent().siblings('.form-group').find('.reconciliation-from-date').focus();
        }
    });
    
    // For Fact Sheet A, automatically sum up the values in the various expense fields and provide the user with a total
    // in the total field.
    $('[data-mirror=true]').on('change', function(e) {
        var target_id = $(this).data("mirror_target_id");
        var scale_factor_identifier = $(this).data("mirror_scale");
        var broadcast_change = $(this).data("mirror_broadcast_change");

        if (target_id !== "undefined" && scale_factor_identifier !== "undefined") {
            var scaled_value = parseFloat($(this).val());
            if (scaled_value !== 0) {
                if (scale_factor_identifier === "year_up") {
                    scaled_value *= 12;
                } else if (scale_factor_identifier === "month_down") {
                    scaled_value /= 12;
                }

                var target_element = $('#' + target_id);
                target_element.val(scaled_value.toFixed(2));

                if (broadcast_change !== "undefined" && broadcast_change) {
                    target_element.trigger("change");
                }
            }
        }
    });

    $('.money').on('change', function() {
        var value = parseFloat($(this).val());
        $(this).val(value.toFixed(2));
    });

    $('.fact-sheet-input').on('focus', function() {
        $(this).closest('td').addClass('table-cell-active');
    }).on('focusout', function() {
        $(this).closest('td').removeClass('table-cell-active');
    });


    // spinner
    // $('a.spinner').on('click', function (e) {
    //     e.preventDefault();
    //     var href = $(this).attr('href');
    //     $('div#progress-overlay').show();
    //     $('div#progress-overlay-spinner').spin('large');
    //     setTimeout(function(){
    //         window.location.href = href;
    //     }, 1);
    // });

    $('a.save-spinner').on('click', function (e) {
        var href = $('a.save-spinner').attr('href');
        e.preventDefault();
        $('div#progress-overlay').show();
        $('div#progress-overlay-spinner').spin('large');

        setTimeout(function(){
            window.location.href = href;
        }, 0);

    });

    // kills the spinner when the back button is pressed
    $(window).on('pageshow', function () {
        $('div#progress-overlay').hide();
        $('div#progress-overlay-spinner').spin(false);
    });

    $('.info-modal').on('click', function (e) {
        e.preventDefault();
        $('#info_modal').modal('show');
    });

    $('.confirm-link').on('click', function (e) {
      if (!confirm($(e.target).data('message'))) {
        e.preventDefault();
      }
    });

    $('.previous-page').on('click', function(e) {
      e.preventDefault();
      window.history.back();
    });
});

var replaceSuffix = function(str, suffix) {
    if (str !== undefined && str.lastIndexOf('_') !== -1) {
        str = str.substr(0, str.lastIndexOf('_'));
        str += '_' + suffix;
    }
    return str;
};

// All elements tagged with the following mirror related data attributes
// will have the value of the input fields mirror in other html elements.
//      data-mirror=[true|false] - indicates when input field changes, the value of the input field should
//                                  be mirror in one or more other elements.
//      data-mirror_target=[selector] - selector for the target element to copy value into
//      data-mirror_scale=[year_up|month_down] - year_up will multiply the number by 12 and month_down will divide the
//                                                  the number by twelve.
//      data-mirror_broadcast_change=[true|false] - after change the target element will trigger a change event so
//                                                  so any listener attached to target element are notified that
//                                                  contents have changed.
var mirrorOnChange = function() {
    var target_select = $(this).attr("data-mirror_target");
    var scale_factor_identifier = $(this).attr("data-mirror_scale");
    var broadcast_change = $(this).attr("data-mirror_broadcast_change");
    var target_element = null;
    var source_value = $(this).val();

    if (target_select !== undefined) {
        target_element = $(target_select);

        if (scale_factor_identifier !== undefined) {
            var scaled_value = parseFloat(source_value);
            if (scaled_value !== 0) {
                if (scale_factor_identifier === "year_up") {
                    scaled_value *= 12;
                } else if (scale_factor_identifier === "month_down") {
                    scaled_value /= 12;
                }
                source_value = scaled_value.toFixed(2);
            }
        }
        if (target_element.is('div') || target_element.is('span')) {
            target_element.text(source_value);
        } else {
            target_element.val(source_value);
        }

        if (broadcast_change !== undefined && broadcast_change) {
            target_element.trigger("change");
        }
    }
};

// delete and added field and save the change
var deleteAddedField = function(e){
    var field = $('#' + e.data.field_name);
    var button = $('#' + e.data.button_name);
    $(this).parent('div').remove();

    //enable btn_add_other_names button
    if (button.prop('id') === "btn_add_other_names"){
        button.show();
        $('#other_name_warning_message').html("");
    }

    // when there is only one field left, clear it instead of delete it
    if (field.find('input:text').length < 1){
        button.triggerHandler('click');
    }
    // update by trigger change event on one of the text field
    field.find('input:text').first().triggerHandler('change');
};

var deleteAddedTableRow = function(element) {
    // If the element being removed contained the sum attribute, cache the addend
    // class and sum target id so that can remove the element then recalculate the
    // total with the remaining elements.
    var sumTargetElement = $(this).closest('tr').find('[data-sum="true"]');
    var sumClass = null;
    var sumTargetId = null;
    if (sumTargetElement !== undefined) {
        sumClass = sumTargetElement.data('sum_class');
        sumTargetId = sumTargetElement.data('sum_target_id');
    }

    element.closest('tr').remove();
    if (sumClass && sumTargetId) {
        sumFields('.' + sumClass, '#' + sumTargetId);
    }
};

var registerTableRowAddRemoveHandlers = function(settings) {
    var cleanUp = function() {
        if (settings.hasOwnProperty('customDeleteAction')) {
            settings.customDeleteAction(settings, $(this));
        } else {
            deleteAddedTableRow($(this));
        }
    };

    $(settings.delete_button_selector).on('click', cleanUp);
    $(settings.add_button_selector).on('click', function() {
        var newRow = $('.' + settings.clone_group_class).clone();
        newRow.show();
        newRow.removeClass(settings.clone_group_class);
        newRow.addClass(settings.reveal_class);
        newRow.find(settings.delete_button_selector).on('click', cleanUp);
        newRow.find(settings.input_field_selector)
            .on('change', ajaxOnChange)
            .on('focus', function() {
                $(this).closest('td').addClass('table-cell-active');
            })
            .on('focusout', function() {
                $(this).closest('td').removeClass('table-cell-active');
            });
        newRow.find('[data-sum="true"]').on('change', function() {
            var sumClass = $(this).data('sum_class');
            var sumTargetId = $(this).data('sum_target_id');
            sumFields('.' + sumClass, '#' + sumTargetId);
        });

        $(settings.table_selector).find('tbody:first').append(newRow);

        if (settings.hasOwnProperty('customAction')) {
            settings.customAction(settings, newRow);
        }
    });
};

var sumFields = function(addend_selector, sum_selector) {
    var total = 0.0;
    $(addend_selector).each(function () {
        if ($(this).val() !== undefined && $(this).val().length != 0) {
            total += parseFloat($(this).val());
        }
    });
    total = total.toFixed(2);
    if (addend_selector !== undefined) {
        if ($(sum_selector).is("p")) {
            $(sum_selector).text(total);
        }
        else {
            $(sum_selector).val(total);
            $(sum_selector).trigger("change");
        }
    }
};

// Configuration for datepicker
var date_picker = function (selector, showOnFocus) {
    var startDate, endDate;
    if($(selector).data("allow-future-date")){
        startDate = "+1d";
        endDate = "+100y";
    }
    else {
        startDate = "-100y";
        endDate = "0d";
    }
    $(selector).datepicker({
        format: "dd/mm/yyyy",
        startDate: startDate,
        endDate: endDate,
        autoclose: true,
        todayHighlight: true,
        immediateUpdates: true,
        showOnFocus: showOnFocus,
        startView: 'decade',
        clearBtn: true
    }).on('dp.change', function(e) {
         $(this).find('input').trigger('change');
    }).on('show', function(e) {
         $(this).closest(selector).find('input').attr('readonly','readonly');
    }).on('hide', function(e) {
         $(this).closest(selector).find('input').removeAttr('readonly');
    }).on('clearDate', function (e) {
        var input = $(this).closest(selector).find('input');
        ajaxCall(input.attr('name'), '')
    });
};

// Expand More Information boxes
var moreInfo = $(".more_information-column");
var moreInfoLink = $(".more_information-link a");
var contentColumn = $(".col-flex.content-column");
$(".more_information-link a").click(function () {
    if ($(moreInfo).hasClass("off-canvas")) {
        $(moreInfo).removeClass("off-canvas").addClass("on-canvas");
        $(moreInfoLink).addClass("active");
        $(contentColumn).removeClass("margin-right").addClass("no-margin-right");
    } else {
        $(moreInfo).removeClass("on-canvas").addClass("off-canvas");
        $(moreInfoLink).removeClass("active");
        $(contentColumn).removeClass("no-margin-right").addClass("margin-right");
    }
});
$("a.more_information-close").click(function () {
    var moreInfo = $(".more_information-column");
    $(moreInfo).removeClass("on-canvas").addClass("off-canvas");
    $(moreInfoLink).removeClass("active");
    $(contentColumn).removeClass("no-margin-right").addClass("margin-right");
});

// Change border color on well when child has focus

$(".question-well").click(function () {
    $(".question-well").removeClass('hasFocus');
    $(this).addClass('hasFocus');
});

// disable collapse for links in data-toggle elements
$('.no-collapse').on('click', function (e) {
    e.stopPropagation();
});


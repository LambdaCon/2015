/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, immed:false, latedef:true, newcap:true, noarg:true, noempty:true, nonew:true, undef:true, strict:false, trailing:true, 
  browser:true, jquery:true */
/*!
 * jQuery flexslider extension
 * Original author: @markirby
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {
  
  var flexsliderManualDirectionControls = 'flexsliderManualDirectionControls',
      defaults = {
        previousElementSelector: ".previous",
        nextElementSelector: ".next",
        disabledStateClassName: "disable"
      };

  function FlexsliderManualDirectionControls( element, options ) {
    this.element = element;
    this.options = $.extend( {}, defaults, options) ;

    this._flexslider = $(element).data('flexslider');
    this._originalFlexsliderWrapupFunction = this._flexslider.wrapup;
    this._defaults = defaults;
    this._name = flexsliderManualDirectionControls;

    this.init();
  }

  FlexsliderManualDirectionControls.prototype.init = function () {
      this.addEventListeners();
      var self = this;
      this._flexslider.wrapup = function(direction) {
        self.onAnimationEnd.call(self, direction);
      };
  };
  
  FlexsliderManualDirectionControls.prototype.addEventListeners = function() {
    
    $(this.element).find(this.options.previousElementSelector).bind('touchstart.flexsliderPromo click.flexsliderPromo', {self:this}, function(event) {
      event.stopPropagation();
      event.preventDefault();
      
      if (!event.handled) {
        event.data.self.goToTargetInDirection('prev');
        event.handled = true;
      }
      
    });

    $(this.element).find(this.options.nextElementSelector).bind('click.flexsliderPromo', {self:this}, function(event) {

      event.stopPropagation();
      event.preventDefault();

      if (!event.handled) {
        event.data.self.goToTargetInDirection('next');
        event.handled = true;
      }

    });
    
  };
  
  FlexsliderManualDirectionControls.prototype.goToTargetInDirection = function(direction) {
    
    var target = this._flexslider.getTarget(direction);
    
    if (this._flexslider.canAdvance(target)) {
      this._flexslider.flexAnimate(target);
    }
    
    return false;
  };
  
  FlexsliderManualDirectionControls.prototype.addOrRemoveDisabledStateForDirection = function(direction, $navElement) {
    var target = this._flexslider.getTarget(direction);
   
    if (!this._flexslider.canAdvance(target)) {
      $navElement.addClass(this.options.disabledStateClassName);
    } else {
      $navElement.removeClass(this.options.disabledStateClassName);
    }
  };
  
  FlexsliderManualDirectionControls.prototype.onAnimationEnd = function(direction) {
      var $nextElement = $(this.element).find(this.options.nextElementSelector),
      $previousElement = $(this.element).find(this.options.previousElementSelector);
      
      this.addOrRemoveDisabledStateForDirection('next', $nextElement);
      this.addOrRemoveDisabledStateForDirection('prev', $previousElement);
      
      this._originalFlexsliderWrapupFunction(direction);
  };
  
  $.fn[flexsliderManualDirectionControls] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + flexsliderManualDirectionControls)) {
        $.data(this, 'plugin_' + flexsliderManualDirectionControls,
        new FlexsliderManualDirectionControls( this, options ));
      }
    });
  };
  
})( jQuery, window, document );
(function(){
    window.app            = {el : {}, fn : {}};
    app.el['window']      = $(window);
    app.el['document']    = $(document);
    app.el['back-to-top'] = $('.back-to-top');
    app.el['html-body']   = $('html,body');
    app.el['loader']      = $('#loader');
    app.el['mask']        = $('#mask');

    app.fn.screenSize = function() {
        var size, width = app.el['window'].width();
        if(width < 320) size = "Not supported";
        else if(width < 480) size = "Mobile portrait";
        else if(width < 768) size = "Mobile landscape";
        else if(width < 960) size = "Tablet";
        else size = "Desktop";
        if (width < 768){$('.animated').removeClass('animated').removeClass('hiding');}
        // $('#screen').html( size + ' - ' + width );
        // console.log( size, width );
    };

    $(function() {
        //Preloader
        app.el['loader'].delay(200).fadeOut();
        app.el['mask'].delay(500).fadeOut("slow");

        // Resized based on screen size
        app.el['window'].resize(function() {
            app.fn.screenSize();
        });

        var flexSlider = $('.flexslider').flexslider({
          animation: "slide",
          animationLoop: false,
          itemWidth: 300,
          itemMargin: 5,
          minItems: 2,
          maxItems: 4,
          controlNav: false,
          directionNav: true,
          prevText: "",
          nextText: "",
          controlsContainer: "#speakers",
          useCSS: false
        });

        flexSlider.data('flexslider').pause();
        
        // fade in .back-to-top
        $(window).scroll(function () {
            if ($(this).scrollTop() > 500) {
                app.el['back-to-top'].fadeIn();
            }
            else {
                app.el['back-to-top'].fadeOut();
            }
        });

        // scroll body to 0px on click
        app.el['back-to-top'].click(function () {
            app.el['html-body'].animate({ scrollTop: 0 }, 1500);
            return false;
        });

        $('#mobileheader').html($('#header').html());

        function heroInit() {
            var hero       = jQuery('#hero'),
                winHeight  = jQuery(window).height(),
                heroHeight = winHeight;

            hero.css({height: heroHeight + "px"});
        };

        jQuery(window).on("resize", heroInit);
        jQuery(document).on("ready", heroInit);

        $('.navigation-bar').onePageNav({
            currentClass: 'active',
            changeHash: true,
            scrollSpeed: 750,
            scrollThreshold: 0.5,
            easing: 'swing'
        });

        $('.animated').appear(function(){
            var element = $(this);
            var animation = element.data('animation');
            var animationDelay = element.data('delay');
            if (animationDelay) {
                setTimeout(function() {
                    element.addClass( animation + " visible" );
                    element.removeClass('hiding');
                    if (element.hasClass('counter'))
                        element.find('.value').countTo();
                }, animationDelay);
            }
            else {
                element.addClass( animation + " visible" );
                element.removeClass('hiding');
                if (element.hasClass('counter'))
                element.find('.value').countTo();
            }
        }, {accY: -150});

        $('#header').waypoint('sticky', {
            wrapper: '<div class="sticky-wrapper" />',
            stuckClass: 'sticky'
        });

        $('.fancybox').fancybox();

        if (window.CKEDITOR) {
          CKEDITOR.on("instanceReady", function(event) {
              $('#cke_17').hide();
              $('#cke_1_contents').height('400px');
          });
          CKEDITOR.replace('abstract');
        }

        $.validator.addMethod("email", function(value, element) {
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
          return this.optional(element) || re.test(value);
        }, 'Invalid e-mail address');

        $.fn.serializeObject = function()
        {
          var o = {};
          var a = this.serializeArray();
          $.each(a, function() {
            if (o[this.name] !== undefined) {
              if (!o[this.name].push)
                o[this.name] = [o[this.name]];
              o[this.name].push(this.value || '');
            }
            else {
                o[this.name] = this.value || '';
            }
          });
          return o;
        };

        var $form = $('.form-register');

        if (!$form)
          return;

        $form.parent().find('.alert').hide();
        $form.validate();
        $form.on('submit', function () {
          event.preventDefault();
          if (!$form.valid())
            return;

          $form.find('button').attr('disabled', 'disabled');

          if (window.CKEDITOR) {
            for (instance in CKEDITOR.instances )
              CKEDITOR.instances[instance].updateElement();
          }

          var toSend = $form.serializeObject();
          toSend._replyto = $form.find('input[type=email]').val();
          toSend._subject = "Automatic e-mail";

          $.ajax({
            method: "POST",
            url: $form.attr('action'),
            data: toSend,
            dataType: "json",
            success: function () {
              $form.parent().find('.alert').hide().end().find('.alert-success').show().fadeOut(5000);
            },
            error: function () {
              $form.parent().find('.alert').hide().end().find('.alert-danger').show().fadeOut(5000);
            }
          }).always(function () {
             setTimeout(function() {
               location.assign('index.html')
             }, 3000);
           });
        });
    });
})();

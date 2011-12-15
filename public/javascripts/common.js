var INDOOR = (function() {

    var indoor = {};

    indoor.ui = {
        roll: {
            init:function() {

                indoor.ui.roll.animate()
                indoor.ui.savePositions.init()
                indoor.ui.savePositions.assign()
                indoor.ui.loadPositions.init()
                indoor.ui.restorePositions.init()
            },
            animate: function() {
                $('.demo').click(function() {
                    $('.demo').css('background', '#ff8811').removeClass('selected');
                    $(this).css('background', '#333').addClass('selected');
                });
            }
        },
        savePositions:{
            init: function() {
                /*
                 $('button').bind('click',function(){
                 INDOOR.ui.savePositions.store()
                 })
                 */
                $('.save-data').bind('click', function(e) {
                    e.preventDefault()
                    var left = $('.demo.selected').css('left'),
                        top = $('.demo.selected').css('top')
                    var elemId = parseInt($('.selected').attr('id').replace('block', '')) + 1
                    $('#holder').load('/save/' + left + '/' + top + '/' + elemId)
                })
            },
            store: function() {
                $('.demo').each(function() {
                    console.log($(this).css('top'))
                })
            },
            load:function() {
                // show top and left values
                // window.location.pathname('/load/')
            },
            assign: function() {
                $('.demo').each(function(i) {
                    $(this).attr('id', 'block' + (i))
                })
            }
        },
        loadPositions: {
            init: function(elemId) {
                console.log('loadPositions.init()')
                $('.load-data').bind('click', function(e) {
//						var elemId = parseInt($('.selected').attr('id').replace('block','')) + 1
                    var elemId = parseInt(elemId)
                    e.preventDefault()
                    $('#holder2').load('/load/' + elemId, 'body')

                    INDOOR.ui.loadPositions.loadPosition(elemId)
                })

            },
            loadPosition: function(elem) {
                var elem = parseInt(elem)

                $('.demo').eq(elem).css({top:topVal,left:leftVal})

            }
        },
        restorePositions:{
            init:function() {
//					indoor.ui.restorePositions.event()															
                indoor.ui.restorePositions.bindClick()
            },
            trigger:{
                init: function() {
                    indoor.ui.restorePositions.event(0)
                    indoor.ui.restorePositions.event(1)
                    indoor.ui.restorePositions.event(2)
                    indoor.ui.restorePositions.event(3)
                }
            },
            event:function(elemId) {
                $.getJSON('load/' + elemId, function(data) {
                    eventCoordinates = []
                    eventCoordinates.top = data.top
                    eventCoordinates.left = data.left
                    $('.demo').eq(elemId).css({top:eventCoordinates.top, left:eventCoordinates.left})
                });



//                alert(eventCoordinates.top)
//				set top and left val of elem


            },
            bindClick: function() {
                $('.restore-data').bind('click', function(e) {
                    INDOOR.ui.restorePositions.trigger.init()
                    e.preventDefault()
                })
            }
        }
    }
    indoor.app = function() {
        indoor.ui.roll.init()
        $('.demo')
            .draggable()
            .resizable();
        $('#container').bind('click', function(e) {
            $('#marker').remove();
            $('#container').append('<div id=marker>x</div>');
            $('#marker').css('marginLeft', e.pageX).css('marginTop', e.pageY);
            var originTop = $('.selected').offset().top,
                originLeft = $('.selected').offset().left,
                destinationTop = $('#marker').offset().top,
                destinationLeft = $('#marker').offset().left;
            if ($('.path').length) {
                $('.path').remove();
            }
            $('#container').append('<div class=path>o</div>');
            $('.path').css({
                marginLeft:originLeft,
                marginTop:originTop
            });
            $('.path').animate({
                    marginTop:destinationTop,
                    marginLeft:destinationLeft
                },
                {
                    duration:5000,
                    step: function(now, fx) {
//                            var data = fx.elem.id + ' ' + fx.prop + ': ' + now;

//                            if (fx.prop === 'marginLeft') {
//
//                                if (fx.now < 470) {
//                                    $('.path').stop();
//                                    var topMarginVal = $('.path').css('marginTop');
//                                    var topMarginVal = (parseInt(topMarginVal.replace('px', '')) + 95) + 'px';
//
//                                    $('.path').animate({
//                                        marginTop:topMarginVal
//                                    }, {
//                                        duration:'slow'
//                                    },function() {
////                                        alert('check')
//                                    });
//                                }
//                            }

                        if (fx.prop === 'marginLeft') {
                            var left = now
                        }
                        if (fx.prop === 'marginTop') {
                            var top = now
                        }
//                            console.log(left)
//                            console.log(top)

                        var $obstacle = $('.demo').eq(8)
                        var $obstacleTop = $($obstacle).offset().top - 25

                        var $obstacleLeft = $($obstacle).offset().left
                        var $obstacleHeight = $($obstacle).height()
                        var $obstacleWidth = $($obstacle).width()
                        var obstacleBoundLow = $obstacleTop + $obstacleHeight
                        var obstacleBoundWidth = $obstacleLeft + $obstacleWidth

//                            if left is greater than bound left then stop
                        if (top > $obstacleTop) {
                            $('.path').stop()

                            // console.log('current left: ' + left) // out of scope
                            // console.log('current top: ' + top)
                            // console.log('destination left: ' + destinationLeft)
                            // console.log('destination top: ' + destinationTop)
                            var pathLeft = $('.path').css('marginLeft')
//                                console.log('path location: ' + pathLeft)
//                                console.log('obstacle bound width: ' + obstacleBoundWidth)

                            var moveLeft = function () {
                                $('.path').animate({
                                    marginLeft:obstacleBoundWidth + 20
                                }, function() {
//                                        console.log('path top: ' + top)
//                                        console.log('obstacle top: ' + obstacleBoundLow)

                                    $('.path').animate({
                                        marginTop: destinationTop
                                    })
                                    $('.path').animate({
                                        marginLeft: destinationLeft
                                    })
                                })
                            }
                            var moveRight = function () {
                                $('.path').animate({
                                    marginLeft:$obstacleLeft - 20
                                }, function() {
//                                        console.log('path top: ' + top)
//                                        console.log('obstacle top: ' + obstacleBoundLow)

                                    $('.path').animate({
                                        marginTop: destinationTop
                                    })
                                    $('.path').animate({
                                        marginLeft: destinationLeft
                                    })
                                })
                            }

//                                console.log('check which side is shorter')
//                                console.log('path left: ' + pathLeft)
//                                console.log('left: ' + $obstacleLeft)
//                                console.log('width: ' + $obstacleWidth)
//                                console.log('width 1/2 ' + ($obstacleWidth / 2))
                            var halfObstacleWidth = $obstacleWidth / 2;
                            console.log('halfObstacleWidth: ' + halfObstacleWidth)
                            var obstacleCenter = obstacleBoundWidth - halfObstacleWidth;
                            console.log(obstacleCenter)

                            console.log('pathLeft : ' + pathLeft)
                            console.log('obstacleCenter : ' + obstacleCenter)
                            if (parseInt(pathLeft.replace('px', '')) < obstacleCenter) {
                                moveRight()
                            }
                            else {
                                moveLeft()
                            }

                        }

                    }
                }
            );


            function createPath() {
                var topDif = originTop - destTop;
                console.log('difference ' + topDif);
                $('.path').remove();
                $('#container').append('<div class=path>o</div>');
                $('.path').css({
                    marginLeft:originLeft,
                    marginTop:originTop
                })
            }
        });
    }
    indoor.app();
    return indoor;

}());
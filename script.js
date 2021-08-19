var completed = 0;

var audioPausa = new Audio('pausa.mp3');
var audioVoltar = new Audio('voltar.mp3');

$(document).ready(function () {

    var sessionLength = 25,
        breakLength = 5,
        isSession = true,
        timeLeft = sessionLength * 60,
        isPaused = true,
        getFormatedTime = function () {
            var m = Math.floor(timeLeft / 60),
                s = (timeLeft - m * 60);
            return m + ':' + (s < 10 ? '0' : '') + s;
        };

    var $fillAnimationSess = null,
        $fillAnimationBreak = null;
    var intervalCounter = null;

    var updateSettingsTimeValues = function () {
            $('.settings>.break>.value>.v').text(breakLength);
            $('.settings>.session>.value>.v').text(sessionLength);
        },
        pausePomodoro = function () {
            if ($fillAnimationSess !== null)
                $fillAnimationSess.stop();
            if ($fillAnimationBreak !== null)
                $fillAnimationBreak.stop();
            isPaused = true;
            clearInterval(intervalCounter);
            $('.status').text('Clique Para Começar');
        },
        nextStep = function () {
            if (isSession) {
                timeLeft = breakLength * 60;
                $('.fill.session').animate({
                    height: '100%'
                }, 500);
                $('.fill.break').animate({
                    height: '0%'
                }, 500);
                $fillAnimationBreak = $('.fill.break').animate({
                    height: '100%'
                }, (timeLeft * 1000));
                isSession = false;

                completed++;
                audioPausa.play();
                $('.completed').text('');

                if (completed > 3){
                    timeLeft = 25 * 60;
                    $('.fullcicle').append('🌳');
                }else{
                    for(i = 0; i < completed; i++)
                        $('.completed').append('🍅');
                }


            } else {
                $('.fill.session').animate({
                    height: '0%'
                }, 500);
                $('.fill.break').animate({
                    height: '0%'
                }, 500);

                audioVoltar.play();

                isSession = true;
                timeLeft = sessionLength * 60;

                $fillAnimationSess = $('.fill.session').animate({
                    height: '100%'
                }, (timeLeft * 1000));
            }
        },
        startPomodoro = function () {
            intervalCounter = setInterval(function () {
                if (timeLeft > 0) {
                    timeLeft--;
                    $('.pomodoro>.time-left').text(getFormatedTime());
                } else
                    nextStep();
            }, 1000);
            isPaused = false;
            isSession = !isSession;
            nextStep();
            $('.status').text('Clique Para Pausar');
        };
    $('.pomodoro>.time-left').text(getFormatedTime());
    $('.reset-pomodoro').on('click', function () {
        pausePomodoro();
        isSession = !isSession;
        nextStep();
        $('.pomodoro>.time-left').text(getFormatedTime());
    });
    $('.next-pomodoro').on('click', function () {
        pausePomodoro();
        isSession = !isSession;
        startPomodoro();
    });
    $('.pomodoro').on('click', function () {
        if (isPaused) {
            startPomodoro();
        } else {
            pausePomodoro();
        }
    });
    $('.control').on('click', function () {
        if ($(this).hasClass('is') && sessionLength < 100)
            sessionLength++;
        else if ($(this).hasClass('ds') && sessionLength > 1)
            sessionLength--;
        else if ($(this).hasClass('ib') && breakLength < 100)
            breakLength++;
        else if ($(this).hasClass('db') && breakLength > 1)
            breakLength--;
        else
            return false;

        pausePomodoro();
        if (isSession) {
            timeLeft = sessionLength * 60;
        } else {
            timeLeft = breakLength * 60;
        }
        $('.pomodoro>.time-left').text(getFormatedTime());
        updateSettingsTimeValues();
    });
});
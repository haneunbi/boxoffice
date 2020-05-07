var url = 'https://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/';
var key = '0aa6059abb8a9e34df0b69363a262fd5';

$(function () {
    resize();
    $(window).resize(function () {
        resize();
    });

    //viewDailyBoxOffice();
    viewWeeklyBoxOffice();

    $(document).on('click', '.btn_sel_range', function () {
        var $this = $(this);

        $this.addClass('on').siblings().removeClass('on');

        if ($this.hasClass('daily')) {
            viewDailyBoxOffice();
        } else {
            viewWeeklyBoxOffice();
        }
    });
}); //_ready

function resize() {
    var winW = $(window).width();
    var winH = $(window).height();
    var mt = winW > 540 ? '20' : $('.movie_wrap').offset().left;

    $('.movie_wrap').css({
        //'margin-top': mt,
        height: winH - mt * 2,
    });

    $('.movie_list').height($('.movie_wrap').height() - $('.movie_top').height());
}

function getPrevDay(d) {
    var today = new Date();
    var prevDay = today.getTime() - d * 24 * 60 * 60 * 1000;

    today.setTime(prevDay);

    var yyyy = today.getFullYear();
    var mm = today.getMonth() + 1; //January is 0!
    var dd = today.getDate();

    if (mm < 10) {
        mm = '0' + mm;
    }
    if (dd < 10) {
        dd = '0' + dd;
    }
    var result = yyyy + mm + dd;

    return result;
}

function viewDailyBoxOffice() {
    var date = getPrevDay(1); //1일 전
    var dailyUrl = url + 'searchDailyBoxOfficeList.json?key=' + key + '&targetDt=' + date; //일별 박스오피스

    $.ajax({
        type: 'GET',
        url: dailyUrl,
        dataType: 'JSON',
        success: function (data) {
            var result = data.boxOfficeResult;
            var movieList = result.dailyBoxOfficeList;

            $('.movie_title').text(result.boxofficeType);
            $('.movie_range').text(result.showRange.split('~', 1));
            bindingMovieList(movieList);
        },
        beforeSend: function () {
            $('.pop').show().find('.pop_wrap').html('<p class="pop_txt">로딩 중입니다..</p>');
        },
        complete: function () {
            $('.pop').hide();
        },
        error: function (xhr, status, error) {
            console.log('에러', error);
        },
    });
}

function viewWeeklyBoxOffice() {
    var weeklyDate = getPrevDay(7); //7일 전
    var weeklyUrl = url + 'searchWeeklyBoxOfficeList.json?key=' + key + '&targetDt=' + weeklyDate; //주말 박스오피스

    $.ajax({
        type: 'GET',
        url: weeklyUrl,
        dataType: 'JSON',
        success: function (data) {
            var result = data.boxOfficeResult;
            var movieList = result.weeklyBoxOfficeList;

            $('.movie_title').text(result.boxofficeType);
            $('.movie_range').text(result.showRange);
            bindingMovieList(movieList);
        },
        beforeSend: function () {
            $('.pop').show().find('.pop_wrap').html('<p class="pop_txt">로딩 중입니다..</p>');
        },
        complete: function () {
            $('.pop').hide();
        },
        error: function (xhr, status, error) {
            console.log('에러', error);
        },
    });
}

function bindingMovieList(movieList) {
    var ele = '';

    for (var i = 0; i < movieList.length; i++) {
        var rankNew = movieList[i].rankOldAndNew === 'NEW' ? '<span class="rank_new">NEW</span>' : '';

        ele += '<li class="movie_item">';
        ele += '	<span class="movie_idx">' + movieList[i].rank + '. </span>';
        ele += '	<span class="movie_name">' + movieList[i].movieNm + rankNew + '</span>';
        ele += '</li>';
    }

    $('.movie_list').html('').append(ele);
}

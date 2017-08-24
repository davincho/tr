$(function() {
  var slider = document.getElementById('slider');

  var filters = {
    days: [3, 77],
    sort: 'popularity',
    month: 9 // October
  };

  noUiSlider.create(slider, {
    start: filters.days,
    connect: true,
    range: {
      min: 3,
      max: 77
    }
  });

  slider.noUiSlider.on('update', function(values, handle) {
    $($('.slider-days').children()[0]).html(parseInt(values[0]) + ' days');
    $($('.slider-days').children()[1]).html(parseInt(values[1]) + ' days');

    filters.days = values;

    renderResults();
  });

  $('#month-filter li').on('click', function(event) {
    event.preventDefault();
    $(this).parent().children().removeClass('active');
    $(this).addClass('active');

    filters.month = parseInt($(this).data('value'));

    renderResults();
  });

  $('#sort').on('change', function(event) {
    filters.sort = event.target.value;
    renderResults();
  });

  function renderResults() {
    var $tourContainer = $('#tours');

    $tourContainer.empty();

    var days = filters.days;

    var sortedTours = tours.sort(function(tourA, tourB) {
      if (filters.sort === 'popularity') {
        return tourA.rating <= tourB.rating;
      } else if (filters.sort === 'duration') {
        return tourA.length <= tourB.length;
      }
    });

    sortedTours.forEach(function(tour) {
      if (tour.length < days[0] || tour.length > days[1]) {
        return;
      }

      var fullStars = Math.floor(tour.rating);
      var hasHalfStar = fullStars !== tour.rating;

      var availableDates = tour.dates.filter(function(date) {
        return (
          date.availability > 0 &&
          moment(date.start).get('month') === filters.month
        );
      });

      if (availableDates.length === 0) {
        return;
      }

      var cheapestPrice = _.reduce(
        availableDates,
        function(acc, date) {
          return !acc || acc > date.eur ? date.eur : acc;
        },
        null
      );

      var $dates = availableDates.map(function(date) {
        return (
          '<dt>' +
          moment(date.start).format('D MMM') +
          '</dt><dd' +
          (date.availability <= 10 ? 'class="oos"' : '') +
          '>' +
          date.availability +
          ' seats left</dd>'
        );
      });

      var $tour = $('#tour-template')
        .html()
        .replace(/%%TOUR_NAME%%/g, tour.name)
        .replace(/%%TOUR_CITIES%%/g, tour.cities.length)
        .replace(/%%TOUR_REVIEWS%%/g, tour.reviews)
        .replace(/%%TOUR_CITY_START%%/g, tour.cities[0].name)
        .replace(/%%TOUR_CITY_END%%/g, tour.cities[tour.cities.length - 1].name)
        .replace(/%%TOUR_URL%%/g, tour.url)
        .replace(/%%TOUR_CHEAPEST_PRICE%%/g, cheapestPrice)
        .replace(/%%TOUR_DESCRIPTION%%/g, tour.description)
        .replace(/%%TOUR_OPERATOR%%/g, tour.operator_name)
        .replace(/%%TOUR_DATES%%/g, $dates.join(''))
        .replace(/%%TOUR_LENGTH%%/g, tour.length)
        .replace(/%%TOUR_IMAGE%%/g, tour.images[0].url)
        .replace(
          /%%TOUR_STARS%%/,
          _.repeat(
            '<img src="./assets/star-full.svg" alt="star" />',
            fullStars
          ) +
            (hasHalfStar
              ? '<img src="./assets/star-half.png" alt="star" />'
              : '')
        );

      $tourContainer.append($tour);
    });

    $('img').lazyload({
      effect: 'fadeIn'
    });

    if ($tourContainer.children().length === 0) {
      $tourContainer.append($('#no-result-template').html());
    }
  }

  renderResults();
});

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
    $($('.slider-days').children()[0]).html(`${parseInt(values[0])} days`);
    $($('.slider-days').children()[1]).html(`${parseInt(values[1])} days`);

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

      var cheapestPrice = availableDates.reduce(function(acc, date) {
        return !acc || acc > date.eur ? date.eur : acc;
      }, null);

      console.log('cheapestPrice', availableDates, cheapestPrice);

      var $dates = availableDates.map(function(date) {
        return `<dt>${moment(date.start).format(
          'D MMM'
        )}</dt><dd ${date.availability <= 10 ? 'class="oos"' : ''}>${date.availability} seats left</dd>`;
      });

      var $tour = $(
        `
            <li class="tour pure-g">
                <div class="pure-u-1 pure-u-md-1-3">
                    <div class="img-container">
                        <img src="./assets/heart.svg" class="love" />
                        <a href="${tour.url}">
                            <img class="img" data-original="${tour.images[0]
                              .url}" />
                        </a>
                        <div class="controls">
                            <div class="stars">
                                ${'<img src="./assets/star-full.svg" alt="star" />'.repeat(
                                  fullStars
                                )}
                                ${hasHalfStar
                                  ? '<img src="./assets/star-half.png" alt="star" />'
                                  : ''}
                            </div>
                            <div class="reviews">${tour.reviews} Reviews</div>
                        </div> 
                    </div>
                </div>
                <div class="pure-u-1 pure-u-md-2-3">
                  <div class="content">
                    <div class="pure-g">
                      <div class="pure-u-1 pure-u-md-3-5">
                        <div class="content-inner md-border-r sm-border-b">
                          <h2 class="heading">${tour.name} - ${tour.length} days</h2>
                          <p class="teaser">${tour.description}</p>
                          <dl class="facts">
                            <dt>Days</dt>
                            <dd>${tour.length} days</dd>

                            <dt>Destinations</dt>
                            <dd>${tour.cities.length} cities</dd>

                            <dt>Starts / Ends</dt>
                            <dd>
                            ${tour.cities[0].name} /
                            ${tour.cities[tour.cities.length - 1].name}
                            </dd>

                            <dt>Operator</dt>
                            <dd>${tour.operator_name}</dd>
                          </dl>
                        </div>
                      </div>
                      <div class="pure-u-1 pure-u-md-2-5">
                        <div class="content-inner">
                          <div class="price-container">
                            Total price
                            <div class="price">
                            €${cheapestPrice}
                            </div>
                          </div>
                          <div class="divider" />
                          <dl class="dates">
                            ${$dates.join('')}
                          </dl>
                          <div class="divider" />
                          <a href="${tour.url}" class="btn more">View more</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </li>
        `
      );

      $tourContainer.append($tour);
    });

    $('img').lazyload({
      effect: 'fadeIn'
    });
  }

  renderResults();
});

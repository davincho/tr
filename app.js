$(function() {
  var slider = document.getElementById('slider');

  var filters = {
    days: [3, 77],
    sort: 'popularity'
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
      console.log('tour', tour);

      const fullStars = Math.floor(tour.rating);
      const hasHalfStar = fullStars !== tour.rating;

      var $tour = $(
        `
            <li class="tour pure-g">
                <div class="pure-u-1 pure-u-md-1-3">
                    <div class="img-container">
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
                        <a href="${tour.url}" class="btn more">View more</a>
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

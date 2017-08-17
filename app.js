$(function() {
  var $tourContainer = $('#tours');

  tours.forEach(function(tour) {
    console.log('tour', tour);

    const fullStars = Math.floor(tour.rating);
    const hasHalfStar = fullStars !== tour.rating;

    var $tour = $(
      `
        <li class="tour">
            <div class="img-container">
                <img src="${tour.images[0].url}" />
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
            <div class="content">
                <h2 class="heading">${tour.name} - ${tour.length} days</h2>
                <p class="teaser">${tour.description}</p>
                <table class="facts">
                    <tr>
                        <td>Days</td>
                        <td>${tour.length} days</td>
                    </tr>
                    <tr>
                        <td>Destinations</td>
                        <td>${tour.cities.length} cities</td>
                    </tr>
                    <tr>
                        <td>Starts / Ends</td>
                        <td>
                            ${tour.cities[0].name} /
                            ${tour.cities[tour.cities.length - 1].name}
                        </td>
                    </tr>
                    <tr>
                        <td>Operator</td>
                        <td>${tour.operator_name}</td>
                    </tr>
                </table>
            </div>
        </li>
    `
    );

    $tourContainer.append($tour);
  });
});

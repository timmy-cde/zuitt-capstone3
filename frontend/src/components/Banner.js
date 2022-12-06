import Carousel from 'react-bootstrap/Carousel';

// svg images
import Blob from '../media/blob.svg';
import Blob2 from '../media/blob2.svg';

import '../App.css'

export default function Banner() {
  return (
    <div className="d-none d-md-block">
      <Carousel variant="light" className="banner-item">
        <Carousel.Item
          className="banner-item"
        >
          <img className="d-block w-100" src={Blob} alt="First slide" />

          <Carousel.Caption>
            <span className="spanCarousel">
              <div className="d-block align-items-center">
                <h1>SUMMER SALE</h1>
                <h5>
                  Don't compromise on quality! Get 30% off for selected
                  products.
                </h5>
              </div>

              <div className="d-block align-items-center">
                <img
                  className="piano"
                  src={require("../media/piano-edited.png")}
                  alt="first slide"
                />
              </div>
            </span>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item
          className="banner-item"
        >
          <img className="d-block w-100" src={Blob2} alt="Second slide" />

          <Carousel.Caption>
            <span className="spanCarousel">
              <div className="d-block align-items-center">
                <h1>SUMMER SALE</h1>
                <h5>Be your best self! Get 30% off for selected products.</h5>
              </div>
              <div>
                <img
                  className="violin"
                  src={require("../media/violin-no-bg-2.png")}
                  alt="Second slide"
                />
              </div>
            </span>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}


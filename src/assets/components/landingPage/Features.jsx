import React from "react";
import Slider from "react-slick";

const Features = () => {
  const dishes = [
    {
      name: "Grilled Steak",
      img: "/images/grilled-steak.jpg",
      desc: "Juicy steak with herbs and garlic butter.",
      price: "$24",
    },
    {
      name: "Salmon Fillet",
      img: "/images/salmon-fillet.jpg",
      desc: "Fresh salmon with lemon and dill sauce.",
      price: "$18",
    },
    {
      name: "Pasta Alfredo",
      img: "/images/pasta-alfredo.jpg",
      desc: "Creamy fettuccine with parmesan and garlic.",
      price: "$15",
    },
    {
      name: "Veggie Salad",
      img: "/images/salad.jpg",
      desc: "Fresh organic vegetables with vinaigrette.",
      price: "$12",
    },
    {
      name: "Sushi Platter",
      img: "/images/sushi.jpg",
      desc: "Deluxe sushi made with premium ingredients.",
      price: "$20",
    },
    {
      name: "Chocolate Lava Cake",
      img: "/images/chocolate-cake.jpg",
      desc: "Warm cake with molten center and vanilla ice cream.",
      price: "$10",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="dish-menu py-5" id="menu">
      <div className="container">
        <h2 className="text-center mb-5">
          Our <span className="text-danger">Menu</span>
        </h2>
        <Slider {...settings}>
          {dishes.map((dish, index) => (
            <div key={index} className="px-3">
              <div className="dish-card text-center p-3 h-100 border rounded">
                <img
                  src={dish.img}
                  alt={dish.name}
                  className="img-fluid rounded-circle mb-3"
                  style={{
                    height: "180px",
                    width: "180px",
                    objectFit: "cover",
                    margin: "0 auto",
                  }}
                />
                <h3>{dish.name}</h3>
                <p>{dish.desc}</p>
                <span className="price fw-bold d-block mb-2">{dish.price}</span>
                <button className="btn btn-danger btn-add-to-cart">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Features;

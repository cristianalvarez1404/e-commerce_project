const users = [
  {
    username: "username 1",
    email: "email1@gmail.com",
    phone: 123,
    address: "AV 1234",
    password: "1234",
  },
  {
    username: "username 2",
    email: "email2@gmail.com",
    phone: 1234,
    address: "AV 12345",
    password: "12345",
  },
  {
    username: "username 3",
    email: "email3@gmail.com",
    phone: 12345,
    address: "AV 123456",
    password: "123456",
  },
  {
    username: "username 4",
    email: "email4@gmail.com",
    phone: 123456,
    address: "AV 1234567",
    password: "1234567",
  },
  {
    username: "username 5",
    email: "email5@gmail.com",
    phone: 1234567,
    address: "AV 12345678",
    password: "12345678",
  },
];

const products = [
  {
    title: "product 1",
    short_description: "product 1 description",
    price: 10, //USD
    inventory_id: "",
    image_id: "",
    comments: [""],
  },
  {
    title: "product 2",
    short_description: "product 2 description",
    price: 30, //USD
    inventory_id: "",
    image_id: "",
    comments: [""],
  },
  {
    title: "product 2",
    short_description: "product 3 description",
    price: 45, //USD
    inventory_id: "",
    image_id: "",
    comments: [""],
  },
  {
    title: "product 3",
    short_description: "product 4 description",
    price: 60, //USD
    inventory_id: "",
    image_id: "",
    comments: [""],
  },
  {
    title: "product 4",
    short_description: "product 5 description",
    price: 48, //USD
    inventory_id: "",
    image_id: "",
    comments: [""],
  },
  {
    title: "product 5",
    short_description: "product 6 description",
    price: 87, //USD
    inventory_id: "",
    image_id: "",
    comments: [""],
  },
];

const images = [
  {
    product_id: "",
    urls: [""],
  },
];

const inventory = [
  {
    product_id: "",
    type: ["MEN", "WOMEN"],
    categorie: ["FORMAL"],
    color: ["RED", "BLACK"],
    size: ["XS", "S", "L"],
    units_available: 50,
    cost_per_unit: 10,
  },
  {
    product_id: "",
    type: ["WOMEN"],
    categorie: ["CASUAL", "FORMAL"],
    color: ["RED", "BLACK"],
    size: ["XS", "S", "L"],
    units_available: 60,
    cost_per_unit: 40,
  },
  {
    product_id: "",
    type: ["MEN"],
    categorie: ["SPORT"],
    color: ["BLACK"],
    size: ["XS", "S", "L"],
    units_available: 75,
    cost_per_unit: 80,
  },
  {
    product_id: "",
    type: ["MEN", "WOMEN"],
    categorie: ["CASUAL"],
    color: ["GRAY"],
    size: ["S", "L"],
    units_available: 15,
    cost_per_unit: 20,
  },
  {
    product_id: "",
    type: ["WOMEN"],
    categorie: ["CASUAL", "FORMAL"],
    color: ["RED", "BLACK"],
    size: ["S"],
    units_available: 25,
    cost_per_unit: 25,
  },
  {
    product_id: "",
    type: ["MEN"],
    categorie: ["CASUAL", "FORMAL"],
    color: ["RED", "BLACK"],
    size: ["XS"],
    units_available: 89,
    cost_per_unit: 41,
  },
];

const comments = [
  {
    user_id: "",
    product_id: "",
    comment: "Amazing product 1!",
    liked: false,
    star: 5,
  },
  {
    user_id: "",
    product_id: "",
    comment: "Good product!",
    liked: true,
    star: 4,
  },
  {
    user_id: "",
    product_id: "",
    comment: "Refund my money",
    liked: false,
    star: 1,
  },
  {
    user_id: "",
    product_id: "",
    comment: "You have to improve the service, but good prices",
    liked: true,
    star: 3,
  },
  {
    user_id: "",
    product_id: "",
    comment: "Nice pants!",
    liked: false,
    star: 5,
  },
];

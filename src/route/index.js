// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor (email, login, password) {
     this.email = email
     this.login = login
     this.password = password
     this.id = new Date().getTime()
  };
  verifyPassword = (password) => this.password === password
    static add = (user) => {
       this.#list.push(user)
  };

    static getlist = () => this.#list
    static getById = (id) =>
      this.#list.find((user) => used.id === id);

    static deleteBuid = (id) => {
      const index = this.#list.findIndex(
        (user) => user.id === id,
      );
      if (index !== -1) {
        this.#list.splice(index, 1)
        return true
      } else {
        return false
      }
    };
    static updateById = (id, data) => {
       const user = this.getById(id)
       if(user) {
        this.update(user, data)
        return true
       } else {
        return false
       }
    };
    static update = (user, {email}) => {
      if(email) {
        user.email = email
      }
    };
  }

class Product {
   static #list = [];

   constructor(name, price, description) {
     this.name = name
     this.price = price
     this.description = description
     this.id = Math.floor(Math.random() * 100000)
     this.createDate = () => {
      this.date = new Date().toISOString()
     }
   }

   static getlist = () => this.#list

   checkId = (id) => this.id === id

   static add = (product) => {
     this.#list.push(product)
   }

   static getById = (id) =>
     this.#list.find((product) => product.id === id)

  static deleteBuid = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if(index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const product = this.getById(id)
    const { name, price, description } = data;

    if(product) {
      if(name) {
        product.name = name
      }

      if(price) {
        product.price = price
      }

      if(description) {
        product.description = description
      }

      return true
    } else {
      return false
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getlist()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0
      },
    }
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const {email, login, password} = req.body ;

  const user = new User(email, login, password);

  User.add(user)

  console.log(User.getlist());

  res.render('success-info', {

    style: 'success-info',
    info: 'Користувач створений',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const {id} = req.query;

  User.deleteBuid(Number(id));

  res.render('success-info', {

    style: 'success-info',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const {email, password, id} = req.body;

  let result = false;

  const user = User.getById(Number(id))

  if(user.verifyPassword(password)) {
    User.update(user, { email })
    result = true;
  }

  res.render('success-info', {

    style: 'success-info',
    info: result 
    ? 'Емайл пошта оновлена' 
    : 'Сталася помилка',
  })
})


// router.get Створює нам один ентпоїнт

//           ↙ тут вводимо шлях (PATH) до сторінки
router.get('/crud-product', function (req, res) {
  // res.render генерує нам HTML сторінку

  //            ↙ cюди вводимо назву файлу з сontainer
  res.render('crud-product', {
    layout: 'crud-product',
  })
  //                  ↑↑ сюди вводимо JSON дані
})

router.get('/product-create', function (req, res) {
  const list = Product.getlist()

  res.render('product-create', {
    style: 'product-create',
    link: '/product-list',
  })                
})

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  console.log(Product.getlist())

  res.render('product-alert', {
    style: 'product-alert',
    info: 'Товар успішно додано',
  })
  //                  ↑↑ сюди вводимо JSON дані
})

// router.get('/product-alert', function (req, res) {
//   res.render('product-alert', {
//     style: 'product-alert',
//     data: {
//        link: '/product-list?id={{id}}',
//     }
//   })
//   //                  ↑↑ сюди вводимо JSON дані
// })

router.get('/product-list', function (req, res) {
  const list = Product.getlist();
  console.log(list)

  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      }
    }
  })
  //                  ↑↑ сюди вводимо JSON дані
})

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  if (product) {
    return res.render('product-edit', {
      style: 'product-edit',
      data: {
         name: product.name,
         price: product.price,
         description: product.description,
      }
    })
  }
  //                  ↑↑ сюди вводимо JSON дані
})

router.get('/product-delete', function (req, res) {
  const { id } = req.query
  Product.deleteBuid(Number(id))

  res.render('product-alert', {
    style: 'product-alert',
    info: 'Товар видалений'
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
